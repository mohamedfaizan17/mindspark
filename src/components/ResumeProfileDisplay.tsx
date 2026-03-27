import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Star, 
  Award, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Briefcase,
  GraduationCap,
  User,
  Mail,
  Phone,
  CheckCircle,
  Target,
  Lightbulb
} from "lucide-react";
import { ResumeAnalysisResult } from "@/lib/gemini";
import { cn } from "@/lib/utils";

interface ResumeProfileDisplayProps {
  resumeAnalysis: ResumeAnalysisResult;
  onContinueToRecommendations?: () => void;
  className?: string;
}

export const ResumeProfileDisplay = ({ resumeAnalysis, onContinueToRecommendations, className }: ResumeProfileDisplayProps) => {
  const [animatedCounts, setAnimatedCounts] = useState({
    skillsExtracted: 0,
    resumeAnalyzed: 0,
    readyForAnalysis: 0
  });

  // Animate the numbers
  useEffect(() => {
    const skillsTarget = resumeAnalysis.skills.length;
    const intervals = [
      setInterval(() => {
        setAnimatedCounts(prev => {
          if (prev.skillsExtracted < skillsTarget) {
            return { ...prev, skillsExtracted: prev.skillsExtracted + 1 };
          }
          return prev;
        });
      }, 50),
      
      setTimeout(() => {
        setInterval(() => {
          setAnimatedCounts(prev => {
            if (prev.resumeAnalyzed < 100) {
              return { ...prev, resumeAnalyzed: prev.resumeAnalyzed + 2 };
            }
            return prev;
          });
        }, 30);
      }, 500),
      
      setTimeout(() => {
        setAnimatedCounts(prev => ({ ...prev, readyForAnalysis: 100 }));
      }, 2000)
    ];

    return () => {
      intervals.forEach(interval => {
        if (typeof interval === 'number') {
          clearInterval(interval);
        }
      });
    };
  }, [resumeAnalysis.skills.length]);

  // Get skill level color
  const getSkillLevelColor = (skill: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'
    ];
    return colors[skill.length % colors.length];
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Professional Experience Overview */}
      {resumeAnalysis.extractedInfo?.workExperience && resumeAnalysis.extractedInfo.workExperience.length > 0 && (
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <Briefcase className="h-6 w-6 text-blue-600" />
              Professional Experience
            </CardTitle>
            <CardDescription className="text-gray-600">
              Career progression and key achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {resumeAnalysis.extractedInfo.workExperience.slice(0, 3).map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{exp.position}</h4>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      {exp.duration && (
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {exp.duration}
                        </p>
                      )}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Education Background */}
      {resumeAnalysis.education && resumeAnalysis.education.length > 0 && (
        <Card className="shadow-lg border-gray-200">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100">
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              Education Background
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {resumeAnalysis.education.map((edu, index) => (
                <div key={index} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <p className="font-medium text-indigo-900">{edu}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


      {/* Action Button */}
      <div className="text-center pt-6">
        <Button 
          onClick={onContinueToRecommendations}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-3"
        >
          <TrendingUp className="h-5 w-5 mr-2" />
          Career Recommendations
        </Button>
      </div>
    </div>
  );
};
