"use client";

import {AnimatedCounter} from "@/components/animated-counter";
import {Badge} from "@/components/ui/badge";
import {
	Users,
	BookOpen,
	Star,
	Globe,
	Award,
	Clock,
	TrendingUp,
} from "lucide-react";

// Stats section component - Arrow function
const StatsSection = () => {
	const mainStats = [
		{
			icon: Users,
			value: "50000",
			suffix: "+",
			label: "Active Students",
			description: "Learning worldwide",
		},
		{
			icon: BookOpen,
			value: "1200",
			suffix: "+",
			label: "Expert Courses",
			description: "Across multiple domains",
		},
		{
			icon: Star,
			value: "4.9",
			suffix: "/5",
			label: "Average Rating",
			description: "From student reviews",
		},
		{
			icon: Globe,
			value: "150",
			suffix: "+",
			label: "Countries",
			description: "Students from",
		},
	];

	const additionalStats = [
		{
			icon: Award,
			value: "95",
			suffix: "%",
			label: "Completion Rate",
		},
		{
			icon: Clock,
			value: "10000",
			suffix: "+",
			label: "Hours of Content",
		},
		{
			icon: TrendingUp,
			value: "98",
			suffix: "%",
			label: "Career Growth",
		},
	];

	return (
		<section className="py-20 bg-background">
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="text-center mb-16">
					<Badge
						variant="secondary"
						className="inline-flex items-center space-x-2 mb-4"
					>
						<TrendingUp className="h-3 w-3" />
						<span>Our Impact in Numbers</span>
					</Badge>
					<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
						Trusted by{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
							Thousands
						</span>{" "}
						Worldwide
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
						Our commitment to quality education has created a global community
						of learners, achieving remarkable outcomes and transforming careers.
					</p>
				</div>

				{/* Main Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
					{mainStats.map((stat, index) => {
						const Icon = stat.icon;
						return (
							<div
								key={index}
								className="group relative bg-card rounded-2xl p-8 text-center transition-all duration-300 border border-border hover:shadow-2xl hover:-translate-y-1"
							>
								{/* Background Gradient on Hover */}
								<div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 rounded-2xl transition-all duration-300"></div>

								{/* Icon */}
								<div className="relative z-10 flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
									<Icon className="h-8 w-8 text-primary-foreground" />
								</div>

								{/* Stats */}
								<div className="relative z-10 space-y-2">
									<div className="flex items-center justify-center">
										<span className="text-4xl md:text-5xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
											<AnimatedCounter value={stat.value} duration={2500} />
										</span>
										<span className="text-2xl md:text-3xl font-bold text-primary ml-1">
											{stat.suffix}
										</span>
									</div>
									<h3 className="text-xl font-semibold text-foreground">
										{stat.label}
									</h3>
									<p className="text-muted-foreground">{stat.description}</p>
								</div>

								{/* Decorative Elements */}
								<div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								<div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-secondary to-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
							</div>
						);
					})}
				</div>

				{/* Additional Stats */}
				<div className="relative">
					{/* Background Design */}
					<div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-3xl"></div>

					<div className="relative z-10 bg-card/80 backdrop-blur-sm rounded-3xl border border-border shadow-lg p-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{additionalStats.map((stat, index) => {
								const Icon = stat.icon;
								return (
									<div
										key={index}
										className="flex items-center space-x-4 group"
									>
										<div className="flex items-center justify-center w-12 h-12 bg-background/60 rounded-xl group-hover:bg-primary/20 transition-all duration-300">
											<Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
										</div>
										<div>
											<div className="flex items-baseline">
												<span className="text-2xl md:text-3xl font-bold text-foreground">
													<AnimatedCounter value={stat.value} duration={2000} />
												</span>
												<span className="text-lg font-bold text-primary ml-1">
													{stat.suffix}
												</span>
											</div>
											<p className="text-muted-foreground text-sm">
												{stat.label}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Bottom CTA */}
				<div className="text-center mt-12">
					<p className="text-lg text-muted-foreground mb-4">
						Join thousands of successful learners who have transformed their
						careers with us.
					</p>
					<div className="inline-flex items-center space-x-2 text-primary">
						<Star className="h-5 w-5 fill-current" />
						<span className="font-medium">Rated 4.9/5 by 15,000+ students</span>
						<Star className="h-5 w-5 fill-current" />
					</div>
				</div>
			</div>
		</section>
	);
};

export default StatsSection;

