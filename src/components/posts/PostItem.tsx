
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentSection } from "./CommentSection";
import { ShareDialog } from "./ShareDialog";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share,
  MoreVertical,
  Trash2,
  Edit,
  X,
  Check,
  Image as ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/hooks/usePosts";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface PostItemProps {
  post: Post;
  onToggleReaction: (postId: string, reactionType: string) => Promise<void>;
  onToggleCommentLike: (commentId: string) => Promise<void>;
  onCreateComment: (postId: string, content: string) => Promise<void>;
  onCreateReply: (commentId: string, content: string, postId: string) => Promise<void>;
  onUpdatePost?: (postId: string, content: string, imageFile: File | null) => Promise<void>;
  onDeletePost?: (postId: string) => Promise<void>;
}

export function PostItem({ 
  post, 
  onToggleReaction,
  onToggleCommentLike,
  onCreateComment,
  onCreateReply,
  onUpdatePost,
  onDeletePost
}: PostItemProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const isOwnPost = user?.id === post.user_id;

  const handleToggleLike = async () => {
    await onToggleReaction(post.id, "like");
  };
  
  const handleToggleDislike = async () => {
    await onToggleReaction(post.id, "dislike");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(post.content);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(post.content);
    setEditedImage(null);
  };

  const handleSaveEdit = async () => {
    if (onUpdatePost) {
      await onUpdatePost(post.id, editedContent, editedImage);
      setIsEditing(false);
      setEditedImage(null);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setEditedImage(file);
  };

  const handleDelete = async () => {
    if (onDeletePost) {
      await onDeletePost(post.id);
      setShowDeleteConfirm(false);
    }
  };

  const handleUserClick = () => {
    if (post.user?.id) {
      navigate(`/profile/${post.user.id}`);
    }
  };

  const hasLiked = post.userReaction === "like";
  const hasDisliked = post.userReaction === "dislike";
  const likeCount = post.reactions?.filter(r => r.reaction_type === "like").length || 0;
  const dislikeCount = post.reactions?.filter(r => r.reaction_type === "dislike").length || 0;
  const commentCount = post.commentCount || 0;
  const formattedDate = post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : "";

  // Better fallback for user name and avatar
  const userName = post.user?.name || post.author?.name || "User";
  const userAvatar = post.user?.avatar || post.author?.avatar || "";
  const userNameInitial = userName.charAt(0).toUpperCase();

  console.log("PostItem: Rendering post with user data:", { 
    userName, 
    userAvatar, 
    postUser: post.user, 
    postAuthor: post.author 
  });

  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-start justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={handleUserClick}
          >
            <Avatar>
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{userNameInitial}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium hover:underline">{userName}</div>
              <div className="text-xs text-muted-foreground">{formattedDate}</div>
            </div>
          </div>
          
          {isOwnPost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteConfirm(true)} 
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
            
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor={`post-image-edit-${post.id}`} className="cursor-pointer">
                  <div className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700">
                    <ImageIcon size={16} />
                    {editedImage ? 'Change image' : 'Add image'}
                  </div>
                  <input
                    type="file"
                    id={`post-image-edit-${post.id}`}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {editedImage && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {editedImage.name}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSaveEdit}
                  disabled={!editedContent.trim()}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap">{post.content}</p>
            {post.image_url && (
              <div className="mt-3 rounded-md overflow-hidden">
                <img 
                  src={post.image_url} 
                  alt="Post attachment" 
                  className="w-full h-auto max-h-[500px] object-contain bg-muted" 
                />
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="px-4 py-3 flex flex-col gap-3">
        {!isEditing && (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                className={`flex items-center gap-1 ${hasLiked ? "text-blue-500" : ""}`}
                onClick={handleToggleLike}
              >
                <ThumbsUp className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
                <span>{likeCount > 0 ? likeCount : ""}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`flex items-center gap-1 ${hasDisliked ? "text-red-500" : ""}`}
                onClick={handleToggleDislike}
              >
                <ThumbsDown className={`h-4 w-4 ${hasDisliked ? "fill-current" : ""}`} />
                <span>{dislikeCount > 0 ? dislikeCount : ""}</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageSquare className="h-4 w-4" />
                <span>{commentCount > 0 ? commentCount : ""}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {showComments && (
          <CommentSection 
            postId={post.id} 
            comments={post.comments || []} 
            onCreateComment={onCreateComment}
            onCreateReply={onCreateReply}
            onToggleCommentLike={onToggleCommentLike}
          />
        )}
      </CardFooter>
      
      <ShareDialog 
        open={shareDialogOpen} 
        onOpenChange={setShareDialogOpen} 
        postId={post.id}
        postContent={post.content}
      />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
