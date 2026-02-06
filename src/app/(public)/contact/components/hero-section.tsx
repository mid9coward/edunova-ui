"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock,
  HeadphonesIcon,
  Mail,
  MessageCircle,
  Phone,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Mon-Fri 9AM-6PM EST",
      value: "+1 (555) 123-4567",
      action: "Call Now",
      href: "tel:+15551234567",
      color: "text-primary",
      bgColor: "bg-primary/15",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get response within 2 hours",
      value: "support@edunova.com",
      action: "Send Email",
      href: "mailto:support@edunova.com",
      color: "text-accent",
      bgColor: "bg-accent/15",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available 24/7",
      value: "Chat with our team",
      action: "Start Chat",
      href: "#chat",
      color: "text-secondary",
      bgColor: "bg-secondary/15",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-card to-secondary/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,var(--foreground),transparent)] -z-10" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float-slow" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/20 rounded-full blur-2xl animate-float-medium" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-float-fast" />

        {/* Animated Icons */}
        <div className="absolute top-16 right-1/4 animate-float-medium">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center rotate-12">
            <HeadphonesIcon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-20 right-8 animate-float-slow">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center -rotate-12">
            <MessageCircle className="h-5 w-5 text-secondary" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge
              variant="secondary"
              className="inline-flex items-center space-x-2"
            >
              <HeadphonesIcon className="h-3 w-3" />
              <span>We&apos;re Here to Help</span>
            </Badge>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Get in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Touch
                </span>{" "}
                with Us
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Have questions about our courses? Need technical support? Our
                friendly team is ready to help you succeed on your learning
                journey.
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">
                  Response within 2 hours
                </span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Star className="h-5 w-5 text-accent fill-current" />
                <span className="text-sm font-medium">
                  4.9/5 Support Rating
                </span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">24/7 Community Help</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="#contact-form">
                  Send us a Message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8"
                asChild
              >
                <Link href="/help">
                  <HeadphonesIcon className="mr-2 h-4 w-4" />
                  Browse Help Center
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Contact Methods */}
          <div className="space-y-6">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Choose Your Preferred Way to Connect
              </h2>
              <p className="text-muted-foreground">
                Multiple ways to reach us - pick what works best for you.
              </p>
            </div>

            <div className="space-y-4">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-card rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-ring"
                  >
                    {/* Background Gradient on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 rounded-2xl transition-all duration-300" />

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 ${method.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className={`h-6 w-6 ${method.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {method.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {method.description}
                          </p>
                          <p className={`text-sm font-medium ${method.color}`}>
                            {method.value}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className={`opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10 ${method.color}`}
                        asChild
                      >
                        <Link href={method.href}>
                          {method.action}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-primary/60 to-secondary/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                );
              })}
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-destructive/10 to-secondary/10 rounded-2xl p-6 border border-destructive/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-destructive/20 rounded-lg flex items-center justify-center">
                  <Phone className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Emergency Support
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    For urgent technical issues:{" "}
                    <span className="font-medium text-destructive">
                      +1 (555) 999-0000
                    </span>
                  </p>
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
