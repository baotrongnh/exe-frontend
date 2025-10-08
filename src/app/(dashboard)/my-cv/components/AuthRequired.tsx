import React from 'react'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'

interface AuthRequiredProps {
    onLogin: () => void
}

export function AuthRequired({ onLogin }: AuthRequiredProps) {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Authentication Required</h3>
                    <p className="text-muted-foreground mb-6">
                        Please log in to access your CV collection.
                    </p>
                    <Button onClick={onLogin}>
                        Go to Login
                    </Button>
                </div>
            </div>
        </div>
    )
}