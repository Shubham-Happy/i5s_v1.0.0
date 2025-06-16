
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, User, Mail, Phone, Calendar, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useJobs } from "@/hooks/useJobs";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobApplications() {
  const { jobs } = useJobs();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Load current user ID
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUserId(data.session?.user.id || null);
    };
    getUser();
  }, []);
  
  // Fetch applications
  useEffect(() => {
    if (!currentUserId) return;
    
    const fetchApplications = async () => {
      setIsLoading(true);
      
      try {
        // Get all job applications
        const { data, error } = await supabase
          .from('job_applications')
          .select(`
            *,
            job:job_id (
              id,
              title,
              company
            )
          `)
          .order('submitted_date', { ascending: false });
        
        if (error) throw error;
        
        // Format application data
        const formattedApplications = data.map((app: any) => ({
          id: app.id,
          jobId: app.job_id,
          job: app.job,
          candidate: {
            name: app.candidate_name || 'Unknown',
            email: app.candidate_email || 'email@example.com',
            phone: app.candidate_phone || '+1 (555) 123-4567',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${app.candidate_name}`,
            resume: app.resume || 'resume.pdf',
            linkedIn: app.candidate_linkedin || 'https://linkedin.com'
          },
          coverLetter: app.cover_letter || 'No cover letter provided',
          status: app.status,
          submittedDate: app.submitted_date,
          notes: app.notes || 'No notes yet'
        }));
        
        setApplications(formattedApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to load applications.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApplications();
    
    // Subscribe to application changes
    const channel = supabase
      .channel('applications-changes')
      .on('postgres_changes', 
        { 
          event: '*',  
          schema: 'public',
          table: 'job_applications',
        },
        () => fetchApplications()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);
  
  const jobsWithApplications = [...new Set(applications.map(app => app.jobId))];
  
  const filteredApplications = applications.filter(app => {
    if (selectedJob && app.jobId !== selectedJob) return false;
    if (activeTab === "all") return true;
    return app.status === activeTab;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="secondary">New</Badge>;
      case "reviewing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Reviewing</Badge>;
      case "interviewing":
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Interviewing</Badge>;
      case "offered":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Offered</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const updateStatus = async (appId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appId);
      
      if (error) throw error;
      
      toast({
        title: "Application status updated",
        description: `Application has been marked as ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const downloadResume = (appId: string, filename: string) => {
    toast({
      title: "Downloading resume",
      description: `${filename} is being downloaded.`,
    });
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/jobs">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Jobs
              </Link>
            </Button>
            <Skeleton className="h-8 w-48" />
          </div>
          
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[200px]" />
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
            <TabsTrigger value="interviewing">Interviewing</TabsTrigger>
            <TabsTrigger value="offered">Offered</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="border rounded-md">
              <div className="p-4">
                <div className="grid grid-cols-6 gap-4">
                  <Skeleton className="h-10 col-span-1" />
                  <Skeleton className="h-10 col-span-1" />
                  <Skeleton className="h-10 col-span-1" />
                  <Skeleton className="h-10 col-span-1" />
                  <Skeleton className="h-10 col-span-1" />
                  <Skeleton className="h-10 col-span-1" />
                </div>
              </div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-4 border-t">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="flex items-center gap-3 col-span-1">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="col-span-1 space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="h-6 w-32 col-span-1" />
                    <Skeleton className="h-6 w-24 col-span-1" />
                    <Skeleton className="h-8 w-20 col-span-1" />
                    <div className="col-span-1 flex justify-end">
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/jobs">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Jobs
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Job Applications</h1>
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={selectedJob || "all"} 
            onValueChange={(value) => setSelectedJob(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {jobsWithApplications.map(jobId => {
                const job = jobs.find(j => j.id === jobId);
                return (
                  <SelectItem key={jobId} value={jobId}>
                    {job ? job.title : `Job #${jobId}`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All Applications
            <Badge variant="secondary" className="ml-2">
              {applications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="new">
            New
            <Badge variant="secondary" className="ml-2">
              {applications.filter(app => app.status === "new").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="reviewing">
            Reviewing
            <Badge variant="secondary" className="ml-2">
              {applications.filter(app => app.status === "reviewing").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="interviewing">
            Interviewing
            <Badge variant="secondary" className="ml-2">
              {applications.filter(app => app.status === "interviewing").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="offered">
            Offered
            <Badge variant="secondary" className="ml-2">
              {applications.filter(app => app.status === "offered").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            <Badge variant="secondary" className="ml-2">
              {applications.filter(app => app.status === "rejected").length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={app.candidate.avatar} />
                          <AvatarFallback>{app.candidate.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{app.candidate.name}</div>
                          <div className="text-sm text-muted-foreground">{app.candidate.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{app.job?.title || `Job #${app.jobId}`}</div>
                      <div className="text-sm text-muted-foreground">{app.job?.company}</div>
                    </TableCell>
                    <TableCell>{formatDate(app.submittedDate)}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadResume(app.id, app.candidate.resume)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem 
                            onClick={() => toast({
                              title: "View application",
                              description: `Viewing ${app.candidate.name}'s application`,
                            })}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toast({
                              title: "Contact candidate",
                              description: `Sending message to ${app.candidate.name}`,
                            })}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Contact Candidate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => updateStatus(app.id, "new")}>
                            Mark as New
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(app.id, "reviewing")}>
                            Mark as Reviewing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(app.id, "interviewing")}>
                            Mark as Interviewing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(app.id, "offered")}>
                            Mark as Offered
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(app.id, "rejected")}>
                            Mark as Rejected
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No applications found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
