export default function AdminDashboardPage() {
     const stats = [
          {
               title: "Total Users",
               value: "2,543",
               change: "+12%",
               changeType: "positive",
               icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                         />
                    </svg>
               ),
          },
          {
               title: "Pending Employers",
               value: "24",
               change: "+3",
               changeType: "positive",
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
               title: "Pending Jobs",
               value: "18",
               change: "+5",
               changeType: "positive",
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
               title: "Active Jobs",
               value: "342",
               change: "+18%",
               changeType: "positive",
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
                    <p className="text-gray-600 mt-1">Welcome back, Admin</p>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => (
                         <div key={stat.title} className="bg-white rounded-lg border border-gray-200 p-6">
                              <div className="flex items-center justify-between mb-4">
                                   <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                        {stat.icon}
                                   </div>
                                   <span className="text-sm font-medium text-green-600">{stat.change}</span>
                              </div>
                              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                              <div className="text-sm text-gray-600">{stat.title}</div>
                         </div>
                    ))}
               </div>

               {/* Recent Activity */}
               <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                         <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="p-6">
                         <div className="space-y-4">
                              {[
                                   { action: "New employer application", user: "TechCorp Inc.", time: "5 minutes ago" },
                                   { action: "Job post submitted", user: "Stripe", time: "12 minutes ago" },
                                   { action: "New user registered", user: "John Doe", time: "1 hour ago" },
                                   { action: "Employer approved", user: "Dropbox", time: "2 hours ago" },
                                   { action: "Job post approved", user: "Nomad", time: "3 hours ago" },
                              ].map((activity, index) => (
                                   <div key={index} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                                        <div className="flex-1">
                                             <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                                             <div className="text-sm text-gray-600">{activity.user}</div>
                                        </div>
                                        <div className="text-xs text-gray-500">{activity.time}</div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </div>
          </div>
     )
}
