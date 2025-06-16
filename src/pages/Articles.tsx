
import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Filter, Search, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/articles/ArticleCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useArticles } from "@/hooks/useArticles";

export default function Articles() {
  const { articles = [], isLoading } = useArticles();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState("latest");

  // Get all unique tags from articles
  const allTags = [...new Set(articles.flatMap(article => article.tags || []))].sort();

  // Filter and sort articles based on user selections
  const filteredArticles = articles
    .filter(article => {
      // Apply tag filter if selected
      if (selectedTag && (!article.tags || !article.tags.includes(selectedTag))) {
        return false;
      }
      
      // Apply search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query) ||
          article.author.name.toLowerCase().includes(query) ||
          (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected order
      if (sortOrder === "latest") {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      } else if (sortOrder === "popular") {
        return (b.likes || 0) - (a.likes || 0);
      } else if (sortOrder === "commented") {
        return (b.comments || 0) - (a.comments || 0);
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-10 w-10 border-4 border-statusnow-purple border-t-transparent rounded-full mb-4"></div>
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6 text-statusnow-purple" />
            Articles
          </h1>
          <Button asChild>
            <Link to="/articles/new">Write an Article</Link>
          </Button>
        </div>

        {/* Search and filter controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <Select
              value={selectedTag || "all_tags"}
              onValueChange={(value) => setSelectedTag(value === "all_tags" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_tags">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={sortOrder}
              onValueChange={setSortOrder}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Liked</SelectItem>
                <SelectItem value="commented">Most Discussed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active filters */}
        {selectedTag && (
          <div className="flex gap-2 mb-6">
            <Badge 
              variant="secondary"
              className="flex items-center gap-1"
            >
              <Tag className="h-3 w-3" />
              {selectedTag}
              <button
                className="ml-1 hover:text-destructive"
                onClick={() => setSelectedTag(null)}
              >
                ×
              </button>
            </Badge>
          </div>
        )}

        {/* Articles grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">No articles found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try different search terms or filters"
                : "Be the first to write an article on this topic!"}
            </p>
            <Button className="mt-4" asChild>
              <Link to="/articles/new">Write an Article</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
