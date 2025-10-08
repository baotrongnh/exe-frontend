import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Edit3, Loader2 } from 'lucide-react'
import { formatFileSize } from './utils'
import type { CV } from './types'

interface EditModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    editingCV: CV | null
    editCvName: string
    onEditCvNameChange: (name: string) => void
    editCvDescription: string
    onEditCvDescriptionChange: (description: string) => void
    editSelectedFile: File | null
    onEditFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
    onSave: () => void
    loading: boolean
}

export function EditModal({
    isOpen,
    onOpenChange,
    editingCV,
    editCvName,
    onEditCvNameChange,
    editCvDescription,
    onEditCvDescriptionChange,
    editSelectedFile,
    onEditFileSelect,
    onSave,
    loading
}: EditModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit CV</DialogTitle>
                    <DialogClose onClose={() => onOpenChange(false)} />
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor="edit-cv-name">CV Name</Label>
                        <Input
                            id="edit-cv-name"
                            placeholder="e.g., Senior Developer Resume 2024"
                            value={editCvName}
                            onChange={(e) => onEditCvNameChange(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-cv-description">Description</Label>
                        <Textarea
                            id="edit-cv-description"
                            placeholder="Brief description of this CV version..."
                            value={editCvDescription}
                            onChange={(e) => onEditCvDescriptionChange(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-cv-file">Replace CV File (PDF only) - Optional</Label>
                        <div className="mt-2">
                            <Input
                                id="edit-cv-file"
                                type="file"
                                accept=".pdf"
                                onChange={onEditFileSelect}
                                className="cursor-pointer"
                            />
                            {editSelectedFile ? (
                                <p className="text-sm text-muted-foreground mt-2">
                                    New file: {editSelectedFile.name} ({formatFileSize(editSelectedFile.size)})
                                </p>
                            ) : editingCV?.file && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Current file: {editingCV.file.name} ({formatFileSize(editingCV.file.size)})
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
                    <Button onClick={onSave} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Edit3 className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}