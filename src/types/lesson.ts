// Lesson types

import type {QuestionType} from "@/types/quiz";

export type ContentType = "video" | "quiz" | "article" | "coding";

export type CodeSubmissionStatus =
	| "PENDING"
	| "ACCEPTED"
	| "WRONG_ANSWER"
	| "COMPILE_ERROR"
	| "TIME_LIMIT_EXCEEDED";

export interface CodingTestCaseRequest {
	input: string;
	expectedOutput: string;
	isHidden?: boolean;
}

export interface CodingTestCaseHiddenResponse {
	_id: string;
	isHidden: true;
}

export interface CodingTestCaseVisibleResponse {
	_id: string;
	input: string;
	expectedOutput: string;
	isHidden?: false;
}

export type CodingTestCaseResponse =
	| CodingTestCaseHiddenResponse
	| CodingTestCaseVisibleResponse;

export interface CodingExerciseConstraints {
	timeLimit?: number;
	memoryLimit?: number;
}

export interface CodingExerciseResourceRequest {
	_id?: string;
	title: string;
	language: string;
	version: string;
	problemStatement: string;
	starterCode: string;
	solutionCode: string;
	testCases: CodingTestCaseRequest[];
	constraints?: CodingExerciseConstraints;
}

export interface CodingExerciseResourceResponse
	extends Omit<CodingExerciseResourceRequest, "solutionCode" | "testCases"> {
	testCases: CodingTestCaseResponse[];
}

// Lesson resource interface
export interface ILessonResource {
	_id?: string;
	title?: string;
	description?: string;
	duration?: number;
	url?: string; // for video
	totalAttemptsAllowed?: number; // for quiz
	passingScorePercentage?: number; // for quiz
	questions?: QuizQuestionForm[]; // for quiz
	// Coding exercise fields
	language?: string;
	version?: string;
	problemStatement?: string;
	starterCode?: string;
	// Never exposed by API responses; only used when creating/updating
	solutionCode?: string;
	testCases?: Array<CodingTestCaseRequest | CodingTestCaseResponse>;
	constraints?: CodingExerciseConstraints;
}

// Quiz question interface for form management
export interface QuizQuestionForm {
	id?: string;
	question: string;
	explanation: string;
	type: QuestionType;
	options: string[];
	correctAnswers: number[];
	point: number;
}

// Main lesson interface (API response)
export interface ILesson {
	_id: string;
	title: string;
	chapterId: string;
	courseId: string;
	resourceId?: string;
	contentType: ContentType;
	order: number;
	preview: boolean;
	isPublished: boolean;
	duration?: number; // in minutes
	course?: {
		_id: string;
		title: string;
		slug: string;
	};
	resource?: ILessonResource;
	createdAt: string;
	updatedAt: string;
}

// Display lesson interface (for UI components)
export interface DisplayLesson {
	_id: string;
	title: string;
	contentType: ContentType;
	resourceId: string;
	isPublished: boolean;
	preview: boolean;
	order: number;
	duration?: number;
	resource?: {
		description?: string;
		url?: string;
		totalAttemptsAllowed?: number;
		passingScorePercentage?: number;
		// Coding exercise fields (optional for list views)
		language?: string;
		version?: string;
	};
}

// Lesson form data interface
export interface LessonFormData {
	_id?: string;
	title: string;
	chapterId: string;
	courseId: string;
	resourceId?: string;
	contentType: ContentType;
	order: number;
	preview: boolean;
	isPublished: boolean;
	duration?: number; // in seconds
	resource?: ILessonResource;
}

// Lesson request types
export type CreateLessonRequest = LessonFormData;

export interface UpdateLessonRequest extends Partial<LessonFormData> {
	id: string;
}

export interface ReorderLessonsRequest {
	lessons: Array<{id: string; order: number}>;
}

export interface LessonsFilterParams {
	chapterId?: string;
	courseId?: string;
	isPublished?: boolean;
	contentType?: ContentType;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
	[key: string]: unknown;
}

// Lesson list response (for consistency with other services)
export interface LessonsListResponse {
	lessons: ILesson[];
	pagination?: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage?: boolean;
		hasPrevPage?: boolean;
	};
}

// Keep BackendLessonData and ApiLesson as aliases for backward compatibility
export type BackendLessonData = LessonFormData;
