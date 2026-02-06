"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  Zap,
  BookOpen,
  Globe,
  Lightbulb,
} from "lucide-react";

// Mission section component - Arrow function
const MissionSection = () => {
  const missionVision = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To democratize quality education by making it accessible, affordable, and effective for learners worldwide. We strive to bridge the gap between ambition and achievement through innovative online learning experiences.",
      gradient: "from-primary to-secondary",
    },
    {
      icon: Eye,
      title: "Our Vision",
      description:
        "To become the world's leading platform for transformative education, empowering millions of learners to unlock their potential and create a more knowledgeable, skilled, and connected global community.",
      gradient: "from-secondary to-accent",
    },
  ];

  const coreValues = [
    {
      icon: Heart,
      title: "Student-Centric",
      description:
        "Everything we do is designed with our students' success and learning experience at the heart of our decisions.",
      color: "text-destructive",
      bgColor: "from-destructive/10 to-destructive/20",
    },
    {
      icon: Shield,
      title: "Quality Excellence",
      description:
        "We maintain the highest standards in course content, instructor expertise, and platform reliability.",
      color: "text-primary",
      bgColor: "from-primary/10 to-primary/20",
    },
    {
      icon: Users,
      title: "Inclusive Community",
      description:
        "We foster a diverse, supportive learning environment where everyone can thrive regardless of background.",
      color: "text-accent",
      bgColor: "from-accent/10 to-accent/20",
    },
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We continuously evolve our technology and teaching methods to provide cutting-edge learning experiences.",
      color: "text-secondary",
      bgColor: "from-secondary/10 to-secondary/20",
    },
    {
      icon: BookOpen,
      title: "Lifelong Learning",
      description:
        "We believe in the power of continuous education and support learners at every stage of their journey.",
      color: "text-secondary",
      bgColor: "from-secondary/10 to-secondary/20",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description:
        "We're committed to making a positive difference in communities worldwide through accessible education.",
      color: "text-accent",
      bgColor: "from-accent/10 to-accent/20",
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
            <Lightbulb className="h-3 w-3" />
            <span>What Drives Us</span>
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Purpose
            </span>{" "}
            & Values
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the principles and beliefs that guide everything we do,
            from course creation to community building.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {missionVision.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                      {item.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-foreground/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-primary-foreground/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Card>
            );
          })}
        </div>

        {/* Core Values */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Values
              </span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These fundamental beliefs shape our culture, guide our decisions,
              and define how we serve our learning community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${value.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  <CardContent className="relative z-10 p-6 text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-card rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      <Icon className={`h-6 w-6 ${value.color}`} />
                    </div>

                    <h4 className="text-lg font-semibold text-foreground mb-3">
                      {value.title}
                    </h4>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-border/40 rounded-xl transition-all duration-300" />
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="mt-16 text-center">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl transform rotate-1" />
            <div className="relative bg-card rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="text-6xl text-primary/30 leading-none mb-4">
                &quot;
              </div>
              <blockquote className="text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed mb-6">
                Education is the most powerful weapon which you can use to
                change the world. We&apos;re here to put that weapon in
                everyone&apos;s hands.
              </blockquote>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">EduNova Team</p>
                  <p className="text-sm text-muted-foreground">Passionate Educators</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
