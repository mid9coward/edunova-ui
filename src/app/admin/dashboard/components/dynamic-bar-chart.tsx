"use client"; // CRITICAL: Marks this component for client-side rendering

import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";
import {formatPrice} from "@/utils/format";
import type {OverviewDataItem} from "@/types/dashboard";

interface DynamicBarChartProps {
	data: OverviewDataItem[];
}

// Dedicated client component that uses the Recharts components
export default function DynamicBarChart({data}: DynamicBarChartProps) {
	const formatCompactCurrency = (value: number) => {
		if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
		if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
		return `${value}`;
	};

	const CustomTooltip = ({
		active,
		payload,
		label,
	}: {
		active?: boolean;
		payload?: Array<{value: number}>;
		label?: string;
	}) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-card p-3 border border-border rounded-lg shadow-lg">
					<p className="text-sm font-medium text-foreground">{label}</p>
					<p className="text-sm text-primary">
						<span className="font-semibold">Revenue: </span>
						<span className="text-primary">
							{formatPrice(payload[0].value)}
						</span>
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={data}>
				<XAxis
					dataKey="monthName"
					stroke="var(--muted-foreground)"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="var(--muted-foreground)"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => formatCompactCurrency(value)}
				/>
				<Tooltip content={<CustomTooltip />} />
				<Bar
					dataKey="totalRevenue"
					fill="currentColor"
					radius={[4, 4, 0, 0]}
					className="fill-primary"
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}

