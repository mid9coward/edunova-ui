"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {
	Play,
	Star,
	Users,
	Clock,
	Globe,
	Calendar,
	ChevronLeft,
} from "lucide-react";
import {IPublicCourse} from "@/types/course";
import {formatDuration} from "@/utils/format";
import {ROUTE_CONFIG} from "@/configs/routes";
import {DEFAULT_AVATAR, DEFAULT_THUMBNAIL} from "@/constants";
import dynamic from "next/dynamic";
const VideoModal = dynamic(() => import("./video-modal"), {ssr: false});

interface CourseHeroProps {
	course: IPublicCourse;
}

const CourseHero = ({course}: CourseHeroProps) => {
	const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

	const formatStudentCount = (count: number) => {
		if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}k`;
		}
		return count.toString();
	};

	// Check if course has a valid intro video URL
	const hasIntroVideo = course.introUrl && course.introUrl.trim() !== "";

	return (
		<>
			{/* Video Modal - Only render if video exists */}
			{hasIntroVideo && isVideoModalOpen && (
				<VideoModal
					isOpen={isVideoModalOpen}
					onClose={() => setIsVideoModalOpen(false)}
					videoUrl={course.introUrl}
					title={`${course.title} - Preview`}
				/>
			)}

			{/* Hero Section */}
			<div className="bg-background text-foreground relative overflow-hidden">
				{/* Background Pattern */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15"></div>
				<div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>

				<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative">
					{/* Breadcrumb */}
					<div className="mb-4 sm:mb-6">
						<Link
							href={ROUTE_CONFIG.COURSES}
							className="inline-flex items-center text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
						>
							<ChevronLeft className="h-4 w-4 mr-1" />
							Back to Courses
						</Link>
					</div>

					<div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
						{/* Left Content */}
						<div className="space-y-4 sm:space-y-6">
							{/* Category Badge */}
							<Badge variant="secondary" className="w-fit text-xs sm:text-sm">
								{course.category?.name || "General"}
							</Badge>

							{/* Title */}
							<div>
								<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
									{course.title}
								</h1>
								<div className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
									{course.excerpt}
								</div>
							</div>

							{/* Course Stats */}
							<div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
								<div className="flex items-center space-x-1">
									<div className="flex items-center">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`h-3 w-3 sm:h-4 sm:w-4 ${
													i < Math.floor(course.averageRating || 4.5)
														? "text-primary fill-current"
														: "text-muted-foreground"
												}`}
											/>
										))}
									</div>
									<span className="font-medium">
										{course.averageRating || 4.5}
									</span>
									<span className="text-muted-foreground hidden sm:inline">
										({formatStudentCount(course.totalReviews || 0)} reviews)
									</span>
								</div>

								<div className="flex items-center space-x-1 text-muted-foreground">
									<Users className="h-3 w-3 sm:h-4 sm:w-4" />
									<span>
										{formatStudentCount(course.enrolledStudents || 0)}{" "}
										<span className="hidden sm:inline">students</span>
									</span>
								</div>

								<div className="flex items-center space-x-1 text-muted-foreground">
									<Clock className="h-3 w-3 sm:h-4 sm:w-4" />
									<span>{formatDuration(course.totalDuration || 0)}</span>
								</div>
							</div>

							{/* Instructor */}
							<div className="flex items-center space-x-3">
								<div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden rounded-full bg-card">
									<Image
										src={course.author?.avatar || DEFAULT_AVATAR}
										alt={course.author?.username || "Instructor"}
										fill
										className="object-cover"
										sizes="(max-width: 640px) 40px, 48px"
									/>
								</div>
								<div>
									<p className="text-xs sm:text-sm text-muted-foreground">
										Created by
									</p>
									<p className="text-sm sm:text-base font-medium">
										{course.author?.username || "Unknown Instructor"}
									</p>
								</div>
							</div>

							{/* Course Details */}
							<div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-muted-foreground">
								<div className="flex items-center space-x-1">
									<Globe className="h-3 w-3 sm:h-4 sm:w-4" />
									<span>English</span>
								</div>
								<div className="flex items-center space-x-1">
									<Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
									<span className="hidden sm:inline">
										Last updated{" "}
										{new Date(course.updatedAt).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
										})}
									</span>
									<span className="sm:hidden">
										{new Date(course.updatedAt).toLocaleDateString("en-US", {
											month: "short",
											year: "numeric",
										})}
									</span>
								</div>
								<Badge
									variant="outline"
									className="text-xs sm:text-sm text-muted-foreground border-border"
								>
									{course.level.charAt(0).toUpperCase() + course.level.slice(1)}
								</Badge>
							</div>
						</div>

						{/* Right Content - Video Preview */}
						<div className="relative order-first lg:order-last">
							<div
								className={`relative aspect-video bg-card rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl group ${
									hasIntroVideo ? "cursor-pointer" : ""
								}`}
								onClick={() => {
									if (hasIntroVideo) {
										setIsVideoModalOpen(true);
									}
								}}
								role={hasIntroVideo ? "button" : undefined}
								tabIndex={hasIntroVideo ? 0 : undefined}
								onKeyDown={(e) => {
									if (hasIntroVideo && (e.key === "Enter" || e.key === " ")) {
										e.preventDefault();
										setIsVideoModalOpen(true);
									}
								}}
								aria-label={
									hasIntroVideo ? "Play course preview video" : undefined
								}
							>
								<Image
									src={course.image || DEFAULT_THUMBNAIL}
									alt={course.title}
									fill
									className="object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
								/>

								{/* Play Button Overlay - Only show if video exists */}
								{hasIntroVideo && (
									<div className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
										<div className="w-16 h-16 sm:w-20 sm:h-20 bg-foreground rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
											<Play className="h-6 w-6 sm:h-8 sm:w-8 text-background ml-1 fill-current" />
										</div>
									</div>
								)}
							</div>

							{/* Course Features */}
							<div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
								<div className="text-center p-3 sm:p-4 bg-card/60 rounded-lg backdrop-blur-sm">
									<div className="text-lg sm:text-xl lg:text-2xl font-bold text-accent">
										{course.totalLessons || 0}
									</div>
									<div className="text-xs sm:text-sm text-muted-foreground">
										Lessons
									</div>
								</div>
								<div className="text-center p-3 sm:p-4 bg-card/60 rounded-lg backdrop-blur-sm">
									<div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
										25
									</div>
									<div className="text-xs sm:text-sm text-muted-foreground">
										Resources
									</div>
								</div>
								<div className="text-center p-3 sm:p-4 bg-card/60 rounded-lg backdrop-blur-sm">
									<div className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary">
										∞
									</div>
									<div className="text-xs sm:text-sm text-muted-foreground">
										Lifetime Access
									</div>
								</div>
								<div className="text-center p-3 sm:p-4 bg-card/60 rounded-lg backdrop-blur-sm">
									<div className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-foreground">
										⭐
									</div>
									<div className="text-xs sm:text-sm text-muted-foreground">
										Certificate
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CourseHero;


