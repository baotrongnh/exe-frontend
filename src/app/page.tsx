"use client"

import Navbar from "@/components/Navbar"
import Link from "next/link"
import Image from "next/image"
import { useState, FormEvent } from "react"

interface SearchData {
  searchTerm: string
  location: string
}

function handleSearch(searchData: any) {
  // TODO: Implement search functionality
}

function handleCategoryClick(category: any) {
  // TODO: Implement category navigation
}

function handleJobClick(jobId: any) {
  // TODO: Implement job details navigation
}

function handleNewsletterSignup(email: any) {
  // TODO: Implement newsletter signup
}

export default function LandingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("Florence, Italy")
  const [email, setEmail] = useState("")

  const onSearch = (e: any) => {
    e.preventDefault()
    handleSearch({ searchTerm, location })
  }

  const onNewsletterSubmit = (e: any) => {
    e.preventDefault()
    handleNewsletterSignup(email)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-white">

      <Navbar />


      {/* Hero Section */}
      <section className="relative px-6 py-4 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 overflow-hidden min-h-screen">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 border-2 border-purple-200 rounded-full opacity-30"></div>
          <div className="absolute top-40 right-40 w-32 h-32 border-2 border-blue-200 rounded-full opacity-40"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border-2 border-purple-300 rounded-full opacity-20"></div>
        </div>



        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Discover
                <br />
                more than
                <br />
                <span className="text-blue-600">5000+ Jobs</span>
              </h1>
              <div className="w-32 h-2 bg-blue-600 rounded-full mb-6"></div>
              <p className="text-gray-600 text-lg mb-8 max-w-md">
                Great platform for the job seeker that searching for new career heights and passionate about startups
              </p>

              {/* Search Form */}
              <form
                onSubmit={onSearch}
                className="bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2 mb-6"
              >
                <div className="flex-1 flex items-center px-4">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-3 outline-none"
                  />
                </div>
                <div className="flex items-center px-4 border-l border-gray-200">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="py-3 outline-none bg-transparent"
                  >
                    <option>Florence, Italy</option>
                    <option>Rome, Italy</option>
                    <option>Milan, Italy</option>
                  </select>
                </div>
                <Link href='/find-jobs'>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Search my job
                  </button>
                </Link>
              </form>

              <div className="text-sm text-gray-500">
                <span className="font-medium">Popular:</span> UI Designer, UX Researcher, Android, Admin
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <Image
                  src="/images/professional-man.png"
                  alt="Professional man pointing"
                  width={448}
                  height={600}
                  className="w-full max-w-md h-auto relative z-10"
                />
                {/* Stats card */}
                <div className="absolute top-8 left-4 bg-white rounded-lg shadow-lg p-4 z-20">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-8 bg-blue-600 rounded"></div>
                      <div className="w-2 h-6 bg-blue-400 rounded"></div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">100K+</div>
                      <div className="text-sm text-gray-600">People got hired</div>
                    </div>
                  </div>
                </div>
                {/* Testimonial card */}
                <div className="absolute bottom-8 left-8 bg-white rounded-lg shadow-lg p-4 max-w-xs z-20">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">K</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">Karen Sandler</div>
                      <div className="text-xs text-gray-600 mb-2">Lead Engineer at Canva</div>
                      <div className="text-sm text-gray-700 italic">
                        &ldquo;Great platform for the job seeker that searching for new career heights.&rdquo;
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search by Category */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Search by <span className="text-blue-600">category</span>
            </h2>
            <button
              onClick={() => handleCategoryClick("all-categories")}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              All Categories
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => handleCategoryClick("design")}
              className="bg-purple-50 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Design</h3>
              <p className="text-gray-600 text-sm">235 jobs available</p>
            </div>

            <div
              onClick={() => handleCategoryClick("sales")}
              className="bg-blue-50 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sales</h3>
              <p className="text-gray-600 text-sm">756 jobs available</p>
            </div>

            <div
              onClick={() => handleCategoryClick("marketing")}
              className="bg-blue-600 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-shadow text-white"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              </div>
              <h3 className="font-bold mb-2">Marketing</h3>
              <p className="text-blue-100 text-sm">140 jobs available</p>
            </div>

            <div
              onClick={() => handleCategoryClick("engineering")}
              className="bg-gray-50 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Engineering</h3>
              <p className="text-gray-600 text-sm">425 jobs available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Start Posting Jobs */}
      <section className="px-6 py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Start posting
                <br />
                jobs today
              </h2>
              <p className="text-blue-100 mb-8">Start posting jobs for only $10.</p>
              <button
                onClick={() => handleCategoryClick("sign-up-free")}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50"
              >
                Sign Up For Free
              </button>
            </div>
            <div>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-2FVncIPuQfdBsYXDUolZXajVDCSY2B.png"
                alt="Dashboard preview"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured <span className="text-blue-600">jobs</span>
            </h2>
            <button
              onClick={() => handleCategoryClick("show-all-jobs")}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              Show all jobs
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                company: "Revolut",
                location: "Madrid, Spain",
                title: "Email Marketing",
                tags: ["Marketing", "Design"],
              },
              {
                id: 2,
                company: "Dropbox",
                location: "San Francisco, US",
                title: "Brand Designer",
                tags: ["Design", "Business"],
              },
              { id: 3, company: "Pitch", location: "Berlin, Germany", title: "Email Marketing", tags: ["Marketing"] },
              { id: 4, company: "Binlist", location: "Granada, Spain", title: "Visual Designer", tags: ["Design"] },
            ].map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job.id)}
                className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg mr-3"></div>
                  <div>
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {job.company} • {job.location}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${tag === "Marketing"
                        ? "bg-orange-100 text-orange-600"
                        : tag === "Design"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Latest <span className="text-blue-600">jobs open</span>
            </h2>
            <button
              onClick={() => handleCategoryClick("show-all-jobs")}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              Show all jobs
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                id: 5,
                company: "Nomad",
                location: "Paris, France",
                title: "Social Media Assistant",
                tags: ["Part Time", "Marketing", "Design"],
                color: "green",
              },
              {
                id: 6,
                company: "Netlify",
                location: "Paris, France",
                title: "Social Media Assistant",
                tags: ["Part Time", "Marketing", "Design"],
                color: "blue",
              },
              {
                id: 7,
                company: "Dropbox",
                location: "San Francisco, USA",
                title: "Brand Designer",
                tags: ["Part Time", "Marketing", "Design"],
                color: "blue",
              },
              {
                id: 8,
                company: "Maze",
                location: "San Francisco, USA",
                title: "Brand Designer",
                tags: ["Part Time", "Marketing", "Design"],
                color: "blue",
              },
              {
                id: 9,
                company: "Terraform",
                location: "Hamburg, Germany",
                title: "Interactive Developer",
                tags: ["Part Time", "Marketing", "Design"],
                color: "cyan",
              },
              {
                id: 10,
                company: "Udacity",
                location: "Hamburg, Germany",
                title: "Interactive Developer",
                tags: ["Part Time", "Marketing", "Design"],
                color: "blue",
              },
              {
                id: 11,
                company: "Packer",
                location: "Lucern, Switzerland",
                title: "HR Manager",
                tags: ["Part Time", "Marketing", "Design"],
                color: "red",
              },
              {
                id: 12,
                company: "Webflow",
                location: "Lucern, Switzerland",
                title: "HR Manager",
                tags: ["Part Time", "Marketing", "Design"],
                color: "blue",
              },
            ].map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job.id)}
                className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-${job.color}-100 rounded-lg mr-4 flex items-center justify-center`}>
                    <div className={`w-6 h-6 bg-${job.color}-600 rounded`}></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {job.company} • {job.location}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${tag === "Part Time"
                        ? "bg-green-100 text-green-600"
                        : tag === "Marketing"
                          ? "bg-orange-100 text-orange-600"
                          : tag === "Design"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">Sworker</span>
              </div>
              <p className="text-gray-400 text-sm">
                Great platform for the job seeker that passionate about startups. Find your dream job easier.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button onClick={() => handleCategoryClick("companies")}>Companies</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick("pricing")}>Pricing</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick("terms")}>Terms</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick("advice")}>Advice</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick("privacy")}>Privacy Policy</button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button onClick={() => handleCategoryClick("help-docs")}>Help Docs</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick("guide")}>Guide</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick("updates")}>Updates</button>
                </li>
                <li>
                  <button onClick={() => handleCategoryClick("contact")}>Contact Us</button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Get job notifications</h4>
              <p className="text-gray-400 text-sm mb-4">The latest job news, articles, sent to your inbox weekly.</p>
              <form onSubmit={onNewsletterSubmit} className="flex">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 outline-none"
                  required
                />
                <button type="submit" className="bg-blue-600 px-6 py-2 rounded-r-lg hover:bg-blue-700">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">2024 © Sworker. All rights reserved.</p>
            <div className="flex space-x-4">
              {["facebook", "instagram", "dribbble", "linkedin", "twitter"].map((social) => (
                <button
                  key={social}
                  onClick={() => handleCategoryClick(social)}
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700"
                >
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
