
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { Database } from "../_utils/database.types.ts";

// Setup Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient<Database>(supabaseUrl, supabaseServiceRole);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create storage bucket for resumes if it doesn't exist
    const { error: bucketError } = await supabase.storage.createBucket('resumes', {
      public: false,  // Keep resumes private, only accessible through RLS
      fileSizeLimit: 5242880, // 5MB limit for resumes
    });

    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError;
    }

    // Set up storage bucket policies
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Allow users to upload their own resumes
        CREATE POLICY "Users can upload their own resumes" ON storage.objects
          FOR INSERT TO authenticated
          WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
        
        -- Allow users to access their own resumes
        CREATE POLICY "Users can access their own resumes" ON storage.objects
          FOR SELECT TO authenticated
          USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
      `
    });

    // Seed some notifications
    const { data: { user } } = await supabase.auth.getSession();
    
    if (user) {
      // Let's add a welcome notification
      await supabase.from('notifications').insert([
        {
          user_id: user.id,
          type: 'system',
          content: 'Welcome to the platform! We\'re excited to have you here.',
          time: new Date().toISOString(),
          read: false,
        },
        {
          user_id: user.id,
          type: 'message',
          content: 'You have a new message from the team.',
          time: new Date().toISOString(),
          read: false,
          link: '/messages'
        }
      ]);
    }

    // Add example jobs if none exist
    const { count } = await supabase
      .from('job_listings')
      .select('*', { count: 'exact', head: true });
      
    if (count === 0 && user) {
      // Add some sample job listings
      await supabase.from('job_listings').insert([
        {
          id: "job_1",
          title: "Senior Frontend Developer",
          company: "TechVentures",
          company_logo: "https://placekitten.com/100/100",
          location: "San Francisco, CA (Remote)",
          salary: "$120k - $150k",
          type: "Full-time",
          tags: ["React", "TypeScript", "UI/UX", "SaaS"],
          description: "We're looking for an experienced frontend developer with expertise in React and TypeScript to join our growing team...",
          user_id: user.id
        },
        {
          id: "job_2",
          title: "Growth Marketing Manager",
          company: "StartupBoost",
          company_logo: "https://placekitten.com/101/101",
          location: "New York, NY (Hybrid)",
          salary: "$90k - $110k",
          type: "Full-time",
          tags: ["Marketing", "Growth Hacking", "Analytics", "B2B"],
          description: "Join our marketing team to drive user acquisition and retention strategies for our SaaS platform...",
          user_id: user.id
        },
        {
          id: "job_3", 
          title: "Product Designer",
          company: "InnovateCo",
          company_logo: "https://placekitten.com/102/102",
          location: "Austin, TX (On-site)",
          salary: "$100k - $130k",
          type: "Full-time",
          tags: ["UI/UX", "Figma", "Product Design", "User Research"],
          description: "We're seeking a talented product designer to create beautiful interfaces and improve user experiences...",
          user_id: user.id
        },
      ]);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in seedData function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
