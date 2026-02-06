export function getPageNumbers(currentPage: number, totalPages: number) {
	const maxVisiblePages = 5; // Maximum number of page buttons to show
	const rangeWithDots = [];

	if (totalPages <= maxVisiblePages) {
		// If total pages is 5 or less, show all pages
		for (let i = 1; i <= totalPages; i++) {
			rangeWithDots.push(i);
		}
	} else {
		// Always show first page
		rangeWithDots.push(1);

		if (currentPage <= 3) {
			// Near the beginning: [1] [2] [3] [4] ... [10]
			for (let i = 2; i <= 4; i++) {
				rangeWithDots.push(i);
			}
			rangeWithDots.push("...", totalPages);
		} else if (currentPage >= totalPages - 2) {
			// Near the end: [1] ... [7] [8] [9] [10]
			rangeWithDots.push("...");
			for (let i = totalPages - 3; i <= totalPages; i++) {
				rangeWithDots.push(i);
			}
		} else {
			// In the middle: [1] ... [4] [5] [6] ... [10]
			rangeWithDots.push("...");
			for (let i = currentPage - 1; i <= currentPage + 1; i++) {
				rangeWithDots.push(i);
			}
			rangeWithDots.push("...", totalPages);
		}
	}

	return rangeWithDots;
}

export const getStatusConfig = (status: string) => {
	switch (status) {
		case "active":
		case "completed":
		case "approved":
		case "published":
			return {
				bgColor: "bg-primary/10",
				textColor: "text-primary",
				borderColor: "border-primary/30",
				dotColor: "bg-primary",
				ringColor: "focus-visible:ring-primary/20",
				label: status,
			};
		case "expired":
		case "cancelled":
		case "rejected":
		case "banned":
			return {
				bgColor: "bg-destructive/10",
				textColor: "text-destructive",
				borderColor: "border-destructive/30",
				dotColor: "bg-destructive",
				ringColor: "focus-visible:ring-destructive/20",
				label: status,
			};
		case "inactive":
		case "pending":
		case "draft":
			return {
				bgColor: "bg-secondary/20",
				textColor: "text-secondary-foreground",
				borderColor: "border-secondary/40",
				dotColor: "bg-secondary",
				ringColor: "focus-visible:ring-secondary/20",
				label: status,
			};
		default:
			return {
				bgColor: "bg-muted/40",
				textColor: "text-muted-foreground",
				borderColor: "border-border",
				dotColor: "bg-muted-foreground",
				ringColor: "focus-visible:ring-muted-foreground/20",
				label: status,
			};
	}
};
