import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
} else {
  console.log('Gemini API key found, initializing AI service...');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface CareerRecommendation {
  title: string;
  description: string;
  matchScore: number;
  match?: number; // For compatibility with existing component
  requiredSkills: string[];
  salaryRange: string;
  salary?: string; // For compatibility
  growthProspects: string;
  growth?: string; // For compatibility
  learningPath: string[];
  skillGaps?: string[];
  companies?: string[];
  jobLocations?: string[];
  marketDemand?: string;
  nextSteps?: string[];
  geminiInsights?: {
    reasoningScore: number;
    marketFit: string;
    riskFactors: string[];
    keyAdvantages: string[];
  };
}

export interface LearningRecommendation {
  skill: string;
  courses: Array<{
    title: string;
    provider: string;
    duration: string;
    difficulty: string;
    description: string;
  }>;
}

export interface ResumeAnalysisResult {
  // Legacy fields for backward compatibility
  skills: string[];
  experience: string;
  education: string[];
  summary: string;
  recommendations: string[];
  aiReasoning?: {
    strengthsAnalysis: string;
    experienceAssessment: string;
    skillGapAnalysis: string;
    careerTrajectory: string;
    marketPosition: string;
  };
  extractedInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    workExperience: Array<{
      company: string;
      position: string;
      duration: string;
      description: string;
    }>;
    projects?: Array<{
      name: string;
      description: string;
      technologies: string[];
      impact?: string;
    }>;
  };
  
  // New detailed analysis format
  detailedAnalysis?: {
    executiveSummary: string;
    overallScore: {
      resumeScore: number; // 0-100
      atsCompatibility: 'Excellent' | 'Good' | 'Fair' | 'Poor';
      professionalLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
    };
    strengths: Array<{
      title: string;
      description: string;
      examples: string[];
    }>;
    areasForImprovement: Array<{
      title: string;
      description: string;
      actionableSteps: string[];
      priority: 'High' | 'Medium' | 'Low';
    }>;
    missingElements: Array<{
      element: string;
      importance: string;
      suggestion: string;
    }>;
    sectionBreakdown: {
      contactInfo: { rating: number; feedback: string; };
      professionalSummary: { rating: number; feedback: string; };
      workExperience: { rating: number; feedback: string; };
      education: { rating: number; feedback: string; };
      skills: { rating: number; feedback: string; };
      additionalSections: { rating: number; feedback: string; };
    };
    atsOptimization: {
      keywordDensity: string;
      formatCompatibility: string;
      parsingIssues: string[];
      recommendations: string[];
    };
    industryInsights: {
      targetIndustry: string;
      industryStandards: string;
      marketTrends: string[];
      competitivePosition: string;
    };
    actionableRecommendations: {
      immediateFixes: Array<{
        action: string;
        explanation: string;
      }>;
      strategicImprovements: Array<{
        improvement: string;
        timeline: string;
      }>;
      longTermEnhancements: Array<{
        enhancement: string;
        benefit: string;
      }>;
    };
    sampleImprovements: Array<{
      before: string;
      after: string;
      explanation: string;
    }>;
    finalVerdict: {
      marketReadiness: string;
      actionPlan: string[];
      timelineRecommendations: string;
    };
  };
}

// Types for our AI service
export interface UserProfile {
  skills: Array<{ name: string; level: number }>;
  interests: string[];
  experience: string;
  resumeAnalysis?: ResumeAnalysisResult;
}

// Generate career recommendations using Gemini AI
export const generateCareerRecommendations = async (
  userProfile: UserProfile
): Promise<CareerRecommendation[]> => {
  console.log('Generating career recommendations for:', userProfile);
  
  if (!genAI) {
    console.log('No Gemini AI instance, using fallback recommendations');
    return getFallbackCareerRecommendations(userProfile);
  }

  try {
    console.log('Calling Gemini AI API...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Enhanced prompt that includes resume analysis data
    const resumeContext = userProfile.resumeAnalysis ? `
Resume Analysis Context:
- Professional Summary: ${userProfile.resumeAnalysis.summary}
- Work Experience: ${userProfile.resumeAnalysis.extractedInfo?.workExperience?.map(exp => `${exp.position} at ${exp.company}`).join(', ') || 'Not specified'}
- Education: ${userProfile.resumeAnalysis.education?.join(', ') || 'Not specified'}
- AI Insights: ${userProfile.resumeAnalysis.aiReasoning?.careerTrajectory || 'Not available'}
- Market Position: ${userProfile.resumeAnalysis.aiReasoning?.marketPosition || 'Not available'}
` : '';

    const prompt = `
Based on the following user profile and resume analysis, provide 4-5 personalized career recommendations in JSON format that are specifically tailored to current market trends and the user's background. Include opportunities in both global markets (US, Europe) and Indian market (Bangalore, Mumbai, Hyderabad, Chennai, Pune, Delhi, Gurgaon):

${resumeContext}

User Profile:
- Skills: ${userProfile.skills.map(s => `${s.name} (Level ${s.level}/5)`).join(', ')}
- Interests: ${userProfile.interests.join(', ')}
- Experience Level: ${userProfile.experience}

Focus on roles that are in high demand in India's tech ecosystem including companies like TCS, Infosys, Wipro, Accenture, Flipkart, Paytm, Zomato, Swiggy, Byju's, Ola, PhonePe, Freshworks, and global companies with Indian offices.

Please provide recommendations as a JSON array with this exact structure:
[
  {
    "title": "Job Title",
    "description": "Brief description of the role and responsibilities",
    "matchScore": 85,
    "match": 85,
    "requiredSkills": ["skill1", "skill2", "skill3"],
    "salaryRange": "$60,000 - $90,000 / ₹12L - ₹18L",
    "salary": "$60,000 - $90,000 / ₹12L - ₹18L",
    "growthProspects": "Description of career growth opportunities",
    "growth": "+15% (5 year)",
    "learningPath": ["Next skill to learn", "Advanced skill", "Leadership skill"],
    "skillGaps": ["skill to learn", "another skill"],
    "companies": ["Company 1", "Company 2", "Company 3"],
    "jobLocations": ["Bangalore", "Mumbai", "Hyderabad", "Remote"],
    "marketDemand": "High",
    "nextSteps": ["Step 1", "Step 2", "Step 3"],
    "geminiInsights": {
      "reasoningScore": 85,
      "marketFit": "Strong match description",
      "riskFactors": ["Risk 1", "Risk 2"],
      "keyAdvantages": ["Advantage 1", "Advantage 2"]
    }
  }
]

Focus on:
1. Matching user's current skills and interests
2. Realistic career progression based on experience level
3. Current market demand and salary ranges
4. Specific learning paths for career advancement
5. Match scores between 70-95 based on profile alignment

Return only the JSON array, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini AI response received:', text.substring(0, 200) + '...');

    // Parse the JSON response
    try {
      // Clean the response text (remove any markdown formatting)
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const recommendations = JSON.parse(cleanText);
      
      if (Array.isArray(recommendations)) {
        console.log('Successfully parsed AI recommendations:', recommendations.length, 'items');
        return recommendations;
      } else {
        console.log('AI response is not an array, using fallback');
        return getFallbackCareerRecommendations(userProfile);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw response:', text);
      return getFallbackCareerRecommendations(userProfile);
    }
  } catch (error) {
    console.error('Error generating career recommendations:', error);
    return getFallbackCareerRecommendations(userProfile);
  }
};

// Generate learning recommendations using Gemini AI
export const generateLearningRecommendations = async (
  userProfile: UserProfile
): Promise<LearningRecommendation[]> => {
  if (!genAI) {
    return getFallbackLearningRecommendations(userProfile);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Based on the user's profile, recommend learning paths to advance their career:

User Profile:
- Current Skills: ${userProfile.skills.map(s => `${s.name} (Level ${s.level}/5)`).join(', ')}
- Interests: ${userProfile.interests.join(', ')}
- Experience Level: ${userProfile.experience}

Provide 3-5 learning recommendations in JSON format:
[
  {
    "skill": "Skill Name",
    "courses": [
      {
        "title": "Course Title",
        "provider": "Platform/University",
        "duration": "4-6 weeks",
        "difficulty": "Beginner/Intermediate/Advanced",
        "description": "What you'll learn in this course"
      }
    ]
  }
]

Focus on:
1. Skills that complement their current abilities
2. High-demand skills in their interest areas
3. Progressive learning paths from their current level
4. Mix of technical and soft skills
5. Realistic course recommendations from known platforms

Return only the JSON array, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const recommendations = JSON.parse(text);
      return Array.isArray(recommendations) ? recommendations : getFallbackLearningRecommendations(userProfile);
    } catch (parseError) {
      console.error('Error parsing learning recommendations:', parseError);
      return getFallbackLearningRecommendations(userProfile);
    }
  } catch (error) {
    console.error('Error generating learning recommendations:', error);
    return getFallbackLearningRecommendations(userProfile);
  }
};

// Generate market intelligence using Gemini AI
export const generateMarketIntelligence = async (
  userProfile: UserProfile
): Promise<{
  trends: string[];
  opportunities: string[];
  salaryInsights: string;
  skillDemand: Array<{ skill: string; demand: 'High' | 'Medium' | 'Low'; trend: 'Rising' | 'Stable' | 'Declining' }>;
}> => {
  if (!genAI) {
    return getFallbackMarketIntelligence(userProfile);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Provide market intelligence for someone with this profile:

Skills: ${userProfile.skills.map(s => s.name).join(', ')}
Interests: ${userProfile.interests.join(', ')}
Experience: ${userProfile.experience}

Return JSON with this structure:
{
  "trends": ["Current industry trend 1", "Current industry trend 2", "Current industry trend 3"],
  "opportunities": ["Emerging opportunity 1", "Emerging opportunity 2", "Emerging opportunity 3"],
  "salaryInsights": "Brief overview of salary trends in their field",
  "skillDemand": [
    {
      "skill": "Skill Name",
      "demand": "High",
      "trend": "Rising"
    }
  ]
}

Focus on current 2024-2025 market conditions and realistic insights.
Return only JSON, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing market intelligence:', parseError);
      return getFallbackMarketIntelligence(userProfile);
    }
  } catch (error) {
    console.error('Error generating market intelligence:', error);
    return getFallbackMarketIntelligence(userProfile);
  }
};

// Analyze resume using Gemini AI
export const analyzeResumeWithGemini = async (resumeText: string): Promise<ResumeAnalysisResult> => {
  console.log('Analyzing resume with Gemini AI...');
  
  if (!genAI) {
    console.log('No Gemini AI instance, using fallback analysis');
    return getFallbackResumeAnalysis(resumeText);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are an expert career advisor and resume analyst with 15+ years of experience. Analyze the following resume text and provide a comprehensive, professional analysis following the exact format specified below.

Resume Text:
${resumeText}

Provide your analysis in this EXACT JSON structure with ALL required fields:

{
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "experience": "Entry Level (0-2 years)" | "Mid Level (3-5 years)" | "Senior Level (6+ years)" | "Student/Graduate",
  "education": ["degree1", "degree2"],
  "summary": "Detailed 3-4 sentence professional summary highlighting key strengths, experience, and career trajectory",
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2", 
    "Specific actionable recommendation 3",
    "Specific actionable recommendation 4"
  ],
  "aiReasoning": {
    "strengthsAnalysis": "Detailed analysis of the candidate's key strengths and competitive advantages",
    "experienceAssessment": "Assessment of their experience level and career progression",
    "skillGapAnalysis": "Identification of potential skill gaps and areas for improvement",
    "careerTrajectory": "Analysis of their career path and potential future directions",
    "marketPosition": "How they position in the current job market"
  },
  "extractedInfo": {
    "name": "Full Name (if found)",
    "email": "email@example.com (if found)",
    "phone": "phone number (if found)",
    "location": "location (if found)",
    "workExperience": [
      {
        "company": "Company Name",
        "position": "Job Title",
        "duration": "Start - End dates",
        "description": "Detailed description of role, responsibilities, and key achievements"
      }
    ],
    "projects": [
      {
        "name": "Project Name",
        "description": "Comprehensive project description with impact and outcomes",
        "technologies": ["tech1", "tech2", "tech3"],
        "impact": "Quantifiable impact or results achieved"
      }
    ]
  },
  "detailedAnalysis": {
    "executiveSummary": "📋 EXECUTIVE SUMMARY: 2-3 sentence professional overview highlighting primary strengths and career focus using confident, professional language",
    "overallScore": {
      "resumeScore": 85,
      "atsCompatibility": "Excellent",
      "professionalLevel": "Mid"
    },
    "strengths": [
      {
        "title": "✅ Strong Technical Foundation",
        "description": "Demonstrates proficiency in modern technologies",
        "examples": ["Specific example 1 from resume", "Specific example 2 from resume"]
      }
    ],
    "areasForImprovement": [
      {
        "title": "🔄 Quantifiable Achievements",
        "description": "Need to add more measurable results and impact metrics",
        "actionableSteps": ["Add specific numbers and percentages", "Include ROI or cost savings"],
        "priority": "High"
      }
    ],
    "missingElements": [
      {
        "element": "❗ Professional Summary",
        "importance": "Critical for ATS and recruiter attention",
        "suggestion": "Add a 3-4 line summary at the top highlighting key value proposition"
      }
    ],
    "sectionBreakdown": {
      "contactInfo": {
        "rating": 4,
        "feedback": "Contact Information: 4/5 ⭐ - Complete contact details present, consider adding LinkedIn profile"
      },
      "professionalSummary": {
        "rating": 3,
        "feedback": "Professional Summary: 3/5 ⭐ - Present but could be more compelling and specific"
      },
      "workExperience": {
        "rating": 4,
        "feedback": "Work Experience: 4/5 ⭐ - Good descriptions, add more quantifiable achievements"
      },
      "education": {
        "rating": 4,
        "feedback": "Education: 4/5 ⭐ - Relevant education clearly presented"
      },
      "skills": {
        "rating": 3,
        "feedback": "Skills Section: 3/5 ⭐ - Good technical skills, organize better and add proficiency levels"
      },
      "additionalSections": {
        "rating": 3,
        "feedback": "Additional Sections: 3/5 ⭐ - Projects present, consider adding certifications"
      }
    },
    "atsOptimization": {
      "keywordDensity": "Good keyword coverage for target roles, could benefit from more industry-specific terms",
      "formatCompatibility": "Standard format with good ATS compatibility, avoid complex formatting",
      "parsingIssues": ["Tables may cause parsing issues", "Complex formatting in headers"],
      "recommendations": ["Use standard section headers", "Avoid graphics and tables", "Include more relevant keywords"]
    },
    "industryInsights": {
      "targetIndustry": "Technology/Software Development",
      "industryStandards": "Resume meets most industry standards for technical roles",
      "marketTrends": ["Remote work capabilities highly valued", "Cloud skills in high demand", "AI/ML experience increasingly important"],
      "competitivePosition": "Well-positioned for mid-level roles, strong foundation for career growth"
    },
    "actionableRecommendations": {
      "immediateFixes": [
        {
          "action": "Add quantifiable achievements to each role",
          "explanation": "Numbers and metrics make accomplishments more credible and impactful"
        },
        {
          "action": "Optimize for ATS with relevant keywords",
          "explanation": "Many companies use ATS systems that filter resumes based on keyword matching"
        }
      ],
      "strategicImprovements": [
        {
          "improvement": "Develop leadership experience narrative",
          "timeline": "3-6 months - seek leadership opportunities and document them"
        },
        {
          "improvement": "Build portfolio of projects with measurable impact",
          "timeline": "6-12 months - create comprehensive project documentation"
        }
      ],
      "longTermEnhancements": [
        {
          "enhancement": "Pursue industry certifications",
          "benefit": "Validates expertise and demonstrates commitment to professional development"
        }
      ]
    },
    "sampleImprovements": [
      {
        "before": "Worked on web development projects",
        "after": "Developed 5 responsive web applications serving 10,000+ users, improving load times by 40% and user engagement by 25%",
        "explanation": "Added specific numbers, impact metrics, and quantifiable results that demonstrate value"
      },
      {
        "before": "Responsible for database management",
        "after": "Optimized database queries and indexing strategies, reducing query response time by 60% and supporting 3x increase in concurrent users",
        "explanation": "Transformed vague responsibility into specific achievement with measurable business impact"
      }
    ],
    "finalVerdict": {
      "marketReadiness": "🎯 MARKET READINESS: Resume is 75% market-ready with strong technical foundation. With recommended improvements, could reach 90%+ readiness for target roles.",
      "actionPlan": [
        "1. IMMEDIATE (1-2 weeks): Add quantifiable achievements to all roles",
        "2. SHORT-TERM (1 month): Optimize keywords and ATS compatibility", 
        "3. MEDIUM-TERM (3 months): Develop leadership narrative and expand project portfolio",
        "4. LONG-TERM (6+ months): Pursue relevant certifications and advanced skills"
      ],
      "timelineRecommendations": "Focus on immediate fixes first for quick wins, then build strategic improvements over 3-6 months for maximum impact"
    }
  }
}

CRITICAL ANALYSIS REQUIREMENTS:
✅ Professional Standards: Use professional, constructive language throughout. Be specific and actionable. Maintain encouraging yet honest assessment.
📊 Scoring: Resume scores should be 60-95 range. ATS compatibility: Excellent/Good/Fair/Poor. Professional levels: Entry/Mid/Senior/Executive.
🎯 Specificity: Reference actual content from the resume. Provide concrete examples and actionable recommendations.
⭐ Section Ratings: Rate each section 1-5 stars with specific feedback explaining the rating.
🔄 Improvement Focus: Prioritize improvements by impact level (High/Medium/Low priority).
❗ Missing Elements: Identify critical components not present and explain their importance.
💼 Industry Context: Tailor feedback based on target industry and current market trends.

Return ONLY the JSON object with no additional text, formatting, or explanations outside the JSON structure.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini AI resume analysis response received');

    try {
      // Clean the response text (remove any markdown formatting)
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const analysis = JSON.parse(cleanText);
      
      console.log('Successfully parsed resume analysis');
      return analysis;
    } catch (parseError) {
      console.error('Error parsing resume analysis:', parseError);
      console.error('Raw response:', text);
      return getFallbackResumeAnalysis(resumeText);
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return getFallbackResumeAnalysis(resumeText);
  }
};

// Fallback functions for when AI is not available
const getFallbackResumeAnalysis = (resumeText: string): ResumeAnalysisResult => {
  // Simple keyword-based analysis as fallback
  const commonSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Java', 'C++', 'HTML', 'CSS', 'Git'];
  const foundSkills = commonSkills.filter(skill => 
    resumeText.toLowerCase().includes(skill.toLowerCase())
  );

  // Simple experience level detection
  let experience = "Entry Level (0-2 years)";
  let professionalLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive' = 'Entry';
  if (resumeText.toLowerCase().includes('senior') || resumeText.toLowerCase().includes('lead')) {
    experience = "Senior Level (6+ years)";
    professionalLevel = 'Senior';
  } else if (resumeText.toLowerCase().includes('manager') || resumeText.match(/\d+\s*years/)) {
    experience = "Mid Level (3-5 years)";
    professionalLevel = 'Mid';
  }

  return {
    skills: foundSkills.length > 0 ? foundSkills : ['Communication', 'Problem Solving', 'Teamwork'],
    experience,
    education: ['Bachelor\'s Degree'],
    summary: 'Professional with demonstrated experience in technology and business. Shows strong analytical thinking and problem-solving capabilities. Has experience working with modern technologies and frameworks.',
    recommendations: [
      'Consider learning cloud technologies like AWS or Azure to enhance technical skills',
      'Develop leadership and project management skills for career advancement',
      'Build a strong portfolio showcasing your projects and achievements',
      'Network with industry professionals and join relevant communities'
    ],
    aiReasoning: {
      strengthsAnalysis: 'Demonstrates technical proficiency and adaptability. Shows experience with multiple technologies and frameworks.',
      experienceAssessment: `Based on the resume content, this appears to be a ${experience.toLowerCase()} professional with relevant industry experience.`,
      skillGapAnalysis: 'Could benefit from expanding cloud computing knowledge and developing leadership skills for senior roles.',
      careerTrajectory: 'Well-positioned for growth in technology roles with potential for leadership positions.',
      marketPosition: 'Competitive candidate with a solid foundation in current market-relevant technologies.'
    },
    extractedInfo: {
      workExperience: [{
        company: 'Previous Company',
        position: 'Professional Role',
        duration: 'Duration not specified',
        description: 'Professional experience in the field with demonstrated technical and business acumen'
      }],
      projects: [{
        name: 'Professional Project',
        description: 'Project work experience demonstrating technical capabilities',
        technologies: foundSkills.slice(0, 3),
        impact: 'Contributed to successful project outcomes and team objectives'
      }]
    },
    detailedAnalysis: {
      executiveSummary: "📋 EXECUTIVE SUMMARY: Experienced professional with strong technical foundation and proven ability to deliver results. Demonstrates adaptability and continuous learning mindset with solid industry experience.",
      overallScore: {
        resumeScore: 75,
        atsCompatibility: 'Good' as const,
        professionalLevel
      },
      strengths: [
        {
          title: "✅ Technical Proficiency",
          description: "Strong foundation in modern technologies and frameworks",
          examples: foundSkills.slice(0, 3)
        },
        {
          title: "✅ Professional Experience",
          description: "Demonstrated experience in the technology sector",
          examples: ["Relevant work experience", "Industry knowledge"]
        }
      ],
      areasForImprovement: [
        {
          title: "🔄 Quantifiable Achievements",
          description: "Resume would benefit from more specific metrics and measurable outcomes",
          actionableSteps: ["Add specific numbers and percentages to achievements", "Include ROI or cost savings where applicable"],
          priority: 'High' as const
        },
        {
          title: "🔄 Skills Organization",
          description: "Technical skills could be better organized and categorized",
          actionableSteps: ["Group skills by category", "Add proficiency levels"],
          priority: 'Medium' as const
        }
      ],
      missingElements: [
        {
          element: "❗ Professional Summary",
          importance: "Critical for ATS optimization and recruiter attention",
          suggestion: "Add a compelling 3-4 line professional summary at the top"
        },
        {
          element: "❗ Certifications Section",
          importance: "Validates technical expertise and commitment to learning",
          suggestion: "Include relevant industry certifications and training"
        }
      ],
      sectionBreakdown: {
        contactInfo: { rating: 4, feedback: "Contact Information: 4/5 ⭐ - Basic contact information present" },
        professionalSummary: { rating: 2, feedback: "Professional Summary: 2/5 ⭐ - Missing or needs improvement" },
        workExperience: { rating: 3, feedback: "Work Experience: 3/5 ⭐ - Present but could use more quantifiable achievements" },
        education: { rating: 3, feedback: "Education: 3/5 ⭐ - Educational background included" },
        skills: { rating: 3, feedback: "Skills Section: 3/5 ⭐ - Good technical skills, needs better organization" },
        additionalSections: { rating: 2, feedback: "Additional Sections: 2/5 ⭐ - Limited additional content, consider adding projects/certifications" }
      },
      atsOptimization: {
        keywordDensity: "Moderate keyword coverage, could benefit from more industry-specific terms",
        formatCompatibility: "Standard format with good ATS compatibility",
        parsingIssues: ["May need more relevant keywords for target roles"],
        recommendations: ["Include more industry-specific keywords", "Use standard section headers", "Optimize for target job descriptions"]
      },
      industryInsights: {
        targetIndustry: "Technology/Software Development",
        industryStandards: "Resume meets basic industry standards but has room for improvement",
        marketTrends: ["Remote work capabilities highly valued", "Cloud skills in high demand", "Continuous learning mindset important"],
        competitivePosition: "Solid foundation with potential for improvement to increase competitiveness"
      },
      actionableRecommendations: {
        immediateFixes: [
          {
            action: "Add a professional summary section",
            explanation: "Creates strong first impression and improves ATS compatibility"
          },
          {
            action: "Quantify achievements with specific metrics",
            explanation: "Numbers and percentages make accomplishments more credible and impactful"
          }
        ],
        strategicImprovements: [
          {
            improvement: "Develop and showcase leadership experience",
            timeline: "3-6 months - seek opportunities to lead projects or mentor others"
          },
          {
            improvement: "Build comprehensive project portfolio",
            timeline: "6-12 months - document projects with clear impact and outcomes"
          }
        ],
        longTermEnhancements: [
          {
            enhancement: "Pursue relevant industry certifications",
            benefit: "Validates expertise and demonstrates commitment to professional growth"
          }
        ]
      },
      sampleImprovements: [
        {
          before: "Worked on software development projects",
          after: "Developed 3 web applications using React and Node.js, serving 1,000+ users and improving system efficiency by 30%",
          explanation: "Added specific technologies, user impact, and quantifiable improvement metrics"
        },
        {
          before: "Responsible for database tasks",
          after: "Optimized database queries and implemented indexing strategies, reducing response time by 50% and supporting 2x user growth",
          explanation: "Transformed vague responsibility into specific achievement with measurable business impact"
        }
      ],
      finalVerdict: {
        marketReadiness: "🎯 MARKET READINESS: Resume shows solid potential but needs strategic improvements to reach full market competitiveness. Currently 65% market-ready.",
        actionPlan: [
          "1. IMMEDIATE (1 week): Add professional summary and quantify key achievements",
          "2. SHORT-TERM (2-4 weeks): Reorganize skills section and optimize keywords",
          "3. MEDIUM-TERM (2-3 months): Develop leadership narrative and expand project descriptions",
          "4. LONG-TERM (6+ months): Pursue certifications and build comprehensive portfolio"
        ],
        timelineRecommendations: "Focus on immediate structural improvements first, then build content depth over 2-3 months for maximum impact"
      }
    }
  };
};

const getFallbackCareerRecommendations = (userProfile: UserProfile): CareerRecommendation[] => {
  const recommendations: CareerRecommendation[] = [
    {
      title: "Software Developer",
      description: "Design and develop software applications using modern programming languages and frameworks.",
      matchScore: 85,
      match: 85,
      requiredSkills: ["JavaScript", "React", "Node.js", "SQL"],
      salaryRange: "$70,000 - $120,000",
      salary: "$70,000 - $120,000",
      growthProspects: "High demand with opportunities to advance to senior developer, tech lead, or architect roles.",
      growth: "+15% (5 year)",
      learningPath: ["Advanced JavaScript", "System Design", "Cloud Platforms", "Leadership Skills"],
      skillGaps: ["System Design", "Cloud Platforms"],
      companies: ["Microsoft", "Google", "Meta", "Amazon"],
      jobLocations: ["Seattle", "San Francisco", "New York", "Remote"],
      marketDemand: "Very High",
      nextSteps: ["Build portfolio projects", "Learn system design", "Practice coding interviews"],
      geminiInsights: {
        reasoningScore: 85,
        marketFit: "Strong - High demand for full-stack developers",
        riskFactors: ["Competitive market", "Need continuous learning"],
        keyAdvantages: ["Strong technical foundation", "Versatile skill set"]
      }
    },
    {
      title: "Data Analyst",
      description: "Analyze data to help organizations make informed business decisions.",
      matchScore: 78,
      match: 78,
      requiredSkills: ["Python", "SQL", "Data Analysis", "Machine Learning"],
      salaryRange: "$60,000 - $95,000",
      salary: "$60,000 - $95,000",
      growthProspects: "Growing field with paths to data scientist, analytics manager, or business intelligence roles.",
      growth: "+25% (5 year)",
      learningPath: ["Advanced Analytics", "Machine Learning", "Business Intelligence", "Data Visualization"],
      skillGaps: ["Advanced Statistics", "Machine Learning"],
      companies: ["Netflix", "Spotify", "Airbnb", "Uber"],
      jobLocations: ["San Francisco", "New York", "Austin", "Remote"],
      marketDemand: "High",
      nextSteps: ["Build data portfolio", "Learn advanced ML", "Get certified in analytics tools"],
      geminiInsights: {
        reasoningScore: 78,
        marketFit: "Good - Growing demand for data-driven insights",
        riskFactors: ["Need strong math background", "Evolving tools"],
        keyAdvantages: ["Analytical thinking", "Problem-solving skills"]
      }
    },
    {
      title: "Product Manager",
      description: "Guide product development from conception to launch, working with cross-functional teams.",
      matchScore: 72,
      match: 72,
      requiredSkills: ["Project Management", "Communication", "Leadership", "Data Analysis"],
      salaryRange: "$90,000 - $150,000",
      salary: "$90,000 - $150,000",
      growthProspects: "Excellent growth potential to senior PM, director, or VP of product roles.",
      growth: "+20% (5 year)",
      learningPath: ["Product Strategy", "User Research", "Agile Methodologies", "Strategic Planning"],
      skillGaps: ["Product Strategy", "User Research"],
      companies: ["Apple", "Google", "Meta", "Stripe"],
      jobLocations: ["Silicon Valley", "Seattle", "New York", "Remote"],
      marketDemand: "High",
      nextSteps: ["Build product case studies", "Network with PMs", "Get PM certification"],
      geminiInsights: {
        reasoningScore: 72,
        marketFit: "Good - Strong demand for technical PMs",
        riskFactors: ["Requires business acumen", "Competitive field"],
        keyAdvantages: ["Leadership potential", "Cross-functional skills"]
      }
    }
  ];

  return recommendations;
};

const getFallbackLearningRecommendations = (userProfile: UserProfile): LearningRecommendation[] => {
  return [
    {
      skill: "Advanced JavaScript",
      courses: [
        {
          title: "JavaScript: The Advanced Concepts",
          provider: "Udemy",
          duration: "6-8 weeks",
          difficulty: "Advanced",
          description: "Master closures, prototypes, async programming, and modern ES6+ features"
        }
      ]
    },
    {
      skill: "Cloud Computing",
      courses: [
        {
          title: "AWS Certified Solutions Architect",
          provider: "AWS Training",
          duration: "8-10 weeks",
          difficulty: "Intermediate",
          description: "Learn to design and deploy scalable systems on AWS"
        }
      ]
    }
  ];
};

const getFallbackMarketIntelligence = (userProfile: UserProfile) => {
  return {
    trends: [
      "AI and Machine Learning integration across industries",
      "Remote and hybrid work models becoming standard",
      "Increased focus on cybersecurity and data privacy"
    ],
    opportunities: [
      "AI/ML Engineer roles growing rapidly",
      "DevOps and Cloud Engineering in high demand",
      "Product Management roles expanding in tech companies"
    ],
    salaryInsights: "Technology roles continue to offer competitive salaries with 5-10% year-over-year growth in most markets.",
    skillDemand: [
      { skill: "Python", demand: "High" as const, trend: "Rising" as const },
      { skill: "React", demand: "High" as const, trend: "Stable" as const },
      { skill: "Machine Learning", demand: "High" as const, trend: "Rising" as const }
    ]
  };
};
