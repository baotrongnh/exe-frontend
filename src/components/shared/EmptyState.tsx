import React from 'react';
import { FileX, Inbox, SearchX, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
     icon?: 'inbox' | 'search' | 'file' | 'alert' | React.ReactNode;
     title: string;
     description?: string;
     action?: {
          label: string;
          onClick: () => void;
     };
     className?: string;
}

const iconMap = {
     inbox: Inbox,
     search: SearchX,
     file: FileX,
     alert: AlertCircle,
} as const;

type IconType = keyof typeof iconMap;

export function EmptyState({
     icon = 'inbox',
     title,
     description,
     action,
     className,
}: EmptyStateProps) {
     const IconComponent = typeof icon === 'string' && icon in iconMap
          ? iconMap[icon as IconType]
          : null;

     return (
          <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
               <div className="rounded-full bg-muted p-6 mb-4">
                    {IconComponent ? (
                         <IconComponent className="h-12 w-12 text-muted-foreground" />
                    ) : (
                         icon
                    )}
               </div>
               <h3 className="text-lg font-semibold mb-2">{title}</h3>
               {description && (
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm">{description}</p>
               )}
               {action && (
                    <Button onClick={action.onClick} variant="default">
                         {action.label}
                    </Button>
               )}
          </div>
     );
}
