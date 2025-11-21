import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Identify Skill Gaps",
      description: "Understand exactly what skills you need for your target role"
    },
    {
      icon: TrendingUp,
      title: "Career Roadmap",
      description: "Get a personalized learning path tailored to your goals"
    },
    {
      icon: Users,
      title: "Real Job Insights",
      description: "Access actual job descriptions from top companies"
    }
  ];

  const benefits = [
    "Analyze gaps between current skills and target role expectations",
    "Understand what companies are really looking for",
    "Get step-by-step guidance on your career transition",
    "Access curated learning resources and roadmaps"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/signup")}>
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              Your Career Success Partner
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Thanks for taking a step towards{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              your career
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Let's walk you through your journey to get ready for your new role. 
            Understand your skills, identify gaps, and build a path to success.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => navigate("/signup")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to transition successfully
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Jobready combines career insights, skill analysis, and personalized guidance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-8 md:p-12 border border-border">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Why choose Jobready?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => navigate("/signup")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to transform your career?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of professionals who are preparing for their dream roles
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8"
            onClick={() => navigate("/signup")}
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold">J</span>
            </div>
            <span className="font-semibold">Jobready</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Jobready. A career readiness platform.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
