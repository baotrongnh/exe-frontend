'use client';

import { useState, useEffect, useCallback } from 'react';
import { jobsAPI, type ApiJob } from '@/lib/jobs-api';

// Interface for detailed job view (matching what the UI expects)
export interface JobDetail {
     id: string;
     title: string;
     company: string;
     location: string;
     type: "Part-Time" | "Full-Time" | "Remote" | "Internship" | "Contract";
     categories: string[];
     level: "Entry Level" | "Mid Level" | "Senior Level" | "Director" | "VP or Above";
     salary: number;
     applied: number;
     capacity: number;
     logo: string;
     logoColor: string;
     description: string;
     responsibilities: string[];
     requirements: string[];
     niceToHave: string[];
     perks: Array<{
          title: string;
          description: string;
          icon: string;
     }>;
     companyDescription: string;
     companyLink: string;
     deadline: string;
     createdAt: string;
     updatedAt: string;
     // Additional fields for sidebar
     applyBefore: string;
     postedOn: string;
     salaryRange: string;
     skills: string[];
}

export interface UseJobDetailReturn {
     job: JobDetail | null;
     loading: boolean;
     error: string | null;
     refetch: () => void;
}

// Transform API job to detailed job format
const transformApiJobToDetail = (apiJob: ApiJob): JobDetail => {
     // Job type mapping
     const typeMapping: { [key: string]: JobDetail['type'] } = {
          'FULLTIME': 'Full-Time',
          'PARTTIME': 'Part-Time',
          'FREELANCE': 'Contract',
          'INTERNSHIP': 'Internship',
          'CONTRACT': 'Contract',
          'PROJECT': 'Contract' // New mapping for PROJECT type
     };

     // Experience level mapping
     const levelMapping: { [key: string]: JobDetail['level'] } = {
          'INTERN': 'Entry Level',
          'ENTRY': 'Entry Level',
          'INTERMEDIATE': 'Mid Level',
          'EXPERT': 'Senior Level',
          'SENIOR': 'Senior Level' // New mapping for SENIOR level
     };

     // Generate consistent data based on job ID
     const jobIdHash = parseInt(apiJob.id.replace(/[^0-9]/g, '').slice(0, 8) || '0');

     // Company data
     const companies = [
          { name: 'TechCorp Inc.', link: 'https://techcorp.com' },
          { name: 'InnovateHub', link: 'https://innovatehub.com' },
          { name: 'DevStudio Pro', link: 'https://devstudio.com' },
          { name: 'CodeWorks Ltd.', link: 'https://codeworks.com' },
          { name: 'StartupForge', link: 'https://startupforge.com' },
          { name: 'DigitalFlow', link: 'https://digitalflow.com' },
          { name: 'WebCraft Solutions', link: 'https://webcraft.com' },
          { name: 'AppVision', link: 'https://appvision.com' }
     ];

     const company = companies[jobIdHash % companies.length];

     // Locations
     const locations = [
          'New York, NY', 'San Francisco, CA', 'Remote Worldwide', 'London, UK',
          'Berlin, Germany', 'Toronto, Canada', 'Austin, TX', 'Seattle, WA',
          'Amsterdam, Netherlands', 'Sydney, Australia'
     ];

     // Logo and colors
     const logoColors = [
          'bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
          'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-500'
     ];

     const firstLetter = (apiJob.title || 'J').charAt(0).toUpperCase();
     const logoColor = logoColors[jobIdHash % logoColors.length];
     const location = locations[jobIdHash % locations.length];

     // Generate responsibilities based on skills
     const baseResponsibilities = [
          'Collaborate with cross-functional teams to deliver high-quality solutions',
          'Write clean, maintainable, and efficient code',
          'Participate in code reviews and maintain coding standards',
          'Stay up-to-date with emerging technologies and industry trends',
          'Contribute to technical documentation and knowledge sharing'
     ];

     const skillBasedResponsibilities = apiJob.skills_required.map(skill =>
          `Develop and maintain applications using ${skill}`
     );

     const responsibilities = [...skillBasedResponsibilities, ...baseResponsibilities].slice(0, 6);

     // Generate requirements
     const baseRequirements = [
          'Bachelor\'s degree in Computer Science or related field',
          'Strong problem-solving and analytical skills',
          'Excellent communication and teamwork abilities',
          'Experience with version control systems (Git)',
          'Understanding of software development best practices'
     ];

     const skillRequirements = apiJob.skills_required.map(skill =>
          `Professional experience with ${skill}`
     );

     const requirements = [...skillRequirements, ...baseRequirements].slice(0, 6);

     // Nice to have
     const niceToHave = [
          'Experience with cloud platforms (AWS, Azure, or GCP)',
          'Knowledge of containerization technologies (Docker, Kubernetes)',
          'Experience with CI/CD pipelines',
          'Open source contributions',
          'Experience with agile development methodologies'
     ];

     // Perks
     const allPerks = [
          { title: 'Health Insurance', description: 'Comprehensive health coverage', icon: '🏥' },
          { title: 'Remote Work', description: 'Flexible work from anywhere', icon: '🏠' },
          { title: 'Learning Budget', description: '$2000 annual learning allowance', icon: '📚' },
          { title: 'Unlimited PTO', description: 'Take time off when you need it', icon: '🏖️' },
          { title: 'Stock Options', description: 'Equity in the company', icon: '📈' },
          { title: 'Gym Membership', description: 'Health and wellness support', icon: '💪' },
          { title: 'Team Retreats', description: 'Annual company retreats', icon: '✈️' },
          { title: 'Latest Equipment', description: 'Top-tier hardware and tools', icon: '💻' }
     ];

     // Select 4-6 random perks based on job ID
     const selectedPerks: Array<{ title: string; description: string; icon: string }> = [];
     for (let i = 0; i < 5; i++) {
          const perkIndex = (jobIdHash + i) % allPerks.length;
          if (!selectedPerks.find(p => p.title === allPerks[perkIndex].title)) {
               selectedPerks.push(allPerks[perkIndex]);
          }
     }

     // Company descriptions
     const companyDescriptions = [
          'We are a fast-growing technology company focused on innovation and delivering exceptional user experiences. Our team is passionate about creating products that make a real difference.',
          'A leading software development company that specializes in cutting-edge solutions for modern businesses. We value creativity, collaboration, and continuous learning.',
          'An innovative startup building the future of technology. We offer a dynamic work environment where every team member can grow and make an impact.',
          'A well-established company with a startup mindset. We combine the stability of an established business with the agility and innovation of a startup.'
     ];

     return {
          id: apiJob.id,
          title: apiJob.title || 'Software Developer',
          company: company.name,
          location: location,
          type: typeMapping[apiJob.job_type] || 'Full-Time',
          categories: apiJob.skills_required || [],
          level: levelMapping[apiJob.experience_level] || 'Entry Level',
          salary: apiJob.currency === 'VND'
               ? Math.round(parseFloat(apiJob.budget_max) / 1000000) // Convert VND to millions
               : parseFloat(apiJob.budget_max) || 0,
          applied: apiJob.applications_count || 0,
          capacity: Math.floor(Math.random() * 20) + 5,
          logo: firstLetter,
          logoColor: logoColor,
          description: apiJob.description || 'Join our team and help us build amazing products.',
          responsibilities,
          requirements,
          niceToHave,
          perks: selectedPerks,
          companyDescription: companyDescriptions[jobIdHash % companyDescriptions.length],
          companyLink: company.link,
          deadline: apiJob.deadline,
          createdAt: apiJob.createdAt,
          updatedAt: apiJob.updatedAt,
          // Additional fields for sidebar
          applyBefore: new Date(apiJob.deadline).toLocaleDateString('en-US', {
               year: 'numeric',
               month: 'long',
               day: 'numeric'
          }),
          postedOn: (() => {
               const postedDate = new Date(apiJob.createdAt);
               // Handle invalid dates (like 1970)
               if (postedDate.getFullYear() < 2000) {
                    return new Date().toLocaleDateString('en-US', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                    });
               }
               return postedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
               });
          })(),
          salaryRange: (() => {
               const currency = apiJob.currency === 'VND' ? 'VND' : '$';
               const min = apiJob.currency === 'VND'
                    ? (parseFloat(apiJob.budget_min) / 1000000).toFixed(0) + 'M'
                    : parseFloat(apiJob.budget_min).toFixed(0);
               const max = apiJob.currency === 'VND'
                    ? (parseFloat(apiJob.budget_max) / 1000000).toFixed(0) + 'M'
                    : parseFloat(apiJob.budget_max).toFixed(0);

               return apiJob.currency === 'VND'
                    ? `${min} - ${max} VND`
                    : `${currency}${min} - ${currency}${max}`;
          })(),
          skills: apiJob.skills_required || [],
     };
};

export const useJobDetail = (jobId: string): UseJobDetailReturn => {
     const [job, setJob] = useState<JobDetail | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const fetchJob = useCallback(async () => {
          if (!jobId) return;

          try {
               setLoading(true);
               setError(null);

               const apiJob = await jobsAPI.getJobById(jobId);
               const transformedJob = transformApiJobToDetail(apiJob);

               setJob(transformedJob);
          } catch (err) {
               const errorMessage = err instanceof Error ? err.message : 'Failed to fetch job details';
               setError(errorMessage);
               console.error('Error fetching job detail:', err);
          } finally {
               setLoading(false);
          }
     }, [jobId]);

     useEffect(() => {
          fetchJob();
     }, [fetchJob]);

     const refetch = useCallback(() => {
          fetchJob();
     }, [fetchJob]);

     return {
          job,
          loading,
          error,
          refetch,
     };
};