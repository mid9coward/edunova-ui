"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Heart,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

// Hero section component - Arrow function
const HeroSection = () => {
  const highlights = [
    "Founded in 2020",
    "50,000+ Students worldwide",
    "Award-winning platform",
    "Expert instructors",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-secondary/15">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,var(--foreground),transparent)] -z-10" />

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="inline-flex items-center space-x-2"
            >
              <Heart className="h-3 w-3 fill-current text-destructive" />
              <span>Passionate About Learning</span>
            </Badge>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                We&apos;re Building the{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Future
                </span>{" "}
                of Education
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                At EduNova, we believe that quality education should be
                accessible to everyone, everywhere. Our mission is to
                democratize learning and empower individuals to achieve their
                goals through world-class online education.
              </p>
            </div>

            {/* Highlights List */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{highlight}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/courses">
                  Explore Our Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8"
                asChild
              >
                <Link href="/contact">
                  <Users className="mr-2 h-4 w-4" />
                  Join Our Community
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Abstract Illustration */}
          <div className="relative w-full h-[500px] md:h-[600px] mx-auto">
            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Floating Icons */}
              <div className="absolute top-4 left-4 animate-float-slow">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg rotate-12">
                  <Target className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>

              <div className="absolute top-20 right-8 animate-float-medium">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center shadow-lg -rotate-12">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>

              <div className="absolute bottom-20 left-8 animate-float-fast">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg rotate-45">
                  <Users className="h-7 w-7 text-primary-foreground" />
                </div>
              </div>

              {/* Gradient Orbs */}
              <div className="absolute top-32 right-4 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-32 left-4 w-40 h-40 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

              {/* Animated Stars */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute animate-twinkle-slow`}
                  style={{
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    animationDelay: `${i * 0.5}s`,
                  }}
                >
                  <Star
                    className={`h-4 w-4 text-primary fill-current opacity-70`}
                  />
                </div>
              ))}
            </div>

            {/* Central Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-10">
                <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-primary via-secondary to-primary/80 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                  <div className="w-40 h-40 md:w-52 md:h-52 bg-background/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <div className="w-32 h-32 md:w-44 md:h-44 bg-background/20 rounded-full flex items-center justify-center">
                      <Heart className="h-16 w-16 md:h-20 md:w-20 text-primary-foreground" />
                    </div>
                  </div>
                </div>

                {/* Orbiting Elements */}
                <div className="absolute inset-0 animate-spin">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary rounded-full shadow-lg"></div>
                  <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-6 h-6 bg-accent rounded-full shadow-lg"></div>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-secondary rounded-full shadow-lg"></div>
                  <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-7 h-7 bg-primary/80 rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

