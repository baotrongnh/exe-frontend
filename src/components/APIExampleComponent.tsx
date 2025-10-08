// Example component showing how to use the new API client with authentication

"use client"

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { jobsAPI } from '@/lib/jobs-api';
import { userAPI, applicationAPI } from '@/lib/api';

export default function APIExampleComponent() {
     const { user, getAccessToken } = useAuth();
     const [loading, setLoading] = useState(false);
     const [result, setResult] = useState<any>(null);

     // Example: Fetch jobs (không cần auth)
     const fetchJobs = async () => {
          setLoading(true);
          try {
               const response = await jobsAPI.getJobs({ page: 1, limit: 10 });
               setResult(response);
          } catch (error) {
               console.error('Error fetching jobs:', error);
               setResult({ error: 'Failed to fetch jobs' });
          } finally {
               setLoading(false);
          }
     };

     // Example: Fetch user profile (cần auth)
     const fetchUserProfile = async () => {
          if (!user) {
               setResult({ error: 'User not logged in' });
               return;
          }

          setLoading(true);
          try {
               const profile = await userAPI.getCurrentUserProfile();
               setResult(profile);
          } catch (error) {
               console.error('Error fetching profile:', error);
               setResult({ error: 'Failed to fetch profile' });
          } finally {
               setLoading(false);
          }
     };

     // Example: Apply for a job (cần auth)
     const applyForJob = async (jobId: string) => {
          if (!user) {
               setResult({ error: 'User not logged in' });
               return;
          }

          setLoading(true);
          try {
               const application = await applicationAPI.applyForJob(jobId, 'Cover letter example');
               setResult(application);
          } catch (error) {
               console.error('Error applying for job:', error);
               setResult({ error: 'Failed to apply for job' });
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="p-6 space-y-4">
               <h2 className="text-2xl font-bold">API Client Example</h2>

               <div className="space-y-2">
                    <p><strong>User:</strong> {user ? user.email : 'Not logged in'}</p>
                    <p><strong>Access Token:</strong> {getAccessToken() ? 'Available' : 'Not available'}</p>
               </div>

               <div className="space-x-2">
                    <button
                         onClick={fetchJobs}
                         disabled={loading}
                         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                         Fetch Jobs (Public)
                    </button>

                    <button
                         onClick={fetchUserProfile}
                         disabled={loading || !user}
                         className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                         Fetch Profile (Auth Required)
                    </button>

                    <button
                         onClick={() => applyForJob('example-job-id')}
                         disabled={loading || !user}
                         className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                    >
                         Apply for Job (Auth Required)
                    </button>
               </div>

               {loading && <p>Loading...</p>}

               {result && (
                    <div className="mt-4 p-4 bg-gray-100 rounded">
                         <h3 className="text-lg font-semibold mb-2">Result:</h3>
                         <pre className="text-sm overflow-auto">
                              {JSON.stringify(result, null, 2)}
                         </pre>
                    </div>
               )}
          </div>
     );
}