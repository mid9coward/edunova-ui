import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Package, ShoppingBag} from "lucide-react";

interface EmptyStateProps {
	onExplore: () => void;
}

// Empty state component - Arrow function
const EmptyState = ({onExplore}: EmptyStateProps) => {
	return (
		<Card className="border-0 shadow-md sm:shadow-lg bg-gradient-to-br from-card to-muted/40">
			<CardContent className="p-8 sm:p-12 text-center">
				<div className="relative mb-4 sm:mb-6">
					<div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/15 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
						<Package className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
					</div>
					<div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-secondary rounded-full flex items-center justify-center">
						<span className="text-[10px] sm:text-xs">!</span>
					</div>
				</div>
				<h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
					No orders yet
				</h3>
				<p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed px-4 sm:px-0">
					You don&apos;t have any orders yet. Explore and enroll in amazing
					courses to start your learning journey!
				</p>
				<Button
					onClick={onExplore}
					className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-4 sm:px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-10 sm:h-11 text-sm sm:text-base"
				>
					<ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
					Explore courses
				</Button>
			</CardContent>
		</Card>
	);
};

export default EmptyState;
