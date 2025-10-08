import React from 'react'
import { Loader2 } from 'lucide-react'

export function LoadingSpinner() {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center py-16">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Checking authentication...</h3>
                    <p className="text-muted-foreground">Please wait while we verify your session.</p>
                </div>
            </div>
        </div>
    )
}

export function LoadingCVs() {
    return (
        <div className="text-center py-16">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Loading your CVs...</h3>
            <p className="text-muted-foreground">Please wait while we fetch your documents.</p>
        </div>
    )
}