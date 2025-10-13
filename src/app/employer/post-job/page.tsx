"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function PostJobPage() {
     const router = useRouter()
     const [formData, setFormData] = useState({
          title: "",
          company: "TechCorp Inc.",
          location: "",
          jobType: "Full-Time",
          salary: "",
          category: "",
          description: "",
          responsibilities: "",
          requirements: "",
          niceToHave: "",
          benefits: "",
     })

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault()
          // In a real app, this would send data to an API
          alert("Job posted successfully! Waiting for admin approval.")
          router.push("/employer/jobs")
     }

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          setFormData({
               ...formData,
               [e.target.name]: e.target.value,
          })
     }

     return (
          <div className="p-8">
               <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                         <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
                         <p className="text-gray-600">Fill in the details below to create a new job posting</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                         {/* Basic Information */}
                         <div className="bg-white rounded-lg border border-gray-200 p-6">
                              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                                        <input
                                             type="text"
                                             name="title"
                                             value={formData.title}
                                             onChange={handleChange}
                                             required
                                             placeholder="e.g. Senior Frontend Developer"
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                        <input
                                             type="text"
                                             name="company"
                                             value={formData.company}
                                             onChange={handleChange}
                                             disabled
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                                        <input
                                             type="text"
                                             name="location"
                                             value={formData.location}
                                             onChange={handleChange}
                                             required
                                             placeholder="e.g. San Francisco, USA"
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                                        <select
                                             name="jobType"
                                             value={formData.jobType}
                                             onChange={handleChange}
                                             required
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                             <option value="Full-Time">Full-Time</option>
                                             <option value="Part-Time">Part-Time</option>
                                             <option value="Contract">Contract</option>
                                             <option value="Internship">Internship</option>
                                             <option value="Remote">Remote</option>
                                        </select>
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                                        <input
                                             type="text"
                                             name="salary"
                                             value={formData.salary}
                                             onChange={handleChange}
                                             placeholder="e.g. $80k - $120k"
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                        <select
                                             name="category"
                                             value={formData.category}
                                             onChange={handleChange}
                                             required
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                             <option value="">Select a category</option>
                                             <option value="Design">Design</option>
                                             <option value="Engineering">Engineering</option>
                                             <option value="Marketing">Marketing</option>
                                             <option value="Sales">Sales</option>
                                             <option value="Business">Business</option>
                                             <option value="Technology">Technology</option>
                                             <option value="Finance">Finance</option>
                                             <option value="Human Resource">Human Resource</option>
                                        </select>
                                   </div>
                              </div>
                         </div>

                         {/* Job Description */}
                         <div className="bg-white rounded-lg border border-gray-200 p-6">
                              <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
                              <div className="space-y-4">
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                        <textarea
                                             name="description"
                                             value={formData.description}
                                             onChange={handleChange}
                                             required
                                             rows={4}
                                             placeholder="Describe the role and what the candidate will be doing..."
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities *</label>
                                        <textarea
                                             name="responsibilities"
                                             value={formData.responsibilities}
                                             onChange={handleChange}
                                             required
                                             rows={4}
                                             placeholder="List the key responsibilities (one per line)..."
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Requirements *</label>
                                        <textarea
                                             name="requirements"
                                             value={formData.requirements}
                                             onChange={handleChange}
                                             required
                                             rows={4}
                                             placeholder="List the required qualifications and skills (one per line)..."
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nice-to-Have</label>
                                        <textarea
                                             name="niceToHave"
                                             value={formData.niceToHave}
                                             onChange={handleChange}
                                             rows={3}
                                             placeholder="List optional skills or qualifications (one per line)..."
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                   </div>

                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Perks & Benefits</label>
                                        <textarea
                                             name="benefits"
                                             value={formData.benefits}
                                             onChange={handleChange}
                                             rows={3}
                                             placeholder="List the perks and benefits (one per line)..."
                                             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                   </div>
                              </div>
                         </div>

                         {/* Actions */}
                         <div className="flex items-center justify-end gap-4">
                              <button
                                   type="button"
                                   onClick={() => router.back()}
                                   className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                              >
                                   Cancel
                              </button>
                              <button
                                   type="submit"
                                   className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                              >
                                   Post Job
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     )
}
