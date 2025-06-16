
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Briefcase, MapPin, Code, Megaphone, BarChart, HeadphonesIcon, Users } from "lucide-react";

export default function Careers() {
  const openings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco / Remote",
      type: "Full-time",
      icon: <Code className="h-5 w-5" />
    },
    {
      id: 2,
      title: "Product Marketing Manager",
      department: "Marketing",
      location: "New York / Remote",
      type: "Full-time",
      icon: <Megaphone className="h-5 w-5" />
    },
    {
      id: 3,
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Full-time",
      icon: <BarChart className="h-5 w-5" />
    },
    {
      id: 4,
      title: "Customer Success Manager",
      department: "Support",
      location: "Boston / Remote",
      type: "Full-time",
      icon: <HeadphonesIcon className="h-5 w-5" />
    },
    {
      id: 5,
      title: "Community Manager",
      department: "Operations",
      location: "Remote",
      type: "Full-time",
      icon: <Users className="h-5 w-5" />
    }
  ];

  const benefits = [
    {
      title: "Competitive Compensation",
      description: "We offer competitive salaries, equity packages, and comprehensive benefits."
    },
    {
      title: "Remote-First",
      description: "Work from anywhere with flexible scheduling and asynchronous communication."
    },
    {
      title: "Professional Development",
      description: "Annual learning budget and dedicated time for professional growth."
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs for physical and mental health."
    },
    {
      title: "Team Retreats",
      description: "Regular global team meetups to connect in person and build relationships."
    },
    {
      title: "Impact",
      description: "Work on products that help thousands of entrepreneurs change the world."
    }
  ];

  const departments = ["All", "Engineering", "Marketing", "Analytics", "Support", "Operations"];

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="text-xl text-muted-foreground">
          Help us build the future of entrepreneurship
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
        <div className="rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070" 
            alt="Team working together"
            className="w-full h-auto object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Culture</h2>
          <p className="text-muted-foreground mb-6">
            At i5s, we're building a team of passionate individuals who believe in the power of entrepreneurship to change the world. We're startup enthusiasts ourselves, and we bring that founder mentality to everything we do.
          </p>
          <p className="text-muted-foreground">
            Our team is remote-first, diverse, and united by our mission to make the startup journey more accessible and successful for founders everywhere. We value autonomy, impact, and continuous learning in an environment where everyone's voice matters.
          </p>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Why Join i5s</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
        
        <Tabs defaultValue="All" className="mb-6">
          <TabsList>
            {departments.map((dept) => (
              <TabsTrigger key={dept} value={dept}>{dept}</TabsTrigger>
            ))}
          </TabsList>
          
          {departments.map((dept) => (
            <TabsContent key={dept} value={dept}>
              <div className="space-y-4 mt-4">
                {openings
                  .filter((job) => dept === "All" || job.department === dept)
                  .map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="rounded-full p-2 bg-primary/10 text-primary">
                              {job.icon}
                            </div>
                            <div>
                              <CardTitle>{job.title}</CardTitle>
                              <CardDescription>{job.department}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm text-muted-foreground">{job.type}</span>
                        </div>
                        <Button asChild>
                          <a href={`/careers/${job.id}`}>View & Apply</a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="text-center mt-12">
          <h3 className="text-xl font-medium mb-4">Don't see a position that fits your skills?</h3>
          <p className="text-muted-foreground mb-6">
            We're always looking for talented people to join our team. Send us your resume and tell us why you'd be a great fit for i5s.
          </p>
          <Button>Submit an Open Application</Button>
        </div>
      </div>
    </div>
  );
}
