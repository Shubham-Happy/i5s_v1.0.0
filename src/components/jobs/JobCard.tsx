
import { Link } from "react-router-dom";
import { Building, MapPin, Clock, ArrowRight, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SocialShare } from "@/components/sharing/SocialShare";

interface Job {
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

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
              {job.companyLogo ? (
                <img 
                  src={job.companyLogo} 
                  alt={`${job.company} logo`} 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Building className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1 hover:text-statusnow-purple transition-colors">
              <Link to={`/jobs/${job.id}`}>
                {job.title}
              </Link>
            </h3>
            
            <p className="text-base font-medium mb-2">{job.company}</p>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              {job.salary && (
                <div className="flex items-center gap-1">
                  <span>{job.salary}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Posted {job.posted}</span>
              </div>
              {job.postedBy && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>by {job.postedBy.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="bg-primary/10 border-primary/20">
                {job.type}
              </Badge>
              {job.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="hover-scale">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <p className="text-sm line-clamp-2">{job.description}</p>
          </div>
          
          <div className="flex flex-col gap-4 flex-shrink-0 mt-4 md:mt-0">
            <Button asChild>
              <Link to={`/jobs/${job.id}`}>
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <SocialShare 
              url={`/jobs/${job.id}`}
              title={`${job.title} at ${job.company}`}
              description={`Check out this job opportunity: ${job.title} at ${job.company}`}
              compact={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
