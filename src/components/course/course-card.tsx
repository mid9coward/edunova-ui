"use client";

import Image from "next/image";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Star, Users, Clock, BookOpen} from "lucide-react";
import {IPublicCourse} from "@/types/course";
import {
	formatPrice,
	formatStudentCount,
	formatDuration,
	formatLastUpdated,
	formatRating,
} from "@/utils/format";
import {FaRegEye} from "react-icons/fa6";
import {DEFAULT_THUMBNAIL} from "@/constants";
interface CourseCardProps {
	course: IPublicCourse;
}

export function CourseCard({course}: CourseCardProps) {
	return (
		<div className="group overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 bg-card rounded-xl flex flex-col h-full">
			{/* Thumbnail */}
			<div className="relative aspect-video overflow-hidden flex-shrink-0">
				<Image
					src={course.image || DEFAULT_THUMBNAIL}
					alt={course.title}
					fill
					loading="lazy"
					quality={75}
					sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
					className="object-cover group-hover:scale-105 transition-transform duration-300"
				/>
				{/* Level Badge */}
				<div className="absolute top-3 left-3 z-10">
					<Badge variant="default" className="text-sm font-medium capitalize">
						{course.level}
					</Badge>
				</div>
				{/* Price Badge */}
				<div className="absolute top-3 right-3 z-10">
					{course?.isFree ? (
						<Badge className="bg-primary text-primary-foreground border-primary/70 backdrop-blur-sm text-xs font-bold px-2.5 py-1 border transition-all duration-200 hover:scale-105 hover:bg-primary/90">
							FREE
						</Badge>
					) : (
						<div className="flex flex-col items-end space-y-1.5">
							{course.oldPrice > 0 && course.oldPrice > course.price && (
								<div className="relative bg-gradient-to-r from-destructive via-destructive to-secondary text-destructive-foreground px-3 py-1.5 font-bold text-xs flex items-center gap-1.5 hover:from-destructive/90 hover:via-destructive/90 hover:to-secondary/90 hover:scale-110 transition-all duration-300 cursor-default shadow-lg hover:shadow-xl rounded-full">
									{/* Glow effect */}
									<div className="absolute inset-0 bg-gradient-to-r from-destructive/70 via-destructive/80 to-secondary/70 rounded-full blur-sm -z-10"></div>
									<span className="text-primary-foreground text-sm">🔥</span>
									{Math.round(
										((course.oldPrice - course.price) / course.oldPrice) * 100
									)}
									% OFF
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Content */}
			<div className="p-4 flex flex-col flex-grow">
				{/* Header: Category & Date */}
				<div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
					<span className="font-medium text-primary capitalize bg-primary/15 px-2.5 py-1 rounded-full">
						{course.category?.name}
					</span>
					<span>{formatLastUpdated(course.updatedAt)}</span>
				</div>

				{/* Title */}
				<Link
					href={`/courses/${course.slug}`}
					className="mb-2"
					aria-label={`View course: ${course.title}`}
				>
					<h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-2 group-hover:text-primary leading-tight">
						{course.title}
					</h3>
				</Link>

				{/* Instructor */}
				<p className="text-sm text-muted-foreground mb-3">
					by{" "}
					<span className="text-foreground font-medium">
						{course.author?.username}
					</span>
				</p>

				<p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
					{course?.excerpt}
				</p>

				{/* Course Stats - Compact */}
				<div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
					<div className="flex items-center space-x-1">
						<Clock size={16} />
						<span>{formatDuration(course.totalDuration || 0)}</span>
					</div>
					<div className="flex items-center space-x-1">
						<FaRegEye size={16} />
						<span>{course.view || 0}</span>
					</div>
					<div className="flex items-center space-x-1">
						<Users size={16} />
						<span>{formatStudentCount(course.enrolledStudents || 0)}</span>
					</div>
				</div>

				{/* Spacer */}
				<div className="flex-grow"></div>

				{/* Rating & Price Row */}
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center space-x-1">
						<div className="flex items-center">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									size={18}
									className={`${
										i < Math.floor(course.averageRating || 0)
											? "text-primary fill-current"
											: "text-muted"
									}`}
								/>
							))}
						</div>
						<span className="text-sm font-medium text-foreground">
							{formatRating(course.averageRating || 0)}
						</span>
						<span className="text-sm text-muted-foreground">
							({formatStudentCount(course.totalReviews || 0)})
						</span>
					</div>

					{/* Price */}
					<div className="text-right">
						{course?.isFree ? (
							<span
								className="text-lg font-bold text-primary"
								itemProp="price"
								content="0"
								aria-label="Free course"
							>
								Free
							</span>
						) : (
							<div className="flex flex-col items-end">
								{course.oldPrice && course.oldPrice > course.price && (
									<span className="text-muted-foreground line-through">
										{formatPrice(course.oldPrice)}
									</span>
								)}
								<span
									className="text-xl font-bold text-foreground"
									itemProp="price"
									content={course.price.toString()}
								>
									{formatPrice(course.price)}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Action Button */}
				<Button className="w-full h-10" asChild>
					<Link
						href={`/courses/${course.slug}`}
						aria-label={`${course?.isFree ? "Start learning" : "Enroll in"} ${
							course.title
						}`}
					>
						<BookOpen className="h-4 w-4 mr-2" />
						{course?.isFree ? "Start Learning" : "Enroll Now"}
					</Link>
				</Button>
			</div>
		</div>
	);
}
