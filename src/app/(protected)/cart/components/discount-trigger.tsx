"use client";

import {Tag, ChevronRight} from "lucide-react";

// Discount trigger component - Arrow function
const DiscountTrigger = () => {
	return (
		<button className="w-full group overflow-hidden border border-border hover:border-primary/40 hover:shadow-md transition-all duration-300 bg-card rounded-lg p-3 sm:p-4">
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
					<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300 flex-shrink-0">
						<Tag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
					</div>
					<div className="text-left min-w-0">
						<div className="text-xs sm:text-sm font-semibold text-foreground truncate">
							Apply Discount Code
						</div>
						<div className="text-[10px] sm:text-xs text-muted-foreground truncate hidden sm:block">
							Browse available coupons or enter code
						</div>
						<div className="text-[10px] sm:text-xs text-muted-foreground truncate sm:hidden">
							Browse or enter code
						</div>
					</div>
				</div>
				<ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
			</div>
		</button>
	);
};

export default DiscountTrigger;
