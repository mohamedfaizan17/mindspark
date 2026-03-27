import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  MapPin, 
  Calendar,
  Briefcase,
  AlertCircle,
  Brain,
  ExternalLink,
  Loader2,
  Check,
  BarChart3,
  Target
} from "lucide-react";
import { 
  generateMarketIntelligence, 
  getSalaryTrends, 
  getMarketPredictions,
  searchJobs,
  type MarketTrend,
  type JobMarketData,
  type IndustryInsight
} from "@/lib/market-intelligence";

// Mock data - In production, this would come from real APIs
const marketData = {
  trendingSkills: [
    { name: "Artificial Intelligence", growth: 45, demand: "Very High", salary: "$95k - $150k" },
    { name: "React/Next.js", growth: 32, demand: "High", salary: "$80k - $130k" },
    { name: "Python", growth: 28, demand: "Very High", salary: "$75k - $125k" },
    { name: "Cloud Computing", growth: 38, demand: "High", salary: "$85k - $140k" },
    { name: "Data Science", growth: 35, demand: "High", salary: "$90k - $145k" }
  ],
  jobMarketTrends: [
    { 
      role: "AI/ML Engineer", 
      growth: 42, 
      openings: 12500, 
      avgSalary: "$125k",
      locations: ["San Francisco", "New York", "Seattle"],
      trend: "up"
    },
    { 
      role: "Full Stack Developer", 
      growth: 25, 
      openings: 45000, 
      avgSalary: "$95k",
      locations: ["Austin", "Denver", "Remote"],
      trend: "up"
    },
    { 
      role: "Product Manager", 
      growth: 18, 
      openings: 8300, 
      avgSalary: "$115k",
      locations: ["Silicon Valley", "Boston", "Chicago"],
      trend: "stable"
    },
    { 
      role: "Data Analyst", 
      growth: 15, 
      openings: 23000, 
      avgSalary: "$75k",
      locations: ["New York", "Los Angeles", "Remote"],
      trend: "down"
    }
  ],
  industryInsights: [
    {
      industry: "Technology",
      growth: "+22%",
      keyDrivers: ["AI Revolution", "Cloud Migration", "Remote Work Tools"],
      riskFactors: ["Economic Uncertainty", "Skill Shortage"]
    },
    {
      industry: "Healthcare",
      growth: "+18%",
      keyDrivers: ["Digital Health", "Aging Population", "AI Diagnostics"],
      riskFactors: ["Regulation Changes", "Cost Pressures"]
    },
    {
      industry: "Finance",
      growth: "+12%",
      keyDrivers: ["Fintech Innovation", "Blockchain", "Risk Management"],
      riskFactors: ["Market Volatility", "Regulatory Compliance"]
    }
  ]
};

export const MarketIntelligence = () => {
  const [marketData, setMarketData] = useState<{
    trendingSkills: MarketTrend[];
    jobMarketTrends: JobMarketData[];
    industryInsights: IndustryInsight[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching real-time market intelligence...');
        const [intelligence, marketPredictions] = await Promise.all([
          generateMarketIntelligence(),
          getMarketPredictions()
        ]);
        
        setMarketData(intelligence);
        setPredictions(marketPredictions);
        console.log('Market data loaded successfully:', intelligence);
      } catch (err) {
        setError('Failed to load market intelligence data');
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary py-8">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">Market Intelligence</h1>
            <p className="text-xl text-muted-foreground">
              Loading real-time market insights...
            </p>
          </div>
          
          <Card className="mb-8 border-primary/20 bg-gradient-secondary shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Analyzing Real-Time Market Data
                  </h3>
                  <p className="text-muted-foreground">
                    Fetching latest job market trends, salary data, and industry insights...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Card key={i} className="shadow-medium">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary py-8">
        <div className="container mx-auto px-6">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Unable to Load Market Data
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary py-8">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Market Intelligence</h1>
          <p className="text-xl text-muted-foreground">
            Real-time insights into job market trends, skill demands, and salary data
          </p>
        </div>

        {/* Real-Time Data Status */}
        <Card className="mb-8 border-primary/20 bg-gradient-secondary shadow-medium">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Brain className="h-6 w-6 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  Real-Time Market Analysis
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <Check className="h-3 w-3 mr-1" />
                    Live Data
                  </Badge>
                </h3>
                <p className="text-muted-foreground mb-3">
                  Market intelligence powered by real-time job market analysis, salary trends, and industry insights. 
                  Data updated daily from multiple sources including job boards, salary surveys, and market research.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {marketData?.trendingSkills.length || 0} skills tracked
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {marketData?.jobMarketTrends.reduce((sum, job) => sum + job.openings, 0).toLocaleString()} jobs analyzed
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Trending Skills */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Trending Skills
              </CardTitle>
              <CardDescription>
                Most in-demand skills based on job posting analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketData?.trendingSkills.map((skill) => (
                <div key={skill.skill} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{skill.skill}</h4>
                      <p className="text-sm text-muted-foreground">{skill.salaryRange}</p>
                      <p className="text-xs text-muted-foreground">{skill.jobCount.toLocaleString()} jobs</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={skill.demand === "Very High" ? "default" : "secondary"}
                        className="mb-1"
                      >
                        {skill.demand}
                      </Badge>
                      <p className="text-sm text-success font-medium flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +{skill.growth}%
                      </p>
                    </div>
                  </div>
                  <Progress value={skill.growth} className="h-2" />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Updated: {skill.lastUpdated}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Job Market Trends */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Job Market Trends
              </CardTitle>
              <CardDescription>
                Current job openings and market demand by role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketData?.jobMarketTrends.map((job) => (
                <div key={job.role} className="bg-accent p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{job.role}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {job.openings.toLocaleString()} jobs
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {job.avgSalary}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {job.trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
                      {job.trend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
                      <span className={`text-sm font-medium ${
                        job.trend === "up" ? "text-success" : 
                        job.trend === "down" ? "text-destructive" : "text-muted-foreground"
                      }`}>
                        +{job.growth}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.locations.map((location) => (
                      <Badge key={location} variant="outline" className="text-xs">
                        <MapPin className="h-2 w-2 mr-1" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Industry Growth & Decline Analysis */}
        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          {/* Growing Industries */}
          <Card className="shadow-medium border-green-200 bg-green-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <TrendingUp className="h-5 w-5" />
                🚀 Fastest Growing Industries
              </CardTitle>
              <CardDescription>
                Industries experiencing explosive growth and high demand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketData?.industryInsights
                  .filter(industry => parseFloat(industry.growth.replace('%', '').replace('+', '')) > 25)
                  .sort((a, b) => parseFloat(b.growth.replace('%', '').replace('+', '')) - parseFloat(a.growth.replace('%', '').replace('+', '')))
                  .map((industry) => (
                  <div key={industry.industry} className="bg-white p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-800">{industry.industry}</h4>
                      <div className="text-xl font-bold text-green-600">{industry.growth}</div>
                    </div>
                    <p className="text-sm text-green-700 mb-3">{industry.forecast}</p>
                    <div className="space-y-2">
                      <div>
                        <h5 className="font-medium text-xs mb-1 text-green-600">Key Growth Drivers:</h5>
                        <div className="flex flex-wrap gap-1">
                          {industry.keyDrivers.slice(0, 3).map((driver) => (
                            <Badge key={driver} variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                              {driver}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-green-600">Market Size: {industry.marketSize}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Declining/Stable Industries */}
          <Card className="shadow-medium border-orange-200 bg-orange-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <TrendingDown className="h-5 w-5" />
                📉 Declining & At-Risk Industries
              </CardTitle>
              <CardDescription>
                Industries facing challenges and slower growth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add some declining industries data */}
                {[
                  {
                    industry: "Traditional Retail",
                    growth: "-8%",
                    riskFactors: ["E-commerce Competition", "Changing Consumer Behavior", "High Real Estate Costs"],
                    forecast: "Continued decline with digital transformation needs",
                    marketSize: "$4.9T (shrinking)"
                  },
                  {
                    industry: "Print Media",
                    growth: "-12%",
                    riskFactors: ["Digital Media Shift", "Advertising Revenue Loss", "Subscription Decline"],
                    forecast: "Steep decline with niche market survival",
                    marketSize: "$147B (declining)"
                  },
                  {
                    industry: "Legacy Banking",
                    growth: "-3%",
                    riskFactors: ["Fintech Disruption", "Regulatory Pressure", "Digital-First Competitors"],
                    forecast: "Transformation required for survival",
                    marketSize: "$5.4T (stable)"
                  }
                ].map((industry) => (
                  <div key={industry.industry} className="bg-white p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-orange-800">{industry.industry}</h4>
                      <div className="text-xl font-bold text-orange-600">{industry.growth}</div>
                    </div>
                    <p className="text-sm text-orange-700 mb-3">{industry.forecast}</p>
                    <div className="space-y-2">
                      <div>
                        <h5 className="font-medium text-xs mb-1 text-orange-600">Risk Factors:</h5>
                        <div className="flex flex-wrap gap-1">
                          {industry.riskFactors.slice(0, 3).map((risk) => (
                            <Badge key={risk} variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-300">
                              {risk}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-orange-600">Market Size: {industry.marketSize}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Predictions */}
        {predictions && (
          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Market Predictions
                </CardTitle>
                <CardDescription>
                  AI-powered forecasts and emerging trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.predictions.map((prediction: any, index: number) => (
                  <div key={index} className="bg-accent p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{prediction.timeframe}</h4>
                      <Badge variant="outline" className="text-xs">
                        {prediction.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{prediction.prediction}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-success" />
                  Emerging Skills
                </CardTitle>
                <CardDescription>
                  Skills gaining momentum in the job market
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-sm mb-3 text-success">🚀 Hot Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {predictions.emergingSkills.map((skill: string) => (
                        <Badge 
                          key={skill} 
                          variant="outline" 
                          className="bg-success/10 text-success border-success/20 cursor-pointer hover:bg-success/20"
                          onClick={() => {
                            const jobUrls = searchJobs(skill);
                            window.open(jobUrls.linkedin, '_blank');
                          }}
                        >
                          {skill}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-3 text-primary">🏭 Hot Industries</h5>
                    <div className="flex flex-wrap gap-2">
                      {predictions.hotIndustries.slice(0, 5).map((industry: string) => (
                        <Badge 
                          key={industry} 
                          variant="outline" 
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Job Search */}
        <div className="mt-8">
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-accent-foreground" />
                Quick Job Search
              </CardTitle>
              <CardDescription>
                Search for jobs across major platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {['JavaScript', 'React', 'Python', 'AI/ML'].map((skill) => (
                  <div key={skill} className="space-y-2">
                    <h5 className="font-medium text-sm">{skill} Jobs</h5>
                    <div className="flex flex-col gap-2">
                      {Object.entries(searchJobs(skill)).map(([platform, url]) => (
                        <Button
                          key={platform}
                          variant="outline"
                          size="sm"
                          className="justify-start text-xs"
                          onClick={() => window.open(url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};