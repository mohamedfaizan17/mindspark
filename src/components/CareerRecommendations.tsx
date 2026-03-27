import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  ArrowRight,
  Target
} from "lucide-react";

interface Skill {
  name: string;
  level: number;
}

interface AssessmentData {
  skills: Skill[];
  interests: string[];
  experience: string;
}

interface CareerRecommendationsProps {
  assessmentData: AssessmentData;
}

const generateRecommendations = (data: AssessmentData) => {
  // Mock AI-generated recommendations based on assessment data
  const recommendations = [
    {
      title: "Full Stack Developer",
      match: 92,
      salary: "$75k - $120k",
      growth: "22% growth",
      description: "Build end-to-end web applications using modern technologies like React, Node.js, and cloud platforms.",
      requiredSkills: ["JavaScript", "React", "Node.js", "SQL"],
      skillGaps: ["Cloud Computing", "DevOps"],
      learningPath: ["Advanced React Patterns", "AWS Certification", "System Design"],
      companies: ["Google", "Microsoft", "Spotify"]
    },
    {
      title: "Data Scientist",
      match: 87,
      salary: "$80k - $130k",
      growth: "25% growth",
      description: "Analyze complex data to derive insights and build predictive models using Python and machine learning.",
      requiredSkills: ["Python", "Machine Learning", "Data Analysis", "SQL"],
      skillGaps: ["Deep Learning", "Statistics"],
      learningPath: ["Advanced Statistics", "TensorFlow", "MLOps"],
      companies: ["Netflix", "Amazon", "Meta"]
    },
    {
      title: "Product Manager",
      match: 78,
      salary: "$90k - $140k",
      growth: "18% growth",
      description: "Lead product strategy and development, working cross-functionally to bring innovative solutions to market.",
      requiredSkills: ["Project Management", "Communication", "Leadership", "Data Analysis"],
      skillGaps: ["Product Strategy", "User Research"],
      learningPath: ["Product Management Fundamentals", "Design Thinking", "Agile Methodologies"],
      companies: ["Apple", "Uber", "Airbnb"]
    }
  ];

  return recommendations.sort((a, b) => b.match - a.match);
};

export const CareerRecommendations = ({ assessmentData }: CareerRecommendationsProps) => {
  const recommendations = generateRecommendations(assessmentData);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Your Personalized Career Recommendations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Based on your skills, interests, and experience, our AI has identified 
            the best career paths for your professional growth.
          </p>
        </div>

        <div className="space-y-8">
          {recommendations.map((career, index) => (
            <Card key={career.title} className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-2xl">{career.title}</CardTitle>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {career.match}% Match
                      </Badge>
                      {index === 0 && (
                        <Badge className="bg-gradient-primary">
                          <Star className="h-3 w-3 mr-1" />
                          Top Recommendation
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base">
                      {career.description}
                    </CardDescription>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 text-success font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {career.salary}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      {career.growth}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Match Score */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Career Match Score</span>
                    <span>{career.match}%</span>
                  </div>
                  <Progress value={career.match} className="h-2" />
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Your Matching Skills */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4 text-success" />
                      Your Matching Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {career.requiredSkills
                        .filter(skill => assessmentData.skills.some(s => s.name === skill))
                        .map(skill => (
                          <Badge key={skill} variant="outline" className="bg-success/10 text-success border-success/20">
                            {skill}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>

                  {/* Skills to Develop */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-warning" />
                      Skills to Develop
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {career.skillGaps.map(skill => (
                        <Badge key={skill} variant="outline" className="bg-warning/10 text-warning border-warning/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Top Companies */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Top Companies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {career.companies.map(company => (
                        <Badge key={company} variant="secondary">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Learning Path */}
                <div className="bg-accent p-4 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Recommended Learning Path
                  </h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {career.learningPath.map((step, stepIndex) => (
                      <div key={step} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {stepIndex + 1}
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button className="bg-gradient-primary hover:bg-primary-hover">
                    Start Learning Path
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline">
                    View Job Openings
                  </Button>
                  <Button variant="ghost">
                    Schedule Career Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto bg-gradient-secondary shadow-medium">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Take the Next Step?</h3>
              <p className="text-muted-foreground mb-6">
                Get personalized mentorship and detailed learning roadmaps to accelerate your career growth.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-gradient-primary hover:bg-primary-hover">
                  Get Premium Guidance
                </Button>
                <Button variant="outline" size="lg">
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};