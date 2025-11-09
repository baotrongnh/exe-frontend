"use client"

import React, { useState } from 'react'
import { AxiosError } from 'axios'
import {
    LoadingSpinner,
    AuthRequired,
    useCVManagement,
    type CV
} from './components'
import { useToast } from '@/components/toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FileText, Upload, Download, Trash2, Eye, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface ErrorResponse {
    message?: string
}

export default function MyCV() {
    const { showToast } = useToast()
    const {
        cvList,
        loading,
        uploadLoading,
        authLoading,
        user,
        uploadCV,
        deleteCV
    } = useCVManagement()

    const currentCV = cvList.length > 0 ? cvList[0] : null

    // Modal states
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    // Form states
    const [cvName, setCvName] = useState('')
    const [cvDescription, setCvDescription] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    // Show loading if auth is still loading
    if (authLoading) {
        return <LoadingSpinner />
    }

    // Show login message if not authenticated
    if (!user) {
        return (
            <AuthRequired
                onLogin={() => window.location.href = '/login'}
            />
        )
    }

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file)
        } else {
            showToast('Please select a PDF file only.', 'error')
            event.target.value = ''
        }
    }

    const handleUploadCV = async () => {
        if (!cvName.trim()) {
            showToast('Please enter a CV name.', 'error')
            return
        }

        if (!cvDescription.trim()) {
            showToast('Please enter a CV description.', 'error')
            return
        }

        if (!selectedFile) {
            showToast('Please select a PDF file.', 'error')
            return
        }

        if (selectedFile.type !== 'application/pdf') {
            showToast('Please select a valid PDF file.', 'error')
            return
        }

        try {
            await uploadCV({
                name: cvName,
                description: cvDescription,
                file: selectedFile
            })

            // Reset form
            setCvName('')
            setCvDescription('')
            setSelectedFile(null)
            setIsUploadModalOpen(false)

            showToast('CV uploaded successfully!', 'success')
        } catch (error) {
            console.error('Upload error details:', error)

            if (error instanceof Error && 'response' in error) {
                const axiosError = error as AxiosError<ErrorResponse>
                if (axiosError.response?.status === 500) {
                    const errorMessage = axiosError.response?.data?.message || ''
                    if (errorMessage.includes('ENOENT') || errorMessage.includes('no such file or directory')) {
                        showToast('Server configuration error: Upload directory not found. Please contact your system administrator.', 'error')
                    } else if (errorMessage.includes('uploads')) {
                        showToast('Server storage error: Unable to save file. Please contact support.', 'error')
                    } else {
                        showToast(`Server error: ${errorMessage}. Please try again or contact support.`, 'error')
                    }
                } else if (axiosError.response?.status === 413) {
                    showToast('File is too large. Please select a smaller PDF file (max 5MB).', 'error')
                } else if (axiosError.response?.status === 400) {
                    const errorMessage = axiosError.response?.data?.message || ''
                    if (errorMessage.includes('file type') || errorMessage.includes('File type not supported')) {
                        showToast('Invalid file type. Please select a PDF file only.', 'error')
                    } else {
                        showToast('Invalid file format. Please check your file and try again.', 'error')
                    }
                } else {
                    const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Unknown error'
                    showToast(`Upload failed: ${errorMessage}`, 'error')
                }
            } else {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error'
                showToast(`Upload failed: ${errorMessage}`, 'error')
            }
        }
    }

    const handleDeleteCV = async () => {
        if (!currentCV) return

        try {
            await deleteCV(currentCV.id)
            setIsDeleteDialogOpen(false)
            showToast('CV deleted successfully!', 'success')
        } catch (error) {
            console.error('Delete error:', error)
            showToast('Failed to delete CV. Please try again.', 'error')
        }
    }

    const handleDownloadCV = () => {
        if (currentCV?.previewUrl) {
            window.open(currentCV.previewUrl, '_blank')
        } else {
            showToast('Preview not available for download', 'error')
        }
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date)
    }

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return 'Unknown size'
        const mb = bytes / (1024 * 1024)
        return `${mb.toFixed(2)} MB`
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My CV</h1>
                    <p className="text-gray-600">
                        Keep your professional resume up to date and ready for applications
                    </p>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : currentCV ? (
                    /* Display Current CV */
                    <Card className="overflow-hidden shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-red-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">{currentCV.name}</CardTitle>
                                        <CardDescription className="text-base mt-1">
                                            {currentCV.description}
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-600">Active</span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            {/* CV Preview */}
                            {currentCV.previewUrl ? (
                                <div className="mb-6">
                                    <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                                        <iframe
                                            src={`${currentCV.previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                            className="w-full h-full"
                                            title={`Preview of ${currentCV.name}`}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-6 bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
                                    <div className="flex items-center">
                                        <AlertCircle className="h-6 w-6 text-orange-500 mr-3" />
                                        <div>
                                            <p className="font-medium text-orange-900">Preview Unavailable</p>
                                            <p className="text-sm text-orange-700 mt-1">
                                                {currentCV.isFileMissing ? 'File missing on server. Please re-upload your CV.' : 'Unable to generate preview for this file.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CV Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">Uploaded Date</p>
                                    <p className="font-semibold text-gray-900">{formatDate(currentCV.uploadDate)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">File Name</p>
                                    <p className="font-semibold text-gray-900 truncate">{currentCV.fileName || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-1">File Size</p>
                                    <p className="font-semibold text-gray-900">{formatFileSize(currentCV.fileSize)}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={() => setIsViewModalOpen(true)}
                                    className="flex-1 sm:flex-none"
                                    variant="outline"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Full CV
                                </Button>
                                <Button
                                    onClick={handleDownloadCV}
                                    className="flex-1 sm:flex-none"
                                    variant="outline"
                                    disabled={!currentCV.previewUrl}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                                <Button
                                    onClick={() => {
                                        setIsUploadModalOpen(true)
                                        setCvName(currentCV.name)
                                        setCvDescription(currentCV.description)
                                    }}
                                    className="flex-1 sm:flex-none"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Replace CV
                                </Button>
                                <Button
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                    className="flex-1 sm:flex-none"
                                    variant="destructive"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Empty State - No CV */
                    <Card className="text-center py-16 shadow-lg">
                        <CardContent className="space-y-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                <FileText className="w-12 h-12 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">No CV Uploaded Yet</h3>
                                <p className="text-gray-600 max-w-md mx-auto">
                                    Upload your CV to apply for jobs and showcase your professional experience to potential employers
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsUploadModalOpen(true)}
                                size="lg"
                                className="mt-4"
                            >
                                <Upload className="w-5 h-5 mr-2" />
                                Upload Your CV
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Upload/Replace Modal */}
                <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{currentCV ? 'Replace CV' : 'Upload CV'}</DialogTitle>
                            <DialogDescription>
                                {currentCV ? 'Upload a new CV to replace your current one' : 'Upload your professional CV (PDF format only)'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">CV Name</label>
                                <Input
                                    placeholder="e.g., John Doe - Software Engineer"
                                    value={cvName}
                                    onChange={(e) => setCvName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Brief description of your CV..."
                                    value={cvDescription}
                                    onChange={(e) => setCvDescription(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">PDF File</label>
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileSelect}
                                />
                                {selectedFile && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)} disabled={uploadLoading}>
                                Cancel
                            </Button>
                            <Button onClick={handleUploadCV} disabled={uploadLoading}>
                                {uploadLoading ? 'Uploading...' : currentCV ? 'Replace' : 'Upload'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete CV</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete your CV? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteCV}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* View Full CV Modal */}
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <DialogContent className="max-w-4xl h-[90vh]">
                        <DialogHeader>
                            <DialogTitle>{currentCV?.name}</DialogTitle>
                            <DialogDescription>{currentCV?.description}</DialogDescription>
                        </DialogHeader>
                        <div className="flex-1 overflow-hidden">
                            {currentCV?.previewUrl ? (
                                <iframe
                                    src={currentCV.previewUrl}
                                    className="w-full h-full"
                                    title={`Full view of ${currentCV.name}`}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                                    <div className="text-center">
                                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">Preview not available</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )

}
