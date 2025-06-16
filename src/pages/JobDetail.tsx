
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Clock, DollarSign, Building, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

interface JobListing {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  salary?: string;
  type: string;
  tags: string[];
  description: string;
  apply_link: string;
  posted: string;
  user_id: string;
}

const fetchJobById = async (id: string): Promise<JobListing | null> => {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching job:', error);
    return null;
  }

  return data;
};

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id!),
    enabled: !!id
  });

  const handleApply = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to apply for jobs.",
        variant: "destructive",
      });
      return;
    }

    if (job?.apply_link) {
      window.open(job.apply_link, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-statusnow-purple border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">The job listing you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/jobs" className="inline-flex items-center text-statusnow-purple hover:text-statusnow-purple-dark">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
      </div>

      <div className="grid gap-6">
        {/* Job Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-4">
              {job.company_logo && (
                <img 
                  src={job.company_logo} 
                  alt={`${job.company} logo`}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.type}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {new Date(job.posted).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button onClick={handleApply} size="lg" className="bg-statusnow-purple hover:bg-statusnow-purple-medium">
                  Apply Now
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {job.description}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apply Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ready to Apply?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Click the button below to apply for this position. You'll be redirected to the company's application page.
            </p>
            <Button onClick={handleApply} size="lg" className="w-full sm:w-auto bg-statusnow-purple hover:bg-statusnow-purple-medium">
              Apply for this Position
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
