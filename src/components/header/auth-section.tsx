"use client";

import { UserNav } from "@/components/auth/user-nav";
import { Button } from "@/components/ui/button";
import { ROUTE_CONFIG } from "@/configs/routes";
import { useIsAuthenticated, useUser } from "@/stores/auth-store";
import { User } from "lucide-react";
import Link from "next/link";

export default function AuthSection() {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated && user) {
    return <UserNav />;
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="relative text-muted-foreground hover:text-primary h-8 sm:h-10 px-2 sm:px-4 font-semibold transition-all duration-300 group hover:bg-gradient-to-br hover:from-background hover:via-muted/40 hover:to-secondary/20 hover:shadow-lg hover:shadow-primary/20 rounded-xl border border-transparent hover:border-primary/30 focus:outline-none"
        asChild
      >
        <Link
          href={ROUTE_CONFIG.AUTH.SIGN_IN}
          aria-label="Sign in to your account"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/8 group-hover:to-secondary/8 rounded-xl transition-all duration-300"></div>
          <User className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
          <span className="relative z-10 hidden sm:inline">Sign In</span>
        </Link>
      </Button>
      <Button
        size="sm"
        className="bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:via-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-8 sm:h-10 px-3 sm:px-6 rounded-xl font-semibold relative overflow-hidden group border border-transparent hover:border-primary/40 focus:outline-none"
        asChild
      >
        <Link
          href={ROUTE_CONFIG.AUTH.SIGN_UP}
          aria-label="Sign up and get started with EduNova"
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/15 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <span className="relative z-10 group-hover:scale-105 transition-transform duration-300 text-sm sm:text-base">
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
          </span>
          <span
            className="ml-1 sm:ml-2 relative z-10 group-hover:rotate-12 transition-transform duration-300 text-xs sm:text-base"
            aria-hidden="true"
          >
            🚀
          </span>
        </Link>
      </Button>
    </div>
  );
}
