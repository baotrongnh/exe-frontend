import { ArrowRight } from "lucide-react"
import Image from "next/image"

interface CompanyInfoProps {
     company: string
     logo: string
     logoColor: string
     description: string
     link: string
}

export function CompanyInfo({ company, logo, logoColor, description, link }: CompanyInfoProps) {
     return (
          <div className="rounded-lg border bg-white p-6">
               <div className="mb-4 flex items-center gap-3">
                    <div
                         className={`flex h-12 w-12 items-center justify-center rounded-lg ${logoColor} text-xl font-bold text-white`}
                    >
                         {logo}
                    </div>
                    <div>
                         <h3 className="font-semibold text-gray-900">{company}</h3>
                         <a href={link} className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700">
                              Read more about {company}
                              <ArrowRight className="h-3 w-3" />
                         </a>
                    </div>
               </div>
               <p className="mb-4 text-sm text-gray-600">{description}</p>
               <div className="grid grid-cols-2 gap-2">
                    <Image
                         src="/modern-office.png"
                         alt="Office 1"
                         width={200}
                         height={120}
                         className="rounded-lg object-cover"
                    />
                    <Image
                         src="/team-collaboration-space.jpg"
                         alt="Office 2"
                         width={200}
                         height={120}
                         className="rounded-lg object-cover"
                    />
                    <Image
                         src="/comfortable-work-environment.jpg"
                         alt="Office 3"
                         width={200}
                         height={120}
                         className="rounded-lg object-cover"
                    />
                    <Image
                         src="/employee-working-at-desk.jpg"
                         alt="Office 4"
                         width={200}
                         height={120}
                         className="rounded-lg object-cover"
                    />
               </div>
          </div>
     )
}
