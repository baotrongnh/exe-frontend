const API_BASE_URL = 'http://14.169.93.37:3003/api/v1';

export interface ApiJob {
     id: string;
     owner_id: string;
     title: string;
     description: string;
     job_type: "FULLTIME" | "PARTTIME" | "FREELANCE" | "INTERNSHIP" | "CONTRACT";
     budget_type: "FIXED" | "HOURLY";
     budget_min: string;
     budget_max: string;
     currency: string;
     experience_level: "INTERN" | "ENTRY" | "INTERMEDIATE" | "EXPERT";
     deadline: string;
     status: "active" | "inactive" | "completed" | "cancelled";
     applications_count: number;
     skills_required: string[];
     rejection_reason?: string;
     createdAt: string;
     updatedAt: string;
     category_id?: string;
}

export interface ApiJobDetailResponse {
     success: boolean;
     data: ApiJob;
}

export interface ApiResponse {
     success: boolean;
     data: ApiJob[];
     pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
     };
}

export interface JobsResponse {
     jobs: ApiJob[];
     total: number;
     page: number;
     limit: number;
}

export interface JobsFilters {
     search?: string;
     location?: string;
     type?: string;
     level?: string;
     categories?: string[];
     salaryMin?: number;
     salaryMax?: number;
     page?: number;
     limit?: number;
     sortBy?: 'createdAt' | 'salary' | 'title' | 'company';
     sortOrder?: 'asc' | 'desc';
}

class JobsAPI {
     private async fetchWithErrorHandling(url: string, options?: RequestInit): Promise<any> {
          try {
               const response = await fetch(url, {
                    headers: {
                         'Content-Type': 'application/json',
                         ...options?.headers,
                    },
                    ...options,
               });

               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }

               return await response.json();
          } catch (error) {
               console.error('API Error:', error);
               throw error;
          }
     }

     async getJobs(filters: JobsFilters = {}): Promise<JobsResponse> {
          const params = new URLSearchParams();

          // Add filters to query params
          if (filters.search) params.append('search', filters.search);
          if (filters.location) params.append('location', filters.location);
          if (filters.type) params.append('job_type', filters.type);
          if (filters.level) params.append('experience_level', filters.level);
          if (filters.categories?.length) params.append('categories', filters.categories.join(','));
          if (filters.salaryMin) params.append('budget_min', filters.salaryMin.toString());
          if (filters.salaryMax) params.append('budget_max', filters.salaryMax.toString());
          if (filters.page) params.append('page', filters.page.toString());
          if (filters.limit) params.append('limit', filters.limit.toString());
          if (filters.sortBy) params.append('sortBy', filters.sortBy);
          if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

          const queryString = params.toString();
          const url = `${API_BASE_URL}/jobs${queryString ? `?${queryString}` : ''}`;

          const apiResponse: ApiResponse = await this.fetchWithErrorHandling(url);

          // Transform the API response to match our JobsResponse interface
          return {
               jobs: apiResponse.data,
               total: apiResponse.pagination.total,
               page: apiResponse.pagination.page,
               limit: apiResponse.pagination.limit,
          };
     }

     async getJobById(id: string): Promise<ApiJob> {
          const url = `${API_BASE_URL}/jobs/${id}`;
          const response: ApiJobDetailResponse = await this.fetchWithErrorHandling(url);
          return response.data;
     }

     async createJob(jobData: Partial<ApiJob>): Promise<ApiJob> {
          const url = `${API_BASE_URL}/jobs`;
          return this.fetchWithErrorHandling(url, {
               method: 'POST',
               body: JSON.stringify(jobData),
          });
     }

     async updateJob(id: string, jobData: Partial<ApiJob>): Promise<ApiJob> {
          const url = `${API_BASE_URL}/jobs/${id}`;
          return this.fetchWithErrorHandling(url, {
               method: 'PUT',
               body: JSON.stringify(jobData),
          });
     }

     async deleteJob(id: string): Promise<void> {
          const url = `${API_BASE_URL}/jobs/${id}`;
          await this.fetchWithErrorHandling(url, {
               method: 'DELETE',
          });
     }
}

export const jobsAPI = new JobsAPI();