import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Target, TrendingUp, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-career-advisor.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-primary">
      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your AI-Powered
                <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Career Guide
                </span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-lg">
                Discover your perfect career path with personalized AI recommendations, 
                skill assessments, and market insights tailored just for you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onGetStarted}
                size="lg" 
                className="bg-white text-primary hover:bg-blue-50 shadow-medium group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center space-y-2">
                <Brain className="h-8 w-8 mx-auto text-blue-200" />
                <p className="text-sm text-blue-100">AI-Powered Analysis</p>
              </div>
              <div className="text-center space-y-2">
                <Target className="h-8 w-8 mx-auto text-blue-200" />
                <p className="text-sm text-blue-100">Personalized Paths</p>
              </div>
              <div className="text-center space-y-2">
                <TrendingUp className="h-8 w-8 mx-auto text-blue-200" />
                <p className="text-sm text-blue-100">Market Insights</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="AI Career Advisor Dashboard" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};