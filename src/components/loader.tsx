import {cn} from "@/lib/utils";

// Loader.jsx
export default function Loader({message}: {message?: string}) {
	return (
		<div
			className={cn(
				"fixed inset-0 z-50 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center"
			)}
		>
			<div className="w-[50px] h-[50px] border-[7px] border-double border-t-accent border-r-transparent border-b-accent border-l-transparent rounded-full flex items-center justify-center animate-spin">
				<div className="w-1/2 h-1/2 bg-accent rounded-full"></div>
			</div>
			{message && (
				<p className="text-lg text-muted-foreground font-medium animate-pulse">
					{message}
				</p>
			)}
		</div>
	);
}

