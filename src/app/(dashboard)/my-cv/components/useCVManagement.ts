import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import type { CV } from './types'

export function useCVManagement() {
    const { user, loading: authLoading, getAccessToken, signOut } = useAuth()
    const router = useRouter()
    const [cvList, setCvList] = useState<CV[]>([])
    const [loading, setLoading] = useState(false)
    const [uploadLoading, setUploadLoading] = useState(false)

    const handleAuthError = useCallback(() => {
        signOut()
        router.push('/login')
    }, [signOut, router])

    // Load CVs from API
    const loadCVs = useCallback(async () => {
        try {
            setLoading(true)
            console.log('Loading CVs from API...')
            console.log('User:', user)

            // Check if we have a valid access token
            const token = getAccessToken()
            console.log('Access token available:', !!token, token ? token.substring(0, 20) + '...' : 'none')

            if (!token) {
                throw new Error('No access token available. Please log in again.')
            }

            // Now try with our API client
            const response = await api.cvs.getAll()
            console.log('API Response:', response)
            console.log('Response type:', typeof response)
            console.log('Response keys:', response ? Object.keys(response) : 'null')

            // Handle different response structures
            let cvData = []

            if (!response) {
                console.log('No response received')
                cvData = []
            } else if (Array.isArray(response)) {
                console.log('Response is directly an array')
                cvData = response
            } else if (response && typeof response === 'object') {
                console.log('Response is an object, checking properties...')
                if (response.data && response.data.cvs && Array.isArray(response.data.cvs)) {
                    console.log('Found data.cvs property with array')
                    cvData = response.data.cvs
                } else if (response.data && Array.isArray(response.data)) {
                    console.log('Found data property with array')
                    cvData = response.data
                } else if (response.cvs && Array.isArray(response.cvs)) {
                    console.log('Found cvs property with array')
                    cvData = response.cvs
                } else if (response.result && Array.isArray(response.result)) {
                    console.log('Found result property with array')
                    cvData = response.result
                } else {
                    console.log('No recognizable array property found, trying to extract values...')
                    // Try to find any array property
                    const arrayProperty = Object.values(response).find(val => Array.isArray(val))
                    if (arrayProperty && Array.isArray(arrayProperty)) {
                        console.log('Found array in object values')
                        cvData = arrayProperty
                    } else {
                        console.log('No array found anywhere in response')
                        cvData = []
                    }
                }
            } else {
                console.log('Response is not an object or array')
                cvData = []
            }

            console.log('Final cvData:', cvData, 'Type:', typeof cvData, 'Is Array:', Array.isArray(cvData))

            // Ensure cvData is an array
            if (!Array.isArray(cvData)) {
                console.warn('cvData is not an array, converting to empty array')
                cvData = []
            }

            const cvs = await Promise.all(cvData.map(async (cv: {
                id: string;
                name: string;
                description: string;
                uploaded_at?: string;
                created_at?: string;
                uploadDate?: string;
                file_name?: string;
                fileName?: string;
                file_size?: number;
                fileSize?: number;
            }) => {
                const previewUrl = await api.cvs.getPreviewUrl(cv.id)
                return {
                    id: cv.id,
                    name: cv.name,
                    description: cv.description,
                    uploadDate: new Date(cv.uploaded_at || cv.created_at || cv.uploadDate || Date.now()),
                    fileName: cv.file_name || cv.fileName,
                    fileSize: cv.file_size || cv.fileSize,
                    previewUrl: previewUrl
                }
            }))
            console.log('Processed CVs:', cvs)
            setCvList(cvs)
        } catch (error) {
            console.error('Error loading CVs:', error)
            // More detailed error message
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

            // Handle specific authentication errors
            if (errorMessage.includes('No token provided') || errorMessage.includes('403') || errorMessage.includes('No access token')) {
                if (confirm(`Authentication error: ${errorMessage}. Would you like to log out and log in again?`)) {
                    handleAuthError()
                }
            } else {
                alert(`Failed to load CVs: ${errorMessage}. Please try again.`)
            }
        } finally {
            setLoading(false)
        }
    }, [user, getAccessToken, handleAuthError])

    // Load CVs on component mount
    useEffect(() => {
        // Only load CVs if user is authenticated
        if (user && !authLoading) {
            loadCVs()
        }
    }, [user, authLoading, loadCVs])

    // Cleanup URLs when component unmounts
    useEffect(() => {
        return () => {
            cvList.forEach(cv => {
                if (cv.previewUrl && cv.previewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(cv.previewUrl)
                }
            })
        }
    }, [cvList])

    const uploadCV = async (data: { name: string; description: string; file: File }) => {
        try {
            setUploadLoading(true)
            await api.cvs.upload({
                cv: data.file,
                name: data.name.trim(),
                description: data.description.trim()
            })
            // Reload CVs
            await loadCVs()
        } catch (error) {
            console.error('Error uploading CV:', error)
            throw error
        } finally {
            setUploadLoading(false)
        }
    }

    const deleteCV = async (id: string) => {
        try {
            await api.cvs.delete(id)
            // Reload CVs
            await loadCVs()
        } catch (error) {
            console.error('Error deleting CV:', error)
            throw error
        }
    }

    return {
        // State
        cvList,
        loading,
        uploadLoading,
        authLoading,
        user,

        // Actions
        loadCVs,
        uploadCV,
        deleteCV,
        handleAuthError
    }
}