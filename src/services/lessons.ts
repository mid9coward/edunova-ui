import {ApiService} from "@/lib/api-service";
import type {
	ILesson,
	CodeSubmissionStatus,
	LessonFormData,
	CreateLessonRequest,
	UpdateLessonRequest,
	ReorderLessonsRequest,
	LessonsFilterParams,
} from "@/types/lesson";

const ENDPOINTS = {
	LESSONS: "/lessons",
	LESSON: (id: string) => `/lessons/${id}`,
	LESSON_BY_SLUG: (slug: string) => `/lessons/slug/${slug}`,
	LESSON_TOGGLE_PUBLISH: (id: string) => `/lessons/${id}/toggle-publish`,
	LESSON_REORDER: "/lessons/reorder",
	LESSON_RUN: (id: string) => `/lessons/${id}/run`,
	LESSON_SUBMIT: (id: string) => `/lessons/${id}/submit`,
	LESSON_CODING_RUNTIMES: "/lessons/coding/runtimes",
} as const;

export interface RunCodeRequest {
	sourceCode: string;
	language: string;
	version: string;
	stdin?: string;
}

export type RunCodeStatus =
	| "OK"
	| "SUCCESS"
	| "RUNTIME_ERROR"
	| "COMPILE_ERROR"
	| "TIME_LIMIT_EXCEEDED";

export interface RunCodeResponse {
	status: RunCodeStatus;
	language?: string;
	version?: string;
	runtimeMs?: number;
	timeLimitMs?: number;
	memoryKb?: number | null;
	memoryLimitKb?: number;
	stdout?: string;
	stderr?: string;
	exitCode?: number | null;
	signal?: string | null;
	compileOutput?: string;
}

export interface SubmitCodeRequest {
	sourceCode: string;
	language: string;
	version: string;
}

export interface SubmitCodeFailedTest {
	index: number;
	input: string;
	expected: string;
	actual: string;
	isHidden?: boolean;
}

export interface SubmitCodeSummaryResponse {
	status: CodeSubmissionStatus;
	passedTestCases: number;
	totalTestCases: number;
	runtimeMs: number;
	timeLimitMs?: number;
	memoryKb: number | null;
	memoryLimitKb?: number;
	compileError?: string;
	failedTest?: SubmitCodeFailedTest;
	stdout?: string;
	stderr?: string;
	resultMode?: "strict" | "leetcode";
}

export interface CodingRuntimeOption {
	language: string;
	versions: string[];
	aliases: string[];
}

export class LessonsService {
	// Get lessons with filtering
	static async getLessons(params?: LessonsFilterParams): Promise<ILesson[]> {
		try {
			const response = await ApiService.get<ILesson[]>(
				ENDPOINTS.LESSONS,
				params as Record<string, unknown>
			);
			return response || [];
		} catch {
			return [];
		}
	}

	// Get chapter lessons
	static async getChapterLessons(chapterId: string): Promise<ILesson[]> {
		return this.getLessons({chapterId});
	}

	// Get lesson by ID
	static async getLesson(
		id: string,
		params?: Record<string, unknown>
	): Promise<ILesson> {
		const response = await ApiService.get<ILesson>(
			ENDPOINTS.LESSON(id),
			params
		);
		return response;
	}

	// Create lesson
	static async createLesson(lessonData: CreateLessonRequest): Promise<ILesson> {
		const response = await ApiService.post<ILesson, CreateLessonRequest>(
			ENDPOINTS.LESSONS,
			lessonData
		);
		return response;
	}

	// Update lesson
	static async updateLesson(lessonData: UpdateLessonRequest): Promise<ILesson> {
		const {id, ...updateData} = lessonData;
		const response = await ApiService.put<ILesson, Partial<LessonFormData>>(
			ENDPOINTS.LESSON(id),
			updateData
		);
		return response;
	}

	// Delete lesson
	static async deleteLesson(id: string): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.LESSON(id));
	}

	// Toggle publish status
	static async toggleLessonPublish(id: string): Promise<ILesson> {
		const response = await ApiService.patch<{lesson: ILesson}>(
			ENDPOINTS.LESSON_TOGGLE_PUBLISH(id)
		);
		return response.lesson;
	}

	// Reorder lessons
	static async reorderLessons(
		reorderData: ReorderLessonsRequest
	): Promise<void> {
		return ApiService.put<void, ReorderLessonsRequest>(
			ENDPOINTS.LESSON_REORDER,
			reorderData
		);
	}

	// Run code for coding exercises (stateless)
	static async runCode(
		lessonId: string,
		payload: RunCodeRequest
	): Promise<RunCodeResponse> {
		return ApiService.post<RunCodeResponse, RunCodeRequest>(
			ENDPOINTS.LESSON_RUN(lessonId),
			payload
		);
	}

	// Submit code for grading (stateful)
	static async submitCode(
		lessonId: string,
		payload: SubmitCodeRequest
	): Promise<SubmitCodeSummaryResponse> {
		return ApiService.post<SubmitCodeSummaryResponse, SubmitCodeRequest>(
			ENDPOINTS.LESSON_SUBMIT(lessonId),
			payload
		);
	}

	// List available coding runtimes for authoring forms
	static async getCodingRuntimes(): Promise<CodingRuntimeOption[]> {
		return ApiService.get<CodingRuntimeOption[]>(ENDPOINTS.LESSON_CODING_RUNTIMES);
	}
}

export default LessonsService;
