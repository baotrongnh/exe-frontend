export default function EmployerDashboardPage() {
     const stats = [
          {
               title: "Active Jobs",
               value: "12",
               change: "+2 this week",
               icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                         />
                    </svg>
               ),
          },
          {
               title: "Total Applications",
               value: "248",
               change: "+18 today",
               icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                         />
                    </svg>
               ),
          },
          {
               title: "Pending Review",
               value: "42",
               change: "Needs attention",
               icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                         />
                    </svg>
               ),
          },
          {
               title: "Hired",
               value: "18",
               change: "This month",
               icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                         />
                    </svg>
               ),
          },
     ]

     return (
          <div className="p-8">
               <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, TechCorp Inc.</p>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                         <div key={stat.title} className="bg-white rounded-lg border border-gray-200 p-6">
                              <div className="flex items-center justify-between mb-4">
                                   <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                        {stat.icon}
                                   </div>
                              </div>
                              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                              <div className="text-sm text-gray-600 mb-1">{stat.title}</div>
                              <div className="text-xs text-indigo-600">{stat.change}</div>
                         </div>
                    ))}
               </div>

               {/* Recent Applications */}
               <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                         <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                    </div>
                    <div className="p-6">
                         <div className="space-y-4">
                              {[
                                   { name: "Sarah Johnson", position: "Senior Frontend Developer", time: "5 minutes ago", status: "New" },
                                   { name: "Michael Chen", position: "Product Designer", time: "1 hour ago", status: "New" },
                                   { name: "Emily Davis", position: "Backend Engineer", time: "2 hours ago", status: "Reviewed" },
                                   { name: "David Wilson", position: "Marketing Manager", time: "3 hours ago", status: "Shortlisted" },
                                   { name: "Lisa Anderson", position: "Data Scientist", time: "5 hours ago", status: "New" },
                              ].map((application, index) => (
                                   <div
                                        key={index}
                                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                                   >
                                        <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                  <span className="text-indigo-600 font-semibold text-sm">
                                                       {application.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                  </span>
                                             </div>
                                             <div>
                                                  <div className="text-sm font-medium text-gray-900">{application.name}</div>
                                                  <div className="text-sm text-gray-600">{application.position}</div>
                                             </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                             <span
                                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${application.status === "New"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : application.status === "Reviewed"
                                                                 ? "bg-yellow-100 text-yellow-800"
                                                                 : "bg-green-100 text-green-800"
                                                       }`}
                                             >
                                                  {application.status}
                                             </span>
                                             <div className="text-xs text-gray-500">{application.time}</div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </div>
          </div>
     )
}
