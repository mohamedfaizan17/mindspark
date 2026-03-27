import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Star, 
  Target, 
  Clock,
  Award,
  FileText,
  BarChart3,
  Users,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { ResumeAnalysisResult } from "@/lib/gemini";

interface DetailedResumeAnalysisProps {
  analysis: ResumeAnalysisResult;
  className?: string;
}

export const DetailedResumeAnalysis = ({ analysis, className }: DetailedResumeAnalysisProps) => {
  const detailedAnalysis = analysis.detailedAnalysis;

  if (!detailedAnalysis) {
    // Fallback to basic display if detailed analysis is not available
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Resume Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Skills Identified:</h4>
              <p className="text-muted-foreground">{analysis.skills.join(', ')}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Experience Level:</h4>
              <p className="text-muted-foreground">{analysis.experience}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Summary:</h4>
              <p className="text-muted-foreground">{analysis.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getATSColor = (ats: string) => {
    switch (ats) {
      case 'Excellent': return "text-green-600 bg-green-50 border-green-200";
      case 'Good': return "text-blue-600 bg-blue-50 border-blue-200";
      case 'Fair': return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case 'Poor': return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return "text-red-600 bg-red-50 border-red-200";
      case 'Medium': return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case 'Low': return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Executive Summary */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            📋 Resume Analysis Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-lg leading-relaxed">{detailedAnalysis.executiveSummary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Professional Profile Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            Professional Profile
          </CardTitle>
          <CardDescription className="text-blue-100">
            Professional Summary & Contact Information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Professional Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed">
              {analysis.extractedInfo.name || 'Professional Profile'} is {analysis.summary}
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.extractedInfo.email && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">@</span>
                    </div>
                    <span className="text-sm font-medium text-blue-800">Email</span>
                  </div>
                  <p className="text-blue-700 text-sm">{analysis.extractedInfo.email}</p>
                </div>
              )}
              
              {analysis.extractedInfo.phone && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📞</span>
                    </div>
                    <span className="text-sm font-medium text-green-800">Phone</span>
                  </div>
                  <p className="text-green-700 text-sm">{analysis.extractedInfo.phone}</p>
                </div>
              )}
              
              {analysis.extractedInfo.location && (
                <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📍</span>
                    </div>
                    <span className="text-sm font-medium text-purple-800">Location</span>
                  </div>
                  <p className="text-purple-700 text-sm">{analysis.extractedInfo.location}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education Background Section */}
      {analysis.education && analysis.education.length > 0 && (
        <Card>
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              Education Background
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.education.map((edu, index) => (
                <div key={index} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-indigo-600" />
                    <span className="font-medium text-indigo-800">{edu}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Core Skills & Expertise Section */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Target className="h-5 w-5" />
            </div>
            Core Skills & Expertise
          </CardTitle>
          <CardDescription className="text-green-100">
            Key technical and professional competencies identified from your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            {analysis.skills.map((skill, index) => {
              const colors = [
                'bg-orange-100 text-orange-800 border-orange-300',
                'bg-blue-100 text-blue-800 border-blue-300',
                'bg-green-100 text-green-800 border-green-300',
                'bg-purple-100 text-purple-800 border-purple-300',
                'bg-red-100 text-red-800 border-red-300',
                'bg-yellow-100 text-yellow-800 border-yellow-300',
                'bg-indigo-100 text-indigo-800 border-indigo-300',
                'bg-pink-100 text-pink-800 border-pink-300'
              ];
              const colorClass = colors[index % colors.length];
              
              return (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`px-3 py-1 text-sm font-medium border ${colorClass}`}
                >
                  {skill}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detailedAnalysis.strengths && detailedAnalysis.strengths.length > 0 ? (
              detailedAnalysis.strengths.map((strength, index) => (
                <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">{strength.title}</h4>
                  <p className="text-green-700 text-sm mb-3">{strength.description}</p>
                  <div className="space-y-1">
                    {strength.examples.map((example, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        <p className="text-xs text-green-600">{example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Fallback content based on basic analysis
              <div className="space-y-3">
                {analysis.skills.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Strong Skill Set</h4>
                    <p className="text-green-700 text-sm mb-3">
                      Your resume demonstrates expertise in {analysis.skills.length} key areas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skills.slice(0, 5).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {analysis.experience && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">💼 Experience Level</h4>
                    <p className="text-green-700 text-sm">
                      Classified as {analysis.experience} level professional with relevant industry experience
                    </p>
                  </div>
                )}
                
                {analysis.education && analysis.education.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">🎓 Educational Background</h4>
                    <p className="text-green-700 text-sm">
                      Strong educational foundation with {analysis.education.length} qualification(s)
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detailedAnalysis.areasForImprovement && detailedAnalysis.areasForImprovement.length > 0 ? (
              detailedAnalysis.areasForImprovement.map((area, index) => (
                <div key={index} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-yellow-800">{area.title}</h4>
                    <Badge className={`text-xs ${getPriorityColor(area.priority)}`}>
                      {area.priority}
                    </Badge>
                  </div>
                  <p className="text-yellow-700 text-sm mb-3">{area.description}</p>
                  <div className="space-y-1">
                    {area.actionableSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                        <p className="text-xs text-yellow-600">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Fallback improvement suggestions
              <div className="space-y-3">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-yellow-800">📞 Complete Contact Information</h4>
                    <Badge className="text-xs bg-red-100 text-red-800 border-red-300">High</Badge>
                  </div>
                  <p className="text-yellow-700 text-sm mb-3">
                    The resume is missing critical sections such as contact information, professional summary, work experience, education, and skills.
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                      <p className="text-xs text-yellow-600">Add contact information (name, email, phone number, location)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                      <p className="text-xs text-yellow-600">Develop a professional summary to capture attention</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                      <p className="text-xs text-yellow-600">Include a detailed work experience section with quantifiable achievements</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                      <p className="text-xs text-yellow-600">Provide information on education and degrees earned</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-3 h-3 text-yellow-500 mt-1 flex-shrink-0" />
                      <p className="text-xs text-yellow-600">Create a comprehensive skills section that aligns with targeted job roles</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Missing Elements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Missing Elements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {detailedAnalysis.missingElements.map((element, index) => (
              <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">{element.element}</h4>
                <p className="text-red-700 text-sm mb-2">{element.importance}</p>
                <p className="text-red-600 text-xs">{element.suggestion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section-by-Section Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Section-by-Section Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(detailedAnalysis.sectionBreakdown).map(([section, data]) => (
            <div key={section} className="bg-accent p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium capitalize">
                  {section.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < data.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{data.feedback}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ATS Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            ATS Optimization Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Keyword Density:</h4>
              <p className="text-sm text-muted-foreground">{detailedAnalysis.atsOptimization.keywordDensity}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Format Compatibility:</h4>
              <p className="text-sm text-muted-foreground">{detailedAnalysis.atsOptimization.formatCompatibility}</p>
            </div>
          </div>
          
          {detailedAnalysis.atsOptimization.parsingIssues.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Potential Parsing Issues:</h4>
              <div className="space-y-1">
                {detailedAnalysis.atsOptimization.parsingIssues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{issue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Recommendations:</h4>
            <div className="space-y-1">
              {detailedAnalysis.atsOptimization.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Industry-Specific Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Target Industry:</h4>
              <p className="text-sm text-muted-foreground">{detailedAnalysis.industryInsights.targetIndustry}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Competitive Position:</h4>
              <p className="text-sm text-muted-foreground">{detailedAnalysis.industryInsights.competitivePosition}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Market Trends:</h4>
            <div className="flex flex-wrap gap-2">
              {detailedAnalysis.industryInsights.marketTrends.map((trend, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {trend}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Industry Standards:</h4>
            <p className="text-sm text-muted-foreground">{detailedAnalysis.industryInsights.industryStandards}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actionable Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-orange-600" />
            Actionable Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Immediate Fixes */}
          <div>
            <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              IMMEDIATE FIXES (High Priority)
            </h4>
            <div className="space-y-3">
              {detailedAnalysis.actionableRecommendations.immediateFixes.map((fix, index) => (
                <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <h5 className="font-medium text-red-800 mb-1">{fix.action}</h5>
                  <p className="text-sm text-red-600">{fix.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Improvements */}
          <div>
            <h4 className="font-semibold text-yellow-600 mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              STRATEGIC IMPROVEMENTS (Medium Priority)
            </h4>
            <div className="space-y-3">
              {detailedAnalysis.actionableRecommendations.strategicImprovements.map((improvement, index) => (
                <div key={index} className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <h5 className="font-medium text-yellow-800 mb-1">{improvement.improvement}</h5>
                  <p className="text-sm text-yellow-600">{improvement.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Long-term Enhancements */}
          <div>
            <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
              <Award className="h-4 w-4" />
              LONG-TERM ENHANCEMENTS (Low Priority)
            </h4>
            <div className="space-y-3">
              {detailedAnalysis.actionableRecommendations.longTermEnhancements.map((enhancement, index) => (
                <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h5 className="font-medium text-green-800 mb-1">{enhancement.enhancement}</h5>
                  <p className="text-sm text-green-600">{enhancement.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Improvements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Sample Improvements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {detailedAnalysis.sampleImprovements.map((sample, index) => (
            <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-red-700 mb-1">Before:</h5>
                  <p className="text-sm text-red-600 italic">"{sample.before}"</p>
                </div>
                <div>
                  <h5 className="font-medium text-green-700 mb-1">After:</h5>
                  <p className="text-sm text-green-600 font-medium">"{sample.after}"</p>
                </div>
                <div>
                  <h5 className="font-medium text-blue-700 mb-1">Why:</h5>
                  <p className="text-sm text-blue-600">{sample.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Final Verdict */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Final Verdict & Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Market Readiness:</h4>
            <p className="text-muted-foreground">{detailedAnalysis.finalVerdict.marketReadiness}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Action Plan:</h4>
            <div className="space-y-2">
              {detailedAnalysis.finalVerdict.actionPlan.map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Timeline Recommendations:</h4>
            <p className="text-muted-foreground">{detailedAnalysis.finalVerdict.timelineRecommendations}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
