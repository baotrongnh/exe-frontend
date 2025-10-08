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
