'use client';

import { useState, useEffect, useCallback } from 'react';
import { jobsAPI, type JobsFilters, type JobsResponse, type ApiJob } from '@/lib/jobs-api';
import { type Job } from '@/data/jobs';

// Transform API job to match our Job interface
const transformApiJob = (apiJob: ApiJob): Job => {
     // Map job_type to our expected format
     const typeMapping: { [key: string]: Job['type'] } = {
          'FULLTIME': 'Full-Time',
          'PARTTIME': 'Part-Time',
          'FREELANCE': 'Contract',
          'INTERNSHIP': 'Internship',
          'CONTRACT': 'Contract',
          'PROJECT': 'Contract' // New mapping for PROJECT type
     };

     // Map experience_level to our expected format
     const levelMapping: { [key: string]: Job['level'] } = {
          'INTERN': 'Entry Level',
          'ENTRY': 'Entry Level',
          'INTERMEDIATE': 'Mid Level',
          'EXPERT': 'Senior Level',
          'SENIOR': 'Senior Level' // New mapping for SENIOR level
     };

     // Generate a simple logo from job title (first letter)
     const firstLetter = (apiJob.title || 'J').charAt(0).toUpperCase();
     const logoColors = [
          'bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
          'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-gray-500'
     ];
     // Use job ID to determine color consistently
     const colorIndex = parseInt(apiJob.id.replace(/[^0-9]/g, '').slice(0, 1) || '0') % logoColors.length;
     const logoColor = logoColors[colorIndex];

     // Generate company name from budget or default
     const companyNames = [
          'TechCorp', 'InnovateInc', 'DevStudio', 'CodeWorks', 'StartupHub',
          'DigitalPro', 'WebFlow', 'AppCraft', 'TechVision', 'CloudTech'
     ];
     const companyIndex = parseInt(apiJob.id.replace(/[^0-9]/g, '').slice(1, 2) || '0') % companyNames.length;

     // Generate location based on budget type or random
     const locations = [
          'New York, NY', 'San Francisco, CA', 'Remote', 'London, UK',
          'Berlin, Germany', 'Toronto, Canada', 'Austin, TX', 'Seattle, WA'
     ];
     const locationIndex = parseInt(apiJob.id.replace(/[^0-9]/g, '').slice(2, 3) || '0') % locations.length;

     return {
          id: apiJob.id,
          title: apiJob.title || 'Untitled Position',
          company: companyNames[companyIndex],
          location: locations[locationIndex],
          type: typeMapping[apiJob.job_type] || 'Full-Time',
          categories: apiJob.skills_required || [],
          level: levelMapping[apiJob.experience_level] || 'Entry Level',
          salary: parseFloat(apiJob.budget_max) || 0,
          applied: apiJob.applications_count || 0,
          capacity: Math.floor(Math.random() * 20) + 5, // Random capacity between 5-25
          logo: firstLetter,
          logoColor: logoColor,
          description: apiJob.description,
          requirements: apiJob.skills_required,
          createdAt: apiJob.createdAt,
          updatedAt: apiJob.updatedAt,
     };
};

export interface UseJobsReturn {
     jobs: Job[];
     loading: boolean;
     error: string | null;
     total: number;
     page: number;
     limit: number;
     refetch: () => void;
     setFilters: (filters: JobsFilters) => void;
}

export const useJobs = (initialFilters: JobsFilters = {}): UseJobsReturn => {
     const [jobs, setJobs] = useState<Job[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);
     const [total, setTotal] = useState(0);
     const [page, setPage] = useState(1);
     const [limit, setLimit] = useState(12);
     const [filters, setFilters] = useState<JobsFilters>(initialFilters);

     const fetchJobs = useCallback(async () => {
          try {
               setLoading(true);
               setError(null);

               const response: JobsResponse = await jobsAPI.getJobs({
                    ...filters,
                    page,
                    limit,
               });

               const transformedJobs = response.jobs.map(transformApiJob);

               setJobs(transformedJobs);
               setTotal(response.total);

          } catch (err) {
               const errorMessage = err instanceof Error ? err.message : 'Failed to fetch jobs';
               setError(errorMessage);
               console.error('Error fetching jobs:', err);
          } finally {
               setLoading(false);
          }
     }, [filters, page, limit]);

     useEffect(() => {
          fetchJobs();
     }, [fetchJobs]);

     const handleSetFilters = useCallback((newFilters: JobsFilters) => {
          setFilters(newFilters);
          setPage(1); // Reset to first page when filters change
     }, []);

     const refetch = useCallback(() => {
          fetchJobs();
     }, [fetchJobs]);

     return {
          jobs,
          loading,
          error,
          total,
          page,
          limit,
          refetch,
          setFilters: handleSetFilters,
     };
};