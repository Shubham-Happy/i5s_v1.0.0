
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Calendar, ExternalLink, Users, Heart, MessageCircle } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [hasSearched, setHasSearched] = useState(false);
  
  console.log('=== SEARCH PAGE DEBUG ===');
  console.log('Search term:', searchTerm);
  console.log('Search type:', searchType);
  console.log('Has searched:', hasSearched);
  
  const { data: searchResults, isLoading, error } = useSearch(searchTerm, searchType === "all" ? undefined : searchType);
  
  console.log('Search results from hook:', searchResults);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search form submitted with term:', searchTerm);
    setHasSearched(true);
  };

  const renderPeopleResults = (people: any[]) => {
    console.log('Rendering people results:', people);
    
    if (!people || people.length === 0) {
      return <p className="text-muted-foreground text-center py-8">No people found.</p>;
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {people.map((person) => (
          <Card key={person.id} className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={person.avatar} />
                <AvatarFallback>{person.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{person.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{person.headline}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-3 w-3" />
                  <span className="text-xs text-muted-foreground">
                    {person.followers} followers
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderJobsResults = (jobs: any[]) => {
    console.log('Rendering jobs results:', jobs);
    
    if (!jobs || jobs.length === 0) {
      return <p className="text-muted-foreground text-center py-8">No jobs found.</p>;
    }

    return (
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {job.companyLogo && (
                    <img src={job.companyLogo} alt={job.company} className="h-10 w-10 rounded-lg" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {job.posted}
                  </div>
                  {job.salary && <span>{job.salary}</span>}
                </div>
                <p className="text-sm mb-3 line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{job.type}</Badge>
                  {job.tags?.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
              <Button asChild>
                <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                  Apply <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderArticlesResults = (articles: any[]) => {
    console.log('Rendering articles results:', articles);
    
    if (!articles || articles.length === 0) {
      return <p className="text-muted-foreground text-center py-8">No articles found.</p>;
    }

    return (
      <div className="space-y-6">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden">
            <div className="flex">
              {article.coverImage && (
                <img 
                  src={article.coverImage} 
                  alt={article.title}
                  className="h-32 w-48 object-cover"
                />
              )}
              <div className="flex-1 p-6">
                <h3 className="font-semibold text-xl mb-2">{article.title}</h3>
                <p className="text-muted-foreground mb-3 line-clamp-2">{article.summary}</p>
                
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={article.author?.avatar} />
                    <AvatarFallback>{article.author?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{article.author?.name}</p>
                    <p className="text-xs text-muted-foreground">{article.author?.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{article.readingTime}</span>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {article.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {article.comments}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {article.tags?.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderCompaniesResults = (companies: any[]) => {
    console.log('Rendering companies results:', companies);
    
    if (!companies || companies.length === 0) {
      return <p className="text-muted-foreground text-center py-8">No companies found.</p>;
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Card key={company.id} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {company.logo && (
                <img src={company.logo} alt={company.name} className="h-12 w-12 rounded-lg" />
              )}
              <div>
                <h3 className="font-semibold">{company.name}</h3>
                <p className="text-sm text-muted-foreground">{company.industry}</p>
              </div>
            </div>
            <p className="text-sm mb-3 line-clamp-2">{company.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {company.location}
              </div>
              <div className="flex items-center gap-1">
                <Building className="h-3 w-3" />
                {company.size}
              </div>
              <span>Founded {company.founded}</span>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Process search results based on type
  let displayResults = null;
  
  if (searchResults) {
    console.log('Processing search results:', searchResults);
    
    if (searchResults.type === 'all' && typeof searchResults.data === 'object' && !Array.isArray(searchResults.data)) {
      const allData = searchResults.data as {
        people: any[];
        jobs: any[];
        articles: any[];
        companies: any[];
      };
      
      console.log('All data:', allData);
      
      displayResults = (
        <Tabs value={searchType} onValueChange={setSearchType} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="people">People ({allData.people?.length || 0})</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({allData.jobs?.length || 0})</TabsTrigger>
            <TabsTrigger value="articles">Articles ({allData.articles?.length || 0})</TabsTrigger>
            <TabsTrigger value="companies">Companies ({allData.companies?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {allData.people && allData.people.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">People ({allData.people.length})</h3>
                {renderPeopleResults(allData.people.slice(0, 3))}
              </div>
            )}
            {allData.jobs && allData.jobs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Jobs ({allData.jobs.length})</h3>
                {renderJobsResults(allData.jobs.slice(0, 3))}
              </div>
            )}
            {allData.articles && allData.articles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Articles ({allData.articles.length})</h3>
                {renderArticlesResults(allData.articles.slice(0, 3))}
              </div>
            )}
            {allData.companies && allData.companies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Companies ({allData.companies.length})</h3>
                {renderCompaniesResults(allData.companies.slice(0, 3))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="people">
            {renderPeopleResults(allData.people || [])}
          </TabsContent>

          <TabsContent value="jobs">
            {renderJobsResults(allData.jobs || [])}
          </TabsContent>

          <TabsContent value="articles">
            {renderArticlesResults(allData.articles || [])}
          </TabsContent>

          <TabsContent value="companies">
            {renderCompaniesResults(allData.companies || [])}
          </TabsContent>
        </Tabs>
      );
    } else if (Array.isArray(searchResults.data)) {
      // Single category results
      const data = searchResults.data;
      console.log('Single category data:', data);
      
      switch (searchResults.type) {
        case 'people':
          displayResults = renderPeopleResults(data);
          break;
        case 'jobs':
          displayResults = renderJobsResults(data);
          break;
        case 'articles':
          displayResults = renderArticlesResults(data);
          break;
        case 'companies':
          displayResults = renderCompaniesResults(data);
          break;
        default:
          displayResults = <p className="text-center py-8">No results found.</p>;
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Search</h1>
          <p className="text-muted-foreground">
            Find people, jobs, articles, and companies on i5s
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search for anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!searchTerm.trim()}>
              Search
            </Button>
          </div>
        </form>

        {isLoading && (
          <div className="text-center py-8">
            <p>Searching...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">Error: {error.message}</p>
          </div>
        )}

        {hasSearched && !isLoading && displayResults && (
          <div className="mt-8">
            {displayResults}
          </div>
        )}

        {hasSearched && !isLoading && !displayResults && searchTerm && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
