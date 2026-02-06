"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {
	MdQuiz,
	MdPlayArrow,
	MdRestartAlt,
	MdAccessTime,
	MdQuestionAnswer,
	MdTrendingUp,
	MdRefresh,
} from "react-icons/md";
import {QuizAttempt, QuizSummary} from "@/types/quiz";
import {secondsToDisplayTime} from "@/utils/format";

interface LessonResource {
	_id?: string;
	title?: string;
	description?: string;
	url?: string;
	totalAttemptsAllowed?: number;
	passingScorePercentage?: number;
	totalQuestions?: number;
	duration?: number;
}

interface QuizOverviewProps {
	lesson?: {
		_id: string;
		title: string;
		resource?: LessonResource;
	};
	attempts?: QuizAttempt[];
	summary?: QuizSummary;
	quizStatus?: {
		canContinue: boolean;
		attemptId: string | null;
	};
	onStartQuiz?: () => void;
}

// Quiz overview component - Arrow function
const QuizOverview = ({
	lesson,
	attempts = [],
	summary,
	quizStatus,
	onStartQuiz,
}: QuizOverviewProps) => {
	// Extract data from lesson resource
	const quizTitle = lesson?.title || "Quiz";
	const description =
		lesson?.resource?.description || "Knowledge assessment test";
	const totalQuestions = lesson?.resource?.totalQuestions || 0;
	const timeLimit = lesson?.resource?.duration; // Default 2 minutes - this could be from lesson resource if available
	const passingScore = lesson?.resource?.passingScorePercentage || 70;
	const maxAttempts = lesson?.resource?.totalAttemptsAllowed || 10;

	// Calculate attempts summary from real data or API summary
	const currentAttempts = summary?.totalAttempts || attempts.length;
	const hasStarted = currentAttempts > 0;
	const canRetake = currentAttempts < maxAttempts;

	// Check if user can continue an ongoing quiz
	const canContinue = quizStatus?.canContinue || false;
	const hasOngoingAttempt = canContinue && quizStatus?.attemptId;

	return (
		<div className="overflow-hidden">
			<div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/70 p-4 sm:p-6">
				{/* Section Title */}
				<div className="mb-3 sm:mb-4">
					<h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
						Quiz
					</h2>
				</div>

				{/* Quiz Title with Icon and Status */}
				<div className="flex items-start gap-3 sm:gap-4">
					<div className="flex-shrink-0">
						<div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/15 rounded-lg sm:rounded-xl flex items-center justify-center">
							<MdQuiz className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
						</div>
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 sm:gap-3 mb-2">
							<h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
								{quizTitle}
							</h3>
						</div>

						<p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
							{description}
						</p>
					</div>
				</div>
			</div>

			<div className="p-4 sm:p-6">
				{/* Quiz Statistics Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
					<div className="space-y-3 sm:space-y-4">
						<div className="flex items-center justify-between py-2 sm:py-3 border-b border-border/70">
							<div className="flex items-center gap-2 sm:gap-3 min-w-0">
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/15 rounded-lg flex items-center justify-center flex-shrink-0">
									<MdQuestionAnswer className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
								</div>
								<span className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
									Number of questions:
								</span>
							</div>
							<span className="text-base sm:text-lg font-bold text-foreground ml-2 flex-shrink-0">
								{totalQuestions}
							</span>
						</div>

						<div className="flex items-center justify-between py-2 sm:py-3 border-b border-border/70">
							<div className="flex items-center gap-2 sm:gap-3 min-w-0">
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
									<MdAccessTime className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
								</div>
								<span className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
									Time limit:
								</span>
							</div>
							<span className="text-base sm:text-lg font-bold text-foreground ml-2 flex-shrink-0">
								{secondsToDisplayTime(timeLimit)}
							</span>
						</div>
					</div>

					<div className="space-y-3 sm:space-y-4">
						<div className="flex items-center justify-between py-2 sm:py-3 border-b border-border/70">
							<div className="flex items-center gap-2 sm:gap-3 min-w-0">
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
									<MdRefresh className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
								</div>
								<span className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
									Total attempts:
								</span>
							</div>
							<span className="text-base sm:text-lg font-bold text-foreground ml-2 flex-shrink-0">
								{currentAttempts}/{maxAttempts}
							</span>
						</div>

						<div className="flex items-center justify-between py-2 sm:py-3 border-b border-border/70">
							<div className="flex items-center gap-2 sm:gap-3 min-w-0">
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
									<MdTrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-foreground" />
								</div>
								<span className="text-xs sm:text-sm text-muted-foreground font-medium truncate">
									Minimum score to pass:
								</span>
							</div>
							<span className="text-base sm:text-lg font-bold text-foreground ml-2 flex-shrink-0">
								{passingScore}%
							</span>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="pt-4 sm:pt-6 border-t border-border/70">
					{/* Status Messages */}
					{hasOngoingAttempt && (
						<div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-primary/10 rounded-lg text-center border border-primary/30">
							<p className="text-xs sm:text-sm text-primary font-medium">
								You have an ongoing quiz. Click &ldquo;Continue Quiz&rdquo; to
								complete it.
							</p>
						</div>
					)}

					{currentAttempts >= maxAttempts && (
						<div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-muted/40 rounded-lg text-center">
							<p className="text-xs sm:text-sm text-muted-foreground italic font-medium">
								No attempts remaining
							</p>
						</div>
					)}

					{/* Button Actions */}
					<div className="flex items-center justify-between gap-3 sm:gap-4">
						{/* Main Action Button */}
						<div className="flex-1">
							{/* Continue ongoing quiz attempt */}
							{hasOngoingAttempt && (
								<Button
									onClick={onStartQuiz}
									className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base h-10 sm:h-12"
								>
									<MdPlayArrow className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
									Continue Quiz
								</Button>
							)}

							{/* Start new quiz (no previous attempts) */}
							{!hasOngoingAttempt && !hasStarted && currentAttempts === 0 && (
								<Button
									onClick={onStartQuiz}
									className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base h-10 sm:h-12"
								>
									<MdPlayArrow className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
									Start Quiz
								</Button>
							)}

							{/* Retake quiz (has completed attempts and can retake) */}
							{!hasOngoingAttempt &&
								hasStarted &&
								canRetake &&
								currentAttempts < maxAttempts && (
									<Button
										onClick={onStartQuiz}
										variant="outline"
										className="w-full border-2 border-primary text-primary hover:bg-primary/10 font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base h-10 sm:h-12"
									>
										<MdRestartAlt className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
										Retake
									</Button>
								)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuizOverview;
