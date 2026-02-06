export type ColorAuditRouteCategory = "public" | "protected" | "admin";

export type ColorAuditRoute = {
	path: string;
	category: ColorAuditRouteCategory;
	requiresAuth: boolean;
	components: string[];
};

export const colorRoutesManifest: ColorAuditRoute[] = [
	{
		path: "/",
		category: "public",
		requiresAuth: false,
		components: ["header", "hero", "cards", "footer"],
	},
	{
		path: "/courses",
		category: "public",
		requiresAuth: false,
		components: ["filters", "course-card", "badges", "pagination"],
	},
	{
		path: "/blogs",
		category: "public",
		requiresAuth: false,
		components: ["blog-card", "typography", "tags"],
	},
	{
		path: "/contact",
		category: "public",
		requiresAuth: false,
		components: ["form", "input", "button", "alert"],
	},
	{
		path: "/about",
		category: "public",
		requiresAuth: false,
		components: ["gradients", "rich-content", "cta"],
	},
	{
		path: "/forbidden",
		category: "public",
		requiresAuth: false,
		components: ["status-page", "buttons", "text-contrast"],
	},
	{
		path: "/unauthorized",
		category: "public",
		requiresAuth: false,
		components: ["status-page", "buttons", "text-contrast"],
	},
	{
		path: "/learning/dsa-for-beginners-arrays-hashing",
		category: "protected",
		requiresAuth: true,
		components: ["lesson-sidebar", "coding-editor", "tabs", "badges"],
	},
	{
		path: "/my-profile",
		category: "protected",
		requiresAuth: true,
		components: ["tabs", "cards", "progress", "badges"],
	},
	{
		path: "/admin/dashboard",
		category: "admin",
		requiresAuth: true,
		components: ["sidebar", "charts", "cards", "tooltips"],
	},
	{
		path: "/admin/courses",
		category: "admin",
		requiresAuth: true,
		components: ["table", "filters", "dialog", "badge"],
	},
];
