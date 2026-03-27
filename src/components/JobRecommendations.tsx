import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  ExternalLink,
  Building
} from "lucide-react";

interface JobRecommendationsProps {
  userSkills?: Array<{ name: string; level: number }>;
  userInterests?: string[];
  userExperience?: string;
  filterByRole?: string;
}

// Static job data to ensure it always works
const STATIC_JOBS = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'TCS',
    location: 'Bangalore',
    salary: '₹8 - 15 LPA',
    experience: '2+ years',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    description: 'Join our team as a Software Engineer. Work on innovative projects with cutting-edge technologies.',
    remote: false,
    applyUrl: 'https://careers.tcs.com'
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'Infosys',
    location: 'Hyderabad',
    salary: '₹6 - 12 LPA',
    experience: '1+ years',
    skills: ['React', 'Node.js', 'Python', 'AWS'],
    description: 'Looking for a talented Full Stack Developer to build scalable web applications.',
    remote: true,
    applyUrl: 'https://careers.infosys.com'
  },
  {
    id: '3',
    title: 'Frontend Developer',
    company: 'Wipro',
    location: 'Mumbai',
    salary: '₹5 - 10 LPA',
    experience: '1+ years',
    skills: ['React', 'TypeScript', 'CSS3', 'HTML5'],
    description: 'Create amazing user experiences as a Frontend Developer in our dynamic team.',
    remote: false,
    applyUrl: 'https://careers.wipro.com'
  },
  {
    id: '4',
    title: 'Backend Developer',
    company: 'HCL Technologies',
    location: 'Chennai',
    salary: '₹7 - 13 LPA',
    experience: '3+ years',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Docker'],
    description: 'Build robust backend systems and APIs for enterprise applications.',
    remote: false,
    applyUrl: 'https://careers.hcltech.com'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'Tech Mahindra',
    location: 'Pune',
    salary: '₹9 - 16 LPA',
    experience: '2+ years',
    skills: ['AWS', 'Kubernetes', 'Docker', 'Jenkins'],
    description: 'Manage cloud infrastructure and deployment pipelines for modern applications.',
    remote: true,
    applyUrl: 'https://careers.techmahindra.com'
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'Accenture',
    location: 'Delhi',
    salary: '₹10 - 18 LPA',
    experience: '2+ years',
    skills: ['Python', 'TensorFlow', 'Pandas', 'Scikit-learn'],
    description: 'Analyze complex data sets and build machine learning models for business insights.',
    remote: false,
    applyUrl: 'https://careers.accenture.com'
  }
];

export const JobRecommendations = ({ 
  userSkills = [], 
  userInterests = [], 
  userExperience = "", 
  filterByRole 
}: JobRecommendationsProps) => {
  
  const handleApplyJob = (applyUrl: string) => {
    window.open(applyUrl, '_blank');
  };

  const getMatchScore = (jobSkills: string[]): number => {
    if (!userSkills.length) return 75;
    
    const matchingSkills = jobSkills.filter(skill => 
      userSkills.some(userSkill => 
        skill.toLowerCase().includes(userSkill.name.toLowerCase()) ||
        userSkill.name.toLowerCase().includes(skill.toLowerCase())
      )
    );
    
    return Math.min(95, 60 + (matchingSkills.length * 10));
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          🚀 Job Opportunities in India
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Discover {STATIC_JOBS.length} opportunities tailored to your skills across major Indian cities
        </p>
        
        {/* Skills Summary */}
        {userSkills.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Matching jobs based on your skills:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {userSkills.slice(0, 8).map((skill, index) => (
                <Badge key={index} variant="outline" className="bg-primary/10">
                  {skill.name}
                </Badge>
              ))}
              {userSkills.length > 8 && (
                <Badge variant="outline" className="bg-muted">
                  +{userSkills.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Job Listings */}
      <div className="grid gap-6">
        {STATIC_JOBS.map((job) => {
          const matchScore = getMatchScore(job.skills);
          
          return (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium">{matchScore}% Match</span>
                    </div>
                    <Badge variant="default">Full-time</Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{job.description}</p>
                  
                  <div>
                    <h4 className="font-medium mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => {
                        const isUserSkill = userSkills.some(userSkill => 
                          skill.toLowerCase().includes(userSkill.name.toLowerCase()) ||
                          userSkill.name.toLowerCase().includes(skill.toLowerCase())
                        );
                        
                        return (
                          <Badge 
                            key={index} 
                            variant={isUserSkill ? "default" : "outline"}
                            className={isUserSkill ? "bg-green-100 text-green-800 border-green-300" : ""}
                          >
                            {isUserSkill && "✓ "}
                            {skill}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Experience: {job.experience}</span>
                      <span>Posted 2 days ago</span>
                      {job.remote && (
                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          Remote
                        </Badge>
                      )}
                    </div>
                    
                    <Button onClick={() => handleApplyJob(job.applyUrl)} className="ml-4">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Load More Button */}
      <div className="text-center mt-8">
        <Button variant="outline" size="lg">
          <Briefcase className="h-4 w-4 mr-2" />
          Load More Jobs
        </Button>
      </div>
    </div>
  );
};
