import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import {colorRoutesManifest} from "./color-routes-manifest";

type Viewport = {
	name: string;
	width: number;
	height: number;
};

type PlaywrightPage = {
	goto: (
		url: string,
		options?: {waitUntil?: "networkidle" | "load"; timeout?: number}
	) => Promise<{status?: () => number} | null>;
	screenshot: (options: {path: string; fullPage: boolean}) => Promise<void>;
	evaluate: <T>(fn: () => T) => Promise<T>;
	close: () => Promise<void>;
};

type PlaywrightContext = {
	newPage: () => Promise<PlaywrightPage>;
	close: () => Promise<void>;
};

type PlaywrightBrowser = {
	newContext: (options: {
		viewport: {width: number; height: number};
	}) => Promise<PlaywrightContext>;
	close: () => Promise<void>;
};

type PlaywrightLike = {
	chromium: {
		launch: (options?: {headless?: boolean}) => Promise<PlaywrightBrowser>;
	};
};

type ContrastFailure = {
	textSample: string;
	ratio: number;
	threshold: number;
	fontSize: number;
	fontWeight: string;
	tagName: string;
};

type ContrastResult = {
	checkedCount: number;
	failures: ContrastFailure[];
};

const VIEWPORTS: Viewport[] = [
	{name: "mobile", width: 360, height: 800},
	{name: "tablet", width: 768, height: 1024},
	{name: "desktop", width: 1440, height: 900},
];

const BASE_URL = process.env.COLOR_AUDIT_BASE_URL ?? "http://localhost:4000";
const ENABLE_E2E = process.env.COLOR_AUDIT_E2E === "1";
const INCLUDE_AUTH_ROUTES = process.env.COLOR_AUDIT_INCLUDE_AUTH === "1";
const PLAYWRIGHT_MODULE_NAME = process.env.PLAYWRIGHT_PACKAGE ?? "playwright";

function isObjectLike(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function isPlaywrightLike(value: unknown): value is PlaywrightLike {
	if (!isObjectLike(value)) return false;
	const chromium = value.chromium;
	if (!isObjectLike(chromium)) return false;
	return typeof chromium.launch === "function";
}

async function loadPlaywright(): Promise<PlaywrightLike | null> {
	try {
		const moduleName = `${PLAYWRIGHT_MODULE_NAME}`;
		const loaded: unknown = await import(moduleName);
		if (!isPlaywrightLike(loaded)) {
			return null;
		}
		return loaded;
	} catch {
		return null;
	}
}

function sanitizePathSegment(routePath: string): string {
	return routePath
		.replaceAll("/", "_")
		.replaceAll("?", "_")
		.replaceAll("&", "_")
		.replaceAll("=", "_")
		.replaceAll(":", "_")
		.replace(/^_+/, "")
		.replace(/_+$/, "") || "root";
}

test("color routes manifest should be valid and unique", () => {
	assert.ok(colorRoutesManifest.length > 0, "Manifest must contain at least one route");

	const seen = new Set<string>();
	for (const route of colorRoutesManifest) {
		assert.ok(route.path.startsWith("/"), `Route must start with '/': ${route.path}`);
		assert.ok(route.components.length > 0, `Route must define components: ${route.path}`);
		assert.ok(!seen.has(route.path), `Duplicate route path in manifest: ${route.path}`);
		seen.add(route.path);
	}
});

test(
	"capture color screenshots and run contrast checks",
	{skip: !ENABLE_E2E},
	async (t) => {
		const playwright = await loadPlaywright();
		if (!playwright) {
			t.diagnostic(
				`Skipping: module '${PLAYWRIGHT_MODULE_NAME}' not available. Install Playwright or set PLAYWRIGHT_PACKAGE.`
			);
			return;
		}

		const now = new Date().toISOString().replace(/[:.]/g, "-");
		const artifactRoot = path.join(
			process.cwd(),
			"tests",
			"ui",
			".artifacts",
			"color-regression",
			now
		);
		await fs.mkdir(artifactRoot, {recursive: true});

		const browser = await playwright.chromium.launch({headless: true});
		const failures: Array<{
			route: string;
			viewport: string;
			issue: string;
			details?: unknown;
		}> = [];

		try {
			for (const viewport of VIEWPORTS) {
				const context = await browser.newContext({
					viewport: {width: viewport.width, height: viewport.height},
				});

				try {
					for (const route of colorRoutesManifest) {
						if (route.requiresAuth && !INCLUDE_AUTH_ROUTES) {
							continue;
						}

						const page = await context.newPage();
						try {
							const url = new URL(route.path, BASE_URL).toString();
							const response = await page.goto(url, {
								waitUntil: "networkidle",
								timeout: 45_000,
							});
							const status = response?.status?.() ?? 0;
							if (status >= 400) {
								failures.push({
									route: route.path,
									viewport: viewport.name,
									issue: `HTTP ${status}`,
								});
							}

							const screenshotFile = path.join(
								artifactRoot,
								`${viewport.name}__${sanitizePathSegment(route.path)}.png`
							);
							await page.screenshot({path: screenshotFile, fullPage: true});

							const contrast = await page.evaluate(() => {
								type RGBA = {r: number; g: number; b: number; a: number};

								const parseRgba = (value: string): RGBA | null => {
									const trimmed = value.trim().toLowerCase();
									const match = trimmed.match(
										/^rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\)$/
									);
									if (!match) return null;
									return {
										r: Number(match[1]),
										g: Number(match[2]),
										b: Number(match[3]),
										a: match[4] ? Number(match[4]) : 1,
									};
								};

								const composite = (fg: RGBA, bg: RGBA): RGBA => {
									const alpha = fg.a + bg.a * (1 - fg.a);
									if (alpha <= 0) return {r: 0, g: 0, b: 0, a: 0};
									return {
										r: Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha),
										g: Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha),
										b: Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha),
										a: alpha,
									};
								};

								const srgbToLinear = (channel: number): number => {
									const normalized = channel / 255;
									return normalized <= 0.04045
										? normalized / 12.92
										: ((normalized + 0.055) / 1.055) ** 2.4;
								};

								const luminance = (color: RGBA): number => {
									return (
										0.2126 * srgbToLinear(color.r) +
										0.7152 * srgbToLinear(color.g) +
										0.0722 * srgbToLinear(color.b)
									);
								};

								const contrastRatio = (a: RGBA, b: RGBA): number => {
									const la = luminance(a);
									const lb = luminance(b);
									const lighter = Math.max(la, lb);
									const darker = Math.min(la, lb);
									return (lighter + 0.05) / (darker + 0.05);
								};

								const getEffectiveBackground = (element: Element): RGBA => {
									const fallback: RGBA = {r: 40, g: 42, b: 54, a: 1};
									let current: Element | null = element;

									while (current) {
										const style = getComputedStyle(current);
										const parsed = parseRgba(style.backgroundColor);
										if (parsed && parsed.a > 0) {
											if (parsed.a >= 1) return parsed;

											const parent = current.parentElement;
											const parentColor = parent
												? getEffectiveBackground(parent)
												: fallback;
											return composite(parsed, parentColor);
										}
										current = current.parentElement;
									}

									return fallback;
								};

								const candidates = Array.from(
									document.querySelectorAll(
										"p, span, a, button, label, li, td, th, h1, h2, h3, h4, h5, h6, small"
									)
								).slice(0, 800);

								const failures: ContrastFailure[] = [];
								let checkedCount = 0;

								for (const element of candidates) {
									const htmlElement = element as HTMLElement;
									const text = (htmlElement.innerText || "").trim();
									if (!text) continue;

									const rect = htmlElement.getBoundingClientRect();
									if (rect.width < 2 || rect.height < 2) continue;

									const style = getComputedStyle(htmlElement);
									if (style.visibility === "hidden" || style.display === "none") {
										continue;
									}

									const fg = parseRgba(style.color);
									if (!fg || fg.a <= 0) continue;

									const bg = getEffectiveBackground(htmlElement);
									const effectiveFg = fg.a < 1 ? composite(fg, bg) : fg;
									const ratio = contrastRatio(effectiveFg, bg);

									const fontSize = Number.parseFloat(style.fontSize);
									const fontWeight = style.fontWeight;
									const numericWeight = Number.parseInt(fontWeight, 10) || 400;
									const isLargeText =
										fontSize >= 24 || (fontSize >= 18.66 && numericWeight >= 700);
									const threshold = isLargeText ? 3 : 4.5;

									checkedCount += 1;
									if (ratio < threshold) {
										failures.push({
											textSample: text.slice(0, 80),
											ratio: Number(ratio.toFixed(2)),
											threshold,
											fontSize,
											fontWeight,
											tagName: htmlElement.tagName.toLowerCase(),
										});
									}
								}

								return {
									checkedCount,
									failures: failures.slice(0, 30),
								};
							});

							if (contrast.failures.length > 0) {
								failures.push({
									route: route.path,
									viewport: viewport.name,
									issue: `Contrast failures: ${contrast.failures.length}`,
									details: contrast,
								});
							}
						} catch (error) {
							failures.push({
								route: route.path,
								viewport: viewport.name,
								issue: "Navigation or capture failed",
								details:
									error instanceof Error ? error.message : "Unknown runtime error",
							});
						} finally {
							await page.close();
						}
					}
				} finally {
					await context.close();
				}
			}
		} finally {
			await browser.close();
		}

		const summaryPath = path.join(artifactRoot, "summary.json");
		await fs.writeFile(summaryPath, JSON.stringify({failures}, null, 2), "utf8");
		t.diagnostic(`Color audit artifacts: ${artifactRoot}`);
		t.diagnostic(`Summary: ${summaryPath}`);

		assert.equal(
			failures.length,
			0,
			`Color regression failures detected. See ${summaryPath}`
		);
	}
);
