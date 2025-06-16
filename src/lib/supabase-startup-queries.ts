
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface StartupFounder {
  id: string;
  name: string;
  avatar?: string;
}

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo?: string;
  category: string;
  fundingStage: string; // matches frontend but not DB (funding_stage)
  location: string;
  votes: number;
  hasVoted: boolean;
  featured: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  founder?: StartupFounder;
}

export const fetchStartups = async (): Promise<Startup[]> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch all startups
    const { data: startups, error } = await supabase
      .from('startups')
      .select('*')
      .order('featured', { ascending: false })
      .order('votes', { ascending: false });
      
    if (error) {
      console.error("Error fetching startups:", error);
      throw error;
    }

    // If user is logged in, check which startups they've voted for
    let userVotes: Record<string, boolean> = {};
    if (user) {
      const { data: votes } = await supabase
        .from('startup_votes')
        .select('startup_id')
        .eq('user_id', user.id);
      
      if (votes) {
        userVotes = votes.reduce((acc: Record<string, boolean>, vote) => {
          acc[vote.startup_id] = true;
          return acc;
        }, {});
      }
    }

    // Fetch founder information for each startup
    const startupsWithFounders = await Promise.all(
      startups.map(async (startup) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .eq('id', startup.user_id)
          .single();
        
        // Map the database fields to our interface
        return {
          id: startup.id,
          name: startup.name,
          tagline: startup.tagline,
          description: startup.description,
          logo: startup.logo,
          category: startup.category, 
          fundingStage: startup.funding_stage, // Map from DB field to interface field
          location: startup.location,
          votes: startup.votes || 0,
          hasVoted: !!userVotes[startup.id],
          featured: startup.featured || false,
          user_id: startup.user_id,
          created_at: startup.created_at,
          updated_at: startup.updated_at,
          founder: profile ? {
            id: profile.id,
            name: profile.full_name || "Anonymous Founder",
            avatar: profile.avatar_url
          } : undefined
        };
      })
    );
    
    return startupsWithFounders;
  } catch (error) {
    console.error("Error in fetchStartups:", error);
    return [];
  }
};

export const createStartup = async (startupData: Partial<Startup>, logoFile?: File): Promise<Startup | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a startup.",
        variant: "destructive",
      });
      return null;
    }

    // Upload logo if provided
    let logoUrl;
    if (logoFile) {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('startup_logos')
        .upload(filePath, logoFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('startup_logos')
        .getPublicUrl(filePath);

      logoUrl = urlData.publicUrl;
    }

    // Make sure all required fields are present
    if (!startupData.name || !startupData.tagline || !startupData.description || 
        !startupData.category || !startupData.fundingStage || !startupData.location) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return null;
    }

    // Insert startup data, mapping from interface fields to DB fields
    const { data, error } = await supabase
      .from('startups')
      .insert({
        name: startupData.name,
        tagline: startupData.tagline,
        description: startupData.description,
        logo: logoUrl,
        category: startupData.category,
        funding_stage: startupData.fundingStage, // Map to DB field name
        location: startupData.location,
        user_id: user.id,
        votes: 0,
        featured: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Startup created",
      description: "Your startup has been successfully added.",
    });
    
    // Convert the data to our interface format
    const result: Startup = {
      id: data.id,
      name: data.name,
      tagline: data.tagline,
      description: data.description,
      logo: data.logo,
      category: data.category,
      fundingStage: data.funding_stage, // Map from DB field
      location: data.location,
      votes: data.votes || 0,
      hasVoted: false,
      featured: data.featured || false,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return result;
  } catch (error) {
    console.error("Error creating startup:", error);
    
    toast({
      title: "Error",
      description: "Failed to create startup. Please try again.",
      variant: "destructive",
    });
    
    return null;
  }
};

export const toggleVote = async (startupId: string): Promise<boolean> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to vote for startups.",
        variant: "destructive",
      });
      return false;
    }

    // Check if the user has already voted for this startup
    const { data: existingVote } = await supabase
      .from('startup_votes')
      .select()
      .eq('startup_id', startupId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingVote) {
      // Remove the vote
      const { error: deleteError } = await supabase
        .from('startup_votes')
        .delete()
        .eq('id', existingVote.id);

      if (deleteError) throw deleteError;

      // Get current vote count
      const { data: currentStartup } = await supabase
        .from('startups')
        .select('votes')
        .eq('id', startupId)
        .single();
      
      // Decrement the votes count by directly updating the value
      if (currentStartup) {
        const newVotes = Math.max(0, (currentStartup.votes || 1) - 1);
        const { error: updateError } = await supabase
          .from('startups')
          .update({ votes: newVotes })
          .eq('id', startupId);
        
        if (updateError) throw updateError;
      }
      
      return false;
    } else {
      // Add a vote
      const { error: insertError } = await supabase
        .from('startup_votes')
        .insert([{ startup_id: startupId, user_id: user.id }]);

      if (insertError) throw insertError;

      // Get current vote count
      const { data: currentStartup } = await supabase
        .from('startups')
        .select('votes')
        .eq('id', startupId)
        .single();
      
      // Increment the votes count by directly updating the value
      if (currentStartup) {
        const newVotes = (currentStartup.votes || 0) + 1;
        const { error: updateError } = await supabase
          .from('startups')
          .update({ votes: newVotes })
          .eq('id', startupId);
        
        if (updateError) throw updateError;
      }
      
      return true;
    }
  } catch (error) {
    console.error("Error toggling vote:", error);
    
    toast({
      title: "Error",
      description: "Failed to update vote. Please try again.",
      variant: "destructive",
    });
    
    return false;
  }
};
