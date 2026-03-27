import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  Clock, 
  Star, 
  Play, 
  CheckCircle, 
  Trophy,
  Users,
  AlertCircle,
  ExternalLink,
  Loader2,
  Check,
  Brain
} from "lucide-react";
import { generateLearningRecommendations, type LearningRecommendation, type UserProfile } from "@/lib/gemini";
import { getCourseRecommendations, getCourseRecommendationsEnhanced, generateEnrollmentUrl, type Course } from "@/lib/course-providers";

// Mock learning paths - In production, integrated with course APIs
const learningPaths = {
  "AI/ML Engineer": {
    duration: "6-8 months",
    difficulty: "Advanced",
    courses: [
      {
        id: 1,
        title: "Machine Learning Fundamentals",
        provider: "Coursera",
        duration: "6 weeks",
        rating: 4.8,
        enrolled: 125000,
        completed: false,
        skills: ["Python", "Statistics", "Linear Algebra"],
        description: "Introduction to ML algorithms and mathematical foundations"
      },
      {
        id: 2,
        title: "Deep Learning Specialization",
        provider: "Coursera",
        duration: "4 months",
        rating: 4.9,
        enrolled: 89000,
        completed: false,
        skills: ["Neural Networks", "TensorFlow", "Computer Vision"],
        description: "Comprehensive deep learning from Andrew Ng"
      },
      {
        id: 3,
        title: "MLOps Engineering",
        provider: "edX",
        duration: "8 weeks",
        rating: 4.6,
        enrolled: 34000,
        completed: false,
        skills: ["Docker", "Kubernetes", "Model Deployment"],
        description: "Production ML systems and deployment strategies"
      }
    ]
  },
  "Full Stack Developer": {
    duration: "4-6 months",
    difficulty: "Intermediate",
    courses: [
      {
        id: 4,
        title: "React - The Complete Guide",
        provider: "Udemy",
        duration: "12 weeks",
        rating: 4.7,
        enrolled: 245000,
        completed: true,
        skills: ["React", "JavaScript", "State Management"],
        description: "Master React with hooks, context, and modern patterns"
      },
      {
        id: 5,
        title: "Node.js Backend Development",
        provider: "YouTube",
        duration: "8 weeks",
        rating: 4.5,
        enrolled: 78000,
        completed: false,
        skills: ["Node.js", "Express", "MongoDB"],
        description: "Build scalable backend APIs and services"
      },
      {
        id: 6,
        title: "Cloud Deployment & DevOps",
        provider: "AWS Training",
        duration: "6 weeks",
        rating: 4.8,
        enrolled: 56000,
        completed: false,
        skills: ["AWS", "Docker", "CI/CD"],
        description: "Deploy and scale applications in the cloud"
      }
    ]
  }
};

const supplementaryContent = [
  {
    type: "Article",
    title: "2024 AI Career Roadmap",
    source: "Medium",
    readTime: "8 min",
    rating: 4.6,
    url: "https://medium.com/search?q=AI+career+roadmap+2024",
    description: "Complete guide to building a career in AI and machine learning"
  },
  {
    type: "Video",
    title: "System Design Interview Prep",
    source: "YouTube",
    readTime: "45 min",
    rating: 4.8,
    url: "https://www.youtube.com/results?search_query=system+design+interview+preparation",
    description: "Essential system design concepts for tech interviews"
  },
  {
    type: "Podcast",
    title: "Tech Career Growth Strategies",
    source: "Spotify",
    readTime: "32 min",
    rating: 4.7,
    url: "https://open.spotify.com/search/tech%20career%20growth",
    description: "Expert advice on advancing your technology career"
  }
];

interface LearningPathsProps {
  userSkills?: Array<{ name: string; level: number }>;
  userInterests?: string[];
  userExperience?: string;
}

export const LearningPaths = ({ userSkills = [], userInterests = [], userExperience = "" }: LearningPathsProps) => {
  const [selectedPath, setSelectedPath] = useState<string>("AI/ML Engineer");
  const [aiRecommendations, setAiRecommendations] = useState<LearningRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateProgress = (pathKey: string) => {
    const path = learningPaths[pathKey as keyof typeof learningPaths];
    const completedCourses = path.courses.filter(course => course.completed).length;
    return (completedCourses / path.courses.length) * 100;
  };

  const fetchAIRecommendations = async () => {
    if (userSkills.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userProfile: UserProfile = {
        skills: userSkills,
        interests: userInterests,
        experience: userExperience
      };
      
      const recommendations = await generateLearningRecommendations(userProfile);
      setAiRecommendations(recommendations);
    } catch (err) {
      setError('Failed to generate AI learning recommendations');
      console.error('Error fetching learning recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIRecommendations();
  }, [userSkills, userInterests, userExperience]);

  return (
    <div className="min-h-screen bg-secondary py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Personalized Learning Paths</h1>
          <p className="text-xl text-muted-foreground">
            AI-curated learning journeys tailored to your career goals and current skills
          </p>
        </div>

        {/* AI Learning Status */}
        <Card className="mb-8 border-primary/20 bg-gradient-secondary shadow-medium">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Brain className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  AI-Powered Learning Recommendations
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Powered by Gemini AI
                  </Badge>
                </h3>
                <p className="text-muted-foreground mb-3">
                  {import.meta.env.VITE_GEMINI_API_KEY 
                    ? "Personalized course recommendations generated using Gemini AI based on your skills, interests, and career goals."
                    : "Using curated learning paths. Add your Gemini API key to unlock AI-powered personalized course recommendations."
                  }
                </p>
                <Badge 
                  variant="outline" 
                  className={import.meta.env.VITE_GEMINI_API_KEY 
                    ? "bg-success/10 text-success border-success/20" 
                    : "bg-warning/10 text-warning border-warning/20"
                  }
                >
                  {import.meta.env.VITE_GEMINI_API_KEY ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      AI Recommendations Active
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Add API Key for AI Features
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations Section */}
        {import.meta.env.VITE_GEMINI_API_KEY && aiRecommendations.length > 0 && (
          <Card className="mb-8 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI-Generated Learning Recommendations
              </CardTitle>
              <CardDescription>
                Personalized course suggestions based on your profile analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(() => {
                  let globalCourseIndex = 0; // Track global course numbering
                  
                  return aiRecommendations.map((recommendation, index) => (
                    <div key={index} className="space-y-4">
                      <h4 className="font-semibold text-lg text-primary mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        {recommendation.skill} Learning Path
                      </h4>
                      {(() => {
                        // Get real course data for this skill
                        console.log('Looking for courses for skill:', recommendation.skill);
                        const realCourses = getCourseRecommendationsEnhanced(recommendation.skill);
                        console.log('Found real courses:', realCourses.length, realCourses);
                        
                        if (realCourses.length > 0) {
                          // Use real course data
                          return realCourses.map((course, courseIndex) => {
                            const currentGlobalIndex = ++globalCourseIndex;
                            return (
                          <Card key={courseIndex} className="shadow-medium">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                                    <span className="text-sm font-bold">{currentGlobalIndex}</span>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                                    <p className="text-muted-foreground mb-3">{course.description}</p>
                                    
                                    <div className="flex items-center gap-4 mb-3">
                                      <Badge variant="outline">{course.provider}</Badge>
                                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {course.duration}
                                      </span>
                                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                                        {course.rating}
                                      </span>
                                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {course.enrolled.toLocaleString()}
                                      </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                      {course.skills.map((skill) => (
                                        <Badge 
                                          key={skill} 
                                          variant="secondary"
                                          className={
                                            userSkills.some(s => s.name === skill) 
                                              ? "bg-success/20 text-success" 
                                              : ""
                                          }
                                        >
                                          {skill}
                                          {userSkills.some(s => s.name === skill) && (
                                            <CheckCircle className="h-3 w-3 ml-1" />
                                          )}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                  <Button 
                                    size="sm" 
                                    className="bg-gradient-primary"
                                    onClick={() => {
                                      const enrollUrl = generateEnrollmentUrl(course);
                                      window.open(enrollUrl, '_blank');
                                    }}
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Start Course
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' preview')}`;
                                      window.open(searchUrl, '_blank');
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Preview
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                            );
                          });
                      } else {
                        // Use AI recommendation data with fallback values
                        return recommendation.courses.map((course, courseIndex) => {
                          const currentGlobalIndex = ++globalCourseIndex;
                          return (
                          <Card key={courseIndex} className="shadow-medium">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                                    <span className="text-sm font-bold">{currentGlobalIndex}</span>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                                    <p className="text-muted-foreground mb-3">{course.description}</p>
                                    
                                    <div className="flex items-center gap-4 mb-3">
                                      <Badge variant="outline">{course.provider}</Badge>
                                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {course.duration}
                                      </span>
                                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-current text-yellow-500" />
                                        4.8
                                      </span>
                                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        125,000
                                      </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                      {['Python', 'Statistics', 'Linear Algebra'].map((skill) => (
                                        <Badge 
                                          key={skill} 
                                          variant="secondary"
                                          className={
                                            userSkills.some(s => s.name === skill) 
                                              ? "bg-success/20 text-success" 
                                              : ""
                                          }
                                        >
                                          {skill}
                                          {userSkills.some(s => s.name === skill) && (
                                            <CheckCircle className="h-3 w-3 ml-1" />
                                          )}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                  <Button 
                                    size="sm" 
                                    className="bg-gradient-primary"
                                    onClick={() => {
                                      const searchQuery = `${recommendation.skill} ${course.title}`;
                                      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' course')}`;
                                      window.open(searchUrl, '_blank');
                                    }}
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Start Course
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(course.title + ' preview')}`;
                                      window.open(searchUrl, '_blank');
                                    }}
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Preview
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          );
                        });
                      }
                    })()}
                    </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="mb-8 shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span>Generating AI-powered learning recommendations...</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={selectedPath} onValueChange={setSelectedPath} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            {Object.keys(learningPaths).map((pathKey) => (
              <TabsTrigger key={pathKey} value={pathKey} className="text-center">
                <div>
                  <div className="font-medium">{pathKey}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {calculateProgress(pathKey).toFixed(0)}% Complete
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(learningPaths).map(([pathKey, pathData]) => (
            <TabsContent key={pathKey} value={pathKey} className="space-y-6">
              {/* Path Overview */}
              <Card className="shadow-medium">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{pathKey} Learning Path</CardTitle>
                      <CardDescription className="mt-2">
                        Complete roadmap to become a {pathKey.toLowerCase()} with industry-relevant skills
                      </CardDescription>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {pathData.difficulty}
                      </Badge>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {pathData.duration}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Overall Progress</span>
                      <span>{calculateProgress(pathKey).toFixed(0)}%</span>
                    </div>
                    <Progress value={calculateProgress(pathKey)} className="h-2" />
                  </div>
                </CardHeader>
              </Card>

              {/* Course List */}
              <div className="space-y-4">
                {pathData.courses.map((course, index) => (
                  <Card key={course.id} className="shadow-medium">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            course.completed 
                              ? "bg-success text-success-foreground" 
                              : "bg-primary text-primary-foreground"
                          }`}>
                            {course.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-sm font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                            <p className="text-muted-foreground mb-3">{course.description}</p>
                            
                            <div className="flex items-center gap-4 mb-3">
                              <Badge variant="outline">{course.provider}</Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {course.duration}
                              </span>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Star className="h-3 w-3 fill-current text-yellow-500" />
                                {course.rating}
                              </span>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {course.enrolled.toLocaleString()}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {course.skills.map((skill) => (
                                <Badge 
                                  key={skill} 
                                  variant="secondary"
                                  className={
                                    userSkills.some(s => s.name === skill) 
                                      ? "bg-success/20 text-success" 
                                      : ""
                                  }
                                >
                                  {skill}
                                  {userSkills.some(s => s.name === skill) && (
                                    <CheckCircle className="h-3 w-3 ml-1" />
                                  )}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {course.completed ? (
                            <Button variant="outline" size="sm" className="text-success border-success">
                              <Trophy className="h-4 w-4 mr-2" />
                              Completed
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              className="bg-gradient-primary"
                              onClick={() => {
                                // Map course titles to real course recommendations
                                const skillMap: Record<string, string> = {
                                  "Machine Learning Fundamentals": "Machine Learning",
                                  "Deep Learning Specialization": "Machine Learning",
                                  "MLOps Engineering": "Machine Learning",
                                  "React - The Complete Guide": "React",
                                  "Node.js Backend Development": "Node.js",
                                  "Cloud Deployment & DevOps": "Cloud Computing"
                                };
                                
                                const skill = skillMap[course.title] || course.title;
                                const realCourses = getCourseRecommendations(skill);
                                
                                if (realCourses.length > 0) {
                                  const enrollUrl = generateEnrollmentUrl(realCourses[0]);
                                  window.open(enrollUrl, '_blank');
                                } else {
                                  // Fallback to course provider search
                                  const searchUrl = `https://www.coursera.org/search?query=${encodeURIComponent(course.title)}`;
                                  window.open(searchUrl, '_blank');
                                }
                              }}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Course
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const skill = course.skills[0] || course.title;
                              const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial preview')}`;
                              window.open(searchUrl, '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Supplementary Content */}
        <Card className="mt-8 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Supplementary Learning Content
            </CardTitle>
            <CardDescription>
              Additional resources to complement your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {supplementaryContent.map((content, index) => (
                <div 
                  key={index} 
                  className="bg-accent p-4 rounded-lg cursor-pointer hover:bg-accent/80 transition-all duration-200 hover:shadow-md border border-transparent hover:border-primary/20"
                  onClick={() => {
                    window.open(content.url, '_blank');
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {content.type}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      {content.rating}
                    </div>
                  </div>
                  <h4 className="font-medium mb-2 hover:text-primary transition-colors">{content.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{content.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      {content.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {content.readTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};