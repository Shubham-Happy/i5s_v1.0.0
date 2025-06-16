
import { Profile } from "@/types/database";

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  replies?: Comment[];
  likes?: CommentLike[];
  likesCount?: number;
  userHasLiked?: boolean;
}

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface Post {
  id: string;
  content: string;
  image_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  reactions?: Reaction[];
  comments?: Comment[];
  commentCount?: number;
  userReaction?: string | null;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}
