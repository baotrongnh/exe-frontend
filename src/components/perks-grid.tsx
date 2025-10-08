interface Perk {
     icon: string
     title: string
     description: string
}

interface PerksGridProps {
     perks: Perk[]
}

export function PerksGrid({ perks }: PerksGridProps) {
     return (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {perks.map((perk, index) => (
                    <div key={index} className="text-center">
                         <div className="mb-3 flex justify-center">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-indigo-600 text-2xl">
                                   {perk.icon}
                              </div>
                         </div>
                         <h4 className="mb-2 font-semibold text-gray-900">{perk.title}</h4>
                         <p className="text-sm text-gray-600">{perk.description}</p>
                    </div>
               ))}
          </div>
     )
}
