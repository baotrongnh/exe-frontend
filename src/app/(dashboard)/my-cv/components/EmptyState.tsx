import React from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Upload } from 'lucide-react'

interface EmptyStateProps {
    onUpload: () => void
}

export function EmptyState({ onUpload }: EmptyStateProps) {
    return (
        <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <FileText className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No CVs uploaded yet</h3>
            <p className="text-muted-foreground mb-6">
                Start by uploading your first CV to build your professional portfolio.
            </p>
            <Button
                onClick={onUpload}
                variant="outline"
            >
                <Upload className="w-4 h-4 mr-2" />
                Upload your first CV
            </Button>
        </div>
    )
}