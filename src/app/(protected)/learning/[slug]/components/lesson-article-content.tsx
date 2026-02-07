"use client";

import React from "react";

interface LessonArticleContentProps {
	title: string;
	content: string;
}

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const renderInlineMarkdown = (text: string) => {
	const parts = text.split(/(\*\*[^*]+\*\*)/g);

	return parts.map((part, index) => {
		if (part.startsWith("**") && part.endsWith("**")) {
			return (
				<strong key={`${part}-${index}`} className="font-semibold text-foreground">
					{part.slice(2, -2)}
				</strong>
			);
		}

		return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
	});
};

const renderMarkdownLikeContent = (rawContent: string) => {
	const lines = rawContent.replace(/\r\n/g, "\n").split("\n");
	const nodes: React.ReactNode[] = [];
	let listBuffer: string[] = [];

	const flushList = (keyPrefix: string) => {
		if (listBuffer.length === 0) return;

		nodes.push(
			<ul key={`${keyPrefix}-list-${nodes.length}`} className="my-4 list-disc pl-6 space-y-1 text-foreground/95">
				{listBuffer.map((item, index) => (
					<li key={`${keyPrefix}-item-${index}`} className="leading-relaxed break-words">
						{renderInlineMarkdown(item)}
					</li>
				))}
			</ul>
		);

		listBuffer = [];
	};

	lines.forEach((line, lineIndex) => {
		const trimmed = line.trim();

		if (!trimmed) {
			flushList(`line-${lineIndex}`);
			nodes.push(<div key={`spacer-${lineIndex}`} className="h-3" />);
			return;
		}

		if (trimmed.startsWith("- ")) {
			listBuffer.push(trimmed.slice(2));
			return;
		}

		flushList(`line-${lineIndex}`);

		if (trimmed.startsWith("### ")) {
			nodes.push(
				<h3 key={`h3-${lineIndex}`} className="text-lg md:text-xl font-semibold text-foreground mt-6 mb-2 break-words">
					{renderInlineMarkdown(trimmed.slice(4))}
				</h3>
			);
			return;
		}

		if (trimmed.startsWith("## ")) {
			nodes.push(
				<h2 key={`h2-${lineIndex}`} className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-3 break-words">
					{renderInlineMarkdown(trimmed.slice(3))}
				</h2>
			);
			return;
		}

		nodes.push(
			<p key={`p-${lineIndex}`} className="my-3 leading-relaxed text-foreground/95 break-words">
				{renderInlineMarkdown(trimmed)}
			</p>
		);
	});

	flushList("final");

	return nodes;
};

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
						{HTML_TAG_PATTERN.test(content) ? (
							<div
								className="prose prose-sm sm:prose md:prose-lg prose-gray max-w-none leading-relaxed"
								dangerouslySetInnerHTML={{__html: content}}
							/>
						) : (
							<div className="max-w-none">{renderMarkdownLikeContent(content)}</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LessonArticleContent;

