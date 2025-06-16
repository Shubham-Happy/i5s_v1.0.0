
import { Edit, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface Skill {
  id: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

interface SkillsExperienceProps {
  userId: string;
  isCurrentUser?: boolean;
  initialSkills?: Skill[];
  initialExperience?: Experience[];
}

export function SkillsExperience({
  userId,
  isCurrentUser = false,
  initialSkills = [],
  initialExperience = []
}: SkillsExperienceProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [experience, setExperience] = useState<Experience[]>(initialExperience);
  const [newSkill, setNewSkill] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.trim(),
      level: "intermediate"
    };
    
    setSkills([...skills, skill]);
    setNewSkill("");
    setIsAddingSkill(false);
    
    toast({
      title: "Skill added",
      description: `${skill.name} has been added to your profile.`,
    });
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
    
    toast({
      title: "Skill removed",
      description: "The skill has been removed from your profile.",
    });
  };

  const form = useForm<Omit<Experience, "id">>({
    defaultValues: {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: ""
    }
  });

  const onSubmit = (data: Omit<Experience, "id">) => {
    const newExperience: Experience = {
      ...data,
      id: Date.now().toString()
    };
    
    setExperience([newExperience, ...experience]);
    form.reset();
    
    toast({
      title: "Experience added",
      description: `${data.title} at ${data.company} has been added to your profile.`,
    });
  };

  const renderSkillLevel = (level?: string) => {
    switch (level) {
      case "beginner":
        return (
          <div className="flex items-center gap-1">
            <div className="bg-statusnow-purple/70 h-1.5 w-5 rounded-full"></div>
            <div className="bg-muted h-1.5 w-5 rounded-full"></div>
            <div className="bg-muted h-1.5 w-5 rounded-full"></div>
            <div className="bg-muted h-1.5 w-5 rounded-full"></div>
          </div>
        );
      case "intermediate":
        return (
          <div className="flex items-center gap-1">
            <div className="bg-statusnow-purple/70 h-1.5 w-5 rounded-full"></div>
            <div className="bg-statusnow-purple/70 h-1.5 w-5 rounded-full"></div>
            <div className="bg-muted h-1.5 w-5 rounded-full"></div>
            <div className="bg-muted h-1.5 w-5 rounded-full"></div>
          </div>
        );
      case "advanced":
        return (
          <div className="flex items-center gap-1">
            <div className="bg-statusnow-purple/70 h-1.5 w-5 rounded-full"></div>
            <div className="bg-statusnow-purple/70 h-1.5 w-5 rounded-full"></div>
            <div className="bg-statusnow-purple/70 h-1.5 w-5 rounded-full"></div>
            <div className="bg-muted h-1.5 w-5 rounded-full"></div>
          </div>
        );
      case "expert":
        return (
          <div className="flex items-center gap-1">
            <div className="bg-statusnow-purple/70 h-1.5 w-5 rounded-full"></div>
            <div className="bg-statusnow-purple/70 h-1.5 w-5 rounded-full"></div>
            <div className="bg-statusnow-purple/70 h-1.5 w-5 rounded-full"></div>
            <div className="bg-statusnow-purple/70 h-1.5 w-5 rounded-full"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Skills Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Your professional skills and proficiency</CardDescription>
            </div>
            {isCurrentUser && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAddingSkill(!isAddingSkill)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isAddingSkill && (
            <div className="flex gap-2 mb-4">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter a skill..."
                className="flex-1"
              />
              <Button onClick={handleAddSkill}>Add</Button>
            </div>
          )}
          
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <div key={skill.id} className="group relative">
                  <Badge variant="secondary" className="py-1.5">
                    {skill.name}
                    {skill.level && (
                      <span className="ml-2">{renderSkillLevel(skill.level)}</span>
                    )}
                  </Badge>
                  {isCurrentUser && (
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground hidden group-hover:flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No skills added yet.
              {isCurrentUser && " Click 'Add Skill' to add your professional skills."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Experience</CardTitle>
              <CardDescription>Your professional experience and roles</CardDescription>
            </div>
            {isCurrentUser && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Experience</DialogTitle>
                    <DialogDescription>
                      Add your professional experience to your profile.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        rules={{ required: "Job title is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="company"
                        rules={{ required: "Company name is required" }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Acme Inc" {...field} />
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
                              <Input placeholder="e.g. San Francisco, CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          rules={{ required: "Start date is required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  disabled={form.watch("current")}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="current"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 mt-1"
                              />
                            </FormControl>
                            <FormLabel>I currently work here</FormLabel>
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
                              <Textarea 
                                placeholder="Describe your role and responsibilities..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit">Save</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {experience.length > 0 ? (
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative border-l-2 pl-4 pb-4 border-muted">
                  <div className="absolute h-3 w-3 rounded-full bg-primary -left-[7px] top-1" />
                  
                  <div className="flex flex-wrap justify-between items-start">
                    <div>
                      <h3 className="text-base font-medium">{exp.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {exp.company} {exp.location ? `• ${exp.location}` : ""}
                      </p>
                    </div>
                    {isCurrentUser && (
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(exp.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })} – {
                      exp.current 
                        ? "Present" 
                        : exp.endDate 
                          ? new Date(exp.endDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })
                          : "Present"
                    }
                  </p>
                  
                  {exp.description && (
                    <p className="mt-2 text-sm">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No experience added yet.
              {isCurrentUser && " Click 'Add Experience' to add your work history."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
