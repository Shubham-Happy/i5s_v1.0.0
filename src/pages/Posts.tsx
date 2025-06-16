
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { PostList } from "@/components/posts/PostList";
import { TrendingPostList } from "@/components/posts/TrendingPostList";
import { usePosts } from "@/hooks/usePosts";
import { Clock, Flame } from "lucide-react";

export default function Posts() {
  const { 
    posts,
    isLoading,
    createPost,
    updatePost,
    deletePost,
    toggleReaction,
    toggleCommentLike,
    createComment,
    createReply
  } = usePosts();

  // Wrapper for createPost to match expected type
  const handleCreatePost = async (content: string, imageFile: File | null) => {
    await createPost(content, imageFile);
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <Card>
        <CardContent className="pt-6">
          <CreatePostForm onCreatePost={handleCreatePost} />
        </CardContent>
      </Card>
      
      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Posts
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Trending Posts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          <ScrollArea className="h-[calc(100vh-400px)]">
            <PostList 
              posts={posts}
              isLoading={isLoading}
              onToggleReaction={toggleReaction}
              onToggleCommentLike={toggleCommentLike}
              onCreateComment={createComment}
              onCreateReply={createReply}
              onUpdatePost={updatePost}
              onDeletePost={deletePost}
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="trending">
          <ScrollArea className="h-[calc(100vh-400px)]">
            <TrendingPostList 
              posts={posts}
              isLoading={isLoading}
              onToggleReaction={toggleReaction}
              onToggleCommentLike={toggleCommentLike}
              onCreateComment={createComment}
              onCreateReply={createReply}
              onUpdatePost={updatePost}
              onDeletePost={deletePost}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
