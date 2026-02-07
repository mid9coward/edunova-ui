"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ROUTE_CONFIG } from "@/configs/routes";
import { cn } from "@/lib/utils";
import { useIsAuthenticated, useUser } from "@/stores/auth-store";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GiGraduateCap } from "react-icons/gi";

const navigation = [
  { name: "Courses", href: ROUTE_CONFIG.COURSES },
  { name: "Blogs", href: ROUTE_CONFIG.BLOGS },
  { name: "About", href: ROUTE_CONFIG.ABOUT },
  { name: "Contact", href: ROUTE_CONFIG.CONTACT },
  // { name: "Demo", href: ROUTE_CONFIG.DEMO },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();

  // Close mobile menu when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden h-10 w-10 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <GiGraduateCap size={18} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              EduNova
            </span>
          </SheetTitle>
          <SheetDescription className="text-left">
            Learn. Grow. Succeed.
          </SheetDescription>
        </SheetHeader>

        {/* Mobile Navigation */}
        <div className="flex flex-col h-full">
          <nav className="flex-1 p-6">
            <div className="space-y-4">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-primary hover:bg-muted",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Mobile Auth Section */}
          <div className="p-6 border-t bg-muted/30">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-card rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                    {user.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {user.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={ROUTE_CONFIG.PROFILE.MY_PROFILE}>
                    View Profile
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={ROUTE_CONFIG.AUTH.SIGN_IN}>Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  asChild
                >
                  <Link href={ROUTE_CONFIG.AUTH.SIGN_UP}>Get Started 🚀</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
