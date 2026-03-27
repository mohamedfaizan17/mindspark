// Course provider integration for real-time course recommendations
// This integrates with popular learning platforms

export interface Course {
  id: string;
  title: string;
  provider: string;
  url: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  enrolled: number;
  price: string;
  skills: string[];
  instructor?: string;
  thumbnail?: string;
}

export interface CourseProvider {
  name: string;
  baseUrl: string;
  searchUrl: (query: string) => string;
  courseUrl: (courseId: string) => string;
}

// Course provider configurations
export const courseProviders: Record<string, CourseProvider> = {
  coursera: {
    name: 'Coursera',
    baseUrl: 'https://www.coursera.org',
    searchUrl: (query: string) => `https://www.coursera.org/search?query=${encodeURIComponent(query)}`,
    courseUrl: (courseId: string) => `https://www.coursera.org/learn/${courseId}`
  },
  udemy: {
    name: 'Udemy',
    baseUrl: 'https://www.udemy.com',
    searchUrl: (query: string) => `https://www.udemy.com/courses/search/?q=${encodeURIComponent(query)}`,
    courseUrl: (courseId: string) => `https://www.udemy.com/course/${courseId}`
  },
  edx: {
    name: 'edX',
    baseUrl: 'https://www.edx.org',
    searchUrl: (query: string) => `https://www.edx.org/search?q=${encodeURIComponent(query)}`,
    courseUrl: (courseId: string) => `https://www.edx.org/course/${courseId}`
  },
  pluralsight: {
    name: 'Pluralsight',
    baseUrl: 'https://www.pluralsight.com',
    searchUrl: (query: string) => `https://www.pluralsight.com/search?q=${encodeURIComponent(query)}`,
    courseUrl: (courseId: string) => `https://www.pluralsight.com/courses/${courseId}`
  },
  youtube: {
    name: 'YouTube',
    baseUrl: 'https://www.youtube.com',
    searchUrl: (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' tutorial')}`,
    courseUrl: (courseId: string) => `https://www.youtube.com/watch?v=${courseId}`
  }
};

// Curated course database with real course links
export const getCourseRecommendations = (skill: string): Course[] => {
  const courseDatabase: Record<string, Course[]> = {
    'JavaScript': [
      {
        id: 'javascript-complete-guide',
        title: 'JavaScript - The Complete Guide 2024',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/',
        description: 'Master JavaScript with the most complete course! Projects, challenges, quizzes, JavaScript ES6+, OOP, AJAX, Webpack',
        duration: '52 hours',
        difficulty: 'Intermediate',
        rating: 4.6,
        enrolled: 180000,
        price: '$84.99',
        skills: ['JavaScript', 'ES6+', 'DOM', 'AJAX'],
        instructor: 'Maximilian Schwarzmüller'
      },
      {
        id: 'javascript-algorithms-data-structures',
        title: 'JavaScript Algorithms and Data Structures',
        provider: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        description: 'Learn JavaScript fundamentals including variables, arrays, objects, loops, and functions',
        duration: '300 hours',
        difficulty: 'Beginner',
        rating: 4.8,
        enrolled: 500000,
        price: 'Free',
        skills: ['JavaScript', 'Algorithms', 'Data Structures'],
        instructor: 'freeCodeCamp'
      }
    ],
    'React': [
      {
        id: 'react-complete-guide',
        title: 'React - The Complete Guide 2024',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        description: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
        duration: '48 hours',
        difficulty: 'Intermediate',
        rating: 4.6,
        enrolled: 220000,
        price: '$84.99',
        skills: ['React', 'Redux', 'Hooks', 'Next.js'],
        instructor: 'Maximilian Schwarzmüller'
      },
      {
        id: 'react-official-tutorial',
        title: 'React Official Tutorial',
        provider: 'React.dev',
        url: 'https://react.dev/learn',
        description: 'Official React documentation and tutorial - learn React from the creators',
        duration: '20 hours',
        difficulty: 'Beginner',
        rating: 4.9,
        enrolled: 1000000,
        price: 'Free',
        skills: ['React', 'JSX', 'Components', 'State'],
        instructor: 'React Team'
      }
    ],
    'Python': [
      {
        id: 'python-complete-bootcamp',
        title: 'Complete Python Bootcamp From Zero to Hero',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/complete-python-bootcamp/',
        description: 'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games',
        duration: '22 hours',
        difficulty: 'Beginner',
        rating: 4.6,
        enrolled: 485000,
        price: '$84.99',
        skills: ['Python', 'OOP', 'Web Development', 'Game Development'],
        instructor: 'Jose Portilla'
      },
      {
        id: 'python-for-everybody',
        title: 'Python for Everybody Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/python',
        description: 'Learn to Program and Analyze Data with Python. Develop programs to gather, clean, analyze, and visualize data.',
        duration: '8 months',
        difficulty: 'Beginner',
        rating: 4.8,
        enrolled: 890000,
        price: '$49/month',
        skills: ['Python', 'Data Analysis', 'Web Scraping', 'Databases'],
        instructor: 'Charles Severance'
      }
    ],
    'Machine Learning': [
      {
        id: 'machine-learning-course',
        title: 'Machine Learning',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/machine-learning',
        description: 'Learn about the most effective machine learning techniques, and gain practice implementing them.',
        duration: '11 weeks',
        difficulty: 'Intermediate',
        rating: 4.9,
        enrolled: 4700000,
        price: '$49/month',
        skills: ['Machine Learning', 'Neural Networks', 'SVM', 'Clustering'],
        instructor: 'Andrew Ng'
      },
      {
        id: 'deep-learning-specialization',
        title: 'Deep Learning Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/deep-learning',
        description: 'Master Deep Learning, and Break into AI. Build neural networks and lead successful machine learning projects.',
        duration: '4 months',
        difficulty: 'Advanced',
        rating: 4.8,
        enrolled: 850000,
        price: '$49/month',
        skills: ['Deep Learning', 'TensorFlow', 'CNN', 'RNN'],
        instructor: 'Andrew Ng'
      }
    ],
    'Node.js': [
      {
        id: 'nodejs-complete-guide',
        title: 'NodeJS - The Complete Guide',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/nodejs-the-complete-guide/',
        description: 'Master Node JS & Deno.js, build REST APIs with Node.js, GraphQL APIs, add Authentication, use MongoDB, SQL & much more!',
        duration: '40 hours',
        difficulty: 'Intermediate',
        rating: 4.6,
        enrolled: 95000,
        price: '$84.99',
        skills: ['Node.js', 'Express', 'MongoDB', 'GraphQL'],
        instructor: 'Maximilian Schwarzmüller'
      }
    ],
    'Cloud Computing': [
      {
        id: 'aws-certified-solutions-architect',
        title: 'AWS Certified Solutions Architect - Associate',
        provider: 'AWS Training',
        url: 'https://aws.amazon.com/training/classroom/aws-certified-solutions-architect-associate/',
        description: 'Prepare for the AWS Certified Solutions Architect - Associate exam',
        duration: '3 days',
        difficulty: 'Intermediate',
        rating: 4.7,
        enrolled: 125000,
        price: '$2000',
        skills: ['AWS', 'Cloud Architecture', 'EC2', 'S3'],
        instructor: 'AWS Training'
      }
    ]
  };

  // Return courses for the specific skill, or empty array if not found
  return courseDatabase[skill] || [];
};

// Generate course URL for enrollment
export const generateEnrollmentUrl = (course: Course): string => {
  // Add tracking parameters for analytics
  const trackingParams = new URLSearchParams({
    utm_source: 'ai_career_advisor',
    utm_medium: 'recommendation',
    utm_campaign: 'learning_path'
  });

  return `${course.url}?${trackingParams.toString()}`;
};

// Search courses across multiple providers
export const searchCourses = (query: string): { provider: string; searchUrl: string }[] => {
  return Object.entries(courseProviders).map(([key, provider]) => ({
    provider: provider.name,
    searchUrl: provider.searchUrl(query)
  }));
};

// Improved skill matching with variations and aliases
const getSkillVariations = (skill: string): string[] => {
  const skillMap: Record<string, string[]> = {
    'JavaScript': ['JavaScript', 'JS', 'ECMAScript', 'Advanced JavaScript'],
    'React': ['React', 'ReactJS', 'React.js'],
    'Python': ['Python', 'Python Programming'],
    'Machine Learning': ['Machine Learning', 'ML', 'Artificial Intelligence', 'AI'],
    'Node.js': ['Node.js', 'NodeJS', 'Node'],
    'Cloud Computing': ['Cloud Computing', 'AWS', 'Cloud', 'Cloud Architecture']
  };

  // Find exact match first
  for (const [key, variations] of Object.entries(skillMap)) {
    if (variations.some(variation => 
      variation.toLowerCase() === skill.toLowerCase() ||
      skill.toLowerCase().includes(variation.toLowerCase()) ||
      variation.toLowerCase().includes(skill.toLowerCase())
    )) {
      return [key, ...variations];
    }
  }

  return [skill];
};

// Enhanced getCourseRecommendations with better matching
export const getCourseRecommendationsEnhanced = (skill: string): Course[] => {
  console.log('Getting course recommendations for skill:', skill);
  
  const courseDatabase: Record<string, Course[]> = {
    'JavaScript': [
      {
        id: 'javascript-complete-guide',
        title: 'JavaScript - The Complete Guide 2024',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/',
        description: 'Master JavaScript with the most complete course! Projects, challenges, quizzes, JavaScript ES6+, OOP, AJAX, Webpack',
        duration: '52 hours',
        difficulty: 'Intermediate',
        rating: 4.6,
        enrolled: 180000,
        price: '$84.99',
        skills: ['JavaScript', 'ES6+', 'DOM', 'AJAX'],
        instructor: 'Maximilian Schwarzmüller'
      },
      {
        id: 'javascript-algorithms-data-structures',
        title: 'JavaScript Algorithms and Data Structures',
        provider: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        description: 'Learn JavaScript fundamentals including variables, arrays, objects, loops, and functions',
        duration: '300 hours',
        difficulty: 'Beginner',
        rating: 4.8,
        enrolled: 500000,
        price: 'Free',
        skills: ['JavaScript', 'Algorithms', 'Data Structures'],
        instructor: 'freeCodeCamp'
      }
    ],
    'React': [
      {
        id: 'react-complete-guide',
        title: 'React - The Complete Guide 2024',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        description: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
        duration: '48 hours',
        difficulty: 'Intermediate',
        rating: 4.6,
        enrolled: 220000,
        price: '$84.99',
        skills: ['React', 'Redux', 'Hooks', 'Next.js'],
        instructor: 'Maximilian Schwarzmüller'
      },
      {
        id: 'react-official-tutorial',
        title: 'React Official Tutorial',
        provider: 'React.dev',
        url: 'https://react.dev/learn',
        description: 'Official React documentation and tutorial - learn React from the creators',
        duration: '20 hours',
        difficulty: 'Beginner',
        rating: 4.9,
        enrolled: 1000000,
        price: 'Free',
        skills: ['React', 'JSX', 'Components', 'State'],
        instructor: 'React Team'
      }
    ],
    'Python': [
      {
        id: 'python-complete-bootcamp',
        title: 'Complete Python Bootcamp From Zero to Hero',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/complete-python-bootcamp/',
        description: 'Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games',
        duration: '22 hours',
        difficulty: 'Beginner',
        rating: 4.6,
        enrolled: 485000,
        price: '$84.99',
        skills: ['Python', 'OOP', 'Web Development', 'Game Development'],
        instructor: 'Jose Portilla'
      }
    ],
    'Machine Learning': [
      {
        id: 'machine-learning-course',
        title: 'Machine Learning',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/machine-learning',
        description: 'Learn about the most effective machine learning techniques, and gain practice implementing them.',
        duration: '11 weeks',
        difficulty: 'Intermediate',
        rating: 4.9,
        enrolled: 4700000,
        price: '$49/month',
        skills: ['Machine Learning', 'Neural Networks', 'SVM', 'Clustering'],
        instructor: 'Andrew Ng'
      }
    ]
  };

  // Try skill variations
  const skillVariations = getSkillVariations(skill);
  console.log('Trying skill variations:', skillVariations);
  
  for (const variation of skillVariations) {
    if (courseDatabase[variation]) {
      console.log('Found courses for variation:', variation, courseDatabase[variation]);
      return courseDatabase[variation];
    }
  }

  console.log('No courses found for skill:', skill);
  return [];
};

// Get course recommendations based on skill gaps
export const getSkillBasedRecommendations = (skillGaps: string[]): Course[] => {
  const allRecommendations: Course[] = [];
  
  skillGaps.forEach(skill => {
    const courses = getCourseRecommendationsEnhanced(skill);
    allRecommendations.push(...courses);
  });

  // Remove duplicates and sort by rating
  const uniqueCourses = allRecommendations.filter((course, index, self) => 
    index === self.findIndex(c => c.id === course.id)
  );

  return uniqueCourses.sort((a, b) => b.rating - a.rating);
};
