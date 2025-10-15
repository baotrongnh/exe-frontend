import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { FileText, Trash2, Download, AlertTriangle } from 'lucide-react'
import { formatDate, formatFileSize } from './utils'
import { api } from '@/lib/api'
import { useToast } from '@/components/toast'
import type { CV } from './types'

interface DetailModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    selectedCV: CV | null
    onDelete: (id: string) => void
}

export function DetailModal({
    isOpen,
    onOpenChange,
    selectedCV,
    onDelete
}: DetailModalProps) {
    const { showToast } = useToast()
    const [isDownloading, setIsDownloading] = useState(false)

    if (!selectedCV) return null

    const handleDownload = async () => {
        try {
            setIsDownloading(true)
            const blob = await api.cvs.download(selectedCV.id)

            // Create download link
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = selectedCV.fileName || `${selectedCV.name}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)

            showToast('CV downloaded successfully!', 'success')
        } catch (error) {
            console.error('Download failed:', error)
            if (error instanceof Error && error.message.includes('not found on server')) {
                showToast('CV file is missing on server. Please re-upload your CV.', 'error')
            } else {
                showToast('Failed to download CV. Please try again.', 'error')
            }
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-[80vw] w-[80vw] max-h-[90vh] h-[90vh] overflow-auto"
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 50
                }}
            >
                <DialogHeader>
                    <DialogTitle>CV Details</DialogTitle>
                    <DialogClose onClose={() => onOpenChange(false)} />
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {selectedCV.name}
                            </h3>
                            <p className="text-muted-foreground">
                                {selectedCV.description}
                            </p>
                        </div>
                    </div>

                    {/* Full PDF Preview */}
                    {selectedCV.previewUrl ? (
                        <div className="w-full">
                            <h4 className="text-lg font-semibold mb-3">PDF Preview</h4>
                            <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-gray-50">
                                <iframe
                                    src={`${selectedCV.previewUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                                    className="w-full h-full"
                                    title={`Full preview of ${selectedCV.name}`}
                                />
                            </div>
                            <div className="mt-2 flex justify-end">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {isDownloading ? 'Downloading...' : 'Download PDF'}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full">
                            <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                                <div className="flex items-center">
                                    <AlertTriangle className="h-5 w-5 text-orange-400 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-orange-800">
                                            {selectedCV.isFileMissing ? 'File Missing' : 'Preview Unavailable'}
                                        </p>
                                        <p className="text-sm text-orange-700">
                                            {selectedCV.isFileMissing
                                                ? 'CV file is missing on server. Please re-upload your CV.'
                                                : 'Preview could not be loaded.'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDownload}
                                        disabled={isDownloading}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        {isDownloading ? 'Trying...' : 'Try Download'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-foreground">Upload Date</p>
                            <p className="text-sm text-muted-foreground">
                                {formatDate(selectedCV.uploadDate)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">File Size</p>
                            <p className="text-sm text-muted-foreground">
                                {selectedCV.fileSize ? formatFileSize(selectedCV.fileSize) : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">File Name</p>
                            <p className="text-sm text-muted-foreground truncate">
                                {selectedCV.file?.name || 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">File Type</p>
                            <p className="text-sm text-muted-foreground">PDF</p>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false) // Close detail modal first
                                onDelete(selectedCV.id)
                            }}
                            className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete CV
                        </Button>
                        <Button onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}