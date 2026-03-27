// Grok AI Integration for Enhanced Resume Analysis
import { ResumeAnalysisResult } from './gemini';

interface GrokResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface GrokAnalysisResult extends ResumeAnalysisResult {
  grokInsights?: {
    marketTrends: string[];
    industrySpecificAdvice: string[];
    careerTrajectoryPrediction: string;
    skillGapAnalysis: string[];
    competitiveAdvantage: string[];
  };
}

// Grok AI API configuration
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

export const analyzeResumeWithGrok = async (resumeText: string): Promise<GrokAnalysisResult> => {
  // Hardcoded API key - replace with your actual Grok API key
  const apiKey = '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'; // Replace this with your actual API key
  
  if (!apiKey || apiKey === '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') {
    console.warn('Grok API key not configured, falling back to basic analysis');
    return getFallbackAnalysis(resumeText);
  }

  try {
    console.log('Starting Grok AI resume analysis...');
    
    const prompt = `
Analyze this resume comprehensively and provide detailed insights in JSON format. Focus on providing actionable career advice, market positioning, and growth opportunities.

Resume Content:
${resumeText}

Please provide a detailed analysis in the following JSON structure:
{
  "summary": "Professional summary of the candidate",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": "Entry Level | Mid Level | Senior Level | Executive",
  "education": ["degree1", "degree2"],
  "extractedInfo": {
    "name": "Full Name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, State",
    "workExperience": [
      {
        "position": "Job Title",
        "company": "Company Name",
        "duration": "Start - End",
        "description": "Key achievements and responsibilities"
      }
    ]
  },
  "recommendations": [
    "Career recommendation 1",
    "Career recommendation 2",
    "Career recommendation 3"
  ],
  "aiReasoning": {
    "careerTrajectory": "Analysis of career progression and potential",
    "marketPosition": "Current market positioning and competitiveness",
    "strengthsAnalysis": "Key strengths and differentiators",
    "improvementAreas": "Areas needing development"
  },
  "detailedAnalysis": {
    "executiveSummary": "Comprehensive overview of the candidate's profile",
    "strengths": [
      {
        "title": "Strength Title",
        "description": "Detailed description",
        "examples": ["Example 1", "Example 2"]
      }
    ],
    "areasForImprovement": [
      {
        "title": "Improvement Area",
        "description": "Detailed description",
        "priority": "High | Medium | Low",
        "actionableSteps": ["Step 1", "Step 2", "Step 3"]
      }
    ]
  },
  "grokInsights": {
    "marketTrends": ["Current market trend 1", "Current market trend 2"],
    "industrySpecificAdvice": ["Industry advice 1", "Industry advice 2"],
    "careerTrajectoryPrediction": "Predicted career path and opportunities",
    "skillGapAnalysis": ["Missing skill 1", "Missing skill 2"],
    "competitiveAdvantage": ["Advantage 1", "Advantage 2"]
  }
}

Focus on:
1. Extracting accurate contact information and work history
2. Identifying technical and soft skills
3. Providing market-relevant career advice
4. Suggesting specific improvements with actionable steps
5. Analyzing competitive positioning in current job market
6. Predicting career growth opportunities
7. Identifying skill gaps based on current market demands

Be thorough, accurate, and provide actionable insights that can help advance the candidate's career.
`;

    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are an expert career advisor and resume analyst with deep knowledge of current job markets, industry trends, and hiring practices. Provide comprehensive, actionable career guidance.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'grok-beta',
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
    }

    const data: GrokResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from Grok API');
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Grok response');
    }

    const analysisResult: GrokAnalysisResult = JSON.parse(jsonMatch[0]);
    
    console.log('Grok AI analysis completed successfully');
    return analysisResult;

  } catch (error) {
    console.error('Grok AI analysis failed:', error);
    return getFallbackAnalysis(resumeText);
  }
};

// Fallback analysis when Grok AI is not available
const getFallbackAnalysis = (resumeText: string): GrokAnalysisResult => {
  console.log('Using fallback analysis');
  
  // Basic text analysis
  const text = resumeText.toLowerCase();
  
  // Extract basic skills
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
    'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'aws', 'docker',
    'kubernetes', 'git', 'agile', 'scrum', 'project management', 'leadership',
    'communication', 'problem solving', 'teamwork', 'analytical thinking'
  ];
  
  const foundSkills = commonSkills.filter(skill => 
    text.includes(skill.toLowerCase())
  ).slice(0, 8);

  // Determine experience level
  let experience = 'Entry Level';
  if (text.includes('senior') || text.includes('lead') || text.includes('manager')) {
    experience = 'Senior Level';
  } else if (text.includes('mid') || text.includes('intermediate') || foundSkills.length > 5) {
    experience = 'Mid Level';
  }

  return {
    summary: "Professional with demonstrated experience in technology and business domains. Shows potential for career growth with proper skill development and strategic positioning.",
    skills: foundSkills.length > 0 ? foundSkills : ['Communication', 'Problem Solving', 'Teamwork', 'Analytical Thinking'],
    experience,
    education: ['Professional Development'],
    extractedInfo: {
      name: 'Professional Profile',
      email: '',
      phone: '',
      location: '',
      workExperience: []
    },
    recommendations: [
      'Focus on developing in-demand technical skills',
      'Build a strong professional network',
      'Consider industry certifications',
      'Gain experience in emerging technologies'
    ],
    aiReasoning: {
      careerTrajectory: 'Shows potential for growth with focused skill development',
      marketPosition: 'Competitive with proper positioning and skill enhancement',
      strengthsAnalysis: 'Demonstrates foundational capabilities',
      experienceAssessment: 'Entry level with growth potential',
      skillGapAnalysis: 'Needs more detailed professional information'
    },
    detailedAnalysis: {
      executiveSummary: "This profile shows promise but requires more comprehensive information to provide detailed career guidance. Focus on building a complete professional narrative.",
      overallScore: {
        resumeScore: 30,
        atsCompatibility: 'Poor' as const,
        professionalLevel: 'Entry' as const
      },
      strengths: [
        {
          title: "Growth Potential",
          description: "Shows willingness to develop professionally",
          examples: ["Seeking career guidance", "Open to improvement"]
        }
      ],
      areasForImprovement: [
        {
          title: "Complete Professional Profile",
          description: "Need comprehensive resume with detailed work history",
          priority: "High" as const,
          actionableSteps: [
            "Add complete contact information",
            "Include detailed work experience",
            "List educational background",
            "Highlight key achievements"
          ]
        }
      ],
      missingElements: [
        {
          element: "Contact Information",
          importance: "Critical",
          suggestion: "Add name, email, phone, and location"
        },
        {
          element: "Work Experience",
          importance: "High",
          suggestion: "Include detailed employment history with achievements"
        },
        {
          element: "Education",
          importance: "Medium",
          suggestion: "List degrees, certifications, and relevant coursework"
        }
      ],
      sectionBreakdown: {
        contactInfo: { rating: 1, feedback: "Missing essential contact information" },
        professionalSummary: { rating: 2, feedback: "Needs professional summary section" },
        workExperience: { rating: 1, feedback: "No work experience provided" },
        education: { rating: 1, feedback: "Educational background not specified" },
        skills: { rating: 3, feedback: "Some skills identified but needs expansion" },
        additionalSections: { rating: 1, feedback: "Consider adding projects, certifications" }
      },
      atsOptimization: {
        keywordDensity: "Low - needs industry-specific keywords",
        formatCompatibility: "Poor - missing standard resume sections",
        parsingIssues: ["Missing contact information", "No clear section headers", "Insufficient content"],
        recommendations: ["Use standard resume format", "Add keyword-rich content", "Include clear section headers"]
      },
      industryInsights: {
        targetIndustry: "Technology",
        industryStandards: "Requires technical skills and project experience",
        marketTrends: ["AI/ML skills in demand", "Cloud computing essential", "Remote work capabilities"],
        competitivePosition: "Needs significant improvement to be competitive"
      },
      actionableRecommendations: {
        immediateFixes: [
          {
            action: "Add complete contact information",
            explanation: "Essential for recruiters to contact you"
          },
          {
            action: "Write professional summary",
            explanation: "Captures attention and highlights key qualifications"
          }
        ],
        strategicImprovements: [
          {
            improvement: "Build comprehensive work experience section",
            timeline: "1 week"
          },
          {
            improvement: "Add quantifiable achievements",
            timeline: "2-3 days"
          }
        ],
        longTermEnhancements: [
          {
            enhancement: "Develop industry-specific skills",
            benefit: "Improved market competitiveness and higher salary potential"
          }
        ]
      },
      sampleImprovements: [
        {
          before: "Missing contact information",
          after: "John Doe | john.doe@email.com | (555) 123-4567 | New York, NY",
          explanation: "Complete contact information makes it easy for recruiters to reach you"
        }
      ],
      finalVerdict: {
        marketReadiness: "Significant improvement needed - currently at 30% market readiness",
        actionPlan: ["Complete basic resume sections", "Add quantifiable achievements", "Tailor for target roles"],
        timelineRecommendations: "2-4 weeks with focused effort to reach market-ready status"
      }
    },
    grokInsights: {
      marketTrends: [
        "AI and Machine Learning skills in high demand",
        "Remote work capabilities increasingly important",
        "Cloud computing expertise highly valued"
      ],
      industrySpecificAdvice: [
        "Focus on continuous learning and upskilling",
        "Build a strong online professional presence",
        "Network within your target industry"
      ],
      careerTrajectoryPrediction: "With proper skill development and strategic positioning, significant career growth is possible within 2-3 years",
      skillGapAnalysis: [
        "Technical skills specific to target role",
        "Industry-specific certifications",
        "Leadership and management capabilities"
      ],
      competitiveAdvantage: [
        "Adaptability and learning mindset",
        "Professional development focus"
      ]
    }
  };
};

// Note: API key is now hardcoded in the analyzeResumeWithGrok function
// No need for localStorage management functions
