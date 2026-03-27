import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SkillsAssessment } from "@/components/SkillsAssessment";
import { EnhancedCareerRecommendations } from "@/components/EnhancedCareerRecommendations";
import { MarketIntelligence } from "@/components/MarketIntelligence";
import { LearningPaths } from "@/components/LearningPaths";
import { JobRecommendations } from "@/components/JobRecommendations";
import { ResumeAnalysisResult } from "@/lib/gemini";

interface AssessmentData {
  skills: Array<{ name: string; level: number }>;
  interests: string[];
  experience: string;
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<string>('hero');
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [jobFilter, setJobFilter] = useState<string>("");

  useEffect(() => {
    if (!loading && user) {
      // Load user's assessment data if exists
      loadUserAssessment();
    } else if (!loading && !user) {
      // Clear data when user logs out
      setAssessmentData(null);
      setResumeAnalysis(null);
      setHasCompletedAssessment(false);
      setCurrentPage('hero');
    }
  }, [user, loading]);

  // Periodic check to ensure data persistence
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const resumeKey = `resume_analysis_${user.id}`;
      const savedResumeAnalysis = localStorage.getItem(resumeKey);
      
      // If we have resume analysis in state but not in localStorage, save it
      if (resumeAnalysis && !savedResumeAnalysis) {
        console.log('Re-saving resume analysis to localStorage');
        localStorage.setItem(resumeKey, JSON.stringify(resumeAnalysis));
      }
      
      // If we don't have resume analysis in state but it exists in localStorage, load it
      if (!resumeAnalysis && savedResumeAnalysis) {
        try {
          console.log('Re-loading resume analysis from localStorage');
          const parsedAnalysis = JSON.parse(savedResumeAnalysis);
          setResumeAnalysis(parsedAnalysis);
        } catch (error) {
          console.error('Error re-loading resume analysis:', error);
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [user, resumeAnalysis]);

  // Handle URL parameters for new users
  useEffect(() => {
    const page = searchParams.get('page');
    const newUserParam = searchParams.get('newUser');
    
    if (!loading && user && page === 'assessment' && newUserParam === 'true') {
      // New user should go directly to assessment
      setCurrentPage('assessment');
      setIsNewUser(true);
      // Clean up URL parameters
      setSearchParams({});
    }
  }, [searchParams, user, loading, setSearchParams]);

  const loadUserAssessment = async () => {
    if (!user) return;
    
    console.log('Loading user assessment for user:', user.id);
    
    // Load assessment from localStorage for now
    // TODO: Replace with API call to Prisma backend
    const assessmentKey = `assessment_${user.id}`;
    const resumeKey = `resume_analysis_${user.id}`;
    const savedAssessment = localStorage.getItem(assessmentKey);
    const savedResumeAnalysis = localStorage.getItem(resumeKey);
    
    console.log('Saved assessment:', savedAssessment ? 'Found' : 'Not found');
    console.log('Saved resume analysis:', savedResumeAnalysis ? 'Found' : 'Not found');
    
    // Always load resume analysis if available, regardless of assessment
    if (savedResumeAnalysis) {
      try {
        const resumeAnalysis = JSON.parse(savedResumeAnalysis);
        console.log('Loading resume analysis:', resumeAnalysis);
        setResumeAnalysis(resumeAnalysis);
      } catch (error) {
        console.error('Error parsing resume analysis:', error);
      }
    }
    
    if (savedAssessment) {
      try {
        const assessment = JSON.parse(savedAssessment);
        setAssessmentData({
          skills: assessment.skills || [],
          interests: assessment.interests || [],
          experience: assessment.experience || ''
        });
        
        setHasCompletedAssessment(true);
        // Only redirect to careers if we're still on hero page
        if (currentPage === 'hero') {
          setCurrentPage('careers');
        }
      } catch (error) {
        console.error('Error loading assessment:', error);
      }
    }
  };

  const handleGetStarted = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentPage('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssessmentComplete = async (data: AssessmentData, resumeAnalysisData?: ResumeAnalysisResult) => {
    if (!user) return;

    console.log('Saving assessment data:', data);
    console.log('Saving resume analysis:', resumeAnalysisData);

    // Save to localStorage for now
    // TODO: Replace with API call to Prisma backend
    try {
      const assessmentKey = `assessment_${user.id}`;
      const assessmentToSave = {
        skills: data.skills,
        interests: data.interests,
        experience: data.experience,
        completedAt: new Date().toISOString()
      };
      
      localStorage.setItem(assessmentKey, JSON.stringify(assessmentToSave));
      console.log('Assessment saved to localStorage');

      // Save resume analysis if available
      if (resumeAnalysisData) {
        const resumeKey = `resume_analysis_${user.id}`;
        localStorage.setItem(resumeKey, JSON.stringify(resumeAnalysisData));
        setResumeAnalysis(resumeAnalysisData);
        console.log('Resume analysis saved to localStorage');
        
        // Double-check the save worked
        const verifyResume = localStorage.getItem(resumeKey);
        if (verifyResume) {
          console.log('Resume analysis save verified');
        } else {
          console.error('Resume analysis save failed verification');
        }
      }

      setAssessmentData(data);
      setHasCompletedAssessment(true);
      setIsNewUser(false); // Reset new user flag after assessment
      setCurrentPage('careers');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const handleNavigate = (page: string) => {
    if (page === 'dashboard') {
      // Dashboard should show resume feedback/analysis, not careers
      if (resumeAnalysis) {
        setCurrentPage('dashboard'); // Show resume feedback
      } else {
        setCurrentPage('assessment'); // New user, go to assessment to get resume analysis
      }
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLearningPath = (careerTitle: string) => {
    console.log('Starting learning path for:', careerTitle);
    setCurrentPage('learning');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToJobs = (jobTitle?: string) => {
    console.log('Navigating to jobs for:', jobTitle);
    setJobFilter(jobTitle || "");
    setCurrentPage('jobs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'hero':
        return <HeroSection onGetStarted={handleGetStarted} />;
      
      case 'assessment':
        return (
          <SkillsAssessment 
            onComplete={handleAssessmentComplete} 
            isNewUser={isNewUser}
            existingData={assessmentData}
            existingResumeAnalysis={resumeAnalysis}
          />
        );
      
      case 'dashboard':
        // Dashboard shows resume feedback/analysis
        if (!user) {
          return <HeroSection onGetStarted={handleGetStarted} />;
        }
        
        if (!resumeAnalysis) {
          return (
            <div className="container mx-auto px-6 py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Upload Your Resume First</h2>
              <p className="text-muted-foreground mb-8">
                To see your resume feedback and analysis, please upload your resume in the assessment section.
              </p>
              <button 
                onClick={() => setCurrentPage('assessment')}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
              >
                Upload Resume
              </button>
            </div>
          );
        }
        
        return (
          <SkillsAssessment 
            onComplete={handleAssessmentComplete} 
            isNewUser={false}
            existingData={assessmentData}
            existingResumeAnalysis={resumeAnalysis}
          />
        );
      
      case 'careers':
        // Always allow access to careers page if user is logged in
        if (!user) {
          return <HeroSection onGetStarted={handleGetStarted} />;
        }
        
        // If no assessment data, show a message to complete assessment first
        if (!assessmentData) {
          return (
            <div className="container mx-auto px-6 py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Complete Your Assessment First</h2>
              <p className="text-muted-foreground mb-8">
                To get personalized career recommendations, please complete your skills assessment.
              </p>
              <button 
                onClick={() => setCurrentPage('assessment')}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90"
              >
                Start Assessment
              </button>
            </div>
          );
        }
        
        return (
          <EnhancedCareerRecommendations 
            assessmentData={assessmentData}
            resumeAnalysis={resumeAnalysis}
            onStartLearningPath={handleStartLearningPath}
            onNavigateToJobs={handleNavigateToJobs}
          />
        );
      
      case 'learning':
        return (
          <LearningPaths 
            userSkills={assessmentData?.skills} 
            userInterests={assessmentData?.interests}
            userExperience={assessmentData?.experience}
          />
        );
      
      case 'jobs':
        return (
          <JobRecommendations 
            userSkills={assessmentData?.skills} 
            userInterests={assessmentData?.interests}
            userExperience={assessmentData?.experience}
            filterByRole={jobFilter}
          />
        );
      
      case 'market':
        return <MarketIntelligence />;
      
      default:
        return <HeroSection onGetStarted={handleGetStarted} />;
    }
  };

  const showNavigation = currentPage !== 'hero' && user;
  
  // Determine the navigation page for highlighting
  const getNavigationPage = () => {
    // Always return the actual current page for proper navigation highlighting
    return currentPage;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your career advisor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {showNavigation && (
        <Navigation 
          currentPage={getNavigationPage()} 
          onNavigate={handleNavigate} 
        />
      )}
      
      {renderContent()}
    </div>
  );
};

export default Index;
