"use client";

import dynamic from "next/dynamic";
import React from "react";
import {toast} from "sonner";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Textarea} from "@/components/ui/textarea";
import type {ApiError} from "@/lib/api-service";
import {cn} from "@/lib/utils";
import {useRunCode, useSubmitCode} from "@/hooks/use-lessons";
import type {
	CodingExerciseResourceResponse,
	ILesson,
} from "@/types/lesson";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
	ssr: false,
	loading: () => (
		<div className="h-[420px] rounded-md border border-border bg-muted/40 animate-pulse" />
	),
});

function getCooldownUntilFromRateLimitError(error: ApiError): number {
	const resetTime = error.meta?.resetTime;
	if (!resetTime) return Date.now() + 1000;
	const resetMs = new Date(resetTime).getTime();
	if (Number.isNaN(resetMs)) return Date.now() + 1000;
	return Math.max(resetMs, Date.now() + 200);
}

function formatRuntime(runtimeMs: number): string {
	if (!Number.isFinite(runtimeMs)) return "-";
	if (runtimeMs < 1000) return `${runtimeMs} ms`;
	return `${(runtimeMs / 1000).toFixed(2)} s`;
}

function normalizeEscapedNewlines(value: string): string {
	return value.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
}

function isLikelyHtml(content: string): boolean {
	return /<\/?[a-z][\s\S]*>/i.test(content);
}

function getMonacoLanguage(language: string): string {
	const value = language.trim().toLowerCase();
	if (value === "js" || value === "javascript" || value === "node") return "javascript";
	if (value === "ts" || value === "typescript") return "typescript";
	if (value === "py" || value === "python") return "python";
	if (value === "cpp" || value === "c++") return "cpp";
	if (value === "c") return "c";
	if (value === "java") return "java";
	if (value === "go" || value === "golang") return "go";
	return "plaintext";
}

function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
	if (status === "ACCEPTED") return "default";
	if (status === "WRONG_ANSWER" || status === "COMPILE_ERROR") return "destructive";
	return "secondary";
}

type LessonCodingExerciseProps = {
	lesson: ILesson;
};

type StandaloneCodeEditor = import("monaco-editor").editor.IStandaloneCodeEditor;
type MonacoInstance = typeof import("monaco-editor");

const LessonCodingExercise = ({lesson}: LessonCodingExerciseProps) => {
	const exercise = lesson.resource as unknown as CodingExerciseResourceResponse | undefined;
	const editorRef = React.useRef<StandaloneCodeEditor | null>(null);

	const language = exercise?.language || "";
	const version = exercise?.version || "";
	const normalizedProblemStatement = normalizeEscapedNewlines(
		exercise?.problemStatement || ""
	);

	const storageKey = React.useMemo(() => `coding:${lesson._id}`, [lesson._id]);

	const [code, setCode] = React.useState<string>("");
	const [stdin, setStdin] = React.useState<string>("");
	const [activeMobileTab, setActiveMobileTab] = React.useState<string>("statement");

	const [runCooldownUntil, setRunCooldownUntil] = React.useState<number>(0);
	const [submitCooldownUntil, setSubmitCooldownUntil] = React.useState<number>(0);
	const [lastRunAt, setLastRunAt] = React.useState<string | null>(null);

	const [submitSummary, setSubmitSummary] = React.useState<{
		status: string;
		passedTestCases: number;
		totalTestCases: number;
		runtimeMs: number;
		memoryKb: number | null;
		compileError?: string;
		failedTest?: {
			index: number;
			input: string;
			expected: string;
			actual: string;
		};
	} | null>(null);

	const runMutation = useRunCode();
	const submitMutation = useSubmitCode();

	React.useEffect(() => {
		if (typeof window === "undefined") return;
		if (runCooldownUntil <= Date.now()) return;
		const delay = runCooldownUntil - Date.now() + 50;
		const timer = window.setTimeout(() => setRunCooldownUntil(0), delay);
		return () => window.clearTimeout(timer);
	}, [runCooldownUntil]);

	React.useEffect(() => {
		if (typeof window === "undefined") return;
		if (submitCooldownUntil <= Date.now()) return;
		const delay = submitCooldownUntil - Date.now() + 50;
		const timer = window.setTimeout(() => setSubmitCooldownUntil(0), delay);
		return () => window.clearTimeout(timer);
	}, [submitCooldownUntil]);

	// Initialize code from localStorage (fallback to starterCode)
	React.useEffect(() => {
		if (!exercise) return;

		const saved =
			typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
		setCode(saved ?? normalizeEscapedNewlines(exercise.starterCode ?? ""));
	}, [exercise, storageKey]);

	// Persist code for this lesson
	React.useEffect(() => {
		if (typeof window === "undefined") return;
		if (!code) return;
		localStorage.setItem(storageKey, code);
	}, [code, storageKey]);

	const visibleExamples = React.useMemo(() => {
		const cases = exercise?.testCases ?? [];
		return cases.filter((t) => !(t as {isHidden?: boolean}).isHidden);
	}, [exercise?.testCases]);

	const now = Date.now();
	const isRunCoolingDown = runCooldownUntil > now;
	const isSubmitCoolingDown = submitCooldownUntil > now;

	const canInteract = Boolean(exercise && lesson.contentType === "coding");
	const editorLanguage = getMonacoLanguage(language);
	const isEditorReadOnly =
		!canInteract || runMutation.isPending || submitMutation.isPending;
	const canRunShortcut =
		canInteract &&
		!runMutation.isPending &&
		!submitMutation.isPending &&
		!isRunCoolingDown;
	const canSubmitShortcut =
		canInteract &&
		!submitMutation.isPending &&
		!runMutation.isPending &&
		!isSubmitCoolingDown;

	const handleReset = () => {
		setCode(normalizeEscapedNewlines(exercise?.starterCode ?? ""));
		setSubmitSummary(null);
		setLastRunAt(null);
		toast.message("Reset to starter code");
	};

	const handleRun = React.useCallback(async () => {
		if (!exercise) return;
		if (!language || !version) {
			toast.error("Exercise runtime is not configured");
			return;
		}

		setSubmitSummary(null);

		try {
			await runMutation.mutateAsync({
				lessonId: lesson._id,
				payload: {
					sourceCode: code,
					language,
					version,
					stdin: normalizeEscapedNewlines(stdin),
				},
			});
			toast.success("Executed (output hidden)");
			setLastRunAt(new Date().toISOString());
			setActiveMobileTab("result");
		} catch (err) {
			const error = err as ApiError;
			if (error?.errorCode === "RATE_LIMIT_EXCEEDED") {
				setRunCooldownUntil(getCooldownUntilFromRateLimitError(error));
				toast.error(error.message || "Too many runs. Please wait a moment.");
				return;
			}
			toast.error(error?.message || "Failed to run code");
		}
	}, [exercise, language, version, runMutation, lesson._id, code, stdin]);

	const handleSubmit = React.useCallback(async () => {
		if (!exercise) return;
		if (!language || !version) {
			toast.error("Exercise runtime is not configured");
			return;
		}

		try {
			const summary = await submitMutation.mutateAsync({
				lessonId: lesson._id,
				courseId: lesson.courseId,
				payload: {
					sourceCode: code,
					language,
					version,
				},
			});

			setSubmitSummary(summary);
			setActiveMobileTab("result");

			if (summary.status === "ACCEPTED") toast.success("Accepted");
			else if (summary.status === "COMPILE_ERROR") toast.error("Compile error");
			else toast.error("Wrong answer");
		} catch (err) {
			const error = err as ApiError;
			if (error?.errorCode === "RATE_LIMIT_EXCEEDED") {
				setSubmitCooldownUntil(getCooldownUntilFromRateLimitError(error));
				toast.error(error.message || "Too many submissions. Please wait a moment.");
				return;
			}
			toast.error(error?.message || "Failed to submit code");
		}
	}, [exercise, language, version, submitMutation, lesson._id, lesson.courseId, code]);

	const handleEditorMount = React.useCallback(
		(editor: StandaloneCodeEditor, monaco: MonacoInstance) => {
			editorRef.current = editor;
			editor.focus();
			editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
				editor.trigger("keyboard", "editor.action.commentLine", null);
			});
		},
		[]
	);

	React.useEffect(() => {
		if (typeof window === "undefined") return;
		if (window.innerWidth < 1024 && activeMobileTab !== "code") return;
		const frameId = window.requestAnimationFrame(() => editorRef.current?.focus());
		return () => window.cancelAnimationFrame(frameId);
	}, [lesson._id, activeMobileTab]);

	React.useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Enter") return;
			const hasPrimaryModifier = event.ctrlKey || event.metaKey;
			if (!hasPrimaryModifier) return;

			event.preventDefault();
			if (event.shiftKey) {
				if (canRunShortcut) {
					void handleRun();
				}
				return;
			}

			if (canSubmitShortcut) {
				void handleSubmit();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [canRunShortcut, canSubmitShortcut, handleRun, handleSubmit]);

	const StatementPanel = (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-2">
				<h1 className="text-xl sm:text-2xl font-bold text-foreground">
					{exercise?.title || lesson.title}
				</h1>
				{language && (
					<Badge variant="secondary" className="capitalize">
						{language}
					</Badge>
				)}
				{version && (
					<Badge variant="outline" className="font-mono text-xs">
						{version}
					</Badge>
				)}
			</div>

			<Card className="border border-border">
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Problem</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className="prose prose-sm sm:prose max-w-none text-foreground"
					>
						{isLikelyHtml(normalizedProblemStatement) ? (
							<div
								dangerouslySetInnerHTML={{
									__html: normalizedProblemStatement,
								}}
							/>
						) : (
							<div className="whitespace-pre-wrap break-words">
								{normalizedProblemStatement}
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{visibleExamples.length > 0 && (
				<Card className="border border-border">
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Examples</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{visibleExamples.map((tc, index) => (
							<div key={(tc as { _id?: string })._id || index}>
								<div className="text-sm font-semibold text-foreground mb-1">
									Example {index + 1}
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div className="rounded-md border bg-muted/40 p-3">
										<div className="text-xs font-semibold text-muted-foreground mb-1">
											Input
										</div>
										<pre className="text-xs whitespace-pre-wrap break-words text-foreground">
											{normalizeEscapedNewlines(
												(tc as { input?: string }).input ?? ""
											)}
										</pre>
									</div>
									<div className="rounded-md border bg-muted/40 p-3">
										<div className="text-xs font-semibold text-muted-foreground mb-1">
											Expected Output
										</div>
										<pre className="text-xs whitespace-pre-wrap break-words text-foreground">
											{normalizeEscapedNewlines(
												(tc as { expectedOutput?: string }).expectedOutput ?? ""
											)}
										</pre>
									</div>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			)}

			<Card className="border border-border">
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Constraints</CardTitle>
				</CardHeader>
				<CardContent className="text-sm text-muted-foreground">
					<div className="flex flex-wrap gap-2">
						<Badge variant="outline">
							Time limit: {exercise?.constraints?.timeLimit ?? 2}s
						</Badge>
						<Badge variant="outline">
							Memory limit: {exercise?.constraints?.memoryLimit ?? 128}MB
						</Badge>
					</div>
				</CardContent>
			</Card>
		</div>
	);

	const CodePanel = (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center gap-2 justify-between">
				<div className="flex items-center gap-2">
					<Badge variant="secondary" className="capitalize">
						{editorLanguage}
					</Badge>
					<Badge variant="outline" className="font-mono text-xs">
						{version || "latest"}
					</Badge>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={handleReset}
						disabled={!canInteract || runMutation.isPending || submitMutation.isPending}
					>
						Reset
					</Button>
					<Button
						variant="outline"
						onClick={handleRun}
						disabled={
							!canInteract ||
							runMutation.isPending ||
							submitMutation.isPending ||
							isRunCoolingDown
						}
					>
						{isRunCoolingDown ? "Wait..." : runMutation.isPending ? "Running..." : "Run"}
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={
							!canInteract ||
							submitMutation.isPending ||
							runMutation.isPending ||
							isSubmitCoolingDown
						}
					>
						{isSubmitCoolingDown
							? "Wait..."
							: submitMutation.isPending
							? "Submitting..."
							: "Submit"}
					</Button>
				</div>
			</div>
			<div className="text-[11px] text-muted-foreground">
				Shortcuts: Ctrl+Enter submit, Ctrl+Shift+Enter run, Ctrl+/ toggle comment
			</div>

			<Card className="border border-border">
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Code</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-md overflow-hidden border border-border">
						<MonacoEditor
							height="420px"
							language={editorLanguage}
							theme="vs-dark"
							value={code}
							onChange={(value) => setCode(value ?? "")}
							onMount={handleEditorMount}
							options={{
								readOnly: isEditorReadOnly,
								automaticLayout: true,
								minimap: {enabled: false},
								scrollBeyondLastLine: false,
								wordWrap: "on",
								tabSize: 2,
								insertSpaces: true,
								fontSize: 14,
								fontFamily:
									"'JetBrains Mono', 'Fira Code', Consolas, 'Liberation Mono', Menlo, monospace",
								fontLigatures: true,
								padding: {top: 12, bottom: 12},
								smoothScrolling: true,
								renderLineHighlight: "all",
							}}
						/>
					</div>

					<div className="mt-3">
						<div className="text-xs font-semibold text-muted-foreground mb-1">
							Custom Input (optional)
						</div>
						<Textarea
							value={stdin}
							onChange={(e) => setStdin(e.target.value)}
							rows={4}
							className="font-mono text-xs sm:text-sm"
							placeholder="Enter input for Run (output is hidden)"
							disabled={!canInteract || runMutation.isPending || submitMutation.isPending}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);

	const ResultPanel = (
		<div className="space-y-4">
			<Card className="border border-border">
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Result</CardTitle>
				</CardHeader>
				<CardContent>
					{submitSummary ? (
						<div className="space-y-3">
							<div className="flex flex-wrap items-center gap-2">
								<Badge variant={getStatusBadgeVariant(submitSummary.status)}>
									{submitSummary.status}
								</Badge>
								<Badge variant="outline">
									{submitSummary.passedTestCases}/{submitSummary.totalTestCases} passed
								</Badge>
								<Badge variant="outline">
									Runtime: {formatRuntime(submitSummary.runtimeMs)}
								</Badge>
								<Badge variant="outline">
									Memory: {submitSummary.memoryKb ?? "-"} KB
								</Badge>
							</div>

							{submitSummary.compileError && (
								<div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
									<div className="text-sm font-semibold text-destructive mb-1">
										Compile Error
									</div>
									<pre className="text-xs whitespace-pre-wrap break-words text-destructive">
										{submitSummary.compileError}
									</pre>
								</div>
							)}

							{submitSummary.failedTest && (
								<div className="rounded-md border border-secondary/40 bg-secondary/20 p-3">
									<div className="text-sm font-semibold text-secondary-foreground mb-2">
										Failed Test #{submitSummary.failedTest.index + 1}
									</div>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
										<div className="rounded-md border bg-card p-2">
											<div className="text-xs font-semibold text-muted-foreground mb-1">
												Input
											</div>
											<pre className="text-xs whitespace-pre-wrap break-words text-foreground">
												{normalizeEscapedNewlines(
													submitSummary.failedTest.input
												)}
											</pre>
										</div>
										<div className="rounded-md border bg-card p-2">
											<div className="text-xs font-semibold text-muted-foreground mb-1">
												Expected
											</div>
											<pre className="text-xs whitespace-pre-wrap break-words text-foreground">
												{normalizeEscapedNewlines(
													submitSummary.failedTest.expected
												)}
											</pre>
										</div>
										<div className="rounded-md border bg-card p-2">
											<div className="text-xs font-semibold text-muted-foreground mb-1">
												Actual
											</div>
											<pre className="text-xs whitespace-pre-wrap break-words text-foreground">
												{normalizeEscapedNewlines(
													submitSummary.failedTest.actual
												)}
											</pre>
										</div>
									</div>
								</div>
							)}

							<Separator />
							<div className="text-xs text-muted-foreground">
								Run output is intentionally hidden to prevent cheating.
							</div>
						</div>
					) : (
						<div className="text-sm text-muted-foreground space-y-1">
							<div>Submit your code to see grading results.</div>
							{lastRunAt && (
								<div className="text-xs">
									Last run: {new Date(lastRunAt).toLocaleString()}
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);

	if (!exercise || lesson.contentType !== "coding") {
		return (
			<div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6">
				<Card>
					<CardHeader>
						<CardTitle>Lesson not available</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-muted-foreground">
						This lesson is not a coding exercise or is missing exercise data.
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-6">
			{/* Desktop layout */}
			<div className="hidden lg:grid grid-cols-2 gap-6">
				<div>{StatementPanel}</div>
				<div className="space-y-6">
					{CodePanel}
					{ResultPanel}
				</div>
			</div>

			{/* Mobile layout */}
			<div className="lg:hidden">
				<Tabs value={activeMobileTab} onValueChange={setActiveMobileTab}>
					<TabsList className="w-full">
						<TabsTrigger value="statement">Statement</TabsTrigger>
						<TabsTrigger value="code">Code</TabsTrigger>
						<TabsTrigger value="result">Result</TabsTrigger>
					</TabsList>

					<TabsContent value="statement" className="pt-4">
						{StatementPanel}
					</TabsContent>
					<TabsContent value="code" className="pt-4">
						{CodePanel}
					</TabsContent>
					<TabsContent value="result" className="pt-4">
						{ResultPanel}
					</TabsContent>
				</Tabs>
			</div>

			{/* Cooldown hints (non-blocking) */}
			<div
				className={cn(
					"mt-4 text-xs text-muted-foreground",
					(!isRunCoolingDown && !isSubmitCoolingDown) && "hidden"
				)}
			>
				{isRunCoolingDown && <div>Run is rate-limited. Please wait a moment.</div>}
				{isSubmitCoolingDown && (
					<div>Submit is rate-limited. Please wait a moment.</div>
				)}
			</div>
		</div>
	);
};

export default LessonCodingExercise;

