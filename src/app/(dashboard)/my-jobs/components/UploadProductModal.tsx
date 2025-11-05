import { useState, useRef } from "react"
import { X, Upload, FileText, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { useToast } from "@/components/toast"

interface Job {
    id: string
    title: string
}

interface UploadProductModalProps {
    isOpen: boolean
    onClose: () => void
    job: Job
    onSuccess: () => void
}

export function UploadProductModal({ isOpen, onClose, job, onSuccess }: UploadProductModalProps) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const toast = useToast()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)

            // Check max files (10)
            if (files.length + newFiles.length > 10) {
                toast.showToast("Maximum 10 files allowed", "error")
                return
            }

            // Check file size (25MB each)
            const maxSize = 25 * 1024 * 1024 // 25MB
            const oversizedFiles = newFiles.filter(file => file.size > maxSize)

            if (oversizedFiles.length > 0) {
                toast.showToast(`Some files exceed 25MB limit: ${oversizedFiles.map(f => f.name).join(", ")}`, "error")
                return
            }

            setFiles([...files, ...newFiles])
        }
    }

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) {
            toast.showToast("Please enter a title", "error")
            return
        }

        if (files.length === 0) {
            toast.showToast("Please select at least one file", "error")
            return
        }

        try {
            setUploading(true)
            await api.jobProducts.upload({
                job_id: job.id,
                title: title.trim(),
                description: description.trim(),
                files,
            })

            toast.showToast("Product uploaded successfully!", "success")
            onSuccess()
            handleClose()
        } catch (err: unknown) {
            console.error("Error uploading product:", err)
            const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to upload product"
            toast.showToast(errorMessage, "error")
        } finally {
            setUploading(false)
        }
    }

    const handleClose = () => {
        setTitle("")
        setDescription("")
        setFiles([])
        onClose()
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">Upload Product</h2>
                        <p className="text-sm text-muted-foreground mt-1">For: {job.title}</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        disabled={uploading}
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-semibold">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Website Design - Version 1"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={uploading}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold">
                            Description (Optional)
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Add notes about this submission..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={uploading}
                            rows={4}
                        />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">
                            Files <span className="text-red-500">*</span>
                        </Label>
                        <div
                            className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm font-medium text-foreground mb-1">
                                Click to upload files
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Maximum 10 files, 25MB each
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                            accept="*/*"
                        />
                    </div>

                    {/* Selected Files */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold">
                                Selected Files ({files.length}/10)
                            </Label>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-muted rounded-md p-3"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(index)}
                                            disabled={uploading}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={uploading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={uploading || files.length === 0 || !title.trim()}
                            className="flex-1"
                        >
                            {uploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Product
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
