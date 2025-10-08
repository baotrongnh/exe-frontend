import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Upload, Loader2 } from 'lucide-react'
import { formatFileSize } from './utils'

interface UploadModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    cvName: string
    onCvNameChange: (name: string) => void
    cvDescription: string
    onCvDescriptionChange: (description: string) => void
    selectedFile: File | null
    onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
    onUpload: () => void
    loading: boolean
}

export function UploadModal({
    isOpen,
    onOpenChange,
    cvName,
    onCvNameChange,
    cvDescription,
    onCvDescriptionChange,
    selectedFile,
    onFileSelect,
    onUpload,
    loading
}: UploadModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Your CV</DialogTitle>
                    <DialogClose onClose={() => onOpenChange(false)} />
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor="cv-name">CV Name</Label>
                        <Input
                            id="cv-name"
                            placeholder="e.g., Senior Developer Resume 2024"
                            value={cvName}
                            onChange={(e) => onCvNameChange(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="cv-description">Description</Label>
                        <Textarea
                            id="cv-description"
                            placeholder="Brief description of this CV version..."
                            value={cvDescription}
                            onChange={(e) => onCvDescriptionChange(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="cv-file">CV File (PDF only)</Label>
                        <div className="mt-2">
                            <Input
                                id="cv-file"
                                type="file"
                                accept=".pdf"
                                onChange={onFileSelect}
                                className="cursor-pointer"
                            />
                            {selectedFile && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button onClick={onUpload} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload CV
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}