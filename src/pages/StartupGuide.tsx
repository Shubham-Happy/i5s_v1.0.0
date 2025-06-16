
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ArrowRight, Rocket, FileText, PieChart, Users, DollarSign, Award } from "lucide-react";

export default function StartupGuide() {
  const guideCategories = [
    {
      id: 1,
      icon: <FileText className="h-6 w-6" />,
      title: "Ideation & Research",
      description: "Validate your idea and understand the market",
      progress: 100,
      guides: [
        { title: "How to Validate Your Startup Idea", steps: 5 },
        { title: "Conducting Effective Market Research", steps: 7 },
        { title: "Finding Your Product-Market Fit", steps: 4 }
      ]
    },
    {
      id: 2,
      icon: <Users className="h-6 w-6" />,
      title: "Building Your Team",
      description: "Find the right people and create a founding team",
      progress: 85,
      guides: [
        { title: "Finding a Co-Founder", steps: 6 },
        { title: "Key Roles for Early-Stage Startups", steps: 8 },
        { title: "Equity Distribution Guidelines", steps: 5 }
      ]
    },
    {
      id: 3,
      icon: <PieChart className="h-6 w-6" />,
      title: "Business Planning",
      description: "Develop your business model and strategy",
      progress: 70,
      guides: [
        { title: "Creating a Business Model Canvas", steps: 9 },
        { title: "Writing a Business Plan", steps: 12 },
        { title: "Setting Realistic Goals and KPIs", steps: 7 }
      ]
    },
    {
      id: 4,
      icon: <Rocket className="h-6 w-6" />,
      title: "Product Development",
      description: "Build your MVP and iterate based on feedback",
      progress: 60,
      guides: [
        { title: "Building a Minimum Viable Product", steps: 10 },
        { title: "User Testing Fundamentals", steps: 8 },
        { title: "Development Methodologies for Startups", steps: 6 }
      ]
    },
    {
      id: 5,
      icon: <DollarSign className="h-6 w-6" />,
      title: "Funding & Finance",
      description: "Secure funding and manage startup finances",
      progress: 45,
      guides: [
        { title: "Startup Funding Stages Explained", steps: 7 },
        { title: "How to Approach Investors", steps: 9 },
        { title: "Financial Management for Startups", steps: 11 }
      ]
    },
    {
      id: 6,
      icon: <Award className="h-6 w-6" />,
      title: "Growth & Scaling",
      description: "Strategies for growing and scaling your startup",
      progress: 30,
      guides: [
        { title: "Customer Acquisition Strategies", steps: 14 },
        { title: "When and How to Scale", steps: 9 },
        { title: "International Expansion Guide", steps: 12 }
      ]
    }
  ];

  const featuredGuide = {
    title: "The Complete Startup Roadmap: From Idea to Exit",
    description: "This comprehensive guide walks you through every stage of the startup journey, from validating your initial concept to preparing for an acquisition or IPO.",
    chapters: 18,
    duration: "5 hours",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015"
  };

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Startup Guide</h1>
        <p className="text-muted-foreground">
          Step-by-step resources to help you succeed at every stage of your startup journey
        </p>
      </div>
      
      <div className="mb-12">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">{featuredGuide.title}</h2>
              <p className="text-muted-foreground mb-6">
                {featuredGuide.description}
              </p>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{featuredGuide.chapters} chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{featuredGuide.duration}</span>
                </div>
              </div>
              <Button>
                Start Learning <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="hidden md:block">
              <img 
                src={featuredGuide.image} 
                alt="Featured guide"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Guide Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guideCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="rounded-full p-2 bg-primary/10 text-primary">
                {category.icon}
              </div>
              <div>
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{category.progress}%</span>
              </div>
              <Progress value={category.progress} className="mb-4" />
              
              <ul className="space-y-2">
                {category.guides.map((guide, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 
                        className={`h-4 w-4 ${index === 0 ? "text-primary" : "text-muted-foreground"}`} 
                      />
                      <span className="text-sm">{guide.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{guide.steps} steps</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <Separator />
            <CardFooter className="pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/startup-guide/${category.id}`}>
                  View Guides <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
