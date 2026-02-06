"use client";

import React from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {getRoutes} from "@/configs/routes";
import {
	ChevronLeft,
	ChevronRight,
	PanelRightClose,
	PanelRightOpen,
} from "lucide-react";

interface NavigationLesson {
	_id: string;
}

interface LessonNavigationProps {
	courseSlug: string;
	previousLesson?: NavigationLesson;
	nextLesson?: NavigationLesson;
	currentChapterTitle?: string;
	isSidebarOpen: boolean;
	onToggleSidebar: () => void;
}

// Lesson navigation component - Arrow function
const LessonNavigation = ({
	courseSlug,
	previousLesson,
	nextLesson,
	currentChapterTitle = "Chapter",
	isSidebarOpen,
	onToggleSidebar,
}: LessonNavigationProps) => {
	return (
		<div
			className={`fixed bottom-0 left-0 z-40 bg-card border-t border-border h-14 sm:h-16 flex items-center px-3 sm:px-4 md:px-6 transition-all duration-300 ${
				isSidebarOpen ? "lg:right-[23%] right-0" : "right-0"
			}`}
		>
			<div className="flex items-center justify-between w-full gap-2 sm:gap-3">
				{/* Left Section - Chapter Title (Hidden on mobile) */}
				<div className="hidden md:flex flex-shrink-0 min-w-0 max-w-[150px] lg:max-w-[200px]">
					<p className="text-sm text-muted-foreground font-medium truncate">
						{currentChapterTitle}
					</p>
				</div>

				{/* Center Section - Navigation Buttons */}
				<div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 justify-center">
					{/* Previous Button */}
					{previousLesson ? (
						<Link href={`/learning/${courseSlug}?id=${previousLesson._id}`}>
							<Button
								variant="outline"
								className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border-border text-foreground hover:bg-muted hover:border-primary/30 hover:scale-105 active:scale-95 transition-all duration-300 transform-gpu will-change-transform hover:shadow-md hover:shadow-primary/20 h-9 sm:h-10"
							>
								<ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								<span className="font-medium text-xs sm:text-sm hidden sm:inline">
									PREVIOUS
								</span>
								<span className="font-medium text-xs sm:hidden">PREV</span>
							</Button>
						</Link>
					) : (
						<Button
							variant="outline"
							disabled
							className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 border-border text-muted-foreground cursor-not-allowed transition-all duration-300 opacity-50 h-9 sm:h-10"
						>
							<ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							<span className="font-medium text-xs sm:text-sm hidden sm:inline">
								PREVIOUS
							</span>
							<span className="font-medium text-xs sm:hidden">PREV</span>
						</Button>
					)}

					{/* Next Button */}
					{nextLesson ? (
						<Link href={`/learning/${courseSlug}?id=${nextLesson._id}`}>
							<Button className="flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-primary/25 hover:from-primary/90 hover:via-primary/90 hover:to-secondary/90 hover:scale-105 active:scale-95 transform-gpu will-change-transform h-9 sm:h-10">
								<span className="font-medium text-xs sm:text-sm">NEXT</span>
								<ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
							</Button>
						</Link>
					) : (
						<Link href={getRoutes.courseDetail(courseSlug)}>
							<Button className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform-gpu will-change-transform h-9 sm:h-10">
								<span className="font-medium text-xs sm:text-sm">
									COMPLETED
								</span>
							</Button>
						</Link>
					)}
				</div>

				{/* Right Section - Sidebar Toggle */}
				<div className="flex-shrink-0">
					<Button
						variant="ghost"
						size="sm"
						onClick={onToggleSidebar}
						className="p-1.5 sm:p-2 hover:bg-muted transition-colors h-8 w-8 sm:h-9 sm:w-9"
						title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
					>
						{isSidebarOpen ? (
							<PanelRightClose className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
						) : (
							<PanelRightOpen className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default LessonNavigation;
