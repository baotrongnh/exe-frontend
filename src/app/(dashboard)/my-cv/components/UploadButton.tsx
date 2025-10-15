import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, AlertTriangle } from 'lucide-react'

interface UploadButtonProps {
    onClick: () => void
    disabled?: boolean
    showServerIssue?: boolean
}

export function UploadButton({ onClick, disabled = false, showServerIssue = false }: UploadButtonProps) {
    if (showServerIssue) {
        return (
            <div className="mb-8">
                <Button
                    disabled
                    size="lg"
                    className="bg-gray-400 text-gray-600 cursor-not-allowed"
                >
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Upload Unavailable (Server Issue)
                </Button>
            </div>
        )
    }

    return (
        <div className="mb-8">
            <Button
                onClick={onClick}
                disabled={disabled}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Plus className="w-5 h-5 mr-2" />
                Upload Your CV
            </Button>
        </div>
    )
}