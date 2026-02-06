import {ROUTE_CONFIG} from "@/configs/routes";
import Link from "next/link";

export function NotificationBar() {
	return (
		<div className="bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground text-center py-2 sm:py-3 text-xs sm:text-sm relative overflow-hidden">
			{/* Animated background pattern */}
			<div className="absolute inset-0 opacity-20">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent transform -skew-x-12 animate-pulse"></div>
			</div>
			<div className="absolute inset-0 bg-background/20"></div>
			<div className="relative z-10 px-4">
				<span className="font-semibold">
					🎉 <span className="hidden sm:inline">New Year Sale: </span>Get 50%
					off all courses!{" "}
				</span>
				<Link
					href={ROUTE_CONFIG.COURSES}
					className="underline hover:no-underline ml-1 sm:ml-2 font-bold hover:text-primary-foreground/80 transition-colors"
					aria-label="Shop now - 50% off all courses"
				>
					Shop Now →
				</Link>
			</div>
		</div>
	);
}


