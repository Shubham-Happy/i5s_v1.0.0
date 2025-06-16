import { useState } from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, Award, Filter, ChevronRight, Briefcase, TrendingUp, Plus, ChevronDown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { fetchStartups, toggleVote, createStartup, Startup } from "@/lib/supabase-startup-queries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Startup name must be at least 2 characters"),
  tagline: z.string().min(5, "Tagline must be at least 5 characters").max(100, "Tagline must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  fundingStage: z.string().min(1, "Funding stage is required"),
  location: z.string().min(1, "Location is required")
});
const tabOptions = [{
  value: "all",
  label: "All Startups"
}, {
  value: "featured",
  label: "Featured"
}, {
  value: "software",
  label: "Software"
}, {
  value: "healthtech",
  label: "HealthTech"
}, {
  value: "fintech",
  label: "FinTech"
}, {
  value: "cleantech",
  label: "CleanTech"
}, {
  value: "edtech",
  label: "EdTech"
}, {
  value: "e-commerce",
  label: "E-commerce"
}, {
  value: "hardware",
  label: "Hardware"
}, {
  value: "ai/ml",
  label: "AI/ML"
}, {
  value: "blockchain",
  label: "Blockchain"
}, {
  value: "gaming",
  label: "Gaming"
}, {
  value: "other",
  label: "Other"
}];
const categoryOptions = ["Software", "HealthTech", "FinTech", "CleanTech", "EdTech", "E-commerce", "Hardware", "AI/ML", "Blockchain", "Gaming", "Other"];

export default function StartupShowcase() {
  const {
    user
  } = useAuth();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Setup form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      category: "Software",
      fundingStage: "Pre-seed",
      location: ""
    }
  });

  // Fetch startups
  const {
    data: startups = [],
    isLoading
  } = useQuery({
    queryKey: ["startups"],
    queryFn: fetchStartups
  });

  // Create startup mutation
  const createStartupMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return await createStartup(values, logoFile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["startups"]
      });
      setDialogOpen(false);
      form.reset();
      setLogoFile(null);
    }
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async (startupId: string) => {
      return await toggleVote(startupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["startups"]
      });
    }
  });

  // Filter startups based on search query and category filter
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchQuery.toLowerCase()) || startup.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || filter === "featured" && startup.featured || startup.category.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });
  const handleVote = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to vote for startups.",
        variant: "destructive"
      });
      return;
    }
    await voteMutation.mutateAsync(id);
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to showcase your startup.",
        variant: "destructive"
      });
      return;
    }
    await createStartupMutation.mutateAsync(values);
  };

  // Loading state
  if (isLoading) {
    return <div className="container max-w-6xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-statusnow-purple border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Loading startups...</p>
          </div>
        </div>
      </div>;
  }
  return <div className="container max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Startup Showcase</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Vote for innovative startups to help them get noticed by investors and connect with their first potential customers</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input placeholder="Search startups..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 md:w-64" />
            <Button variant="outline" size="icon">
              <Filter size={18} />
            </Button>
            {/* Launch Your Startup Button - Prominent */}
            <Link to="/startups/launch">
              <Button className="bg-statusnow-purple hover:bg-statusnow-purple-medium hidden sm:flex">
                <Rocket size={16} className="mr-2" />
                Launch Your Startup
              </Button>
            </Link>
            {/* Quick showcase dialog for existing functionality */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="hidden sm:flex">
                  <Plus size={16} className="mr-2" />
                  Quick Add
                </Button>
              </DialogTrigger>
              {/* ... keep existing code (dialog content) */}
              <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Quick Add Startup</DialogTitle>
                  <DialogDescription>
                    Quickly add your startup here, or use our full launch page for a better experience.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField control={form.control} name="name" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Startup Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. TechVentures" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={form.control} name="tagline" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Tagline</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. AI-powered healthcare diagnostics" maxLength={100} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <FormField control={form.control} name="description" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Describe what your startup does, the problem it solves, and your unique value proposition" rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="category" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" {...field}>
                                {categoryOptions.map(category => <option key={category} value={category}>{category}</option>)}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                      
                      <FormField control={form.control} name="fundingStage" render={({
                      field
                    }) => <FormItem>
                            <FormLabel>Funding Stage</FormLabel>
                            <FormControl>
                              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" {...field}>
                                <option value="Pre-seed">Pre-seed</option>
                                <option value="Seed">Seed</option>
                                <option value="Series A">Series A</option>
                                <option value="Series B">Series B</option>
                                <option value="Series C+">Series C+</option>
                                <option value="Bootstrapped">Bootstrapped</option>
                                <option value="Profitable">Profitable</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>} />
                    </div>
                    
                    <FormField control={form.control} name="location" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. San Francisco, CA" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    
                    <div>
                      <Label htmlFor="startup-logo">Company Logo (Optional)</Label>
                      <Input id="startup-logo" type="file" accept="image/*" onChange={handleLogoChange} />
                      {logoFile && <p className="text-sm text-muted-foreground mt-1">
                          Selected: {logoFile.name}
                        </p>}
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit" disabled={createStartupMutation.isPending}>
                        {createStartupMutation.isPending ? "Submitting..." : "Add Startup"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            {/* Mobile buttons */}
            <Link to="/startups/launch" className="sm:hidden">
              <Button variant="default" size="icon">
                <Rocket size={16} />
              </Button>
            </Link>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <Plus size={16} />
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Hero section for launching startups */}
        <div className="bg-gradient-to-r from-statusnow-purple/10 via-statusnow-purple/5 to-transparent rounded-lg p-6 mb-6 border border-statusnow-purple/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Rocket className="h-12 w-12 text-statusnow-purple flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-statusnow-purple">Launch Your Startup Today</h2>
                <p className="text-sm text-muted-foreground">Join our community, get your startup in front of investors, and connect with your first potential customers.</p>
              </div>
            </div>
            <Link to="/startups/launch">
              <Button className="bg-statusnow-purple hover:bg-statusnow-purple-medium whitespace-nowrap">
                <Rocket size={16} className="mr-2" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-statusnow-purple/5 rounded-lg p-4 mb-6 border border-statusnow-purple/20">
          <div className="flex items-center gap-3">
            <Award className="h-8 w-8 sm:h-10 sm:w-10 text-statusnow-purple flex-shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-medium">Monthly Funding Challenge</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Top voted startup will be veiwed by our pannel for funding oppurtunity and next 4 startups will be mentored by our pannel of experts.</p>
            </div>
          </div>
        </div>

        {/* Mobile filter dropdown */}
        {isMobile ? <div className="mb-6">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter startups" />
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                {tabOptions.map(option => <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div> : (/* Desktop tabs */
      <Tabs defaultValue="all" className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-5">
              {tabOptions.slice(0, 5).map(option => <TabsTrigger key={option.value} value={option.value} onClick={() => setFilter(option.value)} className="text-xs sm:text-sm">
                  {option.label}
                </TabsTrigger>)}
            </TabsList>
          </Tabs>)}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredStartups.length > 0 ? filteredStartups.map(startup => <Card key={startup.id} className={cn("overflow-hidden", startup.featured && "border-statusnow-purple/30 bg-statusnow-purple/5")}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-md overflow-hidden flex-shrink-0">
                        <img src={startup.logo || "https://images.unsplash.com/photo-1560179707-f14e90ef3623"} alt={`${startup.name} logo`} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="line-clamp-1 text-sm sm:text-base">{startup.name}</CardTitle>
                        <CardDescription className="mt-0.5 text-xs sm:text-sm line-clamp-2">
                          {startup.tagline}
                        </CardDescription>
                      </div>
                    </div>
                    {startup.featured && <span className="text-xs bg-statusnow-purple/20 text-statusnow-purple px-2 py-1 rounded-full flex-shrink-0 ml-2">
                        Featured
                      </span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{startup.description}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <Briefcase size={12} className="text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{startup.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={12} className="text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{startup.fundingStage}</span>
                    </div>
                  </div>
                  {startup.founder && <div className="mt-3 flex items-center gap-3">
                      <img src={startup.founder.avatar || "https://via.placeholder.com/40"} alt={startup.founder.name} className="h-5 w-5 sm:h-6 sm:w-6 rounded-full flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">
                        {startup.founder.name}, Founder
                      </span>
                    </div>}
                </CardContent>
                <CardFooter className="flex justify-between items-center gap-2">
                  <Button variant={startup.hasVoted ? "default" : "outline"} className={cn("text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 h-auto", startup.hasVoted ? "bg-statusnow-purple hover:bg-statusnow-purple-medium" : "")} onClick={() => handleVote(startup.id)}>
                    <ThumbsUp size={14} className="mr-1 sm:mr-2" />
                    {startup.hasVoted ? "Voted" : "Vote"} ({startup.votes})
                  </Button>
                  <Link to={`/startups/${startup.id}`} className="flex items-center text-xs sm:text-sm text-statusnow-purple hover:text-statusnow-purple-dark whitespace-nowrap">
                    View Details <ChevronRight size={14} className="ml-1" />
                  </Link>
                </CardFooter>
              </Card>) : <div className="col-span-2 py-12 text-center">
              <Briefcase className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-3" />
              <h3 className="text-base sm:text-lg font-medium">No startups found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your search or filter criteria</p>
            </div>}
        </div>
      </section>
    </div>;
}
