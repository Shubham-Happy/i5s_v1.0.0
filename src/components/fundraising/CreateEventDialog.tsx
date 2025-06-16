
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createFundraisingEvent } from "@/lib/supabase-fundraising-queries";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  deadline: z.string().min(1, "Application deadline is required"),
  prize: z.string().min(1, "Prize information is required"),
  organizer: z.string().min(1, "Organizer name is required"),
  organizer_email: z.string().min(1, "Organizer email is required").email("Please enter a valid email"),
  organizer_phone: z.string().min(1, "Organizer phone is required"),
  organizer_website: z.string().min(1, "Organizer website is required").url("Please enter a valid URL"),
  organizer_description: z.string().min(10, "Organizer description is required and must be at least 10 characters"),
  application_link: z.string().min(1, "Application link is required").url("Please enter a valid URL"),
});

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated: () => void;
}

export function CreateEventDialog({ open, onOpenChange, onEventCreated }: CreateEventDialogProps) {
  const { user } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      category: "Competition",
      deadline: "",
      prize: "",
      organizer: "",
      organizer_email: "",
      organizer_phone: "",
      organizer_website: "",
      organizer_description: "",
      application_link: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a fundraising event.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createFundraisingEvent(values, imageFile || undefined);
      onOpenChange(false);
      form.reset();
      setImageFile(null);
      onEventCreated();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create a Fundraising Event</DialogTitle>
        <DialogDescription>
          Share fundraising opportunities with the community. All events will be reviewed and approved before publishing.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Startup Pitch Competition" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Describe your event, requirements, and benefits" rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Date</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. May 15, 2025" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. San Francisco, CA" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      {...field}
                    >
                      <option value="Competition">Competition</option>
                      <option value="Pitch Event">Pitch Event</option>
                      <option value="Grant">Grant</option>
                      <option value="Accelerator">Accelerator</option>
                      <option value="Hackathon">Hackathon</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Deadline</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. April 1, 2025" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="prize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prize/Funding Amount</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. $100,000 investment" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. TechStars" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organizer_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer Email <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. contact@techstars.com" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="organizer_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer Phone <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. +1 (555) 123-4567" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizer_website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer Website <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. https://techstars.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="organizer_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About the Organizer <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Brief description about the organizing company or individual" rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="application_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Link <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. https://example.com/apply" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Label htmlFor="event-image">Event Image (Optional)</Label>
            <Input id="event-image" type="file" accept="image/*" onChange={handleImageChange} />
            {imageFile && <p className="text-sm text-muted-foreground mt-1">Selected: {imageFile.name}</p>}
          </div>
          <DialogFooter>
            <Button type="submit">Submit for Review</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
