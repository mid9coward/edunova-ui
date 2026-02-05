"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {Skeleton} from "@/components/ui/skeleton";
import {cn} from "@/lib/utils";
import type {IPublicChapter} from "@/types/chapter";
import {formatDuration, secondsToDisplayTime} from "@/utils/format";
import {
	Award,
	BookOpen,
	Clock,
	Code2,
	HelpCircle,
	Layers,
	LucideFileText,
	PlayCircle,
} from "lucide-react";
import React from "react";
import {MdOutlineSlowMotionVideo} from "react-icons/md";

interface CourseCurriculumProps {
	chapters: IPublicChapter[];
	isLoading: boolean;
}

const CourseCurriculum = ({chapters, isLoading}: CourseCurriculumProps) => {
	if (isLoading) {
		return (
			<div className="bg-card rounded-xl sm:rounded-2xl shadow-xl border border-border overflow-hidden backdrop-blur-sm">
				{/* Header */}
				<div className="p-4 sm:p-6 lg:p-8 border-b border-border">
					<div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
						<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-lg sm:rounded-xl flex items-center justify-center">
							<Layers className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
						</div>
						<div className="flex-1">
							<Skeleton className="h-5 sm:h-7 w-36 sm:w-48 mb-1 sm:mb-2" />
							<Skeleton className="h-3 sm:h-4 w-48 sm:w-64" />
						</div>
					</div>
				</div>

				{/* Loading Chapters */}
				<div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="bg-background/60 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border"
						>
							<div className="flex items-center justify-between mb-3 sm:mb-4">
								<Skeleton className="h-5 sm:h-6 w-2/3" />
								<Skeleton className="h-4 sm:h-5 w-16 sm:w-20" />
							</div>
							<div className="space-y-2 sm:space-y-3">
								{[1, 2].map((j) => (
									<div key={j} className="flex items-center gap-2 sm:gap-3">
										<Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg" />
										<div className="flex-1">
											<Skeleton className="h-3 sm:h-4 w-3/4 mb-1" />
											<Skeleton className="h-2.5 sm:h-3 w-1/4" />
										</div>
										<Skeleton className="h-6 w-16 sm:h-8 sm:w-20 rounded-lg" />
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (chapters.length === 0) {
		return (
			<div className="bg-card rounded-xl sm:rounded-2xl shadow-xl border border-border overflow-hidden backdrop-blur-sm">
				{/* Header */}
				<div className="p-4 sm:p-6 lg:p-8 border-b border-border bg-background/60">
					<div className="flex items-center gap-2 sm:gap-3">
						<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-lg sm:rounded-xl flex items-center justify-center">
							<Layers className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
						</div>
						<div>
							<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
								Course Curriculum
							</h3>
							<p className="text-muted-foreground text-xs sm:text-sm">
								Explore course content and lessons
							</p>
						</div>
					</div>
				</div>

				{/* Empty State */}
				<div className="p-8 sm:p-12 text-center">
					<div className="w-16 h-16 sm:w-20 sm:h-20 bg-background/60 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
						<BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
					</div>
					<h4 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
						No Curriculum Available
					</h4>
					<p className="text-sm sm:text-base text-muted-foreground max-w-sm mx-auto">
						This course doesn&apos;t have any curriculum content yet. Check back
						later for updates.
					</p>
				</div>
			</div>
		);
	}

	// Calculate total stats
	const totalLessons = chapters.reduce(
		(total, chapter) => total + (chapter.lessons?.length || 0),
		0
	);
	const totalDuration = chapters.reduce(
		(total, chapter) =>
			total +
			(chapter.lessons?.reduce(
				(sum: number, lesson) => sum + (lesson.duration || 0),
				0
			) || 0),
		0
	);

	return (
		<div className="bg-card rounded-xl sm:rounded-2xl shadow-xl border border-border overflow-hidden backdrop-blur-sm">
			{/* Enhanced Header */}
			<div className="p-4 sm:p-6 lg:p-8 border-b border-border bg-background/60">
				<div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
					<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
						<Layers className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
					</div>
					<div className="flex-1">
						<h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
							Course Curriculum
						</h3>
						<p className="text-xs sm:text-sm text-muted-foreground">
							Complete learning path for this course
						</p>
					</div>
				</div>

				{/* Course Stats */}
				<div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
					<div className="bg-background/60 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 border border-border">
						<div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
							<Award className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
							<span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Chapters
							</span>
						</div>
						<p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
							{chapters.length}
						</p>
					</div>
					<div className="bg-background/60 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 border border-border">
						<div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
							<PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
							<span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Lessons
							</span>
						</div>
						<p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
							{totalLessons}
						</p>
					</div>
					<div className="bg-background/60 rounded-lg sm:rounded-xl p-2.5 sm:p-3 lg:p-4 border border-border">
						<div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
							<Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
							<span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
								Duration
							</span>
						</div>
						<p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
							{formatDuration(totalDuration || 0)}
						</p>
					</div>
				</div>
			</div>

			{/* Curriculum Content */}
			<div className="bg-background rounded-b-xl border border-border overflow-hidden">
				<Accordion type="multiple" className="w-full">
					{chapters.map((chapter, chapterIndex) => (
						<AccordionItem
							key={chapter._id}
							value={chapter._id}
							className="border-b border-border last:border-b-0"
						>
							<AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 flex items-center bg-background/50 hover:no-underline">
								<div className="flex items-center justify-between w-full text-left">
									<span className="text-sm sm:text-base font-semibold pr-2">
										{chapterIndex + 1}. {chapter.title}
									</span>
									<span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
										{chapter.lessons?.length || 0} lessons
									</span>
								</div>
							</AccordionTrigger>

							<AccordionContent className="px-0 pb-0">
								<div>
									{chapter.lessons?.map(
										(
											lesson: NonNullable<IPublicChapter["lessons"]>[0],
											lessonIndex: number
										) => {
											const isLastLesson =
												lessonIndex === (chapter.lessons?.length || 0) - 1;
											return (
												<React.Fragment key={lesson._id}>
													<div
														key={lesson._id}
														className={cn(
															"flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6 transition-colors relative group hover:bg-muted/20"
														)}
													>
														<div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
															<div
																className={cn(
																	"w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0"
																)}
															>
																{lesson.contentType === "video" && (
																	<MdOutlineSlowMotionVideo className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
																)}
																{lesson.contentType === "quiz" && (
																	<HelpCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
																)}
																{lesson.contentType === "article" && (
																	<LucideFileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
																)}
																{lesson.contentType === "coding" && (
																	<Code2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
																)}
															</div>
															<span className="text-xs sm:text-sm text-foreground truncate">
																{lessonIndex + 1}. {lesson.title}
															</span>
														</div>
														<span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
															{secondsToDisplayTime(lesson.duration || 0)}
														</span>
													</div>
													{!isLastLesson && (
														<div className="border-t border-dotted border-border"></div>
													)}
												</React.Fragment>
											);
										}
									)}
								</div>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
};

export default CourseCurriculum;
