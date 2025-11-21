import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { LogOut, User, FileText, Upload, Edit2, Target, TrendingUp, BookOpen } from "lucide-react";

interface OnboardingData {
  designation: string;
  user_role: string;
  experience: string;
  industry: string;
  company: string;
  objective: string;
  target_role: string | null;
  education_status: string | null;
}

interface ProfileData {
  full_name: string | null;
  email: string | null;
  resume_url: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    currentRole: "",
    industry: "",
    company: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchUserData();
    }
  }, [user, loading, navigate]);

  const fetchUserData = async () => {
    if (!user) return;

    const { data: onboarding, error: onboardingError } = await supabase
      .from("onboarding_data")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (onboardingError) {
      console.error("Error fetching onboarding data:", onboardingError);
    } else if (!onboarding) {
      navigate("/onboarding");
      return;
    } else {
      setOnboardingData(onboarding);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    } else {
      setProfileData(profile);
      setEditFormData({
        fullName: profile?.full_name || "",
        currentRole: onboarding?.user_role || "",
        industry: onboarding?.industry || "",
        company: onboarding?.company || "",
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleEditProfile = async () => {
    if (!user || !onboardingData) return;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ full_name: editFormData.fullName })
      .eq("id", user.id);

    const { error: onboardingError } = await supabase
      .from("onboarding_data")
      .update({
        user_role: editFormData.currentRole,
        industry: editFormData.industry,
        company: editFormData.company,
      })
      .eq("user_id", user.id);

    if (profileError || onboardingError) {
      toast({
        title: "Error updating profile",
        description: "Please try again",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved.",
      });
      setIsEditDialogOpen(false);
      fetchUserData();
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/resume.${fileExt}`;

    if (profileData?.resume_url) {
      await supabase.storage.from('resumes').remove([`${user.id}/resume.pdf`]);
    }

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ resume_url: fileName })
      .eq("id", user.id);

    setIsUploading(false);

    if (updateError) {
      toast({
        title: "Error saving resume",
        description: updateError.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Resume uploaded!",
        description: "Your resume has been successfully uploaded.",
      });
      fetchUserData();
    }
  };

  if (loading || !onboardingData || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <Button variant="ghost" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {profileData.full_name || "there"}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Continue your journey to {onboardingData.objective === "transition" ? onboardingData.target_role : "career growth"}
            </p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Summary
                </CardTitle>
                <CardDescription>Your current career information</CardDescription>
              </div>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={editFormData.fullName}
                        onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentRole">Current Role</Label>
                      <Select
                        value={editFormData.currentRole}
                        onValueChange={(value) => setEditFormData({ ...editFormData, currentRole: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="data-analyst">Data Analyst</SelectItem>
                          <SelectItem value="hr-executive">HR Executive</SelectItem>
                          <SelectItem value="product-manager">Product Manager</SelectItem>
                          <SelectItem value="software-engineer">Software Engineer</SelectItem>
                          <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        value={editFormData.industry}
                        onValueChange={(value) => setEditFormData({ ...editFormData, industry: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="it-services">IT Services</SelectItem>
                          <SelectItem value="ecommerce">Ecommerce</SelectItem>
                          <SelectItem value="banking">Banking</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="hospitality">Hospitality</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={editFormData.company}
                        onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleEditProfile}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Designation</p>
                <p className="font-medium capitalize">{onboardingData.designation}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Role</p>
                <p className="font-medium">{onboardingData.user_role}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-medium">{onboardingData.experience} years</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium capitalize">{onboardingData.industry.replace('-', ' ')}</p>
              </div>
              {onboardingData.designation !== "student" && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{onboardingData.company}</p>
                </div>
              )}
              {onboardingData.education_status && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Education Status</p>
                  <p className="font-medium capitalize">{onboardingData.education_status.replace('-', ' ')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume
              </CardTitle>
              <CardDescription>Upload your resume to get personalized feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.resume_url ? (
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">Resume uploaded</p>
                        <p className="text-sm text-muted-foreground">PDF document</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('resume-upload')?.click()}
                      disabled={isUploading}
                    >
                      Replace
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Upload your resume</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      PDF format only, max 10MB
                    </p>
                    <Button
                      onClick={() => document.getElementById('resume-upload')?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Choose File"}
                    </Button>
                  </div>
                )}
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleResumeUpload}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Skill Gap Analysis
                </CardTitle>
                <CardDescription>
                  Identify gaps between your current and target role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  Start Analysis
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  Career Roadmap
                </CardTitle>
                <CardDescription>
                  Get a personalized learning path
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  View Roadmap
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  Learning Resources
                </CardTitle>
                <CardDescription>
                  Curated courses and materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">
                  Explore Resources
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
