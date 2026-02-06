"use client";

import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {ArrowLeft, Home} from "lucide-react";

export default function ForbiddenPage() {
	const router = useRouter();

	return (
		<div className="h-screen bg-gradient-to-br from-background via-card to-secondary/10">
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
				<div className="absolute top-1/3 -left-8 w-96 h-96 bg-gradient-to-br from-secondary/15 to-accent/15 rounded-full blur-3xl"></div>
				<div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
			</div>

			<div className="relative z-10 min-h-screen flex h-full w-full flex-col items-center justify-center gap-2">
				{/* 403 Number */}
				<h1 className="text-[12rem] md:text-[16rem] leading-tight font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent drop-shadow-sm">
					403
				</h1>

				{/* Error Message */}
				<span className="text-2xl md:text-3xl font-medium text-foreground mb-2">
					Oops! Access Forbidden!
				</span>

				{/* Description */}
				<p className="text-base md:text-lg text-muted-foreground text-center max-w-md px-4 mb-8">
					You don&apos;t have necessary permission{" "}
					<br className="hidden md:block" />
					to view this resource.
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 mt-6">
					{/* Go Back Button */}
					<Button
						variant="outline"
						onClick={() => router.back()}
						className="relative h-12 px-6 font-semibold transition-all duration-300 group hover:bg-gradient-to-br hover:from-muted/40 hover:via-muted/60 hover:to-muted/40 hover:shadow-lg  rounded-xl border-2 border-border hover:border-ring"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-muted/0 to-muted/0 group-hover:from-muted/30 group-hover:to-muted/30 rounded-xl transition-all duration-300"></div>
						<ArrowLeft className="h-4 w-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
						<span className="relative z-10">Go Back</span>
					</Button>

					{/* Back to Home Button */}
					<Button
						className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6 rounded-xl font-semibold relative overflow-hidden group border border-transparent hover:border-primary/50"
						asChild
					>
						<Link href="/">
							{/* Animated shine effect */}
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
							<Home className="h-4 w-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
							<span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
								Back to Home
							</span>
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
