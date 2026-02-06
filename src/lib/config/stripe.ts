export const stripeConfig = {
	publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
	apiVersion: "2024-12-18.acacia" as const,
	currency: "vnd", // Vietnamese Dong for your LMS
	appearance: {
		theme: "stripe" as const,
		variables: {
			colorPrimary: "hsl(var(--primary))",
			colorBackground: "hsl(var(--background))",
			colorText: "hsl(var(--foreground))",
			colorDanger: "hsl(var(--destructive))",
			fontFamily: '"Inter", system-ui, sans-serif',
			spacingUnit: "4px",
			borderRadius: "8px",
		},
	},
	urls: {
		success:
			process.env.NEXT_PUBLIC_PAYMENT_SUCCESS_URL ||
			`${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
		cancel:
			process.env.NEXT_PUBLIC_PAYMENT_CANCEL_URL ||
			`${process.env.NEXT_PUBLIC_APP_URL}/cart`,
		base: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000",
	},
} as const;

