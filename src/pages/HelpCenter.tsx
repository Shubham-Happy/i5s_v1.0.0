
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, LifeBuoy, BookOpen, MessageSquare, HelpCircle } from "lucide-react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const faqs = [
    {
      question: "How do I create a startup profile?",
      answer: "To create a startup profile, navigate to the Startups section and click on 'Add Startup'. Fill in all the required information about your startup including name, description, industry, and funding stage. You can also upload a logo and add team members."
    },
    {
      question: "How can I connect with investors?",
      answer: "cozync offers several ways to connect with investors. You can participate in funding events listed in the Fundraising section, showcase your startup to gain visibility, or network with investors directly through our Network feature. Make sure your startup profile is complete and compelling to attract investor interest."
    },
    {
      question: "What makes a good startup pitch on cozync?",
      answer: "A good startup pitch on cozync should be concise yet informative. Include your unique value proposition, the problem you're solving, market opportunity, business model, and current traction. Use visuals where appropriate and clearly state what you're looking for (funding, partnerships, team members, etc.)."
    },
    {
      question: "How do I promote my startup on cozync?",
      answer: "You can promote your startup by creating compelling content in the Articles section, engaging with the community through posts and comments, participating in discussions related to your industry, and showcasing your startup in the dedicated Startups section. Regular updates about your progress can also help maintain visibility."
    },
    {
      question: "Can I post job openings for my startup?",
      answer: "Yes, you can post job openings by navigating to the Jobs section and clicking on 'Post a Job'. Fill in the details about the position including title, description, requirements, and how to apply. These listings will be visible to all cozync members looking for opportunities in the startup ecosystem."
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container max-w-6xl py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">How can we help you?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions or reach out for support
        </p>
        
        <div className="max-w-xl mx-auto mt-6 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for answers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Browse our detailed guides and documentation</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button>View Documentation</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle>Community</CardTitle>
            <CardDescription>Get help from our community of founders</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button>Join Discussion</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <LifeBuoy className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Reach out to our support team directly</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button>Contact Us</Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faqs" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faqs">Frequently Asked Questions</TabsTrigger>
          <TabsTrigger value="topics">Popular Topics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faqs" className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  We couldn't find answers matching your search. Try different keywords or
                  contact our support team.
                </p>
              </div>
            )}
          </Accordion>
        </TabsContent>
        
        <TabsContent value="topics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="hover:text-primary cursor-pointer">Creating your account</li>
                  <li className="hover:text-primary cursor-pointer">Setting up your profile</li>
                  <li className="hover:text-primary cursor-pointer">Navigating the platform</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Startup Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="hover:text-primary cursor-pointer">Creating a startup profile</li>
                  <li className="hover:text-primary cursor-pointer">Managing team members</li>
                  <li className="hover:text-primary cursor-pointer">Showcasing your products</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Networking</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="hover:text-primary cursor-pointer">Finding and connecting with others</li>
                  <li className="hover:text-primary cursor-pointer">Messaging best practices</li>
                  <li className="hover:text-primary cursor-pointer">Building your professional network</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="hover:text-primary cursor-pointer">Writing effective articles</li>
                  <li className="hover:text-primary cursor-pointer">Creating engaging posts</li>
                  <li className="hover:text-primary cursor-pointer">Sharing your startup journey</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
