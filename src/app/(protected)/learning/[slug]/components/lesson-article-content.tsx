"use client";

import React from "react";

interface LessonArticleContentProps {
	title: string;
	content: string;
}

// Lesson article content component - Arrow function
const LessonArticleContent = ({title, content}: LessonArticleContentProps) => {
	const getCurrentDate = () => {
		const now = new Date();
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
		};
		return `Updated ${now.toLocaleDateString("en-US", options)}`;
	};

	return (
		<div className="w-full h-full bg-card">
			{/* Main Content */}
			<div className="max-w-4xl mx-auto h-full flex flex-col">
				{/* Article Header */}
				<div className="px-4 sm:px-6 pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-6 md:pb-8 flex-shrink-0">
					<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 leading-tight">
						{title}
					</h1>
					<p className="text-muted-foreground text-sm sm:text-base">
						{getCurrentDate()}
					</p>
				</div>

				{/* Article Content */}
				<div className="flex-1 overflow-hidden">
					<div
						className="h-full overflow-y-auto px-4 sm:px-6 pb-6 sm:pb-8 md:pb-12"
						style={{
							scrollbarWidth: "thin",
							scrollbarColor: "var(--border) var(--background)",
						}}
					>
						<div
							className="prose prose-sm sm:prose md:prose-lg prose-gray max-w-none leading-relaxed"
							dangerouslySetInnerHTML={{__html: content}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LessonArticleContent;

