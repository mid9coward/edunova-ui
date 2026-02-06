/* eslint-disable no-console */
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const OUTPUT_DIR = path.join(ROOT, "docs", "reports");
const OUTPUT_JSON = path.join(OUTPUT_DIR, "ui-color-audit-report.json");
const OUTPUT_MD = path.join(OUTPUT_DIR, "ui-color-audit-report.md");

const SCANNED_EXTENSIONS = new Set([
	".ts",
	".tsx",
	".js",
	".jsx",
	".css",
	".scss",
]);

const HARD_COLOR_REGEX = /#(?:[0-9a-fA-F]{3,8})\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g;
const RISKY_CLASS_REGEX =
	/\b(?:text|bg|border|from|via|to)-(?:white|black|gray|slate|zinc|neutral|stone|blue|indigo|purple|pink|rose|cyan|sky|teal|emerald|green|red|orange|amber|yellow)(?:-[0-9]{2,3})?(?:\/[0-9]{1,3})?\b/g;
const INLINE_STYLE_COLOR_REGEX =
	/\b(style\s*=\s*|style\s*:\s*|stopColor\s*=|stroke\s*=|fill\s*=|color\s*:|background(?:Color)?\s*:)/;

const SOURCE_OF_TRUTH_PATHS = [
	{
		path: "src/app/styles/base.css",
		rationale: "Theme tokens and core palette source-of-truth.",
	},
	{
		path: "src/app/styles/components.css",
		rationale: "Shared component style layer with approved visual effects.",
	},
	{
		path: "src/app/styles/utilities.css",
		rationale: "Legacy utility compatibility layer intentionally centralizes mappings.",
	},
	{
		path: "src/app/styles/animations.css",
		rationale: "Animation effects and gradients intentionally authored at style-layer.",
	},
	{
		path: "src/app/styles/tiptap.css",
		rationale: "Editor-specific styling layer.",
	},
];

const ALLOWED_EXCEPTION_PATHS = [
	{
		path: "src/lib/config/stripe.ts",
		rationale: "Third-party Stripe appearance configuration.",
	},
	{
		path: "src/components/tiptap/toolbar.tsx",
		rationale: "Rich text color picker defaults and authoring palette.",
	},
	{
		path: "src/components/tiptap/mention-node-view.tsx",
		rationale: "Editor node rendering style boundary.",
	},
];

function toPosixPath(filePath) {
	return filePath.split(path.sep).join("/");
}

function relativePath(filePath) {
	return toPosixPath(path.relative(ROOT, filePath));
}

function pathMatches(relPath, entries) {
	return entries.some((entry) => relPath.startsWith(entry.path));
}

function isSourceOfTruthPath(relPath) {
	return pathMatches(relPath, SOURCE_OF_TRUTH_PATHS);
}

function isAllowedExceptionPath(relPath) {
	return pathMatches(relPath, ALLOWED_EXCEPTION_PATHS);
}

function classifyFinding({relPath, kind, lineText}) {
	if (isAllowedExceptionPath(relPath)) {
		return "P2";
	}

	if (kind === "hardColor") {
		if (INLINE_STYLE_COLOR_REGEX.test(lineText)) {
			return "P0";
		}
		if (relPath.includes("/styles/")) {
			return "P1";
		}
		return "P0";
	}

	if (kind === "riskyUtilityClass") {
		return "P1";
	}

	return "P1";
}

function suggestionForMatch(match, kind) {
	if (kind === "hardColor") {
		return "Replace hardcoded value with semantic token (e.g. var(--primary), var(--foreground), var(--border)).";
	}

	if (match.startsWith("text-gray") || match.startsWith("text-slate")) {
		return "Use text-foreground/text-muted-foreground depending emphasis.";
	}
	if (match.startsWith("bg-white") || match.startsWith("bg-gray")) {
		return "Use bg-card or bg-background.";
	}
	if (match.startsWith("border-gray") || match.startsWith("border-white")) {
		return "Use border-border.";
	}
	if (match.startsWith("from-blue") || match.startsWith("to-blue")) {
		return "Use from-primary/to-primary.";
	}
	if (match.startsWith("from-purple") || match.startsWith("to-purple")) {
		return "Use from-secondary/to-secondary.";
	}
	if (match.startsWith("from-cyan") || match.startsWith("to-cyan")) {
		return "Use from-accent/to-accent.";
	}
	return "Map to semantic token from base.css contract.";
}

async function listFiles(dirPath) {
	const entries = await fs.readdir(dirPath, {withFileTypes: true});
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await listFiles(fullPath)));
			continue;
		}
		if (!SCANNED_EXTENSIONS.has(path.extname(entry.name))) continue;
		files.push(fullPath);
	}

	return files;
}

function collectLineMatches(fileContent, regex) {
	const findings = [];
	const lines = fileContent.split(/\r?\n/);
	for (let index = 0; index < lines.length; index++) {
		const lineText = lines[index];
		regex.lastIndex = 0;
		const matches = lineText.match(regex);
		if (!matches || matches.length === 0) continue;
		for (const match of matches) {
			findings.push({
				line: index + 1,
				match,
				lineText,
			});
		}
	}
	return findings;
}

function buildMarkdownReport(report) {
	const lines = [];
	lines.push("# UI Color Audit Report");
	lines.push("");
	lines.push(`Generated at: \`${report.generatedAt}\``);
	lines.push("");
	lines.push("## Summary");
	lines.push("");
	lines.push(`- Total findings: **${report.summary.total}**`);
	lines.push(`- Actionable findings (P0 + P1): **${report.summary.actionable}**`);
	lines.push(`- Approved exceptions (P2): **${report.summary.exceptions}**`);
	lines.push(`- P0: **${report.summary.P0}**`);
	lines.push(`- P1: **${report.summary.P1}**`);
	lines.push(`- P2: **${report.summary.P2}**`);
	lines.push(`- Total files discovered: **${report.summary.discoveredFiles}**`);
	lines.push(`- Source-of-truth files skipped from scan: **${report.summary.skippedSourceOfTruthFiles}**`);
	lines.push(`- Analyzed files: **${report.summary.analyzedFiles}**`);
	lines.push("");
	lines.push("## Top files by finding count");
	lines.push("");

	const topFiles = [...report.summary.byFile].sort((a, b) => b.count - a.count).slice(0, 20);
	for (const file of topFiles) {
		lines.push(`- \`${file.file}\`: ${file.count}`);
	}

	lines.push("");
	lines.push("## Findings");
	lines.push("");

	for (const finding of report.findings) {
		lines.push(`- [${finding.severity}] \`${finding.file}:${finding.line}\` - \`${finding.match}\``);
		lines.push(`  - Kind: ${finding.kind}`);
		lines.push(`  - Suggestion: ${finding.suggestion}`);
	}

	lines.push("");
	lines.push("## Approved exceptions");
	lines.push("");
	for (const exceptionEntry of ALLOWED_EXCEPTION_PATHS) {
		lines.push(
			`- \`${exceptionEntry.path}\`: ${exceptionEntry.rationale}`
		);
	}
	lines.push("");
	lines.push("## Source-of-truth style layers (excluded from findings)");
	lines.push("");
	for (const sourceEntry of SOURCE_OF_TRUTH_PATHS) {
		lines.push(`- \`${sourceEntry.path}\`: ${sourceEntry.rationale}`);
	}
	lines.push("");

	return lines.join("\n");
}

async function run() {
	const files = await listFiles(SRC_DIR);
	const findings = [];
	const skippedSourceOfTruthFiles = [];

	for (const filePath of files) {
		const relPath = relativePath(filePath);
		if (isSourceOfTruthPath(relPath)) {
			skippedSourceOfTruthFiles.push(relPath);
			continue;
		}

		const content = await fs.readFile(filePath, "utf8");

		const hardColorFindings = collectLineMatches(content, HARD_COLOR_REGEX);
		const riskyClassFindings = collectLineMatches(content, RISKY_CLASS_REGEX);

		for (const item of hardColorFindings) {
			const severity = classifyFinding({
				relPath,
				kind: "hardColor",
				lineText: item.lineText,
			});
			findings.push({
				severity,
				kind: "hardColor",
				file: relPath,
				line: item.line,
				match: item.match,
				suggestion: suggestionForMatch(item.match, "hardColor"),
			});
		}

		for (const item of riskyClassFindings) {
			const severity = classifyFinding({
				relPath,
				kind: "riskyUtilityClass",
				lineText: item.lineText,
			});
			findings.push({
				severity,
				kind: "riskyUtilityClass",
				file: relPath,
				line: item.line,
				match: item.match,
				suggestion: suggestionForMatch(item.match, "riskyUtilityClass"),
			});
		}
	}

	findings.sort((a, b) => {
		const severityOrder = {P0: 0, P1: 1, P2: 2};
		const bySeverity = severityOrder[a.severity] - severityOrder[b.severity];
		if (bySeverity !== 0) return bySeverity;
		if (a.file !== b.file) return a.file.localeCompare(b.file);
		return a.line - b.line;
	});

	const byFileMap = new Map();
	for (const item of findings) {
		byFileMap.set(item.file, (byFileMap.get(item.file) || 0) + 1);
	}
	const p0Count = findings.filter((f) => f.severity === "P0").length;
	const p1Count = findings.filter((f) => f.severity === "P1").length;
	const p2Count = findings.filter((f) => f.severity === "P2").length;

	const report = {
		generatedAt: new Date().toISOString(),
		summary: {
			total: findings.length,
			actionable: p0Count + p1Count,
			exceptions: p2Count,
			P0: p0Count,
			P1: p1Count,
			P2: p2Count,
			discoveredFiles: files.length,
			skippedSourceOfTruthFiles: skippedSourceOfTruthFiles.length,
			analyzedFiles: files.length - skippedSourceOfTruthFiles.length,
			byFile: Array.from(byFileMap.entries()).map(([file, count]) => ({
				file,
				count,
			})),
		},
		findings,
	};

	await fs.mkdir(OUTPUT_DIR, {recursive: true});
	await fs.writeFile(OUTPUT_JSON, JSON.stringify(report, null, 2), "utf8");
	await fs.writeFile(OUTPUT_MD, buildMarkdownReport(report), "utf8");

	console.log(`Color audit completed: ${report.summary.total} findings`);
	console.log(`- Actionable: ${report.summary.actionable}`);
	console.log(`- Exceptions: ${report.summary.exceptions}`);
	console.log(`- P0: ${report.summary.P0}`);
	console.log(`- P1: ${report.summary.P1}`);
	console.log(`- P2: ${report.summary.P2}`);
	console.log(`- Skipped source-of-truth files: ${report.summary.skippedSourceOfTruthFiles}`);
	console.log(`Reports:`);
	console.log(`- ${relativePath(OUTPUT_JSON)}`);
	console.log(`- ${relativePath(OUTPUT_MD)}`);
}

run().catch((error) => {
	console.error("Failed to generate color audit report:", error);
	process.exitCode = 1;
});
