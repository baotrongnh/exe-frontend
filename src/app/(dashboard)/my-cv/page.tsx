"use client"

import React, { useState } from 'react'
import { AxiosError } from 'axios'
import {
    LoadingSpinner,
    AuthRequired,
    CVPageHeader,
    UploadButton,
    CVGrid,
    UploadModal,
    DetailModal,
    TroubleshootingPanel,
    useCVManagement,
    type CV
} from './components'
import { useToast } from '@/components/toast'

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

    // Modal states
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [selectedCV, setSelectedCV] = useState<CV | null>(null)
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null)

    // State for tracking server issues
    const [hasServerIssues, setHasServerIssues] = useState(false)

    // Form states
    const [cvName, setCvName] = useState('')
    const [cvDescription, setCvDescription] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    // Failsafe: show error after loading for too long
    const [loadingTimeout, setLoadingTimeout] = useState(false)

    React.useEffect(() => {
        if (loading && user) {
            const timer = setTimeout(() => {
                setLoadingTimeout(true)
            }, 15000) // 15 seconds timeout

            return () => clearTimeout(timer)
        } else {
            setLoadingTimeout(false)
        }
    }, [loading, user])

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
        console.log('Upload CV clicked - checking form data...')
        console.log('CV Name:', cvName)
        console.log('CV Description:', cvDescription)
        console.log('Selected File:', selectedFile)

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

        console.log('All validations passed, starting upload...')

        try {
            await uploadCV({
                name: cvName,
                description: cvDescription,
                file: selectedFile
            })

            console.log('Upload successful!')

            // Reset form
            setCvName('')
            setCvDescription('')
            setSelectedFile(null)
            setIsUploadModalOpen(false)

            // Show success message
            showToast('CV uploaded successfully!', 'success')
        } catch (error) {
            console.error('Upload error details:', error)

            // More specific error handling for backend issues
            if (error instanceof Error && 'response' in error) {
                const axiosError = error as AxiosError<ErrorResponse>
                if (axiosError.response?.status === 500) {
                    const errorMessage = axiosError.response?.data?.message || ''
                    if (errorMessage.includes('ENOENT') || errorMessage.includes('no such file or directory')) {
                        setHasServerIssues(true)
                        showToast('Server configuration error: Upload directory not found. Please contact your system administrator.', 'error')
                    } else if (errorMessage.includes('uploads')) {
                        setHasServerIssues(true)
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
                } else if (axiosError.response?.status === 401) {
                    showToast('Authentication failed. Please refresh the page and try again.', 'error')
                } else if (axiosError.response?.status === 403) {
                    showToast('Access denied. Please check your permissions and try again.', 'error')
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

    const handleDeleteCV = async (id: string) => {
        try {
            await deleteCV(id)
            setShowActionMenu(null)
            setIsDetailModalOpen(false)

            // Show success message
            showToast('CV deleted successfully!', 'success')
        } catch (error) {
            console.error('Delete error:', error)
            showToast('Failed to delete CV. Please try again.', 'error')
        }
    }

    const handleViewCV = (cv: CV) => {
        setSelectedCV(cv)
        setIsDetailModalOpen(true)
        setShowActionMenu(null)
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                <CVPageHeader
                    title="Your CV Collection"
                    description="Upload and manage your CV files. Keep your professional documents organized and easily accessible."
                />

                <UploadButton
                    onClick={() => setIsUploadModalOpen(true)}
                    showServerIssue={hasServerIssues}
                />

                {/* Show server issues warning */}
                {hasServerIssues && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Upload Service Temporarily Unavailable
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>
                                        The server is experiencing configuration issues that prevent file uploads.
                                        This is a backend infrastructure problem that requires administrator attention.
                                        Please contact your system administrator or try again later.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <CVGrid
                    cvList={cvList}
                    loading={loading}
                    onView={handleViewCV}
                    onDelete={handleDeleteCV}
                    onUpload={() => setIsUploadModalOpen(true)}
                    showActionMenu={showActionMenu}
                    onToggleActionMenu={setShowActionMenu}
                />

                {/* Show troubleshooting panel when there are server issues */}
                {hasServerIssues && <TroubleshootingPanel />}

                {/* Show timeout message if loading takes too long */}
                {loadingTimeout && (
                    <div className="text-center p-4 bg-yellow-100 border border-yellow-300 rounded-lg mt-4">
                        <p className="text-yellow-800">
                            Loading is taking longer than expected. Please check your internet connection or try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                            Refresh Page
                        </button>
                    </div>
                )}

                <UploadModal
                    isOpen={isUploadModalOpen}
                    onOpenChange={setIsUploadModalOpen}
                    cvName={cvName}
                    onCvNameChange={setCvName}
                    cvDescription={cvDescription}
                    onCvDescriptionChange={setCvDescription}
                    selectedFile={selectedFile}
                    onFileSelect={handleFileSelect}
                    onUpload={handleUploadCV}
                    loading={uploadLoading}
                />

                <DetailModal
                    isOpen={isDetailModalOpen}
                    onOpenChange={setIsDetailModalOpen}
                    selectedCV={selectedCV}
                    onDelete={handleDeleteCV}
                />
            </div>
        </div>
    )
}
