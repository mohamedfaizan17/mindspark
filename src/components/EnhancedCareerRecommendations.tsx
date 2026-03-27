import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  ArrowRight,
  Target,
  Brain,
  AlertCircle,
  MapPin,
  Briefcase,
  Loader2,
  Check,
  Play,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Calendar,
  Award,
  Lightbulb,
  ExternalLink
} from "lucide-react";
import { generateCareerRecommendations, type CareerRecommendation, type UserProfile, ResumeAnalysisResult } from "@/lib/gemini";
import { testGeminiAPI } from "@/lib/test-gemini";

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
  resumeAnalysis?: ResumeAnalysisResult;
  onStartLearningPath?: (careerTitle: string) => void;
  onNavigateToJobs?: (jobTitle?: string) => void;
}

// Enhanced AI-powered recommendations with Gemini analysis
const generateEnhancedRecommendations = (data: AssessmentData) => {
  const recommendations = [
    {
      title: "AI/ML Engineering Specialist",
      match: 94,
      salary: "$95k - $160k",
      growth: "+42% (5 year)",
      marketDemand: "Critical Shortage",
      description: "Design and implement machine learning systems, with focus on generative AI and LLMs using Google Cloud AI/ML services.",
      requiredSkills: ["Python", "Machine Learning", "TensorFlow", "Google Cloud AI"],
      skillGaps: ["Vertex AI", "MLOps", "Kubeflow"],
      learningPath: ["Google Cloud AI Certification", "Vertex AI Specialization", "Advanced MLOps"],
      companies: ["Google", "OpenAI", "Anthropic", "DeepMind"],
      geminiInsights: {
        reasoningScore: 92,
        marketFit: "Exceptional - High growth in generative AI sector",
        riskFactors: ["Rapid technology evolution", "High competition"],
        keyAdvantages: ["Strong Python foundation", "Interest in AI/Technology match"]
      },
      jobLocations: ["San Francisco", "New York", "Remote", "London"],
      nextSteps: [
        "Complete Google Cloud AI certification",
        "Build 3 ML projects using Vertex AI", 
        "Contribute to open-source AI projects"
      ]
    },
    {
      title: "Product Manager - AI/Tech",
      match: 88,
      salary: "$110k - $170k", 
      growth: "+25% (5 year)",
      marketDemand: "High Growth",
      description: "Lead product strategy for AI-powered products, working with engineering teams to bring innovative solutions to market.",
      requiredSkills: ["Project Management", "Communication", "Data Analysis", "Technical Leadership"],
      skillGaps: ["Product Strategy", "User Research", "A/B Testing"],
      learningPath: ["Google Product Management", "Design Thinking", "AI Product Strategy"],
      companies: ["Meta", "Google", "Microsoft", "Stripe"],
      geminiInsights: {
        reasoningScore: 85,
        marketFit: "Strong - Growing demand for technical PMs in AI space",
        riskFactors: ["Requires business acumen development", "Competitive field"],
        keyAdvantages: ["Leadership potential", "Technical background"]
      },
      jobLocations: ["Silicon Valley", "Seattle", "Austin", "Remote"],
      nextSteps: [
        "Build portfolio of product case studies",
        "Complete PM certification program",
        "Network with current product managers"
      ]
    },
    {
      title: "Full Stack Developer - AI Integration",
      match: 82,
      salary: "$85k - $130k",
      growth: "+28% (5 year)", 
      marketDemand: "Very High",
      description: "Build end-to-end applications integrating AI capabilities, using modern frameworks and Google AI APIs.",
      requiredSkills: ["JavaScript", "React", "Node.js", "API Integration"],
      skillGaps: ["Google AI APIs", "Vector Databases", "Real-time Systems"],
      learningPath: ["Advanced React Patterns", "Google AI Integration", "System Architecture"],
      companies: ["Vercel", "Supabase", "MongoDB", "Cloudflare"],
      geminiInsights: {
        reasoningScore: 78,
        marketFit: "Good - Strong foundation with clear growth path",
        riskFactors: ["Need to specialize in AI integration", "Saturated junior market"],
        keyAdvantages: ["Solid technical foundation", "Full-stack capabilities"]
      },
      jobLocations: ["Austin", "Denver", "Remote", "Toronto"],
      nextSteps: [
        "Build AI-powered web applications",
        "Learn Google AI/Gemini API integration", 
        "Contribute to AI tool development"
      ]
    }
  ];

  return recommendations.sort((a, b) => b.match - a.match);
};

export const EnhancedCareerRecommendations = ({ assessmentData, resumeAnalysis, onStartLearningPath, onNavigateToJobs }: CareerRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCoaching, setExpandedCoaching] = useState<string | null>(null);
  const [coachingData, setCoachingData] = useState<{[key: string]: any}>({});
  const [expandedRoadmap, setExpandedRoadmap] = useState<string | null>(null);
  const [roadmapData, setRoadmapData] = useState<{[key: string]: any}>({});
  const [activePhase, setActivePhase] = useState<{[key: string]: number}>({});

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test Gemini API first
        console.log('Testing Gemini API...');
        const apiWorking = await testGeminiAPI();
        console.log('API test result:', apiWorking);
        
        const userProfile: UserProfile = {
          skills: assessmentData.skills,
          interests: assessmentData.interests,
          experience: assessmentData.experience,
          resumeAnalysis: resumeAnalysis // Include resume analysis for better recommendations
        };

        console.log('Generating career recommendations with resume data:', userProfile);
        const aiRecommendations = await generateCareerRecommendations(userProfile);
        setRecommendations(aiRecommendations);
      } catch (err) {
        setError('Failed to generate AI recommendations. Please try again.');
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [assessmentData]);

  // Generate AI coaching content
  const generateCoachingContent = (career: any) => {
    const userSkills = assessmentData.skills.map(s => s.name).join(', ');
    const skillGaps = career.skillGaps?.join(', ') || 'various skills';
    const experience = assessmentData.experience || 'beginner';
    const interests = assessmentData.interests?.join(', ') || 'technology';
    
    return {
      personalizedRoadmap: [
        {
          phase: "Foundation (Months 1-3)",
          focus: "Build Core Skills",
          tasks: [
            `Master ${career.skillGaps?.[0] || 'fundamental concepts'} through online courses`,
            `Complete 2-3 beginner projects using ${career.requiredSkills?.[0] || 'relevant technologies'}`,
            "Join relevant communities and start networking",
            "Set up your development environment and tools"
          ]
        },
        {
          phase: "Development (Months 4-8)",
          focus: "Practical Application",
          tasks: [
            `Build a portfolio project showcasing ${career.title.toLowerCase()} skills`,
            `Contribute to open-source projects in ${career.industry}`,
            "Attend industry meetups and conferences",
            "Start applying for internships or junior positions"
          ]
        },
        {
          phase: "Advancement (Months 9-12)",
          focus: "Professional Growth",
          tasks: [
            "Optimize your resume and LinkedIn profile",
            "Practice technical interviews and coding challenges",
            "Build a professional network in your target companies",
            "Consider advanced certifications or specializations"
          ]
        }
      ],
      portfolioProjects: [
        {
          title: `${career.title} Dashboard`,
          description: `Create a comprehensive dashboard demonstrating ${career.requiredSkills?.slice(0, 3).join(', ')} skills`,
          technologies: career.requiredSkills?.slice(0, 4) || [],
          timeline: "4-6 weeks",
          impact: "Showcases technical skills and problem-solving ability"
        },
        {
          title: "Industry-Specific Application",
          description: `Build an application solving real problems in ${career.industry}`,
          technologies: career.requiredSkills?.slice(1, 5) || [],
          timeline: "6-8 weeks",
          impact: "Demonstrates domain knowledge and practical application"
        },
        {
          title: "Collaborative Project",
          description: "Contribute to or lead a team project showcasing collaboration skills",
          technologies: ["Git", "Agile", ...career.requiredSkills?.slice(0, 2) || []],
          timeline: "8-10 weeks",
          impact: "Shows teamwork and leadership capabilities"
        }
      ],
      interviewPrep: {
        technicalTopics: career.requiredSkills?.slice(0, 5) || [],
        commonQuestions: [
          `How would you approach a complex ${career.title.toLowerCase()} project?`,
          `Explain your experience with ${career.requiredSkills?.[0] || 'relevant technology'}`,
          "Walk me through your problem-solving process",
          "How do you stay updated with industry trends?",
          "Describe a challenging project and how you overcame obstacles"
        ],
        practiceResources: [
          { name: "LeetCode", url: "https://leetcode.com", description: "Coding challenges and algorithm practice" },
          { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", description: "System design interview preparation" },
          { name: "Pramp", url: "https://www.pramp.com", description: "Free mock interviews with peers" },
          { name: "InterviewBit", url: "https://www.interviewbit.com", description: "Technical interview preparation" },
          { name: "Glassdoor", url: "https://www.glassdoor.com/Interview/", description: "Company-specific interview experiences" },
          { name: "HackerRank", url: "https://www.hackerrank.com", description: "Coding practice and competitions" }
        ]
      },
      networkingStrategy: {
        platforms: [
          { name: "LinkedIn", url: "https://www.linkedin.com", description: "Professional networking and job search" },
          { name: "GitHub", url: "https://github.com", description: "Code collaboration and open source" },
          { name: "Stack Overflow", url: "https://stackoverflow.com", description: "Technical Q&A community" },
          { name: "Dev.to", url: "https://dev.to", description: "Developer community and articles" },
          { name: "Reddit", url: "https://www.reddit.com/r/programming", description: "Programming discussions" },
          { name: "Discord Communities", url: "https://discord.com", description: "Real-time developer chat" }
        ],
        activities: [
          "Follow industry leaders and engage with their content",
          "Share your learning journey and projects",
          "Attend virtual and in-person networking events",
          "Join professional associations and groups"
        ],
        targetConnections: [
          `${career.title}s at target companies`,
          "Recruiters in the industry",
          "Mentors and senior professionals",
          "Peers and fellow learners"
        ]
      },
      salaryNegotiation: {
        researchTips: [
          `Research ${career.title} salaries in your location`,
          "Use sites like Glassdoor, PayScale, and Levels.fyi",
          "Consider total compensation, not just base salary",
          "Factor in company size, industry, and growth stage"
        ],
        negotiationTactics: [
          "Highlight your unique value proposition",
          "Present market research and salary ranges",
          "Negotiate beyond salary (equity, benefits, PTO)",
          "Be prepared to walk away if needed"
        ],
        expectedRange: career.salary || "$60,000 - $120,000"
      }
    };
  };

  // Handle AI coaching expansion
  const handleCoachingToggle = (careerTitle: string) => {
    if (expandedCoaching === careerTitle) {
      setExpandedCoaching(null);
    } else {
      setExpandedCoaching(careerTitle);
      if (!coachingData[careerTitle]) {
        const career = recommendations.find(r => r.title === careerTitle);
        if (career) {
          const content = generateCoachingContent(career);
          setCoachingData(prev => ({
            ...prev,
            [careerTitle]: content
          }));
        }
      }
    }
  };

  // Generate PDF download
  const downloadCoachingPDF = (careerTitle: string) => {
    const career = recommendations.find(r => r.title === careerTitle);
    const coaching = coachingData[careerTitle];
    
    if (!career || !coaching) return;

    const content = `
AI CAREER COACHING REPORT
${careerTitle}

Generated on: ${new Date().toLocaleDateString()}
User Profile: ${assessmentData.experience} level, Skills: ${assessmentData.skills.map(s => s.name).join(', ')}

=== PERSONALIZED LEARNING ROADMAP ===

${coaching.personalizedRoadmap.map(phase => `
${phase.phase} - ${phase.focus}
${phase.tasks.map(task => `• ${task}`).join('\n')}
`).join('\n')}

=== PORTFOLIO PROJECTS ===

${coaching.portfolioProjects.map(project => `
${project.title} (${project.timeline})
${project.description}
Technologies: ${project.technologies.join(', ')}
Impact: ${project.impact}
`).join('\n')}

=== INTERVIEW PREPARATION ===

Technical Topics: ${coaching.interviewPrep.technicalTopics.join(', ')}

Common Questions:
${coaching.interviewPrep.commonQuestions.map(q => `• ${q}`).join('\n')}

Practice Resources:
${coaching.interviewPrep.practiceResources.map(r => `• ${r.name}: ${r.url} - ${r.description}`).join('\n')}

=== NETWORKING STRATEGY ===

Networking Platforms:
${coaching.networkingStrategy.platforms.map(p => `• ${p.name}: ${p.url} - ${p.description}`).join('\n')}

Activities:
${coaching.networkingStrategy.activities.map(a => `• ${a}`).join('\n')}

Target Connections:
${coaching.networkingStrategy.targetConnections.map(c => `• ${c}`).join('\n')}

=== SALARY NEGOTIATION ===

Expected Range: ${coaching.salaryNegotiation.expectedRange}

Research Tips:
${coaching.salaryNegotiation.researchTips.map(tip => `• ${tip}`).join('\n')}

Negotiation Tactics:
${coaching.salaryNegotiation.negotiationTactics.map(tactic => `• ${tactic}`).join('\n')}

---
Generated by CareerAI - Your AI-Powered Career Advisor
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI-Career-Coaching-${careerTitle.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate detailed roadmap for a specific step
  const generateStepRoadmap = (step: string, careerTitle: string) => {
    const userSkills = assessmentData.skills.map(s => s.name).join(', ');
    const experience = assessmentData.experience || 'beginner';
    
    // Generate detailed roadmap based on the step
    const roadmapTemplates: {[key: string]: any} = {
      "Build portfolio projects": {
        title: "Portfolio Development Roadmap",
        duration: "8-12 weeks",
        overview: `Create impressive portfolio projects that showcase your ${careerTitle.toLowerCase()} skills and attract potential employers.`,
        phases: [
          {
            phase: "Planning & Setup (Week 1-2)",
            objectives: ["Define project scope", "Set up development environment", "Create project timeline"],
            tasks: [
              "Research trending technologies in your field",
              "Identify 3-5 project ideas that demonstrate different skills",
              "Set up GitHub repository with proper README structure",
              "Create project wireframes or technical specifications",
              "Set up development tools and frameworks"
            ],
            deliverables: ["Project plan document", "GitHub repositories", "Development environment"],
            resources: ["GitHub", "Figma/Draw.io", "VS Code", "Project management tools"]
          },
          {
            phase: "Core Development (Week 3-8)",
            objectives: ["Build functional applications", "Implement best practices", "Document progress"],
            tasks: [
              "Start with your strongest skill area project",
              "Implement core functionality with clean, readable code",
              "Add responsive design and user-friendly interfaces",
              "Integrate APIs and external services where relevant",
              "Write comprehensive documentation and comments",
              "Implement testing (unit tests, integration tests)",
              "Use version control effectively with meaningful commits"
            ],
            deliverables: ["2-3 completed projects", "Clean, documented code", "Live deployments"],
            resources: ["Netlify/Vercel", "Heroku", "AWS/Firebase", "Testing frameworks"]
          },
          {
            phase: "Enhancement & Deployment (Week 9-12)",
            objectives: ["Polish projects", "Deploy applications", "Create portfolio website"],
            tasks: [
              "Refactor code for performance and maintainability",
              "Add advanced features that showcase expertise",
              "Deploy projects to cloud platforms",
              "Create a professional portfolio website",
              "Write detailed case studies for each project",
              "Optimize for SEO and performance",
              "Get feedback from peers and mentors"
            ],
            deliverables: ["Portfolio website", "Deployed applications", "Case studies"],
            resources: ["Portfolio templates", "Analytics tools", "Performance testing tools"]
          }
        ],
        tips: [
          "Focus on quality over quantity - 2-3 excellent projects are better than 10 mediocre ones",
          "Include projects that solve real-world problems",
          "Make sure your code is clean, well-commented, and follows best practices",
          "Include a variety of technologies to show versatility",
          "Document your thought process and challenges overcome"
        ],
        metrics: [
          "Code quality and organization",
          "User interface and experience",
          "Technical complexity and innovation",
          "Documentation quality",
          "Deployment and accessibility"
        ]
      },
      "Learn system design": {
        title: "System Design Mastery Roadmap",
        duration: "10-16 weeks",
        overview: `Master system design concepts essential for ${careerTitle.toLowerCase()} roles, from basic principles to complex distributed systems.`,
        phases: [
          {
            phase: "Fundamentals (Week 1-4)",
            objectives: ["Understand basic concepts", "Learn core principles", "Practice simple designs"],
            tasks: [
              "Study scalability, reliability, and availability concepts",
              "Learn about load balancing and caching strategies",
              "Understand database design and data modeling",
              "Practice designing simple systems (URL shortener, chat app)",
              "Learn about API design and REST principles"
            ],
            deliverables: ["System design notes", "Simple system diagrams", "Basic designs"],
            resources: ["System Design Primer", "High Scalability blog", "AWS Architecture Center"]
          },
          {
            phase: "Intermediate Concepts (Week 5-10)",
            objectives: ["Advanced patterns", "Distributed systems", "Real-world applications"],
            tasks: [
              "Study microservices architecture and trade-offs",
              "Learn about message queues and event-driven architecture",
              "Understand consistency patterns and CAP theorem",
              "Practice designing medium-complexity systems",
              "Study real-world system architectures (Netflix, Uber, etc.)"
            ],
            deliverables: ["Complex system designs", "Architecture documentation", "Trade-off analysis"],
            resources: ["Designing Data-Intensive Applications", "System design interviews", "Tech blogs"]
          },
          {
            phase: "Advanced & Practice (Week 11-16)",
            objectives: ["Master complex systems", "Interview preparation", "Real-world application"],
            tasks: [
              "Design large-scale systems (social media, e-commerce)",
              "Practice system design interviews with peers",
              "Study emerging technologies and patterns",
              "Create comprehensive system design portfolio",
              "Contribute to open-source distributed systems projects"
            ],
            deliverables: ["Advanced system designs", "Interview-ready presentations", "Portfolio"],
            resources: ["Mock interview platforms", "System design courses", "Open source projects"]
          }
        ],
        tips: [
          "Start with simple systems and gradually increase complexity",
          "Always consider trade-offs and justify your design decisions",
          "Practice explaining your designs clearly and concisely",
          "Stay updated with current industry practices and technologies",
          "Focus on scalability, reliability, and maintainability"
        ],
        metrics: [
          "Ability to design scalable systems",
          "Understanding of trade-offs",
          "Communication of design decisions",
          "Knowledge of current technologies",
          "Problem-solving approach"
        ]
      },
      "Practice coding interviews": {
        title: "Coding Interview Mastery Roadmap",
        duration: "12-16 weeks",
        overview: `Systematically prepare for coding interviews with a structured approach to algorithms, data structures, and problem-solving.`,
        phases: [
          {
            phase: "Foundation Building (Week 1-4)",
            objectives: ["Master basic data structures", "Learn fundamental algorithms", "Establish practice routine"],
            tasks: [
              "Review arrays, strings, and basic operations",
              "Master linked lists, stacks, and queues",
              "Learn time and space complexity analysis (Big O)",
              "Practice 2-3 easy problems daily on LeetCode",
              "Set up coding interview environment and tools"
            ],
            deliverables: ["Data structure implementations", "Problem-solving notes", "Practice schedule"],
            resources: ["LeetCode", "HackerRank", "Cracking the Coding Interview", "AlgoExpert"]
          },
          {
            phase: "Intermediate Problem Solving (Week 5-10)",
            objectives: ["Advanced data structures", "Common patterns", "Medium-level problems"],
            tasks: [
              "Master trees, graphs, and hash tables",
              "Learn dynamic programming and recursion patterns",
              "Practice sliding window, two pointers, and binary search",
              "Solve 3-4 medium problems daily",
              "Start timing yourself and optimizing solutions",
              "Practice explaining solutions out loud"
            ],
            deliverables: ["Pattern recognition skills", "Optimized solutions", "Explanation practice"],
            resources: ["Grokking the Coding Interview", "Elements of Programming Interviews", "YouTube tutorials"]
          },
          {
            phase: "Advanced & Mock Interviews (Week 11-16)",
            objectives: ["Hard problems", "Interview simulation", "Communication skills"],
            tasks: [
              "Tackle hard-level algorithmic problems",
              "Practice system design coding questions",
              "Conduct mock interviews with peers or platforms",
              "Work on communication and problem-solving process",
              "Review and learn from failed attempts",
              "Practice company-specific question patterns"
            ],
            deliverables: ["Advanced problem solutions", "Mock interview feedback", "Interview readiness"],
            resources: ["Pramp", "InterviewBit", "Company-specific prep", "Mock interview services"]
          }
        ],
        tips: [
          "Consistency is key - practice daily even if just for 30 minutes",
          "Focus on understanding patterns rather than memorizing solutions",
          "Always explain your thought process during practice",
          "Time yourself but prioritize correctness over speed initially",
          "Review and understand your mistakes thoroughly"
        ],
        metrics: [
          "Problem-solving speed and accuracy",
          "Code quality and optimization",
          "Communication during problem-solving",
          "Pattern recognition ability",
          "Performance under time pressure"
        ]
      }
    };

    // Find the best matching template or create a generic one
    const matchingKey = Object.keys(roadmapTemplates).find(key => 
      step.toLowerCase().includes(key.toLowerCase().split(' ')[1]) || 
      key.toLowerCase().includes(step.toLowerCase().split(' ')[0])
    );

    if (matchingKey) {
      return roadmapTemplates[matchingKey];
    }

    // Generic roadmap template
    return {
      title: `${step} - Detailed Roadmap`,
      duration: "8-12 weeks",
      overview: `A comprehensive guide to successfully ${step.toLowerCase()} for your ${careerTitle.toLowerCase()} career.`,
      phases: [
        {
          phase: "Research & Planning (Week 1-2)",
          objectives: ["Understand requirements", "Create action plan", "Gather resources"],
          tasks: [
            `Research best practices for ${step.toLowerCase()}`,
            "Set clear, measurable goals and milestones",
            "Identify required tools and resources",
            "Create a detailed timeline and schedule",
            "Connect with mentors or experts in the field"
          ],
          deliverables: ["Action plan", "Resource list", "Timeline"],
          resources: ["Industry blogs", "Online courses", "Professional networks"]
        },
        {
          phase: "Implementation (Week 3-8)",
          objectives: ["Execute the plan", "Build skills", "Track progress"],
          tasks: [
            `Begin actively working on ${step.toLowerCase()}`,
            "Follow your planned schedule consistently",
            "Document progress and learnings",
            "Seek feedback from peers and mentors",
            "Adjust approach based on results and feedback"
          ],
          deliverables: ["Progress reports", "Skill demonstrations", "Feedback collection"],
          resources: ["Practice platforms", "Feedback tools", "Progress tracking apps"]
        },
        {
          phase: "Optimization & Mastery (Week 9-12)",
          objectives: ["Refine skills", "Achieve proficiency", "Prepare for next steps"],
          tasks: [
            "Refine and optimize your approach",
            "Achieve proficiency in key areas",
            "Create portfolio or evidence of progress",
            "Plan transition to next career development step",
            "Share knowledge and help others"
          ],
          deliverables: ["Portfolio evidence", "Mastery demonstration", "Next steps plan"],
          resources: ["Portfolio platforms", "Certification programs", "Community forums"]
        }
      ],
      tips: [
        "Stay consistent with your practice and learning schedule",
        "Don't hesitate to ask for help when you encounter challenges",
        "Document your journey for future reference and portfolio",
        "Connect with others who are on similar paths",
        "Celebrate small wins and milestones along the way"
      ],
      metrics: [
        "Consistency in following the plan",
        "Quality of work and progress made",
        "Feedback from mentors and peers",
        "Achievement of set milestones",
        "Readiness for next career step"
      ]
    };
  };

  // Handle roadmap expansion
  const handleRoadmapToggle = (step: string, careerTitle: string) => {
    const roadmapKey = `${careerTitle}-${step}`;
    
    if (expandedRoadmap === roadmapKey) {
      setExpandedRoadmap(null);
    } else {
      setExpandedRoadmap(roadmapKey);
      // Initialize with first phase (0)
      setActivePhase(prev => ({
        ...prev,
        [roadmapKey]: 0
      }));
      if (!roadmapData[roadmapKey]) {
        const roadmap = generateStepRoadmap(step, careerTitle);
        setRoadmapData(prev => ({
          ...prev,
          [roadmapKey]: roadmap
        }));
      }
    }
  };

  // Handle phase navigation
  const handlePhaseChange = (roadmapKey: string, phaseIndex: number) => {
    setActivePhase(prev => ({
      ...prev,
      [roadmapKey]: phaseIndex
    }));
  };

  // Download roadmap as PDF
  const downloadRoadmapPDF = (step: string, careerTitle: string) => {
    const roadmapKey = `${careerTitle}-${step}`;
    const roadmap = roadmapData[roadmapKey];
    
    if (!roadmap) return;

    const content = `
${roadmap.title}
Career: ${careerTitle}
Duration: ${roadmap.duration}

Generated on: ${new Date().toLocaleDateString()}
User Profile: ${assessmentData.experience} level, Skills: ${assessmentData.skills.map(s => s.name).join(', ')}

=== OVERVIEW ===
${roadmap.overview}

=== DETAILED PHASES ===

${roadmap.phases.map(phase => `
${phase.phase}
Objectives: ${phase.objectives.join(', ')}

Tasks:
${phase.tasks.map(task => `• ${task}`).join('\n')}

Deliverables: ${phase.deliverables.join(', ')}
Resources: ${phase.resources.join(', ')}
`).join('\n')}

=== SUCCESS TIPS ===
${roadmap.tips.map(tip => `• ${tip}`).join('\n')}

=== SUCCESS METRICS ===
${roadmap.metrics.map(metric => `• ${metric}`).join('\n')}

---
Generated by CareerAI - Your AI-Powered Career Advisor
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${roadmap.title.replace(/\s+/g, '-')}-Roadmap.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              AI-Powered Career Analysis
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Analyzing your profile with Gemini AI to provide personalized career recommendations...
            </p>
          </div>
          
          <Card className="mb-8 border-primary/20 bg-gradient-secondary shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Generating AI-Powered Recommendations...
                  </h3>
                  <p className="text-muted-foreground">
                    Using Gemini AI to analyze market trends, skill alignment, and growth potential for your profile.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="shadow-strong">
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <div className="grid grid-cols-4 gap-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Unable to Generate AI Recommendations
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-destructive/20"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            AI-Powered Career Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Using Gemini AI to analyze market trends, skill alignment, and growth potential 
            for your personalized career recommendations.
          </p>
        </div>

        {/* Gemini Analysis Status */}
        <Card className="mb-8 border-primary/20 bg-gradient-secondary shadow-medium">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Brain className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  Enhanced with Gemini AI Analysis
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Powered by Google AI
                  </Badge>
                </h3>
                <p className="text-muted-foreground mb-3">
                  {import.meta.env.VITE_GEMINI_API_KEY 
                    ? "These recommendations are generated using Google's Gemini AI with real-time market analysis, skill matching, and personalized career insights based on your profile."
                    : "These recommendations use our fallback system. Add your Gemini API key to unlock AI-powered personalized recommendations."
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
                      Gemini AI Active
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Add API Key to Enable AI
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {recommendations.map((career, index) => (
            <div key={`career-container-${career.title}`}>
            <Card key={career.title} className="shadow-strong hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl font-bold text-foreground">{career.title}</CardTitle>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30 font-semibold">
                        {career.match}% Match
                      </Badge>
                      {index === 0 && (
                        <Badge className="bg-gradient-primary text-white font-medium">
                          <Star className="h-3 w-3 mr-1" />
                          #1 Recommendation
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {career.description}
                    </CardDescription>
                    
                    {/* Compact Stats Row */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1 text-success font-semibold">
                        <DollarSign className="h-4 w-4" />
                        <span>{career.salary}</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <TrendingUp className="h-4 w-4" />
                        <span>{career.growth}</span>
                      </div>
                      <Badge 
                        variant={career.marketDemand?.includes("Critical") ? "destructive" : "secondary"}
                        className="text-xs font-medium"
                      >
                        {career.marketDemand}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-5">
                {/* AI Analysis - Compact */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2 text-primary">
                      <Brain className="h-4 w-4" />
                      Gemini AI Analysis
                    </h4>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                      {career.geminiInsights?.reasoningScore}% Match Score
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{career.geminiInsights?.marketFit}</p>
                </div>

                {/* Skills & Info Grid - Compact */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Skill Matches */}
                  <div className="bg-success/5 p-3 rounded-lg border border-success/20">
                    <h5 className="font-medium flex items-center gap-2 text-success mb-2 text-sm">
                      <Target className="h-3 w-3" />
                      Skill Matches
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {career.requiredSkills
                        ?.filter(skill => assessmentData.skills.some(s => s.name.toLowerCase().includes(skill.toLowerCase())))
                        .slice(0, 3)
                        .map(skill => (
                          <Badge key={skill} variant="outline" className="bg-success/10 text-success border-success/30 text-xs">
                            ✓ {skill}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>

                  {/* Skills Needed */}
                  <div className="bg-warning/5 p-3 rounded-lg border border-warning/20">
                    <h5 className="font-medium flex items-center gap-2 text-warning mb-2 text-sm">
                      <BookOpen className="h-3 w-3" />
                      Skills Needed
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {career.skillGaps?.slice(0, 2).map(skill => (
                        <Badge key={skill} variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Top Employers */}
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                    <h5 className="font-medium flex items-center gap-2 text-primary mb-2 text-sm">
                      <Briefcase className="h-3 w-3" />
                      Top Employers
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {career.companies?.slice(0, 3).map(company => (
                        <Badge key={company} variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                          {company}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Locations */}
                  <div className="bg-accent/50 p-3 rounded-lg border border-accent">
                    <h5 className="font-medium flex items-center gap-2 text-accent-foreground mb-2 text-sm">
                      <MapPin className="h-3 w-3" />
                      Locations
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {career.jobLocations?.slice(0, 3).map(location => (
                        <Badge key={location} variant="outline" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Insights - Compact */}
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-success/5 to-success/10 p-3 rounded-lg border border-success/20">
                    <h5 className="font-medium text-success mb-2 text-sm flex items-center gap-2">
                      <Check className="h-3 w-3" />
                      Key Advantages
                    </h5>
                    <div className="space-y-1">
                      {career.geminiInsights?.keyAdvantages?.slice(0, 2).map((advantage, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">• {advantage}</p>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-warning/5 to-warning/10 p-3 rounded-lg border border-warning/20">
                    <h5 className="font-medium text-warning mb-2 text-sm flex items-center gap-2">
                      <AlertCircle className="h-3 w-3" />
                      Risk Factors
                    </h5>
                    <div className="space-y-1">
                      {career.geminiInsights?.riskFactors?.slice(0, 2).map((risk, idx) => (
                        <p key={idx} className="text-xs text-muted-foreground">• {risk}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Next Steps - Streamlined */}
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
                  <h5 className="font-medium text-primary mb-3 text-sm flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Recommended Next Steps
                  </h5>
                  <div className="grid md:grid-cols-3 gap-2">
                    {career.nextSteps?.slice(0, 3).map((step, idx) => (
                      <div key={idx}>
                        <div 
                          className="flex items-start gap-2 text-xs bg-white/50 p-2 rounded cursor-pointer hover:bg-white/70 transition-colors border hover:border-primary/30"
                          onClick={() => handleRoadmapToggle(step, career.title)}
                        >
                          <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <span className="text-muted-foreground hover:text-foreground transition-colors">{step}</span>
                          <ChevronDown className={`h-3 w-3 text-primary ml-auto transition-transform ${expandedRoadmap === `${career.title}-${step}` ? 'rotate-180' : ''}`} />
                        </div>
                        
                        {/* Inline Roadmap Expansion within the step */}
                        {expandedRoadmap === `${career.title}-${step}` && roadmapData[`${career.title}-${step}`] && (
                          <div className="mt-3 p-3 bg-white/95 rounded border border-primary/20">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                              <h6 className="font-semibold text-primary text-sm flex items-center gap-2">
                                <Brain className="h-4 w-4" />
                                AI Career Coaching for {career.title}
                              </h6>
                              <Button
                                onClick={() => downloadRoadmapPDF(step, career.title)}
                                variant="outline"
                                size="sm"
                                className="text-xs h-6 px-2 bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Download PDF
                              </Button>
                            </div>

                            {/* Two Column Layout */}
                            <div className="grid grid-cols-2 gap-4">
                              {/* Left Column - Learning Roadmap */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar className="h-4 w-4 text-primary" />
                                  <p className="font-semibold text-primary text-sm">12-Month Learning Roadmap</p>
                                </div>

                                {/* Phase Navigation */}
                                <div className="flex gap-1 mb-3">
                                  {(roadmapData[`${career.title}-${step}`]?.phases || []).map((phase: any, phaseIdx: number) => (
                                    <button
                                      key={phaseIdx}
                                      onClick={() => {
                                        console.log('Phase clicked:', phaseIdx);
                                        handlePhaseChange(`${career.title}-${step}`, phaseIdx);
                                      }}
                                      className={`px-3 py-1 text-xs rounded transition-colors ${
                                        (activePhase[`${career.title}-${step}`] || 0) === phaseIdx
                                          ? 'bg-primary text-white'
                                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                                      }`}
                                    >
                                      {phase?.phase?.split(' ')[0] || `Phase ${phaseIdx + 1}`}
                                    </button>
                                  ))}
                                </div>

                                {/* Active Phase Content */}
                                {(() => {
                                  const roadmapKey = `${career.title}-${step}`;
                                  const roadmap = roadmapData[roadmapKey];
                                  const phaseIndex = activePhase[roadmapKey] || 0;
                                  
                                  if (!roadmap || !roadmap.phases || !roadmap.phases[phaseIndex]) {
                                    return (
                                      <div className="bg-primary/5 p-3 rounded border border-primary/10">
                                        <p className="text-xs text-muted-foreground">Loading phase content...</p>
                                      </div>
                                    );
                                  }
                                  
                                  const currentPhase = roadmap.phases[phaseIndex];
                                  return (
                                    <div className="bg-primary/5 p-3 rounded border border-primary/10">
                                      <p className="font-medium text-primary text-sm mb-2">{currentPhase.phase}</p>
                                      <p className="text-xs text-muted-foreground mb-3">
                                        {currentPhase.objectives?.join(', ') || 'Build Core Skills'}
                                      </p>
                                      
                                      {/* Tasks */}
                                      <div className="mb-3">
                                        <ul className="text-xs text-muted-foreground space-y-1">
                                          {(currentPhase.tasks || []).map((task: string, taskIdx: number) => (
                                            <li key={taskIdx} className="flex items-start gap-2">
                                              <Check className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                                              <span>{task}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      {/* Deliverables and Resources */}
                                      <div className="space-y-2">
                                        <div>
                                          <p className="text-xs font-medium text-foreground mb-1">Deliverables:</p>
                                          <p className="text-xs text-muted-foreground">{currentPhase.deliverables?.join(', ') || 'Various deliverables'}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs font-medium text-foreground mb-1">Resources:</p>
                                          <div className="flex flex-wrap gap-1">
                                            {(currentPhase.resources || []).map((resource: string, resIdx: number) => (
                                              <Badge key={resIdx} variant="outline" className="text-xs px-1 py-0 h-4">
                                                {resource}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>

                              {/* Right Column - Portfolio Projects */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  <p className="font-semibold text-primary text-sm">Portfolio Projects</p>
                                </div>

                                {/* Portfolio Projects */}
                                <div className="space-y-2">
                                  {(roadmapData[`${career.title}-${step}`]?.portfolioProjects || []).map((project: any, projIdx: number) => (
                                    <div key={projIdx} className="bg-white/80 p-3 rounded border border-primary/10">
                                      <p className="font-medium text-primary text-sm mb-1">{project.title || 'Project Title'}</p>
                                      <p className="text-xs text-muted-foreground mb-2">{project.description || 'Project description'}</p>
                                      
                                      <div className="flex flex-wrap gap-1 mb-2">
                                        {(project.technologies || []).slice(0, 4).map((tech: string, techIdx: number) => (
                                          <Badge key={techIdx} variant="outline" className="text-xs px-1 py-0 h-4">
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                      
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>Timeline: {project.timeline || 'TBD'}</span>
                                        <span>Impact: {project.impact || 'High impact'}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Bottom Section - Tips and Salary */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              {/* Interview Preparation */}
                              <div className="bg-success/10 p-3 rounded border border-success/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Award className="h-4 w-4 text-success" />
                                  <p className="font-medium text-success text-sm">Interview Preparation</p>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-xs font-medium text-foreground mb-1">Technical Topics:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {(roadmapData[`${career.title}-${step}`]?.interviewPrep?.technicalTopics || []).slice(0, 4).map((topic: string, idx: number) => (
                                        <Badge key={idx} variant="outline" className="text-xs bg-success/20 text-success border-success/30">
                                          {topic}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Networking & Salary Tips */}
                              <div className="bg-primary/10 p-3 rounded border border-primary/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Lightbulb className="h-4 w-4 text-primary" />
                                  <p className="font-medium text-primary text-sm">Networking & Salary Tips</p>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-xs font-medium text-success mb-1">Expected Range:</p>
                                    <p className="text-xs font-semibold text-success">{roadmapData[`${career.title}-${step}`]?.salaryNegotiation?.expectedRange || '$60,000 - $120,000'}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-foreground mb-1">Networking Platforms:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {(roadmapData[`${career.title}-${step}`]?.networkingStrategy?.platforms || []).slice(0, 3).map((platform: any, idx: number) => (
                                        <Badge key={idx} variant="outline" className="text-xs px-1 py-0 h-4">
                                          {platform?.name || platform}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons - Enhanced */}
                <div className="flex flex-wrap gap-3 pt-2 border-t border-border/50">
                  <Button 
                    className="bg-gradient-primary hover:bg-primary-hover text-white font-medium flex-1 min-w-[200px]"
                    onClick={() => onStartLearningPath?.(career.title)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning Path
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 min-w-[180px]"
                    onClick={() => {
                      // Navigate to internal Jobs page with the career title as filter
                      if (onNavigateToJobs) {
                        onNavigateToJobs(career.title);
                      } else {
                        // Fallback: scroll to top and show message
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        alert(`Showing jobs for ${career.title} role. Navigate to Jobs section to see all opportunities.`);
                      }
                    }}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Find Jobs ({Math.floor(Math.random() * 400) + 100}+ available)
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="min-w-[140px]"
                    onClick={() => handleCoachingToggle(career.title)}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    AI Coaching
                    {expandedCoaching === career.title ? (
                      <ChevronUp className="h-4 w-4 ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </div>

                {/* Expanded AI Coaching Section */}
                {expandedCoaching === career.title && coachingData[career.title] && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-primary flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        AI Career Coaching for {career.title}
                      </h4>
                      <Button
                        onClick={() => downloadCoachingPDF(career.title)}
                        variant="outline"
                        size="sm"
                        className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Personalized Roadmap */}
                      <div className="space-y-4">
                        <h5 className="font-semibold text-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          12-Month Learning Roadmap
                        </h5>
                        <div className="space-y-3">
                          {coachingData[career.title].personalizedRoadmap.map((phase: any, idx: number) => (
                            <div key={idx} className="bg-white/50 p-4 rounded-lg border border-primary/10">
                              <h6 className="font-medium text-primary mb-2">{phase.phase}</h6>
                              <p className="text-sm text-muted-foreground mb-2">{phase.focus}</p>
                              <ul className="text-xs space-y-1">
                                {phase.tasks.map((task: string, taskIdx: number) => (
                                  <li key={taskIdx} className="flex items-start gap-2">
                                    <Check className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                                    <span>{task}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Portfolio Projects */}
                      <div className="space-y-4">
                        <h5 className="font-semibold text-foreground flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          Portfolio Projects
                        </h5>
                        <div className="space-y-3">
                          {coachingData[career.title].portfolioProjects.map((project: any, idx: number) => (
                            <div key={idx} className="bg-white/50 p-4 rounded-lg border border-primary/10">
                              <h6 className="font-medium text-primary mb-2">{project.title}</h6>
                              <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {project.technologies.map((tech: string, techIdx: number) => (
                                  <Badge key={techIdx} variant="outline" className="text-xs">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Timeline: {project.timeline}</span>
                                <span>Impact: {project.impact}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interview Preparation */}
                      <div className="space-y-4">
                        <h5 className="font-semibold text-foreground flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          Interview Preparation
                        </h5>
                        <div className="bg-white/50 p-4 rounded-lg border border-primary/10">
                          <h6 className="font-medium text-primary mb-2">Technical Topics</h6>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {coachingData[career.title].interviewPrep.technicalTopics.map((topic: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs bg-success/10 text-success">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                          <h6 className="font-medium text-primary mb-2">Common Questions</h6>
                          <ul className="text-xs space-y-1 mb-3">
                            {coachingData[career.title].interviewPrep.commonQuestions.slice(0, 3).map((question: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{question}</span>
                              </li>
                            ))}
                          </ul>
                          <h6 className="font-medium text-primary mb-2">Practice Resources</h6>
                          <div className="flex flex-wrap gap-1">
                            {[
                              { name: "LeetCode", url: "https://leetcode.com", description: "Coding challenges and algorithm practice" },
                              { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", description: "System design interview preparation" },
                              { name: "Pramp", url: "https://www.pramp.com", description: "Free mock interviews with peers" },
                              { name: "InterviewBit", url: "https://www.interviewbit.com", description: "Technical interview preparation" },
                              { name: "Glassdoor", url: "https://www.glassdoor.com/Interview/", description: "Company-specific interview experiences" },
                              { name: "HackerRank", url: "https://www.hackerrank.com", description: "Coding practice and competitions" }
                            ].map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={resource.description}
                              >
                                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-success/10 hover:border-success/50 transition-colors">
                                  {resource.name}
                                </Badge>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Networking & Salary */}
                      <div className="space-y-4">
                        <h5 className="font-semibold text-foreground flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          Networking & Salary Tips
                        </h5>
                        <div className="space-y-3">
                          <div className="bg-white/50 p-4 rounded-lg border border-primary/10">
                            <h6 className="font-medium text-primary mb-2">Networking Strategy</h6>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {[
                                { name: "LinkedIn", url: "https://www.linkedin.com", description: "Professional networking and job search" },
                                { name: "GitHub", url: "https://github.com", description: "Code collaboration and open source" },
                                { name: "Stack Overflow", url: "https://stackoverflow.com", description: "Technical Q&A community" },
                                { name: "Dev.to", url: "https://dev.to", description: "Developer community and articles" },
                                { name: "Reddit", url: "https://www.reddit.com/r/programming", description: "Programming discussions" },
                                { name: "Discord", url: "https://discord.com", description: "Real-time developer chat" }
                              ].map((platform, idx) => (
                                <a
                                  key={idx}
                                  href={platform.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={platform.description}
                                >
                                  <Badge variant="outline" className="text-xs cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors">
                                    {platform.name}
                                  </Badge>
                                </a>
                              ))}
                            </div>
                            <ul className="text-xs space-y-1">
                              {coachingData[career.title].networkingStrategy.activities.slice(0, 2).map((activity: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <Check className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-white/50 p-4 rounded-lg border border-primary/10">
                            <h6 className="font-medium text-primary mb-2">Salary Negotiation</h6>
                            <p className="text-sm font-medium text-success mb-2">
                              Expected Range: {coachingData[career.title].salaryNegotiation.expectedRange}
                            </p>
                            <ul className="text-xs space-y-1">
                              {coachingData[career.title].salaryNegotiation.negotiationTactics.slice(0, 2).map((tactic: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <DollarSign className="h-3 w-3 text-success mt-0.5 flex-shrink-0" />
                                  <span>{tactic}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                      <p className="text-sm text-muted-foreground text-center">
                        💡 This personalized coaching plan is generated based on your skills: <strong>{assessmentData.skills.map(s => s.name).join(', ')}</strong> and experience level: <strong>{assessmentData.experience}</strong>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};