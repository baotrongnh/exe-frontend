import apiClient from './api-client';

// User API endpoints
export interface User {
     id: string;
     email: string;
     full_name?: string;
     avatar_url?: string;
     role?: 'job_seeker' | 'employer' | 'admin';
     created_at: string;
     updated_at: string;
}

export interface UserProfile {
     id: string;
     user_id: string;
     bio?: string;
     skills?: string[];
     experience?: string;
     location?: string;
     phone?: string;
     website?: string;
     resume_url?: string;
}

class UserAPI {
     // Lấy thông tin profile của user hiện tại
     async getCurrentUserProfile(): Promise<UserProfile> {
          try {
               const response = await apiClient.get<{ data: UserProfile }>('/user/profile');
               return response.data.data;
          } catch (error) {
               console.error('Error fetching user profile:', error);
               throw error;
          }
     }

     // Cập nhật profile
     async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
          try {
               const response = await apiClient.put<{ data: UserProfile }>('/user/profile', profileData);
               return response.data.data;
          } catch (error) {
               console.error('Error updating profile:', error);
               throw error;
          }
     }

     // Upload resume
     async uploadResume(file: File): Promise<{ resume_url: string }> {
          try {
               const formData = new FormData();
               formData.append('resume', file);

               const response = await apiClient.post<{ data: { resume_url: string } }>('/user/upload-resume', formData, {
                    headers: {
                         'Content-Type': 'multipart/form-data',
                    },
               });
               return response.data.data;
          } catch (error) {
               console.error('Error uploading resume:', error);
               throw error;
          }
     }
}

// Application API endpoints
export interface JobApplication {
     id: string;
     job_id: string;
     user_id: string;
     status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
     cover_letter?: string;
     applied_at: string;
     updated_at: string;
}

class ApplicationAPI {
     // Apply for a job using the endpoint applications/:jobId
     async applyForJob(jobId: string, coverLetter?: string): Promise<JobApplication> {
          try {
               const response = await apiClient.post<{ success: boolean; message: string; data?: JobApplication }>(`/applications/${jobId}`, {
                    cover_letter: coverLetter,
               });

               if (response.data.success && response.data.data) {
                    return response.data.data;
               } else {
                    // Handle case where success is false (already applied)
                    throw new Error(response.data.message);
               }
          } catch (error: any) {
               console.error('Error applying for job:', error);

               // If it's an axios error with response data, preserve the error format
               if (error.response?.data) {
                    const customError = new Error(error.response.data.message || 'Failed to apply for job');
                    (customError as any).response = error.response;
                    throw customError;
               }

               throw error;
          }
     }

     // Get user's applications
     async getUserApplications(status?: string): Promise<JobApplication[]> {
          try {
               const params = status ? `?status=${status}` : '';
               const response = await apiClient.get<{ data: JobApplication[] }>(`/applications/user${params}`);
               return response.data.data;
          } catch (error) {
               console.error('Error fetching user applications:', error);
               throw error;
          }
     }

     // Withdraw application
     async withdrawApplication(applicationId: string): Promise<void> {
          try {
               await apiClient.delete(`/applications/${applicationId}`);
          } catch (error) {
               console.error('Error withdrawing application:', error);
               throw error;
          }
     }
}

// Company/Employer API endpoints
export interface Company {
     id: string;
     name: string;
     description?: string;
     website?: string;
     logo_url?: string;
     location?: string;
     industry?: string;
     size?: string;
     founded_year?: number;
}

class CompanyAPI {
     // Get company details
     async getCompanyById(companyId: string): Promise<Company> {
          try {
               const response = await apiClient.get<{ data: Company }>(`/companies/${companyId}`);
               return response.data.data;
          } catch (error) {
               console.error('Error fetching company:', error);
               throw error;
          }
     }

     // Get jobs by company
     async getCompanyJobs(companyId: string): Promise<any[]> {
          try {
               const response = await apiClient.get<{ data: any[] }>(`/companies/${companyId}/jobs`);
               return response.data.data;
          } catch (error) {
               console.error('Error fetching company jobs:', error);
               throw error;
          }
     }
}

// Export API instances
export const userAPI = new UserAPI();
export const applicationAPI = new ApplicationAPI();
export const companyAPI = new CompanyAPI();