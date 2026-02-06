"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {QuizAttempt} from "@/types/quiz";
import {secondsToDisplayTime} from "@/utils/format";
import {
	MdAccessTime,
	MdCancel,
	MdCheckCircle,
	MdQuiz,
	MdVisibility,
} from "react-icons/md";

interface QuizHistoryTableProps {
	attempts?: QuizAttempt[];
	summary?: {
		highestScore: number;
		averageScore: number;
		passedAttempts: number;
		totalAttempts: number;
	};
	isLoading?: boolean;
	passingScore?: number;
	onRefresh?: () => void;
	onViewDetails?: (attemptId: string) => void;
}

// Quiz history table component - Arrow function
const QuizHistoryTable = ({
	attempts = [],
	summary,
	isLoading = false,
	passingScore = 70, // eslint-disable-line @typescript-eslint/no-unused-vars
	onRefresh, // eslint-disable-line @typescript-eslint/no-unused-vars
	onViewDetails,
}: QuizHistoryTableProps) => {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, "0");
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const year = date.getFullYear();
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");

		return `${day}/${month}/${year} ${hours}:${minutes}`;
	};

	const getStatusBadge = (
		status: QuizAttempt["status"],
		result: QuizAttempt["result"]
	) => {
		const isPassed = result === "pass";
		switch (status) {
			case "completed":
				return (
					<Badge
						variant={isPassed ? "default" : "destructive"}
						className={
							isPassed
								? "bg-primary hover:bg-primary/90 text-primary-foreground border-primary"
								: "bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive"
						}
					>
						{isPassed ? (
							<>
								<MdCheckCircle className="h-3 w-3 mr-1" />
								Passed
							</>
						) : (
							<>
								<MdCancel className="h-3 w-3 mr-1" />
								Failed
							</>
						)}
					</Badge>
				);
			case "in_progress":
				return (
					<Badge
						variant="secondary"
						className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border-secondary"
					>
						<MdAccessTime className="h-3 w-3 mr-1" />
						In Progress
					</Badge>
				);
			case "abandoned":
				return (
					<Badge variant="outline" className="border-border text-muted-foreground">
						<MdCancel className="h-3 w-3 mr-1" />
						Abandoned
					</Badge>
				);
			default:
				return null;
		}
	};

	if (isLoading) {
		return (
			<div>
				<div className="flex items-center justify-between mb-4 sm:mb-6">
					<h3 className="text-lg sm:text-xl font-bold text-foreground">
						Quiz History
					</h3>
				</div>
				<div className="flex items-center justify-center h-32">
					<div className="text-xs sm:text-sm text-muted-foreground">Loading...</div>
				</div>
			</div>
		);
	}

	if (attempts.length === 0) {
		return (
			<div>
				<div className="flex items-center justify-between mb-4 sm:mb-6">
					<h3 className="text-lg sm:text-xl font-bold text-foreground">
						Quiz History
					</h3>
				</div>
				<div className="flex flex-col items-center justify-center h-32 text-center px-4">
					<MdQuiz className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-2" />
					<div className="text-xs sm:text-sm text-muted-foreground">
						You haven&apos;t taken this quiz yet
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			{/* Header */}
			<div className="flex items-center justify-between mb-3 sm:mb-4">
				<h3 className="text-base sm:text-lg font-semibold text-foreground">
					Quiz History
				</h3>
			</div>

			{/* Table - Horizontal scroll on mobile */}
			<div className="border border-border rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/40">
								<TableHead className="font-medium text-muted-foreground text-xs sm:text-sm whitespace-nowrap">
									Date
								</TableHead>
								<TableHead className="font-medium text-muted-foreground text-xs sm:text-sm text-center whitespace-nowrap">
									Questions
								</TableHead>
								<TableHead className="font-medium text-muted-foreground text-xs sm:text-sm text-center whitespace-nowrap">
									Correct
								</TableHead>
								<TableHead className="font-medium text-muted-foreground text-xs sm:text-sm text-center whitespace-nowrap">
									Wrong
								</TableHead>
								<TableHead className="font-medium text-muted-foreground text-xs sm:text-sm text-center whitespace-nowrap">
									Score
								</TableHead>
								<TableHead className="font-medium text-muted-foreground text-xs sm:text-sm text-center whitespace-nowrap">
									Time
								</TableHead>
								<TableHead className="font-medium text-muted-foreground text-xs sm:text-sm text-center whitespace-nowrap">
									Result
								</TableHead>
								<TableHead className="font-medium text-muted-foreground text-xs sm:text-sm text-center whitespace-nowrap">
									Details
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{attempts
								.sort(
									(a, b) =>
										new Date(b.startedAt).getTime() -
										new Date(a.startedAt).getTime()
								)
								.map((attempt) => (
									<TableRow
										key={attempt._id}
										className="hover:bg-muted/40 border-b border-border/70"
									>
										{/* Date */}
										<TableCell className="font-medium text-xs sm:text-sm text-foreground py-2 sm:py-3 whitespace-nowrap">
											{formatDate(attempt.startedAt)}
										</TableCell>

										{/* Questions */}
										<TableCell className="text-center text-xs sm:text-sm text-muted-foreground py-2 sm:py-3">
											{attempt.totalQuestions}
										</TableCell>

										{/* Correct Answers */}
										<TableCell className="text-center text-xs sm:text-sm text-muted-foreground py-2 sm:py-3">
											{attempt.correctAnswers}
										</TableCell>

										{/* Wrong Answers */}
										<TableCell className="text-center text-xs sm:text-sm text-muted-foreground py-2 sm:py-3">
											{attempt.wrongAnswers}
										</TableCell>

										{/* Score */}
										<TableCell className="text-center text-xs sm:text-sm text-muted-foreground py-2 sm:py-3 whitespace-nowrap">
											{attempt.earnedPoints} (
											{(
												(attempt.earnedPoints / attempt.totalPoints) *
												100
											).toFixed(2)}
											%)
										</TableCell>

										{/* Completion Time */}
										<TableCell className="text-center text-xs sm:text-sm text-muted-foreground py-2 sm:py-3 whitespace-nowrap">
											{secondsToDisplayTime(attempt.duration)}
										</TableCell>

										{/* Result */}
										<TableCell className="text-center py-2 sm:py-3">
											{getStatusBadge(attempt.status, attempt.result)}
										</TableCell>

										{/* Details */}
										<TableCell className="text-center py-2 sm:py-3">
											<Button
												variant="ghost"
												size="sm"
												className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-muted"
												onClick={() => onViewDetails?.(attempt._id)}
											>
												<MdVisibility className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
											</Button>
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Summary Statistics */}
			{summary && summary.totalAttempts > 0 && (
				<div className="mt-4 sm:mt-6 grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 bg-muted/40 rounded-lg">
					<div className="text-center">
						<div className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
							Highest:
						</div>
						<div className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
							{summary.highestScore.toFixed(2)}
						</div>
					</div>
					<div className="text-center">
						<div className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
							Average:
						</div>
						<div className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
							{summary.averageScore.toFixed(2)}
						</div>
					</div>
					<div className="text-center">
						<div className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
							Passed:
						</div>
						<div className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
							{summary.passedAttempts}/{summary.totalAttempts}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default QuizHistoryTable;
