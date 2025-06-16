import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useProfileAnalytics } from "@/hooks/useProfileAnalytics";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

interface ProfileAnalyticsProps {
  userId?: string;
}

interface AudienceData {
  name: string;
  value: number;
}

export function ProfileAnalytics({ userId }: ProfileAnalyticsProps) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  const { 
    profileViews, 
    contentAnalytics, 
    totalViews, 
    isLoading, 
    error 
  } = useProfileAnalytics(targetUserId);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [audienceData, setAudienceData] = useState<AudienceData[]>([]);
  const [isLoadingAudience, setIsLoadingAudience] = useState(true);

  // Calculate growth percentage
  const growthPercentage = profileViews.length > 1 
    ? Math.round(((profileViews[profileViews.length - 1]?.views || 0) / Math.max(profileViews[0]?.views || 1, 1) - 1) * 100)
    : 0;

  // Fetch real audience data based on profile views and content interactions
  useEffect(() => {
    const fetchAudienceData = async () => {
      if (!targetUserId) {
        setIsLoadingAudience(false);
        return;
      }

      try {
        setIsLoadingAudience(true);
        console.log("ProfileAnalytics: Fetching audience data for user:", targetUserId);

        // Get viewer data from profile views to understand audience
        const { data: viewerData, error: viewerError } = await supabase
          .from('profile_views')
          .select(`
            viewer_user_id,
            viewer_profile:profiles!profile_views_viewer_user_id_fkey (
              bio,
              status
            )
          `)
          .eq('profile_user_id', targetUserId)
          .not('viewer_user_id', 'is', null);

        if (viewerError) {
          console.error("Error fetching audience data:", viewerError);
          throw viewerError;
        }

        // Analyze audience based on bio/status keywords
        const audienceCategories: Record<string, number> = {
          'Entrepreneurs': 0,
          'Investors': 0,
          'Developers': 0,
          'Marketers': 0,
          'Students': 0,
          'Others': 0
        };

        const totalViewers = viewerData?.length || 0;

        viewerData?.forEach(view => {
          const bio = view.viewer_profile?.bio?.toLowerCase() || '';
          const status = view.viewer_profile?.status?.toLowerCase() || '';
          const text = `${bio} ${status}`;

          if (text.includes('entrepreneur') || text.includes('founder') || text.includes('ceo') || text.includes('startup')) {
            audienceCategories['Entrepreneurs']++;
          } else if (text.includes('investor') || text.includes('vc') || text.includes('venture') || text.includes('angel')) {
            audienceCategories['Investors']++;
          } else if (text.includes('developer') || text.includes('engineer') || text.includes('programmer') || text.includes('tech')) {
            audienceCategories['Developers']++;
          } else if (text.includes('marketing') || text.includes('growth') || text.includes('sales') || text.includes('business')) {
            audienceCategories['Marketers']++;
          } else if (text.includes('student') || text.includes('university') || text.includes('college') || text.includes('learning')) {
            audienceCategories['Students']++;
          } else {
            audienceCategories['Others']++;
          }
        });

        // Convert to percentage and create chart data
        const chartData = Object.entries(audienceCategories)
          .map(([name, count]) => ({
            name,
            value: totalViewers > 0 ? Math.round((count / totalViewers) * 100) : 0
          }))
          .filter(item => item.value > 0)
          .sort((a, b) => b.value - a.value);

        // If no real data, show a message instead of mock data
        if (chartData.length === 0 || totalViewers === 0) {
          setAudienceData([]);
        } else {
          setAudienceData(chartData);
        }

        console.log("ProfileAnalytics: Audience data processed:", chartData);

      } catch (err) {
        console.error("ProfileAnalytics: Error fetching audience data:", err);
        setAudienceData([]);
      } finally {
        setIsLoadingAudience(false);
      }
    };

    fetchAudienceData();
  }, [targetUserId]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile Analytics</CardTitle>
          <CardDescription>Loading analytics data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-muted rounded-lg" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-muted rounded-lg" />
              <div className="h-16 bg-muted rounded-lg" />
              <div className="h-16 bg-muted rounded-lg" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile Analytics</CardTitle>
          <CardDescription>Error loading analytics: {error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Profile Analytics</CardTitle>
        <CardDescription>
          Track your profile performance and audience engagement
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent>
          <TabsContent value="overview" className="mt-0 space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-4">Profile Views (Last 7 Days)</h3>
              {profileViews.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <ChartContainer 
                    config={{
                      views: {
                        label: "Profile Views",
                        theme: {
                          light: "#8B5CF6",
                          dark: "#9b87f5"
                        }
                      }
                    }}
                  >
                    <BarChart data={profileViews}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="views" name="views" fill="var(--color-views)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No profile views recorded yet
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{totalViews}</CardTitle>
                  <CardDescription>Total Profile Views</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{growthPercentage > 0 ? '+' : ''}{growthPercentage}%</CardTitle>
                  <CardDescription>Recent Growth</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">{contentAnalytics.length}</CardTitle>
                  <CardDescription>Content Pieces</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-4">Content Performance</h3>
              {contentAnalytics.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Content</th>
                        <th className="text-right py-3 px-4">Views</th>
                        <th className="text-right py-3 px-4">Likes</th>
                        <th className="text-right py-3 px-4">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contentAnalytics.slice(0, 10).map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/20">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium truncate max-w-xs">{item.title}</div>
                              <div className="text-sm text-muted-foreground capitalize">{item.content_type}</div>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">{item.views}</td>
                          <td className="text-right py-3 px-4">{item.likes}</td>
                          <td className="text-right py-3 px-4">{item.comments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  No content analytics available yet
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="audience" className="mt-0">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-sm font-medium mb-4">Audience Breakdown</h3>
                {isLoadingAudience ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-pulse">Loading audience data...</div>
                  </div>
                ) : audienceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={audienceData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {audienceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center">
                      <p>No audience data available yet.</p>
                      <p className="text-sm mt-2">Audience insights will appear as more people view your profile.</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="md:w-1/2 space-y-4">
                <h3 className="text-sm font-medium mb-2">Audience Insights</h3>
                {audienceData.length > 0 ? (
                  <>
                    <ul className="space-y-3">
                      {audienceData.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}%</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-4 mt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Your audience breakdown is based on profile viewers' bio and status information. 
                        This helps you understand who is interested in your content and profile.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    <p>Audience insights will be generated based on:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Profile viewers' professional backgrounds</li>
                      <li>Their bio and status information</li>
                      <li>Interaction patterns with your content</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
