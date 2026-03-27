import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { analyzeResumeWithGrok } from "@/lib/grok";
import { ResumeAnalysisResult } from "@/lib/gemini";
import { saveResumeAnalysis } from "@/lib/api";
import { DetailedResumeAnalysis } from "./DetailedResumeAnalysis";

interface ResumeAnalyzerProps {
  onAnalysisComplete?: (result: ResumeAnalysisResult) => void;
  onAnalysisStart?: () => void;
  className?: string;
}

export const ResumeAnalyzer = ({ onAnalysisComplete, onAnalysisStart, className }: ResumeAnalyzerProps) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.type === 'application/msword' || 
          droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Please upload a PDF or Word document only.');
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/msword' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a PDF or Word document only.');
      }
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      if (file.type === 'application/pdf') {
        // For PDF files, we'll read as ArrayBuffer and extract text
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            // Simple PDF text extraction - in production, use pdf-parse or similar
            const text = await extractPDFText(arrayBuffer);
            resolve(text);
          } catch (error) {
            reject(new Error('Failed to extract text from PDF'));
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // For text/Word files, read as text
        reader.onload = (e) => {
          const text = e.target?.result as string;
          resolve(text || '');
        };
        reader.readAsText(file);
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  // Simple PDF text extraction (basic implementation)
  const extractPDFText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      // Convert ArrayBuffer to Uint8Array
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Look for text streams in PDF
      const decoder = new TextDecoder('utf-8');
      let pdfText = decoder.decode(uint8Array);
      
      // Extract text between stream markers (very basic PDF parsing)
      const textMatches = pdfText.match(/BT\s+(.*?)\s+ET/gs);
      let extractedText = '';
      
      if (textMatches) {
        textMatches.forEach(match => {
          // Remove PDF commands and extract readable text
          const cleanText = match
            .replace(/BT|ET/g, '')
            .replace(/\/[A-Za-z0-9]+\s+[0-9.]+\s+Tf/g, '')
            .replace(/[0-9.]+\s+[0-9.]+\s+Td/g, '')
            .replace(/\([^)]*\)\s*Tj/g, (match) => {
              return match.replace(/^\(|\)\s*Tj$/g, '') + ' ';
            })
            .replace(/[<>]/g, '')
            .trim();
          
          if (cleanText) {
            extractedText += cleanText + ' ';
          }
        });
      }
      
      // Fallback: try to extract any readable ASCII text
      if (!extractedText || extractedText.length < 50) {
        let fallbackText = '';
        for (let i = 0; i < uint8Array.length - 1; i++) {
          const char = String.fromCharCode(uint8Array[i]);
          if (char.match(/[a-zA-Z0-9\s\.\,\!\?\-\@\(\)\n\r]/)) {
            fallbackText += char;
          }
        }
        
        // Clean up the fallback text
        fallbackText = fallbackText
          .replace(/\s+/g, ' ')
          .replace(/[^\w\s\.\,\!\?\-\@\(\)]/g, '')
          .trim();
        
        if (fallbackText.length > extractedText.length) {
          extractedText = fallbackText;
        }
      }
      
      if (!extractedText || extractedText.length < 50) {
        throw new Error('Could not extract meaningful text from PDF. The file may be image-based or encrypted.');
      }
      
      return extractedText.trim();
    } catch (error) {
      throw new Error('PDF text extraction failed. Please try pasting the text directly or use a text-based PDF.');
    }
  };

  const analyzeResumeWithAI = async (text: string): Promise<ResumeAnalysisResult> => {
    try {
      return await analyzeResumeWithGrok(text);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to analyze resume');
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    onAnalysisStart?.(); // Notify parent that analysis is starting
    // Don't clear previous results immediately to prevent blank screen

    try {
      let textToAnalyze = '';
      
      if (activeTab === 'upload' && file) {
        console.log('Extracting text from file:', file.name);
        textToAnalyze = await extractTextFromFile(file);
        console.log('Text extracted, length:', textToAnalyze.length);
      } else if (activeTab === 'paste' && resumeText.trim()) {
        textToAnalyze = resumeText.trim();
        console.log('Using pasted text, length:', textToAnalyze.length);
      } else {
        throw new Error('Please provide resume content to analyze');
      }

      if (!textToAnalyze || textToAnalyze.length < 50) {
        throw new Error('Resume content is too short or empty. Please provide more detailed resume information.');
      }

      console.log('Starting Grok AI analysis...');
      const result = await analyzeResumeWithGrok(textToAnalyze);
      console.log('Grok AI analysis completed:', result);
      
      // Only set result after successful analysis
      setAnalysisResult(result);
      onAnalysisComplete?.(result);

      // Optionally save to database (if user is logged in)
      try {
        await saveResumeAnalysis({
          fileName: file?.name,
          fileType: file?.type,
          resumeText: textToAnalyze,
          extractedSkills: result.skills,
          experienceLevel: result.experience,
          education: result.education,
          summary: result.summary,
          recommendations: result.recommendations,
          extractedInfo: result.extractedInfo
        });
        console.log('Resume analysis saved to database');
      } catch (saveError) {
        // Silently fail if not logged in or database error
        console.log('Could not save resume analysis:', saveError);
      }
    } catch (err) {
      console.error('Resume analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze resume';
      setError(errorMessage);
      // Don't clear analysis result on error to prevent blank screen
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = (activeTab === 'upload' && file) || (activeTab === 'paste' && resumeText.trim());

  return (
    <Card className={cn("shadow-medium", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Analyzer - Powered by Grok AI
          </CardTitle>
          <CardDescription>
            Upload your resume or paste the content to get enhanced AI-powered analysis and career recommendations using Grok AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        {/* Tab Selection */}
        <div className="flex rounded-lg border p-1 bg-muted">
          <Button
            variant={activeTab === 'paste' ? 'default' : 'ghost'}
            className="flex-1 gap-2"
            onClick={() => setActiveTab('paste')}
          >
            <FileText className="h-4 w-4" />
            Paste Text
          </Button>
          <Button
            variant={activeTab === 'upload' ? 'default' : 'ghost'}
            className="flex-1 gap-2"
            onClick={() => setActiveTab('upload')}
          >
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </div>

        {/* Content Area */}
        {activeTab === 'upload' ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Upload Resume File</h3>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                file ? "border-green-500 bg-green-50" : ""
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  {file ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                
                {file ? (
                  <div className="text-center">
                    <p className="font-medium text-green-700">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="font-medium">Choose File</p>
                    <p className="text-sm text-muted-foreground">PDF or Word documents only</p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Paste Resume Text</h3>
            <Textarea
              placeholder="Paste your resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <p className="text-sm text-muted-foreground">
              {resumeText.length} characters
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Enhanced Analysis Loading State */}
        {isAnalyzing && (
          <div className="mt-6 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">🤖 AI Analysis in Progress</h3>
                <p className="text-gray-600 mb-4">
                  Our advanced AI is carefully analyzing your resume to extract valuable insights...
                </p>
              </div>
              
              {/* Progress Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-700">Resume content extracted</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  <span className="text-blue-700">Identifying skills and experience</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300"></div>
                  <span>Generating career insights</span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{width: '65%'}}></div>
              </div>
              
              <p className="text-xs text-gray-500">
                Please wait while we create your professional profile...
              </p>
            </div>
          </div>
        )}
        
        {analysisResult && (
          <div className={isAnalyzing ? "opacity-50 pointer-events-none" : ""}>
            <DetailedResumeAnalysis analysis={analysisResult} className="mt-6" />
          </div>
        )}

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 text-lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Analyzing Resume...
            </>
          ) : (
            <>
              Analyze Resume
              <Upload className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
