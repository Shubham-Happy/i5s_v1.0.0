
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserEducation, type UserEducation } from "@/hooks/useUserEducation";
import { useAuth } from "@/context/AuthContext";

interface EducationFormProps {
  onClose: () => void;
}

export function EducationForm({ onClose }: EducationFormProps) {
  const { user } = useAuth();
  const { addEducation } = useUserEducation(user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    start_year: "",
    end_year: "",
    description: "",
    activities: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSubmitting(true);

    const educationData: Omit<UserEducation, 'id' | 'created_at' | 'updated_at'> = {
      user_id: user.id,
      school: formData.school,
      degree: formData.degree,
      start_year: formData.start_year,
      end_year: formData.end_year,
      description: formData.description || undefined,
      activities: formData.activities || undefined,
    };

    const result = await addEducation(educationData);
    setIsSubmitting(false);

    if (result) {
      onClose();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Education</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="school">School/University</Label>
            <Input
              id="school"
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="degree">Degree</Label>
            <Input
              id="degree"
              value={formData.degree}
              onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
              placeholder="e.g., Bachelor of Science in Computer Science"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_year">Start Year</Label>
              <Input
                id="start_year"
                value={formData.start_year}
                onChange={(e) => setFormData(prev => ({ ...prev, start_year: e.target.value }))}
                placeholder="2020"
                required
              />
            </div>

            <div>
              <Label htmlFor="end_year">End Year</Label>
              <Input
                id="end_year"
                value={formData.end_year}
                onChange={(e) => setFormData(prev => ({ ...prev, end_year: e.target.value }))}
                placeholder="2024"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your studies, focus areas, thesis, etc..."
            />
          </div>

          <div>
            <Label htmlFor="activities">Activities & Societies</Label>
            <Input
              id="activities"
              value={formData.activities}
              onChange={(e) => setFormData(prev => ({ ...prev, activities: e.target.value }))}
              placeholder="e.g., Programming Club, Student Government, etc."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Education"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
