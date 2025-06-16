
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Users, TrendingUp, Activity } from "lucide-react";

interface WeeklyActivityData {
  day: string;
  posts: number;
  users: number;
  articles: number;
  jobs: number;
}

interface UserGrowthData {
  month: string;
  users: number;
  active: number;
}

interface ContentDistribution {
  name: string;
  value: number;
  color: string;
}

export function RealTimeAnalytics() {
  const [weeklyData, setWeeklyData] = useState<WeeklyActivityData[]>([]);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [contentDistribution, setContentDistribution] = useState<ContentDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRealAnalyticsData();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('analytics-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchRealAnalyticsData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
        fetchRealAnalyticsData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchRealAnalyticsData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_listings' }, () => {
        fetchRealAnalyticsData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRealAnalyticsData = async () => {
    try {
      setIsLoading(true);

      // Fetch real weekly activity data
      const weeklyActivity = await Promise.all(
        Array.from({ length: 7 }, async (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
          const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();

          const [postsData, usersData, articlesData, jobsData] = await Promise.all([
            supabase.from('posts').select('id', { count: 'exact', head: true })
              .gte('created_at', startOfDay).lte('created_at', endOfDay),
            supabase.from('profiles').select('id', { count: 'exact', head: true })
              .gte('created_at', startOfDay).lte('created_at', endOfDay),
            supabase.from('articles').select('id', { count: 'exact', head: true })
              .gte('created_at', startOfDay).lte('created_at', endOfDay),
            supabase.from('job_listings').select('id', { count: 'exact', head: true })
              .gte('created_at', startOfDay).lte('created_at', endOfDay)
          ]);

          return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            posts: postsData.count || 0,
            users: usersData.count || 0,
            articles: articlesData.count || 0,
            jobs: jobsData.count || 0
          };
        })
      );

      setWeeklyData(weeklyActivity);

      // Fetch real user growth data (last 6 months)
      const growth = await Promise.all(
        Array.from({ length: 6 }, async (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (5 - i));
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
          const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString();

          const [totalUsers, activeUsers] = await Promise.all([
            supabase.from('profiles').select('id', { count: 'exact', head: true })
              .lte('created_at', endOfMonth),
            supabase.from('profiles').select('id', { count: 'exact', head: true })
              .gte('updated_at', startOfMonth).lte('updated_at', endOfMonth)
          ]);

          return {
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            users: totalUsers.count || 0,
            active: activeUsers.count || 0
          };
        })
      );

      setUserGrowth(growth);

      // Fetch real content distribution
      const [posts, articles, jobs, startups] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('job_listings').select('id', { count: 'exact', head: true }),
        supabase.from('startups').select('id', { count: 'exact', head: true })
      ]);

      const distribution = [
        { name: 'Posts', value: posts.count || 0, color: '#8884d8' },
        { name: 'Articles', value: articles.count || 0, color: '#82ca9d' },
        { name: 'Jobs', value: jobs.count || 0, color: '#ffc658' },
        { name: 'Startups', value: startups.count || 0, color: '#ff7300' }
      ];

      setContentDistribution(distribution);

    } catch (error) {
      console.error("Error fetching real analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Real-Time Weekly Activity
                  <Badge className="bg-green-100 text-green-700">Live</Badge>
                </CardTitle>
                <CardDescription>Platform activity over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="posts" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="articles" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    <Area type="monotone" dataKey="jobs" stackId="1" stroke="#ff7300" fill="#ff7300" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Content Distribution
                  <Badge className="bg-blue-100 text-blue-700">Real Data</Badge>
                </CardTitle>
                <CardDescription>Current content types on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {contentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                User Growth Trends
                <Badge className="bg-purple-100 text-purple-700">Live Data</Badge>
              </CardTitle>
              <CardDescription>User registration and activity trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="Total Users" />
                  <Line type="monotone" dataKey="active" stroke="#82ca9d" strokeWidth={2} name="Active Users" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {contentDistribution.map((item) => (
              <Card key={item.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {item.name}
                    <Badge variant="outline">Live</Badge>
                  </CardTitle>
                  <CardDescription>Total {item.name.toLowerCase()} count</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{item.value}</div>
                  <Progress value={Math.min((item.value / 100) * 100, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {((item.value / contentDistribution.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}% of total content
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Engagement Metrics
                <Badge className="bg-orange-100 text-orange-700">Real-Time</Badge>
              </CardTitle>
              <CardDescription>Platform engagement and interaction data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Total Posts</h4>
                  <p className="text-2xl font-bold text-blue-600">{contentDistribution.find(c => c.name === 'Posts')?.value || 0}</p>
                  <Badge className="bg-blue-100 text-blue-700 mt-2">Live Count</Badge>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Total Articles</h4>
                  <p className="text-2xl font-bold text-green-600">{contentDistribution.find(c => c.name === 'Articles')?.value || 0}</p>
                  <Badge className="bg-green-100 text-green-700 mt-2">Live Count</Badge>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Active Jobs</h4>
                  <p className="text-2xl font-bold text-purple-600">{contentDistribution.find(c => c.name === 'Jobs')?.value || 0}</p>
                  <Badge className="bg-purple-100 text-purple-700 mt-2">Live Count</Badge>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">Startups</h4>
                  <p className="text-2xl font-bold text-orange-600">{contentDistribution.find(c => c.name === 'Startups')?.value || 0}</p>
                  <Badge className="bg-orange-100 text-orange-700 mt-2">Live Count</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
