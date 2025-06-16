
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  type: string;
  posted: string;
  tags: string[];
  description: string;
  applyLink: string;
  postedBy?: {
    name: string;
    id: string;
  };
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidate: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    resume?: string;
    linkedIn?: string;
  };
  coverLetter?: string;
  status: string; // 'new', 'reviewing', 'interviewing', 'offered', 'rejected'
  submittedDate: string;
  notes?: string;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load current user ID
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUserId(data.session?.user.id || null);
    };
    getUser();
  }, []);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('job_listings')
          .select(`
            *,
            profiles!job_listings_user_id_fkey (
              id,
              full_name,
              username
            )
          `)
          .order('posted', { ascending: false });
        
        if (error) {
          console.error("Supabase fetch error:", error);
          throw error;
        }
        
        console.log("Fetched jobs data:", data);
        
        // Format job data
        const formattedJobs: Job[] = (data || []).map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          companyLogo: job.company_logo || undefined,
          location: job.location,
          salary: job.salary || undefined,
          type: job.type,
          posted: formatTimeAgo(new Date(job.posted)),
          tags: job.tags || [],
          description: job.description,
          applyLink: job.apply_link,
          postedBy: job.profiles ? {
            name: job.profiles.full_name || job.profiles.username || 'Anonymous',
            id: job.profiles.id
          } : undefined
        }));
        
        console.log("Formatted jobs:", formattedJobs);
        setJobs(formattedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load job listings.",
          variant: "destructive"
        });
        setJobs([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
    
    // Subscribe to job changes
    const channel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', 
        { 
          event: '*',  
          schema: 'public',
          table: 'job_listings'
        },
        () => {
          console.log("Job listing changed, refetching...");
          fetchJobs();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch applications for current user
  useEffect(() => {
    if (!currentUserId) return;
    
    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from('job_applications')
          .select(`
            *,
            job:job_id(
              title,
              company
            )
          `)
          .order('submitted_date', { ascending: false });
        
        if (error) throw error;
        
        // Format application data
        const formattedApplications: JobApplication[] = data.map(app => ({
          id: app.id,
          jobId: app.job_id,
          candidate: {
            name: app.candidate_name || '',
            email: app.candidate_email || '',
            phone: app.candidate_phone,
            resume: app.resume,
            linkedIn: app.candidate_linkedin
          },
          coverLetter: app.cover_letter,
          status: app.status,
          submittedDate: app.submitted_date,
          notes: app.notes
        }));
        
        setApplications(formattedApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
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
          filter: `user_id=eq.${currentUserId}`
        },
        () => fetchApplications()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Apply for a job
  const applyForJob = async (
    jobId: string,
    candidateName: string,
    candidateEmail: string,
    candidatePhone: string,
    candidateLinkedIn: string,
    coverLetter: string,
    resume: string
  ) => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to apply for jobs.",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          user_id: currentUserId,
          candidate_name: candidateName,
          candidate_email: candidateEmail,
          candidate_phone: candidatePhone,
          candidate_linkedin: candidateLinkedIn,
          cover_letter: coverLetter,
          resume: resume,
          status: 'new',
          submitted_date: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Application submitted!",
        description: "Your job application has been successfully submitted.",
      });
      
      return true;
    } catch (error) {
      console.error("Error applying for job:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Post a new job
  const postJob = async (jobData: Omit<Job, 'id' | 'posted' | 'postedBy'>) => {
    console.log("postJob called with data:", jobData);
    
    if (!currentUserId) {
      console.log("No current user ID");
      toast({
        title: "Authentication required",
        description: "You must be logged in to post jobs.",
        variant: "destructive"
      });
      return false;
    }
    
    console.log("Current user ID:", currentUserId);
    setIsSubmitting(true);
    
    try {
      // Generate a UUID for the job ID
      const jobId = uuidv4();
      
      const jobPayload = {
        id: jobId,
        title: jobData.title,
        company: jobData.company,
        company_logo: jobData.companyLogo || null,
        location: jobData.location,
        salary: jobData.salary || null,
        type: jobData.type,
        tags: jobData.tags || [],
        description: jobData.description,
        apply_link: jobData.applyLink,
        user_id: currentUserId,
        posted: new Date().toISOString()
      };
      
      console.log("Job payload:", jobPayload);
      
      const { data, error } = await supabase
        .from('job_listings')
        .insert(jobPayload)
        .select()
        .single();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Job posted successfully:", data);
      
      toast({
        title: "Job posted successfully!",
        description: "Your job posting is now live on the job board.",
      });
      
      return true;
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "Error",
        description: `Failed to post job: ${error.message || 'Unknown error'}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch a single job by ID
  const fetchJobById = async (jobId: string): Promise<Job | null> => {
    try {
      console.log("Fetching job by ID:", jobId);
      
      const { data, error } = await supabase
        .from('job_listings')
        .select(`
          *,
          profiles!job_listings_user_id_fkey (
            id,
            full_name,
            username
          )
        `)
        .eq('id', jobId)
        .single();
        
      if (error) {
        console.error("Error fetching job by ID:", error);
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }
      
      if (!data) {
        console.log("No job found with ID:", jobId);
        return null;
      }
      
      console.log("Fetched job by ID:", data);
      
      // Format job data
      const formattedJob: Job = {
        id: data.id,
        title: data.title,
        company: data.company,
        companyLogo: data.company_logo || undefined,
        location: data.location,
        salary: data.salary || undefined,
        type: data.type,
        posted: formatTimeAgo(new Date(data.posted)),
        tags: data.tags || [],
        description: data.description,
        applyLink: data.apply_link,
        postedBy: data.profiles ? {
          name: data.profiles.full_name || data.profiles.username || 'Anonymous',
          id: data.profiles.id
        } : undefined
      };
      
      return formattedJob;
    } catch (error) {
      console.error("Error in fetchJobById:", error);
      return null;
    }
  };

  // Update application status
  const updateApplicationStatus = async (appId: string, newStatus: string) => {
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
      
      return true;
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return "Just now";
  };

  return {
    jobs,
    applications,
    isLoading,
    isSubmitting,
    applyForJob,
    postJob,
    fetchJobById,
    updateApplicationStatus
  };
};
