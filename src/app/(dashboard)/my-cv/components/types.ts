export interface CV {
    id: string
    name: string
    description: string
    file?: File | null
    uploadDate: Date
    previewUrl?: string | null
    fileName?: string
    fileSize?: number
}