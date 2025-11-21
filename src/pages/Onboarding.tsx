import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";

interface OnboardingData {
  designation: string;
  currentRole: string;
  experience: string;
  industry: string;
  company: string;
  objective: string;
  targetRole: string;
  educationStatus: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 7;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
        // Check if user already completed onboarding
        supabase
          .from("onboarding_data")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data) {
              navigate("/dashboard");
            }
          });
      }
    });
  }, [navigate]);
  
  const [formData, setFormData] = useState<OnboardingData>({
    designation: "",
    currentRole: "",
    experience: "",
    industry: "",
    company: "",
    objective: "",
    targetRole: "",
    educationStatus: "",
  });

  const updateFormData = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Skip steps based on designation
    if (step === 1 && formData.designation === "student") {
      // Students skip company question (step 5)
      setStep(2);
    } else if (step === 4 && formData.designation === "student") {
      // Skip from industry (4) to objective (6) for students
      setStep(6);
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;

    const { error } = await supabase.from("onboarding_data").insert({
      user_id: userId,
      designation: formData.designation,
      user_role: formData.currentRole,
      experience: formData.experience,
      industry: formData.industry || "N/A",
      company: formData.company || "N/A",
      objective: formData.objective,
      target_role: formData.targetRole || null,
      education_status: formData.educationStatus || null,
    });

    if (error) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile created!",
        description: "Analyzing your career path...",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Logo />
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Let's get to know you</CardTitle>
            <CardDescription>
              Help us understand your career goals and current position
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <Label htmlFor="designation">Your current designation</Label>
                <RadioGroup 
                  value={formData.designation} 
                  onValueChange={(value) => updateFormData("designation", value)}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student" className="flex-1 cursor-pointer">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional" className="flex-1 cursor-pointer">Working Professional</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="educator" id="educator" />
                    <Label htmlFor="educator" className="flex-1 cursor-pointer">Educator</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 2 && formData.designation === "student" && (
              <div className="space-y-4">
                <Label htmlFor="education-status">Education Status</Label>
                <Select value={formData.educationStatus} onValueChange={(value) => updateFormData("educationStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your education status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pursuing">Pursuing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="gap-year">Gap Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 2 && formData.designation === "professional" && (
              <div className="space-y-4">
                <Label htmlFor="current-role">Your current role</Label>
                <Select value={formData.currentRole} onValueChange={(value) => updateFormData("currentRole", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
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
            )}

            {step === 2 && formData.designation === "educator" && (
              <div className="space-y-4">
                <Label htmlFor="current-role">Your current role</Label>
                <Select value={formData.currentRole} onValueChange={(value) => updateFormData("currentRole", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="lecturer">Lecturer</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Label>Years of experience</Label>
                <RadioGroup 
                  value={formData.experience} 
                  onValueChange={(value) => updateFormData("experience", value)}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="0-1" id="exp-0-1" />
                    <Label htmlFor="exp-0-1" className="flex-1 cursor-pointer">0-1 years</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="1-3" id="exp-1-3" />
                    <Label htmlFor="exp-1-3" className="flex-1 cursor-pointer">1-3 years</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="3-6" id="exp-3-6" />
                    <Label htmlFor="exp-3-6" className="flex-1 cursor-pointer">3-6 years</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="6+" id="exp-6" />
                    <Label htmlFor="exp-6" className="flex-1 cursor-pointer">6+ years</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
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
            )}

            {step === 5 && formData.designation !== "student" && (
              <div className="space-y-4">
                <Label htmlFor="company">Current Company</Label>
                <Input
                  id="company"
                  type="text"
                  placeholder="Enter your company name"
                  value={formData.company}
                  onChange={(e) => updateFormData("company", e.target.value)}
                />
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <Label>Are you looking to upskill or transition?</Label>
                <RadioGroup 
                  value={formData.objective} 
                  onValueChange={(value) => updateFormData("objective", value)}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="upskill" id="upskill" />
                    <Label htmlFor="upskill" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Upskill within same role</div>
                        <div className="text-sm text-muted-foreground">Enhance your current skills</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="transition" id="transition" />
                    <Label htmlFor="transition" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Transition into a new role</div>
                        <div className="text-sm text-muted-foreground">Change career paths</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === 7 && formData.objective === "transition" && (
              <div className="space-y-4">
                <Label htmlFor="target-role">Target Role</Label>
                <Select value={formData.targetRole} onValueChange={(value) => updateFormData("targetRole", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your target role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product-manager">Product Manager</SelectItem>
                    <SelectItem value="data-scientist">Data Scientist</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="ux-designer">UX Designer</SelectItem>
                    <SelectItem value="software-engineer">Software Engineer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 7 && formData.objective === "upskill" && (
              <div className="space-y-4 text-center py-8">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold">Great! You're ready to level up</h3>
                <p className="text-muted-foreground">
                  We'll create a personalized learning path to enhance your {formData.currentRole} skills
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              {step > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button 
                onClick={handleNext}
                className="flex-1"
                disabled={
                  (step === 1 && !formData.designation) ||
                  (step === 2 && formData.designation === "student" && !formData.educationStatus) ||
                  (step === 2 && formData.designation !== "student" && !formData.currentRole) ||
                  (step === 3 && !formData.experience) ||
                  (step === 4 && !formData.industry) ||
                  (step === 5 && formData.designation !== "student" && !formData.company) ||
                  (step === 6 && !formData.objective) ||
                  (step === 7 && formData.objective === "transition" && !formData.targetRole)
                }
              >
                {step === totalSteps ? "Complete" : "Next"}
                {step < totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
