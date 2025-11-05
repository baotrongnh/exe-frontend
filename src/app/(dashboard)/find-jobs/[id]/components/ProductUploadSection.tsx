import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { useToast } from "@/components/toast"

const TEMP_API_URL = 'https://513q6dp9-5000.asse.devtunnels.ms'
import {
    Upload,
    X,
    FileText,
    Download,
    Trash2,
    Loader2,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react"

interface ProductFile {
    name: string
    path: string
    size: number
    mimetype: string
}

interface Product {
    id: string
    job_id: string
    applicant_id: string
    title: string
    description: string
    files: (ProductFile | string)[] // Can be ProductFile objects or Firebase URLs
    status: "pending" | "rejected" | "approved"
    rejection_reason: string | null
    reviewed_at: string | null
    reviewed_by: string | null
    created_at: string
    updated_at: string
}

interface ProductUploadSectionProps {
    jobId: string
}

export function ProductUploadSection({ jobId }: ProductUploadSectionProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const toast = useToast()

    useEffect(() => {
        fetchProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobId])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await api.jobProducts.getAll({
                job_id: jobId,
                order: "DESC",
            })

            if (response.success && response.data?.products) {
                setProducts(response.data.products)
            }
        } catch (err: unknown) {
            console.error("Error fetching products:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const maxSize = 25 * 1024 * 1024 // 25MB
        const maxFiles = 10

        if (selectedFiles.length + files.length > maxFiles) {
            toast.showToast(`Maximum ${maxFiles} files allowed`, "error")
            return
        }

        const validFiles = files.filter((file) => {
            if (file.size > maxSize) {
                toast.showToast(`File ${file.name} exceeds 25MB`, "error")
                return false
            }
            return true
        })

        setSelectedFiles((prev) => [...prev, ...validFiles])
    }

    const handleRemoveFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {
        if (!title.trim()) {
            toast.showToast("Please enter a title", "error")
            return
        }

        if (selectedFiles.length === 0) {
            toast.showToast("Please select at least one file", "error")
            return
        }

        try {
            setUploading(true)
            await api.jobProducts.upload({
                job_id: jobId,
                title: title.trim(),
                description: description.trim(),
                files: selectedFiles,
            })

            toast.showToast("Product uploaded successfully!", "success")

            // Reset form
            setTitle("")
            setDescription("")
            setSelectedFiles([])
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }

            // Refresh products
            fetchProducts()
        } catch (err: unknown) {
            console.error("Error uploading product:", err)
            const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to upload product"
            toast.showToast(errorMessage, "error")
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (productId: string) => {
        if (!confirm("Are you sure you want to delete this product?")) {
            return
        }

        try {
            await api.jobProducts.delete(productId)
            toast.showToast("Product deleted successfully", "success")
            fetchProducts()
        } catch (err: unknown) {
            console.error("Error deleting product:", err)
            const errorMessage = (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to delete product"
            toast.showToast(errorMessage, "error")
        }
    }

    const handleDownload = async (fileUrl: string, fileName: string, productId: string, fileIndex: number) => {
        try {
            console.log("=== DOWNLOAD FILE START ===")
            console.log("Product ID:", productId)
            console.log("File Index:", fileIndex)
            console.log("File Name:", fileName)
            toast.showToast("Preparing download...", "info")

            // Use backend endpoint to download with proper Content-Disposition header
            // Backend will fetch from Firebase and return with attachment header
            const downloadUrl = `${TEMP_API_URL}/api/job-products/${productId}/files/${fileIndex}`
            console.log("Fetching from backend:", downloadUrl)

            const response = await api.jobProducts.downloadFile(productId, fileIndex)

            // If response is a URL (redirect), fetch it as blob
            const finalUrl = typeof response === 'string' ? response : downloadUrl
            console.log("Fetching file from:", finalUrl)

            const fileResponse = await fetch(finalUrl)

            if (!fileResponse.ok) {
                throw new Error(`HTTP error! status: ${fileResponse.status}`)
            }

            console.log("Creating blob...")
            const blob = await fileResponse.blob()
            console.log("Blob size:", (blob.size / 1024 / 1024).toFixed(2), "MB")

            // Create blob URL and trigger download
            const blobUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = fileName
            link.style.display = 'none'

            document.body.appendChild(link)
            link.click()

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link)
                URL.revokeObjectURL(blobUrl)
            }, 100)

            toast.showToast("Download started!", "success")
            console.log("=== DOWNLOAD SUCCESS ===")
        } catch (error) {
            console.error("=== DOWNLOAD ERROR ===", error)
            toast.showToast("Download failed. Opening file in new tab.", "warning")
            // Fallback: open Firebase URL directly
            window.open(fileUrl, '_blank')
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Review
                    </Badge>
                )
            case "approved":
                return (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="secondary" className="bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                    </Badge>
                )
            default:
                return null
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B"
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
        return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    }

    return (
        <div className="space-y-6">
            {/* Upload Form */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Upload Product</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter product title"
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter product description (optional)"
                            className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                            maxLength={500}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Files <span className="text-red-500">*</span>
                        </label>
                        <div
                            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-1">
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
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {selectedFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <FileText className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                                            <span className="text-sm truncate">{file.name}</span>
                                            <span className="text-xs text-muted-foreground flex-shrink-0">
                                                {formatFileSize(file.size)}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={uploading || !title.trim() || selectedFiles.length === 0}
                        className="w-full"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
            </Card>

            {/* Uploaded Products */}
            {loading ? (
                <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading products...</p>
                </div>
            ) : products.length > 0 ? (
                <div>
                    <h3 className="text-lg font-bold text-foreground mb-4">
                        Your Uploaded Products ({products.length})
                    </h3>
                    <div className="space-y-4">
                        {products.map((product) => (
                            <Card key={product.id} className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-foreground">{product.title}</h4>
                                            {getStatusBadge(product.status)}
                                        </div>
                                        {product.description && (
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {product.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Uploaded: {new Date(product.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    {product.status === "pending" && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                {product.rejection_reason && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                                        <p className="text-sm text-red-700">{product.rejection_reason}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-foreground">Files:</p>
                                    {product.files.map((file: ProductFile | string, index: number) => {
                                        console.log("File object:", file);
                                        console.log("File type:", typeof file);
                                        console.log("Is string:", typeof file === 'string');

                                        // If file is just a string (URL), extract filename from URL
                                        const fileUrl = typeof file === 'string' ? file : file.path;
                                        const fileName = typeof file === 'string'
                                            ? file.split('/').pop()?.split('?')[0] || 'file'
                                            : file.name;
                                        const fileSize = typeof file === 'string' ? 0 : file.size;

                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-3 bg-muted rounded-lg"
                                            >
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    <FileText className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                                                    <span className="text-sm truncate">{fileName}</span>
                                                    {fileSize > 0 && (
                                                        <span className="text-xs text-muted-foreground flex-shrink-0">
                                                            {formatFileSize(fileSize)}
                                                        </span>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDownload(fileUrl, fileName, product.id, index)}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    )
}
