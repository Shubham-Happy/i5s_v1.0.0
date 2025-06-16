import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Lightbulb, Mail, Phone, MapPin, Send, Heart, Rocket, Globe, Award } from "lucide-react";
import { useState } from "react";
import { useFeedback } from "@/hooks/useFeedback";
import { useIsMobile } from "@/hooks/use-mobile";
import { Footer } from "@/components/layout/Footer";
export default function AboutUs() {
  const isMobile = useIsMobile();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const {
    submitFeedback,
    isSubmitting
  } = useFeedback();
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitFeedback(contactForm);
    if (success) {
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    }
  };
  const teamMembers = [{
    name: "Shubham Shrivastava",
    role: "CEO & Founder",
    bio: "Coordinator - Ecell IIT ISM DHANBAD"
  }, {
    name: "Nayan Agarwal",
    role: "CTO",
    bio: "IIT ISM DHANBAD "
  }];
  const stats = [{
    label: "Active Users",
    value: "50K+",
    icon: Users
  }, {
    label: "Startups Connected",
    value: "2.5K+",
    icon: Rocket
  }, {
    label: "Countries Reached",
    value: "120+",
    icon: Globe
  }, {
    label: "Success Stories",
    value: "500+",
    icon: Award
  }];
  return <div className="flex flex-col min-h-screen">
      <div className="container py-8 max-w-6xl flex-1">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary via-emerald to-gold flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-emerald to-gold bg-clip-text  ">About i5s</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Empowering entrepreneurs and founders to connect, collaborate, and build the future together
          </p>
        </div>

        {/* Stats Section */}
        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Mission & Vision */}
          <div className="space-y-8">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Target className="w-5 h-5" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  To create the world's most vibrant ecosystem for entrepreneurs, where innovative ideas meet passionate founders, 
                  and where every startup has the opportunity to grow, scale, and make a meaningful impact on the world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gold-200 dark:border-gold-800">
              <CardHeader className="bg-gradient-to-r from-gold-50 to-yellow-50 dark:from-gold-900/20 dark:to-yellow-900/20">
                <CardTitle className="flex items-center gap-2 text-gold-700 dark:text-gold-400">
                  <Lightbulb className="w-5 h-5" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  A world where geographical boundaries don't limit entrepreneurial potential, where collaboration 
                  transcends borders, and where the next breakthrough innovation is just one connection away.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <Card className="border-coral-200 dark:border-coral-800">
            <CardHeader className="bg-gradient-to-r from-coral-50 to-pink-50 dark:from-coral-900/20 dark:to-pink-900/20">
              <CardTitle className="flex items-center gap-2 text-coral-700 dark:text-coral-400">
                <Heart className="w-5 h-5" />
                Our Values
              </CardTitle>
              <CardDescription>What drives us every day</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">Innovation</Badge>
                  <p className="text-sm text-muted-foreground">Constantly pushing boundaries and embracing new ideas</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">Collaboration</Badge>
                  <p className="text-sm text-muted-foreground">Believing that together we can achieve more</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">Integrity</Badge>
                  <p className="text-sm text-muted-foreground">Building trust through transparency and honesty</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">Impact</Badge>
                  <p className="text-sm text-muted-foreground">Creating meaningful change in the entrepreneurial ecosystem</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-emerald rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-primary-200 dark:border-primary-800">
            <CardHeader className="bg-gradient-to-r from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20">
              <CardTitle className="flex items-center gap-2 text-primary-700 dark:text-primary-400">
                <Mail className="w-5 h-5" />
                Get in Touch
              </CardTitle>
              <CardDescription>We'd love to hear from you</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" value={contactForm.name} onChange={e => setContactForm(prev => ({
                  ...prev,
                  name: e.target.value
                }))} />
                  <Input type="email" placeholder="Your Email" value={contactForm.email} onChange={e => setContactForm(prev => ({
                  ...prev,
                  email: e.target.value
                }))} required />
                </div>
                <Input placeholder="Subject" value={contactForm.subject} onChange={e => setContactForm(prev => ({
                ...prev,
                subject: e.target.value
              }))} required />
                <Textarea placeholder="Your message..." value={contactForm.message} onChange={e => setContactForm(prev => ({
                ...prev,
                message: e.target.value
              }))} rows={4} required />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">hello@i5s.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* <Phone className="w-5 h-5 text-emerald" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div> */}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-coral" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">
                      Dhanbad, Jharkhand<br />
                      India
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-primary/5 to-emerald/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Join Our Community</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Ready to connect with fellow entrepreneurs? Join i5s today and start building your network.
                </p>
                <Button className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer only shows on mobile */}
      {isMobile && <Footer />}
    </div>;
}