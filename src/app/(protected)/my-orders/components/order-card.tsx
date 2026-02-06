import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {DEFAULT_THUMBNAIL} from "@/constants";
import type {useCancelOrder} from "@/hooks/use-orders";
import type {MyOrder} from "@/types/order";
import {formatDate, formatPrice} from "@/utils/format";
import {OrderService} from "@/services/orders";
import {toast} from "sonner";

import {
	Banknote,
	Calendar,
	Clock,
	CreditCard,
	Download,
	Loader2,
	Package,
	X,
} from "lucide-react";
import Image from "next/image";
import {useState} from "react";

// Status colors and labels with modern design
const STATUS_CONFIG = {
	pending: {
		label: "Pending payment",
		color: "bg-secondary/20 text-secondary-foreground border border-secondary/30",
		bgColor: "bg-secondary/20",
		textColor: "text-secondary-foreground",
		icon: Clock,
	},
	completed: {
		label: "Completed",
		color: "bg-primary/10 text-primary border border-primary/30",
		bgColor: "bg-primary/10",
		textColor: "text-primary",
		icon: Package,
	},
	cancelled: {
		label: "Cancelled",
		color: "bg-destructive/10 text-destructive border border-destructive/30",
		bgColor: "bg-destructive/10",
		textColor: "text-destructive",
		icon: X,
	},
} as const;

// Payment method labels
const PAYMENT_METHOD_LABELS = {
	stripe: "Stripe",
	bank_transfer: "Bank transfer",
} as const;

interface OrderCardProps {
	order: MyOrder;
	onPayment: (orderId: string) => void;
	onCancel: (orderId: string, orderCode: string) => void;
	cancelMutation: ReturnType<typeof useCancelOrder>;
}

// Order card component - Arrow function
const OrderCard = ({
	order,
	onPayment,
	onCancel,
	cancelMutation,
}: OrderCardProps) => {
	const statusConfig = STATUS_CONFIG[order.status];
	const StatusIcon = statusConfig.icon;
	const [isDownloading, setIsDownloading] = useState(false);

	// Check if this specific order is being cancelled
	const isCancelling =
		cancelMutation.isPending && cancelMutation.variables === order._id;

	// Handle invoice download
	const handleDownloadInvoice = async () => {
		try {
			setIsDownloading(true);
			await OrderService.downloadInvoice(order._id, order.code);
			toast.success("Invoice downloaded successfully");
		} catch {
			toast.error("Failed to download invoice. Please try again.");
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<Card className="overflow-hidden border-0 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/30">
			{/* Order Header */}
			<CardHeader className="bg-gradient-to-r from-muted/40 to-card border-b border-border/60 p-3 sm:p-6">
				<div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
					<div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
						<div
							className={`p-1.5 sm:p-2 rounded-lg ${statusConfig.bgColor} flex-shrink-0`}
						>
							<StatusIcon
								className={`w-4 h-4 sm:w-5 sm:h-5 ${statusConfig.textColor}`}
							/>
						</div>
						<div className="min-w-0 flex-1">
							<h3 className="text-base sm:text-lg font-bold text-foreground mb-1 truncate">
								#{order.code}
							</h3>
							<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
								<div className="flex items-center gap-1.5 sm:gap-2">
									<Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
									<span className="truncate">
										{formatDate(order.createdAt)}
									</span>
								</div>
								<div className="flex items-center gap-1.5 sm:gap-2">
									<CreditCard className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
									<span className="truncate">
										{PAYMENT_METHOD_LABELS[order.paymentMethod]}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="self-start sm:self-auto">
						<Badge
							className={`${statusConfig.color} px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold rounded-full`}
						>
							{statusConfig.label}
						</Badge>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-3 sm:p-4">
				{/* Course Items */}
				<div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
					{order?.items.map((item) => (
						<div
							key={item._id}
							className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-muted shadow-sm flex-shrink-0">
								<Image
									src={item.thumbnail || DEFAULT_THUMBNAIL}
									alt={item.title}
									fill
									className="object-cover"
								/>
							</div>
							<div className="flex-1 min-w-0">
								<h4 className="font-semibold text-foreground text-xs sm:text-sm md:text-base mb-1 sm:mb-2 line-clamp-2">
									{item.title}
								</h4>

								{/* Price Display with Old Price */}
								<div className="space-y-0.5 sm:space-y-1">
									{item.oldPrice && item.oldPrice > item.price && (
										<div className="flex items-center gap-1.5 sm:gap-2">
											<span className="text-xs sm:text-sm text-muted-foreground line-through">
												{formatPrice(item.oldPrice)}
											</span>
											<span className="text-[10px] sm:text-xs bg-destructive text-destructive-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium shadow-sm">
												{Math.round(
													((item.oldPrice - item.price) / item.oldPrice) * 100
												)}
												% OFF
											</span>
										</div>
									)}
									<div className="text-base sm:text-lg font-bold text-foreground">
										{formatPrice(item.price)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Summary & Actions */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 sm:pt-3 border-t border-border/70 gap-3">
					<div className="space-y-0.5 sm:space-y-1">
						<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
							<span>Subtotal: {formatPrice(order.subTotal)}</span>
							{order.totalDiscount > 0 && (
								<span className="text-primary">
									Discount: -{formatPrice(order.totalDiscount)}
								</span>
							)}
						</div>
						<div className="text-sm sm:text-base font-bold text-foreground">
							Total: {formatPrice(order.totalAmount)}
						</div>
					</div>

					<div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
						{/* Action Buttons */}
						{order.status === "pending" && (
							<>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											disabled={isCancelling}
											className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/40 disabled:opacity-50 h-8 sm:h-9 text-xs sm:text-sm flex-1 sm:flex-none"
										>
											{isCancelling ? (
												<>
													<Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
													<span className="hidden sm:inline">
														Cancelling...
													</span>
													<span className="sm:hidden">...</span>
												</>
											) : (
												<>
													<X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
													Cancel
												</>
											)}
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
										<AlertDialogHeader>
											<AlertDialogTitle className="text-base sm:text-lg">
												Confirm order cancellation
											</AlertDialogTitle>
											<AlertDialogDescription className="text-xs sm:text-sm">
												Are you sure you want to cancel order #{order.code}?
												This action cannot be undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter className="flex-col sm:flex-row gap-2">
											<AlertDialogCancel
												disabled={isCancelling}
												className="h-9 text-sm w-full sm:w-auto"
											>
												No
											</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => onCancel(order._id, order.code)}
												disabled={isCancelling}
												className="bg-destructive hover:bg-destructive/90 disabled:opacity-50 h-9 text-sm w-full sm:w-auto"
											>
												{isCancelling ? (
													<>
														<Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
														<span className="hidden sm:inline">
															Cancelling...
														</span>
														<span className="sm:hidden">...</span>
													</>
												) : (
													"Confirm cancellation"
												)}
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>

								<Button
									onClick={() => onPayment(order._id)}
									size="sm"
									className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 h-8 sm:h-9 text-xs sm:text-sm flex-1 sm:flex-none"
								>
									<Banknote className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
									Pay now
								</Button>
							</>
						)}

						{order.status === "completed" && (
							<Button
								variant="outline"
								size="sm"
								onClick={handleDownloadInvoice}
								disabled={isDownloading}
								className="border-border hover:bg-muted/40 disabled:opacity-50 h-8 sm:h-9 text-xs sm:text-sm w-full sm:w-auto"
							>
								{isDownloading ? (
									<>
										<Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
										<span className="hidden sm:inline">Downloading...</span>
										<span className="sm:hidden">...</span>
									</>
								) : (
									<>
										<Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
										<span className="hidden sm:inline">Download invoice</span>
										<span className="sm:hidden">Invoice</span>
									</>
								)}
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default OrderCard;
