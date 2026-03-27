import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { X, Plus, Check } from "lucide-react";
import { ResumeAnalyzer } from "./ResumeAnalyzer";
import { ResumeProfileDisplay } from "./ResumeProfileDisplay";
import { ResumeAnalysisResult } from "@/lib/gemini";

interface Skill {
  name: string;
  level: number;
}

interface SkillsAssessmentProps {
  onComplete: (data: { skills: Skill[]; interests: string[]; experience: string }, resumeAnalysis?: ResumeAnalysisResult) => void;
  isNewUser?: boolean;
  existingData?: {
    skills: Skill[];
    interests: string[];
    experience: string;
  };
  existingResumeAnalysis?: ResumeAnalysisResult;
}

const suggestedSkills = [
  "JavaScript", "Python", "React", "Node.js", "SQL", "Machine Learning",
  "Project Management", "Communication", "Leadership", "Data Analysis",
  "Digital Marketing", "UI/UX Design", "Cloud Computing", "Agile",
  "HTML", "CSS", "TypeScript", "Git", "MongoDB", "PostgreSQL",
  "Docker", "AWS", "Azure", "DevOps", "REST APIs", "GraphQL",
  "Vue.js", "Angular", "Express.js", "Spring Boot", "Django",
  "Kubernetes", "Jenkins", "Terraform", "Redis", "Elasticsearch"
];

const interestAreas = [
  "Technology", "Healthcare", "Finance", "Education", "Marketing",
  "Design", "Sales", "Operations", "Research", "Consulting"
];

export const SkillsAssessment = ({ 
  onComplete, 
  isNewUser = false, 
  existingData, 
  existingResumeAnalysis 
}: SkillsAssessmentProps) => {
  const [skills, setSkills] = useState<Skill[]>(existingData?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [interests, setInterests] = useState<string[]>(existingData?.interests || []);
  const [experience, setExperience] = useState(existingData?.experience || "");
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult | null>(existingResumeAnalysis || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Update state when existing data changes
  useEffect(() => {
    if (existingData) {
      setSkills(existingData.skills || []);
      setInterests(existingData.interests || []);
      setExperience(existingData.experience || "");
    }
    if (existingResumeAnalysis) {
      setResumeAnalysis(existingResumeAnalysis);
    }
  }, [existingData, existingResumeAnalysis]);

  const addSkill = (skillName: string) => {
    if (skillName && !skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      setSkills([...skills, { name: skillName, level: 3 }]);
      setNewSkill("");
    }
  };

  const updateSkillLevel = (skillName: string, level: number) => {
    setSkills(skills.map(s => s.name === skillName ? { ...s, level } : s));
  };

  const removeSkill = (skillName: string) => {
    setSkills(skills.filter(s => s.name !== skillName));
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleResumeAnalysis = (analysis: ResumeAnalysisResult) => {
    setResumeAnalysis(analysis);
    setIsAnalyzing(false); // Analysis completed
    
    // Auto-populate skills from resume analysis
    const resumeSkills = analysis.skills.map(skill => ({
      name: skill,
      level: 3 // Default to intermediate level
    }));
    
    // Merge with existing skills, avoiding duplicates
    const existingSkillNames = skills.map(s => s.name.toLowerCase());
    const newSkills = resumeSkills.filter(skill => 
      !existingSkillNames.includes(skill.name.toLowerCase())
    );
    
    setSkills(prev => [...prev, ...newSkills]);
    
    // Auto-set experience level if not already set
    if (!experience && analysis.experience) {
      setExperience(analysis.experience);
    }
    
    // Auto-populate interests based on resume content
    const techInterests = ["Technology"];
    const resumeText = analysis.summary.toLowerCase();
    
    if (resumeText.includes('health') || resumeText.includes('medical')) {
      techInterests.push("Healthcare");
    }
    if (resumeText.includes('finance') || resumeText.includes('banking')) {
      techInterests.push("Finance");
    }
    if (resumeText.includes('education') || resumeText.includes('teaching')) {
      techInterests.push("Education");
    }
    if (resumeText.includes('design') || resumeText.includes('ui') || resumeText.includes('ux')) {
      techInterests.push("Design");
    }
    if (resumeText.includes('marketing') || resumeText.includes('sales')) {
      techInterests.push("Marketing");
    }
    
    // Add inferred interests if not already selected
    const newInterests = techInterests.filter(interest => !interests.includes(interest));
    setInterests(prev => [...prev, ...newInterests]);
  };

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
  };

  const handleSubmit = () => {
    onComplete({ skills, interests, experience }, resumeAnalysis);
  };

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          {isNewUser && (
            <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-lg font-medium text-primary mb-2">🎉 Welcome to AI Career Advisor!</p>
              <p className="text-muted-foreground">
                Let's start by learning about your background to provide personalized career recommendations.
              </p>
            </div>
          )}
          <h2 className="text-4xl font-bold text-foreground mb-4">
            {(existingData || resumeAnalysis) ? "Review & Update Your Profile" : "Tell Us About Yourself"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {(existingData || resumeAnalysis) 
              ? "Review your information below and make any updates. Your previous analysis is preserved."
              : "Help our AI understand your skills, interests, and experience to provide the most accurate career recommendations."
            }
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Resume Analyzer Section - Always show, but with different messaging */}
          <div className="mb-8">
            {existingResumeAnalysis && !isNewUser && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">📄 Update Your Resume Analysis</h3>
                <p className="text-blue-700 text-sm">
                  Upload a new resume or paste updated content to refresh your career analysis and recommendations.
                </p>
              </div>
            )}
            <ResumeAnalyzer 
              onAnalysisComplete={handleResumeAnalysis}
              onAnalysisStart={handleAnalysisStart}
              className=""
            />
          </div>

          {/* Show Previous Resume Analysis if Available */}
          {resumeAnalysis && (
            <div className="mb-8 relative">
            
              <div className="relative">
                <ResumeProfileDisplay 
                  resumeAnalysis={resumeAnalysis}
                  onContinueToRecommendations={() => {
                    // Navigate to career recommendations
                    onComplete({ skills, interests, experience }, resumeAnalysis);
                  }}
                />
                {/* Loading overlay during analysis */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                    <div className="text-center p-6">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">🔄 Updating Analysis</h3>
                      <p className="text-sm text-gray-600">
                        Processing your updated resume...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills Section */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">{resumeAnalysis ? '2' : '1'}</div>
                Your Skills {resumeAnalysis && <span className="text-sm text-muted-foreground ml-2">(Auto-populated from resume)</span>}
              </CardTitle>
              <CardDescription>
                Add your current skills and rate your proficiency level (1-5)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill(newSkill)}
                />
                <Button onClick={() => addSkill(newSkill)} disabled={!newSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((skill) => (
                  <Badge 
                    key={skill}
                    variant={skills.find(s => s.name === skill) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => addSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="bg-accent p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="font-medium">{skill.name}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Progress value={skill.level * 20} className="h-2" />
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <Button
                            key={level}
                            variant={skill.level >= level ? "default" : "outline"}
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => updateSkillLevel(skill.name, level)}
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {skill.level === 1 && "Beginner"}
                        {skill.level === 2 && "Basic"}
                        {skill.level === 3 && "Intermediate"}
                        {skill.level === 4 && "Advanced"}
                        {skill.level === 5 && "Expert"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interests Section */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">{resumeAnalysis ? '3' : '2'}</div>
                Your Interests {resumeAnalysis && <span className="text-sm text-muted-foreground ml-2">(Some auto-selected from resume)</span>}
              </CardTitle>
              <CardDescription>
                Select the industries and areas that interest you most
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestAreas.map((interest) => (
                  <Button
                    key={interest}
                    variant={interests.includes(interest) ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interests.includes(interest) && <Check className="h-4 w-4 mr-2" />}
                    {interest}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience Section */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">{resumeAnalysis ? '4' : '3'}</div>
                Experience Level {resumeAnalysis && <span className="text-sm text-muted-foreground ml-2">(Auto-detected from resume)</span>}
              </CardTitle>
              <CardDescription>
                What best describes your current experience level?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Student/Graduate", "Entry Level (0-2 years)", "Mid Level (3-5 years)", "Senior Level (6+ years)"].map((level) => (
                  <Button
                    key={level}
                    variant={experience === level ? "default" : "outline"}
                    className="justify-start h-auto p-4"
                    onClick={() => setExperience(level)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{level}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={handleSubmit}
              disabled={skills.length === 0 || interests.length === 0 || !experience}
              size="lg"
              className="bg-gradient-primary hover:bg-primary-hover shadow-medium"
            >
              {(existingData || resumeAnalysis) ? "Update My Profile" : "Get My Career Recommendations"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};