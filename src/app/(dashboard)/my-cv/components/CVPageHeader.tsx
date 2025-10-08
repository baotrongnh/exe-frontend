import React from 'react'

interface CVPageHeaderProps {
    title: string
    description: string
}

export function CVPageHeader({ title, description }: CVPageHeaderProps) {
    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">
                {description}
            </p>
        </div>
    )
}