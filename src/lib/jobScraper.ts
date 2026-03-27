// Job scraping service for Indian job markets
export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  experience: string;
  skills: string[];
  description: string;
  postedDate: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  remote: boolean;
  applyUrl?: string;
}

export interface JobSearchParams {
  location?: string;
  skills?: string[];
  experience?: string;
  jobType?: string;
  remote?: boolean;
}

// Indian cities for job search
export const INDIAN_CITIES = [
  'Bangalore',
  'Hyderabad', 
  'Mumbai',
  'Delhi',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Gurgaon',
  'Noida'
];

// Mock job data generator (in real implementation, this would scrape from job sites)
const generateMockJobs = (params: JobSearchParams): JobListing[] => {
  const companies = [
    'TCS', 'Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra',
    'Accenture', 'IBM', 'Microsoft', 'Google', 'Amazon',
    'Flipkart', 'Paytm', 'Zomato', 'Swiggy', 'BYJU\'S',
    'Ola', 'Uber', 'PhonePe', 'Razorpay', 'Freshworks'
  ];

  const jobTitles = [
    'Software Engineer', 'Senior Software Engineer', 'Full Stack Developer',
    'Frontend Developer', 'Backend Developer', 'DevOps Engineer',
    'Data Scientist', 'Machine Learning Engineer', 'Product Manager',
    'UI/UX Designer', 'Quality Assurance Engineer', 'Business Analyst',
    'Technical Lead', 'Engineering Manager', 'Cloud Architect'
  ];

  const skillSets = [
    ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    ['Python', 'Django', 'PostgreSQL', 'AWS'],
    ['Java', 'Spring Boot', 'MySQL', 'Docker'],
    ['React Native', 'Flutter', 'iOS', 'Android'],
    ['Python', 'TensorFlow', 'Pandas', 'Scikit-learn'],
    ['AWS', 'Kubernetes', 'Docker', 'Jenkins'],
    ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
    ['Vue.js', 'Nuxt.js', 'Vuex', 'CSS3'],
    ['C#', '.NET Core', 'SQL Server', 'Azure'],
    ['Go', 'Microservices', 'Redis', 'Kafka']
  ];

  const locations = params.location ? [params.location] : INDIAN_CITIES;
  const jobs: JobListing[] = [];

  for (let i = 0; i < 50; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const skills = skillSets[Math.floor(Math.random() * skillSets.length)];
    
    // Filter by user skills if provided
    if (params.skills && params.skills.length > 0) {
      const hasMatchingSkill = skills.some(skill => 
        params.skills!.some(userSkill => 
          skill.toLowerCase().includes(userSkill.toLowerCase()) ||
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      if (!hasMatchingSkill) continue;
    }

    const experienceYears = Math.floor(Math.random() * 8) + 1;
    const experienceText = experienceYears <= 2 ? 'Entry Level' : 
                          experienceYears <= 5 ? 'Mid Level' : 'Senior Level';
    
    // Filter by experience if provided
    if (params.experience && !experienceText.toLowerCase().includes(params.experience.toLowerCase())) {
      continue;
    }

    const salary = `₹${(Math.floor(Math.random() * 20) + 5)} - ${(Math.floor(Math.random() * 30) + 15)} LPA`;
    const isRemote = Math.random() > 0.7;
    
    // Filter by remote preference
    if (params.remote !== undefined && params.remote !== isRemote) {
      continue;
    }

    const jobTypes: JobListing['jobType'][] = ['Full-time', 'Part-time', 'Contract', 'Internship'];
    const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    
    // Filter by job type if provided
    if (params.jobType && jobType !== params.jobType) {
      continue;
    }

    jobs.push({
      id: `job_${i}_${Date.now()}`,
      title,
      company,
      location: isRemote ? `${location} (Remote)` : location,
      salary,
      experience: `${experienceYears}+ years`,
      skills,
      description: `We are looking for a talented ${title} to join our ${company} team. The ideal candidate should have ${experienceYears}+ years of experience in ${skills.slice(0, 2).join(' and ')}. You will be responsible for developing and maintaining high-quality software solutions.`,
      postedDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
      jobType,
      remote: isRemote,
      applyUrl: `https://careers.${company.toLowerCase().replace(/\s+/g, '')}.com/apply/${i}`
    });
  }

  return jobs.slice(0, 20); // Return top 20 matches
};

// Main job search function
export const searchJobs = async (params: JobSearchParams = {}): Promise<JobListing[]> => {
  try {
    console.log('Searching jobs with params:', params);
    
    // In a real implementation, this would make API calls to job sites
    // For now, we'll use mock data
    const jobs = generateMockJobs(params);
    
    // Sort by relevance (mock scoring based on skill matches)
    return jobs.sort((a, b) => {
      if (params.skills && params.skills.length > 0) {
        const aMatches = a.skills.filter(skill => 
          params.skills!.some(userSkill => 
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        ).length;
        
        const bMatches = b.skills.filter(skill => 
          params.skills!.some(userSkill => 
            skill.toLowerCase().includes(userSkill.toLowerCase())
          )
        ).length;
        
        return bMatches - aMatches;
      }
      
      // Sort by posted date if no skill filtering
      return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    });
    
  } catch (error) {
    console.error('Error searching jobs:', error);
    return [];
  }
};

// Get jobs by location
export const getJobsByLocation = async (location: string): Promise<JobListing[]> => {
  return searchJobs({ location });
};

// Get jobs by skills
export const getJobsBySkills = async (skills: string[]): Promise<JobListing[]> => {
  return searchJobs({ skills });
};

// Get trending jobs in major Indian cities
export const getTrendingJobs = async (): Promise<JobListing[]> => {
  const trendingSkills = ['React', 'Python', 'Java', 'AWS', 'Node.js'];
  return searchJobs({ skills: trendingSkills });
};

// Real job scraping functions (for future implementation)
export const scrapeNaukriJobs = async (params: JobSearchParams): Promise<JobListing[]> => {
  // TODO: Implement Naukri.com scraping
  console.log('Naukri scraping not implemented yet, using mock data');
  return generateMockJobs(params);
};

export const scrapeLinkedInJobs = async (params: JobSearchParams): Promise<JobListing[]> => {
  // TODO: Implement LinkedIn Jobs scraping
  console.log('LinkedIn scraping not implemented yet, using mock data');
  return generateMockJobs(params);
};

export const scrapeIndeedJobs = async (params: JobSearchParams): Promise<JobListing[]> => {
  // TODO: Implement Indeed India scraping
  console.log('Indeed scraping not implemented yet, using mock data');
  return generateMockJobs(params);
};

// Aggregate jobs from multiple sources
export const aggregateJobsFromAllSources = async (params: JobSearchParams): Promise<JobListing[]> => {
  try {
    const [naukriJobs, linkedinJobs, indeedJobs] = await Promise.all([
      scrapeNaukriJobs(params),
      scrapeLinkedInJobs(params),
      scrapeIndeedJobs(params)
    ]);
    
    // Combine and deduplicate jobs
    const allJobs = [...naukriJobs, ...linkedinJobs, ...indeedJobs];
    const uniqueJobs = allJobs.filter((job, index, self) => 
      index === self.findIndex(j => j.title === job.title && j.company === job.company)
    );
    
    return uniqueJobs.slice(0, 30); // Return top 30 unique jobs
  } catch (error) {
    console.error('Error aggregating jobs:', error);
    return generateMockJobs(params);
  }
};
