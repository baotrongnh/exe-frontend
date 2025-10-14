"use client"

import React, { useState } from 'react'
import {
    LoadingSpinner,
    AuthRequired,
    CVPageHeader,
    UploadButton,
    CVGrid,
    UploadModal,
    DetailModal,
    useCVManagement,
    type CV
} from './components'
import { useToast } from '@/components/toast'

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
        if (!cvName.trim() || !cvDescription.trim() || !selectedFile) {
            showToast('Please fill in all fields and select a PDF file.', 'error')
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

            // Show success message
            showToast('CV uploaded successfully!', 'success')
        } catch (error) {
            console.error('Upload error:', error)
            showToast('Failed to upload CV. Please try again.', 'error')
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

                <UploadButton onClick={() => setIsUploadModalOpen(true)} />

                <CVGrid
                    cvList={cvList}
                    loading={loading}
                    onView={handleViewCV}
                    onDelete={handleDeleteCV}
                    onUpload={() => setIsUploadModalOpen(true)}
                    showActionMenu={showActionMenu}
                    onToggleActionMenu={setShowActionMenu}
                />

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
