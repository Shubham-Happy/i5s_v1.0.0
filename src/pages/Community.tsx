
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Users, MessageSquare, Calendar, MapPin } from "lucide-react";

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const communities = [
    {
      id: 1,
      name: "Founders Circle",
      description: "A community for startup founders to share experiences and insights",
      members: 2784,
      topics: ["Startups", "Leadership", "Growth"],
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070"
    },
    {
      id: 2,
      name: "Product Innovators",
      description: "Discussion group focused on product development and innovation",
      members: 1853,
      topics: ["Product", "Innovation", "UX/UI"],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070"
    },
    {
      id: 3,
      name: "Tech Entrepreneurs",
      description: "Connect with other entrepreneurs building technology startups",
      members: 3412,
      topics: ["Tech", "Entrepreneurship", "Coding"],
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070"
    },
    {
      id: 4,
      name: "Funding & Investors",
      description: "Discussions about fundraising, investor relations and pitching",
      members: 2105,
      topics: ["Funding", "Investors", "Venture Capital"],
      image: "https://images.unsplash.com/photo-1569683795645-b62e50fbf103?q=80&w=2070"
    }
  ];
  
  const events = [
    {
      id: 1,
      title: "Virtual Pitch Night",
      date: "May 15, 2025",
      time: "7:00 PM - 9:00 PM",
      location: "Online (Zoom)",
      attendees: 142,
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2070"
    },
    {
      id: 2,
      title: "Startup Networking Mixer",
      date: "May 20, 2025",
      time: "6:30 PM - 8:30 PM",
      location: "Innovation Hub, San Francisco",
      attendees: 87,
      image: "https://images.unsplash.com/photo-1540304453527-62f979142a17?q=80&w=2070"
    },
    {
      id: 3,
      title: "Founder's Workshop: Building Your MVP",
      date: "May 25, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Tech Campus, Boston",
      attendees: 65,
      image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070"
    }
  ];
  
  const discussions = [
    {
      id: 1,
      title: "How did you validate your startup idea?",
      author: {
        name: "Alex Chen",
        avatar: "https://i.pravatar.cc/150?u=alex"
      },
      comments: 32,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      title: "Best tools for remote startup teams in 2025?",
      author: {
        name: "Maria Rodriguez",
        avatar: "https://i.pravatar.cc/150?u=maria"
      },
      comments: 47,
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      title: "Experiences with accelerator programs - worth it?",
      author: {
        name: "James Wilson",
        avatar: "https://i.pravatar.cc/150?u=james"
      },
      comments: 29,
      timestamp: "9 hours ago"
    },
    {
      id: 4,
      title: "How to approach early-stage investors?",
      author: {
        name: "Priya Patel",
        avatar: "https://i.pravatar.cc/150?u=priya"
      },
      comments: 53,
      timestamp: "1 day ago"
    },
    {
      id: 5,
      title: "Share your biggest startup failure and what you learned",
      author: {
        name: "David Kim",
        avatar: "https://i.pravatar.cc/150?u=david"
      },
      comments: 76,
      timestamp: "2 days ago"
    }
  ];

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-muted-foreground">
            Connect with founders, share insights, and grow together
          </p>
        </div>
        
        <div className="w-full md:w-auto relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search communities..."
            className="pl-10 md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="communities" className="mb-8">
        <TabsList>
          <TabsTrigger value="communities">
            <Users className="h-4 w-4 mr-2" />
            Communities
          </TabsTrigger>
          <TabsTrigger value="discussions">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="h-4 w-4 mr-2" />
            Events
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="communities" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {communities.map((community) => (
              <Card key={community.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 w-full overflow-hidden">
                  <img 
                    src={community.image} 
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{community.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {community.description}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {community.members.toLocaleString()} members
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {community.topics.map((topic, index) => (
                      <span 
                        key={index} 
                        className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link to={`/community/${community.id}`}>Browse</Link>
                  </Button>
                  <Button>Join</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="discussions" className="mt-6">
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-sm transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                        <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{discussion.author.name}</p>
                        <p className="text-xs text-muted-foreground">{discussion.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link to={`/community/discussion/${discussion.id}`} className="hover:text-primary">
                    <h3 className="text-lg font-medium mb-2">{discussion.title}</h3>
                  </Link>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center text-muted-foreground">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="text-sm">{discussion.comments} comments</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline">Load More Discussions</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 w-full overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Register</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
