
import { supabase } from "@/integrations/supabase/client";
import { fetchProfileById } from "@/lib/supabase-queries";
import { Post, Comment } from "@/types/posts";

export async function processPostsData(posts: any[], user: any): Promise<Post[]> {
  return Promise.all(
    posts.map(async (post) => {
      // Get user profile info for post author
      const profile = await fetchProfileById(post.user_id);
      
      // Process comments to include user information and likes
      const processedComments = post.comments ? await Promise.all(
        post.comments.map(async (comment: any) => {
          // Get comment user profile
          const commentProfile = await fetchProfileById(comment.user_id);
          const commentUser = {
            id: comment.user_id,
            name: commentProfile?.full_name || commentProfile?.username || "Anonymous",
            avatar: commentProfile?.avatar_url
          };

          // Get comment likes
          const { data: commentLikes, error: likesError } = await supabase
            .from('comment_likes')
            .select('*')
            .eq('comment_id', comment.id);

          if (likesError) {
            console.error('Error fetching comment likes:', likesError);
          }

          const likes = commentLikes || [];
          const likesCount = likes.length;
          const userHasLiked = user ? likes.some(like => like.user_id === user.id) : false;

          return {
            id: comment.id,
            content: comment.content,
            post_id: comment.post_id,
            user_id: comment.user_id,
            parent_id: comment.parent_id,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            user: commentUser,
            likes,
            likesCount,
            userHasLiked
          };
        })
      ) : [];

      // Count comments
      const commentCount = processedComments.length;

      // Find user's reaction if logged in
      let userReaction = null;
      if (user) {
        userReaction = post.reactions?.find((r: any) => r.user_id === user.id)?.reaction_type || null;
      }

      return {
        ...post,
        comments: processedComments,
        commentCount,
        userReaction,
        user: {
          id: post.user_id,
          name: profile?.full_name || profile?.username || "Anonymous",
          avatar: profile?.avatar_url
        }
      };
    })
  );
}
