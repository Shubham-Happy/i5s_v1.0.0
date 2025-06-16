
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Building, MapPin, ChevronRight, Search, Filter, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobCard } from "@/components/jobs/JobCard";
import { useJobs } from "@/hooks/useJobs";
import { Skeleton } from "@/components/ui/skeleton";

export default function Jobs() {
  const { jobs, isLoading } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobType, setJobType] = useState("any");
  const [location, setLocation] = useState("any");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  
  // Apply filters when jobs, searchTerm, jobType, or location changes
  useEffect(() => {
    const filtered = jobs.filter(job => {
      // Search filter
      const searchMatch = 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Job type filter
      const typeMatch = jobType === "any" || job.type.toLowerCase() === jobType.toLowerCase();
      
      // Location filter (checking if contains)
      const locationMatch = location === "any" || 
        (location === "remote" && job.location.toLowerCase().includes("remote")) ||
        (location === "onsite" && !job.location.toLowerCase().includes("remote")) ||
        (location === "hybrid" && job.location.toLowerCase().includes("hybrid"));
      
      return searchMatch && typeMatch && locationMatch;
    });
    
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, jobType, location]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filters are already applied in the useEffect
  };

  const clearFilters = () => {
    setSearchTerm("");
    setJobType("any");
    setLocation("any");
  };

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Startup Job Board</h1>
          <p className="text-muted-foreground">
            Find opportunities at innovative startups and companies
          </p>
        </div>
        <Button asChild>
          <Link to="/jobs/new">
            <Briefcase className="mr-2 h-4 w-4" />
            Post a Job
          </Link>
        </Button>
      </div>

      <div className="bg-muted/30 p-6 rounded-lg mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search job title, company or skills..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-row gap-2">
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Type</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Location</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" type="submit">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button type="submit">Search</Button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {isLoading ? (
          // Loading skeleton
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Skeleton className="w-16 h-16 rounded-lg" />
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <div key={job.id} className="block">
              <Link to={`/jobs/${job.id}`} className="block hover:no-underline">
                <JobCard job={job} />
              </Link>
            </div>
          ))
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters to find more opportunities
              </p>
              <Button onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-center mb-12">
        <h2 className="text-xl font-semibold mb-4">Looking for talent for your startup?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Reach thousands of qualified candidates by posting your job openings on our platform.
          Our community includes developers, designers, marketers, and more.
        </p>
        <Button asChild size="lg">
          <Link to="/jobs/new">
            Post a Job <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
