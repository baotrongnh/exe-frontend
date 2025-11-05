import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
     title: string;
     description?: string;
     action?: React.ReactNode;
     breadcrumbs?: Array<{ label: string; href?: string }>;
     className?: string;
}

export function PageHeader({
     title,
     description,
     action,
     breadcrumbs,
     className,
}: PageHeaderProps) {
     return (
          <div className={cn('space-y-4 pb-6 border-b', className)}>
               {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                         {breadcrumbs.map((crumb, index) => (
                              <React.Fragment key={index}>
                                   {index > 0 && <span>/</span>}
                                   {crumb.href ? (
                                        <a
                                             href={crumb.href}
                                             className="hover:text-foreground transition-colors"
                                        >
                                             {crumb.label}
                                        </a>
                                   ) : (
                                        <span className="text-foreground">{crumb.label}</span>
                                   )}
                              </React.Fragment>
                         ))}
                    </nav>
               )}

               <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                         <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                         {description && (
                              <p className="text-muted-foreground">{description}</p>
                         )}
                    </div>
                    {action && <div className="flex-shrink-0">{action}</div>}
               </div>
          </div>
     );
}
