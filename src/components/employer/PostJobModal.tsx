"use client"

import type React from "react"

import { useState } from "react"

interface PostJobModalProps {
     isOpen: boolean
     onClose: () => void
}

export default function PostJobModal({ isOpen, onClose }: PostJobModalProps) {
     const [formData, setFormData] = useState({
          title: "",
          company: "",
          location: "",
          jobType: "Full-Time",
          workplaceType: "On-site",
          experience: "Mid-Level",
          salary: "",
          description: "",
          requirements: "",
          benefits: "",
          category: "Design",
          deadline: "",
     })

     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          setFormData({
               ...formData,
               [e.target.name]: e.target.value,
          })
     }

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault()
          // TODO: Connect to API
          console.log("Job posting data:", formData)
          // After successful API call, close modal and reset form
          onClose()
          setFormData({
               title: "",
               company: "",
               location: "",
               jobType: "Full-Time",
               workplaceType: "On-site",
               experience: "Mid-Level",
               salary: "",
               description: "",
               requirements: "",
               benefits: "",
               category: "Design",
               deadline: "",
          })
     }

     if (!isOpen) return null

     return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
               <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                         <h2 className="text-2xl font-bold text-gray-900">Post a New Job</h2>
                         <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                         </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                         {/* Job Title */}
                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Job Title <span className="text-red-500">*</span>
                              </label>
                              <input
                                   type="text"
                                   name="title"
                                   value={formData.title}
                                   onChange={handleChange}
                                   required
                                   placeholder="e.g. Senior Product Designer"
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                         </div>

                         {/* Company & Location */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company <span className="text-red-500">*</span>
                                   </label>
                                   <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Nomad"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   />
                              </div>
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location <span className="text-red-500">*</span>
                                   </label>
                                   <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Paris, France"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   />
                              </div>
                         </div>

                         {/* Job Type & Workplace Type */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Type <span className="text-red-500">*</span>
                                   </label>
                                   <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   >
                                        <option value="Full-Time">Full-Time</option>
                                        <option value="Part-Time">Part-Time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Internship">Internship</option>
                                   </select>
                              </div>
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Workplace Type <span className="text-red-500">*</span>
                                   </label>
                                   <select
                                        name="workplaceType"
                                        value={formData.workplaceType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   >
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                   </select>
                              </div>
                         </div>

                         {/* Category & Experience */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                   </label>
                                   <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   >
                                        <option value="Design">Design</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Business">Business</option>
                                        <option value="Product">Product</option>
                                   </select>
                              </div>
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Experience Level <span className="text-red-500">*</span>
                                   </label>
                                   <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   >
                                        <option value="Entry-Level">Entry-Level</option>
                                        <option value="Mid-Level">Mid-Level</option>
                                        <option value="Senior">Senior</option>
                                        <option value="Lead">Lead</option>
                                        <option value="Executive">Executive</option>
                                   </select>
                              </div>
                         </div>

                         {/* Salary & Deadline */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                                   <input
                                        type="text"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        placeholder="e.g. $80,000 - $120,000"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   />
                              </div>
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Application Deadline <span className="text-red-500">*</span>
                                   </label>
                                   <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                   />
                              </div>
                         </div>

                         {/* Job Description */}
                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Job Description <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                   name="description"
                                   value={formData.description}
                                   onChange={handleChange}
                                   required
                                   rows={4}
                                   placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              />
                         </div>

                         {/* Requirements */}
                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                   Requirements <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                   name="requirements"
                                   value={formData.requirements}
                                   onChange={handleChange}
                                   required
                                   rows={4}
                                   placeholder="List the required skills, qualifications, and experience..."
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              />
                         </div>

                         {/* Benefits */}
                         <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                              <textarea
                                   name="benefits"
                                   value={formData.benefits}
                                   onChange={handleChange}
                                   rows={3}
                                   placeholder="List the benefits and perks offered..."
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              />
                         </div>

                         {/* Action Buttons */}
                         <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                              <button
                                   type="button"
                                   onClick={onClose}
                                   className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                              >
                                   Cancel
                              </button>
                              <button
                                   type="submit"
                                   className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                              >
                                   Post Job
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     )
}
