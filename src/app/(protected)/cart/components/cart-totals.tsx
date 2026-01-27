"use client";

import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";

import type {CartSummary, OrderDiscount} from "@/types/cart";

import {formatPrice} from "@/utils/format";

interface CartTotalsProps {
	summary: CartSummary;
	appliedDiscount: OrderDiscount | null;
	onRemoveDiscount: () => void;
}

// Cart totals component - Arrow function
const CartTotals = ({
	summary,
	appliedDiscount,
	onRemoveDiscount,
}: CartTotalsProps) => {
	return (
		<div className="space-y-2 sm:space-y-3">
			{/* Subtotal */}
			<div className="flex justify-between items-center py-0.5 sm:py-1">
				<span className="text-xs sm:text-sm text-muted-foreground">
					Subtotal ({summary.itemCount}{" "}
					{summary.itemCount === 1 ? "item" : "items"})
				</span>
				<span className="text-xs sm:text-sm font-medium text-foreground">
					{formatPrice(summary.subtotal)}
				</span>
			</div>

			{/* Applied Discount */}
			{appliedDiscount && (
				<div className="bg-green-500/15 border border-green-500/30 rounded-lg p-2 sm:p-3">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
							<div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
								<span className="text-background text-[10px] sm:text-xs font-bold">
									%
								</span>
							</div>
							<div className="min-w-0">
								<div className="text-xs sm:text-sm font-medium text-green-500 truncate">
									Discount Applied
								</div>
								<div className="text-[10px] sm:text-xs text-green-500/80 truncate">
									Code: {appliedDiscount.code}
								</div>
							</div>
						</div>
						<div className="text-right flex-shrink-0">
							<div className="text-xs sm:text-sm font-bold text-green-500">
								-{formatPrice(summary.discountAmount)}
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={onRemoveDiscount}
								className="h-auto px-0.5 sm:px-1 py-0.5 text-[10px] sm:text-xs text-green-500 hover:text-green-400"
							>
								Remove
							</Button>
						</div>
					</div>
				</div>
			)}

			<Separator />

			{/* Total */}
			<div className="bg-background/60 border border-border rounded-lg p-2 sm:p-3">
				<div className="flex justify-between items-center">
					<span className="text-sm sm:text-base font-bold text-foreground">
						Total
					</span>
					<span className="text-lg sm:text-xl font-bold text-primary">
						{formatPrice(summary.total)}
					</span>
				</div>
				<p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
					Includes lifetime access to all courses
				</p>
			</div>
		</div>
	);
};

export default CartTotals;
