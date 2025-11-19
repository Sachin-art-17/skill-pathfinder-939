import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, BookOpen, Briefcase, ArrowRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";

const Dashboard = () => {
  // Mock data - would come from backend/onboarding in real app
  const userProfile = {
    name: "John",
    currentRole: "Data Analyst",
    targetRole: "Product Manager",
    experience: "3-6 years",
    industry: "IT Services"
  };

  const skillGaps = {
    hasSkills: ["Data Analysis", "SQL", "Excel", "Python", "Statistics"],
    missingSkills: ["Product Strategy", "User Research", "Roadmap Planning", "Stakeholder Management"],
    recommendedSkills: ["A/B Testing", "Market Research", "Agile Methodologies"]
  };

  const learningPath = [
    { title: "Product Management Fundamentals", duration: "4 weeks", status: "not-started" },
    { title: "User Research & Analysis", duration: "3 weeks", status: "not-started" },
    { title: "Product Strategy & Roadmapping", duration: "4 weeks", status: "not-started" },
    { title: "Stakeholder Management", duration: "2 weeks", status: "not-started" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Jobready
              </span>
            </div>
            <Button variant="outline">Profile</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile.name}! 👋</h1>
          <p className="text-lg opacity-90">
            Your journey from {userProfile.currentRole} to {userProfile.targetRole}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {userProfile.experience} experience
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {userProfile.industry}
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Skill Gap Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Skill Gap Analysis</CardTitle>
              </div>
              <CardDescription>
                Understanding your current skills vs. target role requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Skills You Have
                  </h3>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    {skillGaps.hasSkills.length} skills
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGaps.hasSkills.map((skill, index) => (
                    <Badge key={index} className="bg-success/10 text-success border-success/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    Skills to Acquire
                  </h3>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                    {skillGaps.missingSkills.length} skills
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGaps.missingSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    Recommended Skills
                  </h3>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    {skillGaps.recommendedSkills.length} skills
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillGaps.recommendedSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Skills Match</span>
                    <span className="font-semibold">55%</span>
                  </div>
                  <Progress value={55} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Learning Progress</span>
                    <span className="font-semibold">0%</span>
                  </div>
                  <Progress value={0} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="h-4 w-4 mr-2" />
                  View Job Descriptions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Resources
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Learning Roadmap */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Your Learning Roadmap</CardTitle>
              </div>
              <CardDescription>
                Personalized path to become a {userProfile.targetRole}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {learningPath.map((course, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">{course.duration}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Start
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
