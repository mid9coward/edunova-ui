"use client";

import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";

interface CheckoutActionsProps {
	isCheckoutPending: boolean;
	onCheckout: () => void;
}

// Checkout actions component - Arrow function
const CheckoutActions = ({
	isCheckoutPending,
	onCheckout,
}: CheckoutActionsProps) => {
	return (
		<div className="space-y-3 sm:space-y-4">
			{/* Checkout Button */}
			<Button
				onClick={onCheckout}
				disabled={isCheckoutPending}
				className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground py-3 sm:py-4 text-sm sm:text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-lg sm:rounded-xl border border-transparent hover:border-primary/40 h-11 sm:h-auto"
				size="lg"
			>
				{isCheckoutPending ? (
					<>
						<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2" />
						<span className="hidden sm:inline">Creating Order...</span>
						<span className="sm:hidden">Processing...</span>
					</>
				) : (
					<>
						<span className="hidden sm:inline">Proceed to Checkout</span>
						<span className="sm:hidden">Checkout</span>
					</>
				)}
			</Button>

			{/* Security Notice */}
			<p className="text-[10px] sm:text-xs text-muted-foreground text-center">
				🔒 Secure checkout • 30-day money-back guarantee
			</p>
		</div>
	);
};

export default CheckoutActions;
