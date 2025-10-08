import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface UploadButtonProps {
    onClick: () => void
}

export function UploadButton({ onClick }: UploadButtonProps) {
    return (
        <div className="mb-8">
            <Button
                onClick={onClick}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
                <Plus className="w-5 h-5 mr-2" />
                Upload Your CV
            </Button>
        </div>
    )
}