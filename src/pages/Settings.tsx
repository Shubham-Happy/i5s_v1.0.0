
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { AuthPrompt } from "@/components/auth/AuthPrompt";
import { useUnifiedProfile } from "@/hooks/useUnifiedProfile";
import { useUserExperience } from "@/hooks/useUserExperience";
import { useUserEducation } from "@/hooks/useUserEducation";
import { ExperienceForm } from "@/components/profile/ExperienceForm";
import { EducationForm } from "@/components/profile/EducationForm";
import { PersonalInfoTab } from "@/components/settings/PersonalInfoTab";
import { PrivacySecurityTab } from "@/components/settings/PrivacySecurityTab";
import { AccountTab } from "@/components/settings/AccountTab";
import { Plus, User, Shield, Briefcase, GraduationCap, Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  const { user, signOut } = useAuth();
  
  // Show auth prompt if user is not logged in
  if (!user) {
    return (
      <AuthPrompt 
        title="Settings Access Required"
        description="Please sign in to access your account settings and preferences"
      />
    );
  }

  const { profile, isLoading, error, updateProfile: updateUnifiedProfile } = useUnifiedProfile();
  const { experiences } = useUserExperience(user?.id);
  const { education } = useUserEducation(user?.id);
  
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);

  useEffect(() => {
    console.log("Settings: Current user:", user);
    console.log("Settings: Profile loading state:", isLoading);
    console.log("Settings: Profile error:", error);
  }, [user, isLoading, error]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(date);
  };

  if (isLoading) {
    return (
      <div className="container py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground">Loading your settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 max-w-6xl">
        <div className="text-center min-h-[400px] flex items-center justify-center">
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto">
              <SettingsIcon size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Error loading settings</h3>
              <p className="text-muted-foreground mt-2">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-8 max-w-6xl">
        <div className="text-center min-h-[400px] flex items-center justify-center">
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
              <User size={24} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No profile found</h3>
              <p className="text-muted-foreground mt-2">Unable to load your profile data</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 md:py-8 max-w-6xl px-4">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
            <SettingsIcon size={20} className="md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text  ">
              Settings
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">Manage your account preferences and settings</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6 md:mb-8 grid grid-cols-5 bg-muted/50 p-1 rounded-xl h-auto w-full overflow-x-auto">
          <TabsTrigger 
            value="personal" 
            className="flex items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-2 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm"
          >
            <User size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="flex items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-2 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm"
          >
            <Shield size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger 
            value="experience" 
            className="flex items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-2 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm"
          >
            <Briefcase size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Experience</span>
          </TabsTrigger>
          <TabsTrigger 
            value="education" 
            className="flex items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-2 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm"
          >
            <GraduationCap size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger 
            value="account" 
            className="flex items-center gap-1 md:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm px-2 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm"
          >
            <SettingsIcon size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <PersonalInfoTab 
            profile={profile}
            user={user}
            updateProfile={updateUnifiedProfile}
          />
        </TabsContent>

        {/* Security & Notifications Tab */}
        <TabsContent value="notifications">
          <PrivacySecurityTab user={user} />
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <Card className="border-orange-200 dark:border-orange-800">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <Briefcase size={16} className="md:w-5 md:h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg md:text-xl text-orange-700 dark:text-orange-400">Professional Experience</CardTitle>
                    <CardDescription className="text-sm">Showcase your work history and achievements</CardDescription>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowExperienceForm(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-sm w-full sm:w-auto"
                  size="sm"
                >
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Add Experience
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 md:pt-6">
              {showExperienceForm && (
                <div className="mb-4 md:mb-6 p-4 md:p-6 border-2 border-dashed border-orange-200 dark:border-orange-800 rounded-lg">
                  <ExperienceForm onClose={() => setShowExperienceForm(false)} />
                </div>
              )}
              
              {experiences.length > 0 ? (
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-900/10">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start space-x-3 md:space-x-4">
                          <div className="h-12 w-12 md:h-16 md:w-16 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0">
                            {exp.logo ? (
                              <img src={exp.logo} alt={exp.company} className="w-8 h-8 md:w-12 md:h-12 rounded object-cover" />
                            ) : (
                              <span className="text-lg md:text-xl font-semibold text-orange-600 dark:text-orange-400">
                                {exp.company.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base md:text-lg font-semibold break-words">{exp.title}</h3>
                            <p className="text-orange-600 dark:text-orange-400 font-medium text-sm md:text-base break-words">{exp.company}</p>
                            <div className="flex items-center text-xs md:text-sm text-muted-foreground mt-1">
                              <span>
                                {formatDate(exp.start_date)} - 
                                {exp.current ? ' Present' : ` ${exp.end_date ? formatDate(exp.end_date) : 'Present'}`}
                              </span>
                            </div>
                          </div>
                        </div>
                        {exp.current && (
                          <div className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium self-start">
                            Current
                          </div>
                        )}
                      </div>
                      {exp.description && (
                        <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground break-words">{exp.description}</p>
                      )}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mt-3 md:mt-4">
                          <h4 className="text-xs md:text-sm font-semibold mb-2">Key Achievements:</h4>
                          <ul className="list-disc list-inside text-xs md:text-sm text-muted-foreground space-y-1">
                            {exp.achievements.map((achievement, index) => (
                              <li key={index} className="break-words">{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mx-auto mb-4">
                    <Briefcase size={20} className="md:w-6 md:h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-2">No experience added yet</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">Add your professional experience to showcase your career journey!</p>
                  <Button 
                    onClick={() => setShowExperienceForm(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-sm"
                    size="sm"
                  >
                    <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Add Your First Experience
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <GraduationCap size={16} className="md:w-5 md:h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg md:text-xl text-purple-700 dark:text-purple-400">Education</CardTitle>
                    <CardDescription className="text-sm">Your academic background and qualifications</CardDescription>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowEducationForm(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm w-full sm:w-auto"
                  size="sm"
                >
                  <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Add Education
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 md:pt-6">
              {showEducationForm && (
                <div className="mb-4 md:mb-6 p-4 md:p-6 border-2 border-dashed border-purple-200 dark:border-purple-800 rounded-lg">
                  <EducationForm onClose={() => setShowEducationForm(false)} />
                </div>
              )}
              
              {education.length > 0 ? (
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="border rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/10">
                      <div className="flex items-start space-x-3 md:space-x-4">
                        <div className="h-12 w-12 md:h-16 md:w-16 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                          {edu.logo ? (
                            <img src={edu.logo} alt={edu.school} className="w-8 h-8 md:w-12 md:h-12 rounded object-cover" />
                          ) : (
                            <span className="text-lg md:text-xl font-semibold text-purple-600 dark:text-purple-400">
                              {edu.school.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="text-base md:text-lg font-semibold break-words">{edu.degree}</h3>
                          <p className="text-purple-600 dark:text-purple-400 font-medium text-sm md:text-base break-words">{edu.school}</p>
                          <div className="text-xs md:text-sm text-muted-foreground mt-1">
                            {edu.start_year} - {edu.end_year}
                          </div>
                        </div>
                      </div>
                      {edu.description && (
                        <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground break-words">{edu.description}</p>
                      )}
                      {edu.activities && (
                        <div className="mt-3">
                          <h4 className="text-xs md:text-sm font-semibold mb-1">Activities & Societies:</h4>
                          <p className="text-xs md:text-sm text-muted-foreground break-words">{edu.activities}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap size={20} className="md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold mb-2">No education added yet</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">Add your educational qualifications to complete your profile!</p>
                  <Button 
                    onClick={() => setShowEducationForm(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
                    size="sm"
                  >
                    <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Add Your Education
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Account Settings */}
        <TabsContent value="account">
          <AccountTab user={user} signOut={signOut} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
