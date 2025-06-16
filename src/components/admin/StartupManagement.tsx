
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Star, StarOff, Briefcase, TrendingUp } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface StartupData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  funding_stage: string;
  location: string;
  logo?: string;
  votes: number;
  featured: boolean;
  user_id: string;
  created_at: string;
  founder?: {
    full_name: string;
    avatar_url?: string;
  };
}

export function StartupManagement() {
  const [startups, setStartups] = useState<StartupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [featureDialogOpen, setFeatureDialogOpen] = useState(false);
  const [currentStartup, setCurrentStartup] = useState<StartupData | null>(null);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching startups...");
      
      const { data: startups, error: startupsError } = await supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log("Startups data:", startups);
      console.log("Startups error:", startupsError);
      
      if (startupsError) {
        console.error("Error fetching startups:", startupsError);
        throw startupsError;
      }
      
      if (startups && startups.length > 0) {
        // Fetch founder information for each startup
        const startupsWithFounders = await Promise.all(
          startups.map(async (startup) => {
            const { data: founder } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', startup.user_id)
              .single();
            
            return {
              ...startup,
              founder
            };
          })
        );
        
        console.log("Startups with founders:", startupsWithFounders);
        setStartups(startupsWithFounders);
      } else {
        console.log("No startups found");
        setStartups([]);
      }
    } catch (error) {
      console.error("Error in fetchStartups:", error);
      toast({
        title: "Error",
        description: "Failed to load startups. Please try again.",
        variant: "destructive"
      });
      setStartups([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleFeatured = async (startup: StartupData) => {
    try {
      const newFeaturedStatus = !startup.featured;
      
      const { error } = await supabase
        .from('startups')
        .update({ featured: newFeaturedStatus })
        .eq('id', startup.id);
      
      if (error) throw error;
      
      // Update local state
      setStartups(startups.map(s => 
        s.id === startup.id ? { ...s, featured: newFeaturedStatus } : s
      ));
      
      toast({
        title: "Success",
        description: `${startup.name} is now ${newFeaturedStatus ? 'featured' : 'not featured'}.`,
      });
      
      setFeatureDialogOpen(false);
      setCurrentStartup(null);
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast({
        title: "Error",
        description: "Failed to update startup featured status.",
        variant: "destructive"
      });
    }
  };
  
  const filteredStartups = startups.filter(startup => 
    startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    startup.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    startup.founder?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="bg-gradient-to-r from-cream-50 to-cream-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <div className="flex justify-between">
            <div>
              <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
                <Briefcase className="h-5 w-5 mr-2" />
                Startup Management
              </CardTitle>
              <CardDescription>Manage startups and featured listings</CardDescription>
            </div>
          </div>
          <div className="mt-4">
            <Input 
              placeholder="Search startups..." 
              className="max-w-sm border-purple-200" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-cream-50 dark:bg-purple-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Founder</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-cream-200 dark:divide-gray-700">
                  {filteredStartups.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        {startups.length === 0 ? "No startups found." : "No startups found matching your search."}
                      </td>
                    </tr>
                  ) : (
                    filteredStartups.map((startup) => (
                      <tr key={startup.id} className="hover:bg-cream-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img 
                              src={startup.logo || "https://images.unsplash.com/photo-1560179707-f14e90ef3623"} 
                              alt={startup.name}
                              className="w-8 h-8 rounded-md mr-3 object-cover"
                            />
                            <div>
                              <div className="font-medium">{startup.name}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {startup.tagline}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge variant="outline">{startup.category}</Badge>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {startup.founder?.avatar_url && (
                              <img 
                                src={startup.founder.avatar_url} 
                                alt={startup.founder.full_name}
                                className="w-6 h-6 rounded-full mr-2"
                              />
                            )}
                            <span className="text-sm">
                              {startup.founder?.full_name || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                            <span>{startup.votes}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {startup.featured ? (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          ) : (
                            <Badge variant="outline">Regular</Badge>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={startup.featured 
                              ? "border-yellow-200 text-yellow-700 hover:bg-yellow-50" 
                              : "border-purple-200 text-purple-700 hover:bg-purple-50"
                            }
                            onClick={() => {
                              setCurrentStartup(startup);
                              setFeatureDialogOpen(true);
                            }}
                          >
                            {startup.featured ? (
                              <>
                                <StarOff className="h-4 w-4 mr-1" />
                                Unfeature
                              </>
                            ) : (
                              <>
                                <Star className="h-4 w-4 mr-1" />
                                Feature
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-cream-50 dark:bg-gray-900/20 border-t py-3 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {filteredStartups.length} of {startups.length} startups
          </div>
        </CardFooter>
      </Card>
      
      {/* Feature/Unfeature Dialog */}
      <AlertDialog open={featureDialogOpen} onOpenChange={setFeatureDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {currentStartup?.featured 
                ? "Remove from featured?" 
                : "Add to featured?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentStartup?.featured 
                ? `This will remove "${currentStartup?.name}" from the featured startups section.`
                : `This will add "${currentStartup?.name}" to the featured startups section, giving it more visibility.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCurrentStartup(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className={currentStartup?.featured ? "bg-yellow-600 hover:bg-yellow-700" : "bg-purple-600 hover:bg-purple-700"}
              onClick={() => currentStartup && toggleFeatured(currentStartup)}
            >
              {currentStartup?.featured ? "Unfeature" : "Feature"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
