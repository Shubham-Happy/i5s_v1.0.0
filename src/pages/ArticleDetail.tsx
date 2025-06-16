
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  MessageSquare,
  Share2,
  ArrowLeft,
  Tag,
  Send,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useArticleById } from "@/hooks/useArticles";
import { useArticleComments } from "@/hooks/useArticleComments";
import { ArticleEngagement } from "@/components/articles/ArticleEngagement";
import { CommentSection } from "@/components/posts/CommentSection";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { toast } from "@/hooks/use-toast";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { article, isLoading, error } = useArticleById(id || "");
  const { comments, createComment, createReply, toggleCommentLike } = useArticleComments(id || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleCreateComment = async (articleId: string, content: string) => {
    await createComment(content);
  };

  const handleCreateReply = async (commentId: string, content: string, articleId: string) => {
    await createReply(commentId, content);
  };

  const handleToggleCommentLike = async (commentId: string) => {
    await toggleCommentLike(commentId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-12"></div>
          <div className="h-48 bg-muted rounded w-full mb-6"></div>
          <div className="space-y-3 w-full">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container max-w-3xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Article</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find the article you're looking for.
        </p>
        <Button asChild>
          <Link to="/articles">Back to Articles</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/articles">Articles</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="max-w-[150px] truncate">
              {article.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <Link 
          to="/articles"
          className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Articles
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src={article.author.avatar} alt={article.author.name} />
            <AvatarFallback className="bg-gradient-to-r from-slate-green to-gold-accent text-white">
              {article.author.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <Link to={`/profile/${article.author.id}`} className="font-medium hover:text-gold-accent transition-colors">
              {article.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {article.author.role || "Author"} • {formatDate(article.publishedAt)} • {article.readingTime || "5 min"} read
            </p>
          </div>
        </div>

        {article.coverImage && (
          <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8 border border-gold/20">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags && article.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="hover:scale-105 transition-transform bg-gold/10 text-gold-dark border-gold/30">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-8"
             dangerouslySetInnerHTML={{ __html: article.content || article.summary }}
        />

        <div className="flex justify-between items-center my-8 border-t border-b py-4 border-gold/20">
          <ArticleEngagement
            articleId={article.id}
            initialLikes={article.likes}
            initialComments={comments.length}
            url={window.location.href}
            title={article.title}
            onCommentClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </div>

        <div className="bg-gradient-to-r from-gold/5 to-emerald/5 p-6 rounded-lg mb-8 border border-gold/20">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={article.author.avatar} alt={article.author.name} />
              <AvatarFallback className="bg-gradient-to-r from-slate-green to-gold-accent text-white">
                {article.author.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <Link to={`/profile/${article.author.id}`} className="font-medium text-lg hover:text-gold-accent transition-colors">
                About {article.author.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {article.author.role}
              </p>
            </div>

            <Button variant="outline" size="sm" className="ml-auto gold-border gold-hover">
              Follow
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">{article.author.bio || "No bio available"}</p>
        </div>

        <div className="mb-8" id="comments">
          <h2 className="text-xl font-bold mb-4 text-gold-dark">Comments ({comments.length})</h2>
          
          <CommentSection 
            articleId={article.id}
            comments={comments}
            onCreateComment={handleCreateComment}
            onCreateReply={handleCreateReply}
            onToggleCommentLike={handleToggleCommentLike}
          />
        </div>
      </div>
    </div>
  );
}
