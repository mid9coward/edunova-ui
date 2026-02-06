"use client";

import {Button} from "@/components/ui/button";
import {FaComments} from "react-icons/fa6";
import {cn} from "@/lib/utils";

interface LessonCommentButtonProps {
	className?: string;
	onClick: () => void;
}

function LessonCommentButton({className, onClick}: LessonCommentButtonProps) {
	return (
		<div className={cn("fixed z-50", className)}>
			<Button
				onClick={onClick}
				className={cn(
					"h-9 sm:h-10 px-3 sm:px-4 rounded-full shadow-lg transition-all duration-300",
					"bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground",
					"border-2 border-border/60 backdrop-blur-xl",
					"hover:scale-105 hover:shadow-xl hover:shadow-primary/25",
					"hover:from-primary/90 hover:via-primary/90 hover:to-secondary/90",
					"active:scale-95 transform-gpu will-change-transform",
					"flex items-center justify-center gap-1.5 sm:gap-2 min-w-fit"
				)}
			>
				<FaComments className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground drop-shadow-sm" />
				<span className="text-xs sm:text-sm font-medium text-primary-foreground drop-shadow-sm">
					Q&A
				</span>
			</Button>
		</div>
	);
}

export default LessonCommentButton;
