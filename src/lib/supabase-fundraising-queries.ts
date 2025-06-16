
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface FundraisingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  deadline: string;
  prize: string;
  organizer: string;
  organizer_email?: string;
  organizer_phone?: string;
  organizer_website?: string;
  organizer_description?: string;
  image?: string;
  application_link?: string;
  user_id: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export const fetchFundraisingEvents = async (): Promise<FundraisingEvent[]> => {
  try {
    const { data: events, error } = await supabase
      .from('funding_events')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching fundraising events:", error);
      throw error;
    }
    
    return events as FundraisingEvent[];
  } catch (error) {
    console.error("Error in fetchFundraisingEvents:", error);
    return [];
  }
};

export const fetchApprovedFundraisingEvents = async (): Promise<FundraisingEvent[]> => {
  try {
    const { data: events, error } = await supabase
      .from('funding_events')
      .select('*')
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching approved fundraising events:", error);
      throw error;
    }
    
    return events as FundraisingEvent[];
  } catch (error) {
    console.error("Error in fetchApprovedFundraisingEvents:", error);
    return [];
  }
};

export const fetchPendingFundraisingEvents = async (): Promise<FundraisingEvent[]> => {
  try {
    const { data: events, error } = await supabase
      .from('funding_events')
      .select('*')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching pending fundraising events:", error);
      throw error;
    }
    
    return events as FundraisingEvent[];
  } catch (error) {
    console.error("Error in fetchPendingFundraisingEvents:", error);
    return [];
  }
};

export const approveEvent = async (eventId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to approve events.",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('funding_events')
      .update({
        approval_status: 'approved',
        approved_by: user.id,
        approval_date: new Date().toISOString(),
        rejection_reason: null
      })
      .eq('id', eventId);

    if (error) {
      throw error;
    }

    toast({
      title: "Event approved",
      description: "The fundraising event has been approved and is now live.",
    });
    
    return true;
  } catch (error) {
    console.error("Error approving event:", error);
    
    toast({
      title: "Error",
      description: "Failed to approve event. Please try again.",
      variant: "destructive",
    });
    
    return false;
  }
};

export const rejectEvent = async (eventId: string, reason: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to reject events.",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase
      .from('funding_events')
      .update({
        approval_status: 'rejected',
        approved_by: user.id,
        approval_date: new Date().toISOString(),
        rejection_reason: reason
      })
      .eq('id', eventId);

    if (error) {
      throw error;
    }

    toast({
      title: "Event rejected",
      description: "The fundraising event has been rejected.",
    });
    
    return true;
  } catch (error) {
    console.error("Error rejecting event:", error);
    
    toast({
      title: "Error",
      description: "Failed to reject event. Please try again.",
      variant: "destructive",
    });
    
    return false;
  }
};

export const createFundraisingEvent = async (eventData: Partial<FundraisingEvent>, imageFile?: File): Promise<FundraisingEvent | null> => {
  try {
    console.log("Creating fundraising event with data:", eventData);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create an event.",
        variant: "destructive",
      });
      return null;
    }

    console.log("User authenticated:", user.id);

    // Upload image if provided
    let imageUrl;
    if (imageFile) {
      console.log("Uploading image file:", imageFile.name);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('event_images')
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
      console.log("Image uploaded successfully:", imageUrl);
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'location', 'category', 'deadline', 'prize', 'organizer'];
    for (const field of requiredFields) {
      if (!eventData[field as keyof typeof eventData]) {
        console.error(`Missing required field: ${field}`);
        toast({
          title: "Missing information",
          description: `Please provide the ${field}.`,
          variant: "destructive",
        });
        return null;
      }
    }

    console.log("All required fields validated");

    // Prepare event data for insertion
    const insertData = {
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      location: eventData.location,
      category: eventData.category,
      deadline: eventData.deadline,
      prize: eventData.prize,
      organizer: eventData.organizer,
      organizer_email: eventData.organizer_email,
      organizer_phone: eventData.organizer_phone,
      organizer_website: eventData.organizer_website,
      organizer_description: eventData.organizer_description,
      application_link: eventData.application_link,
      image: imageUrl,
      user_id: user.id,
      approval_status: 'pending' as const
    };

    console.log("Inserting event data:", insertData);

    // Insert event data
    const { data, error } = await supabase
      .from('funding_events')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Database insertion error:", error);
      throw error;
    }

    console.log("Event created successfully:", data);

    toast({
      title: "Event submitted",
      description: "Your fundraising event has been submitted for review. It will be visible once approved.",
    });
    
    return data as FundraisingEvent;
  } catch (error) {
    console.error("Error creating fundraising event:", error);
    
    toast({
      title: "Error",
      description: "Failed to create fundraising event. Please try again.",
      variant: "destructive",
    });
    
    return null;
  }
};
