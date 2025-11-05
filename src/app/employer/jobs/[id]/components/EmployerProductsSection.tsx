import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useToast } from "@/components/toast"
import {
    FileText,
    Download,
    Loader2,
    CheckCircle,
    XCircle,
    User,
    Eye,
    Calendar,
    AlertCircle
} from "lucide-react"
import { RejectModal } from "./RejectModal"
import { DetailsModal } from "./DetailsModal"

const TEMP_API_URL = 'https://513q6dp9-5000.asse.devtunnels.ms'

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
    files: (ProductFile | string)[]
    status: "pending" | "rejected" | "approved"
    rejection_reason: string | null
    reviewed_at: string | null
    reviewed_by: string | null
    created_at: string
    updated_at: string
}

interface EmployerProductsSectionProps {
    jobId: string
}

export function EmployerProductsSection({ jobId }: EmployerProductsSectionProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    // Reject Modal State
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [rejectionReason, setRejectionReason] = useState("")

    // View Details Modal State
    const [detailsModalOpen, setDetailsModalOpen] = useState(false)
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null)

    const toast = useToast()

    useEffect(() => {
        fetchProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobId])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const response = await api.jobProducts.getByJob(jobId)

            if (response.success && response.data?.products) {
                setProducts(response.data.products)
            }
        } catch (err: unknown) {
            console.error("Error fetching products:", err)
        } finally {
            setLoading(false)
        }
    }

    // Handle Approve Product
    const handleApprove = async (productId: string) => {
        try {
            setActionLoading(`approve-${productId}`)

            await api.jobProducts.review(productId, {
                status: "approved",
            })

            // Update local state
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === productId
                        ? { ...p, status: "approved" as const, reviewed_at: new Date().toISOString() }
                        : p
                )
            )

            toast.showToast("Product approved successfully!", "success")
        } catch (error) {
            console.error("Error approving product:", error)
            toast.showToast("Failed to approve product", "error")
        } finally {
            setActionLoading(null)
        }
    }

    // Open Reject Modal
    const openRejectModal = (product: Product) => {
        setSelectedProduct(product)
        setRejectionReason("")
        setRejectModalOpen(true)
    }

    // Handle Reject Product
    const handleReject = async () => {
        if (!selectedProduct || !rejectionReason.trim()) {
            toast.showToast("Please provide a reason for rejection", "error")
            return
        }

        try {
            setActionLoading(`reject-${selectedProduct.id}`)

            await api.jobProducts.review(selectedProduct.id, {
                status: "rejected",
                rejection_reason: rejectionReason,
            })

            // Update local state
            setProducts((prev) =>
                prev.map((p) =>
                    p.id === selectedProduct.id
                        ? {
                            ...p,
                            status: "rejected" as const,
                            rejection_reason: rejectionReason,
                            reviewed_at: new Date().toISOString(),
                        }
                        : p
                )
            )

            toast.showToast("Product rejected successfully!", "success")
            setRejectModalOpen(false)
            setSelectedProduct(null)
            setRejectionReason("")
        } catch (error) {
            console.error("Error rejecting product:", error)
            toast.showToast("Failed to reject product", "error")
        } finally {
            setActionLoading(null)
        }
    }

    // Open Details Modal
    const openDetailsModal = (product: Product) => {
        setViewingProduct(product)
        setDetailsModalOpen(true)
    }

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
        if (diffInHours < 24) return `${diffInHours} hours ago`
        if (diffInDays === 0) return "Today"
        if (diffInDays === 1) return "Yesterday"
        if (diffInDays < 7) return `${diffInDays} days ago`
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
        return date.toLocaleDateString()
    }

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "approved":
                return "bg-green-100 text-green-800 border-green-200"
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const handleDownload = async (fileUrl: string, fileName: string, productId: string, fileIndex: number) => {
        try {
            console.log("=== DOWNLOAD FILE START ===")
            console.log("Product ID:", productId)
            console.log("File Index:", fileIndex)
            console.log("File Name:", fileName)
            toast.showToast("Preparing download...", "info")

            const downloadUrl = `${TEMP_API_URL}/api/job-products/${productId}/files/${fileIndex}`
            console.log("Fetching from backend:", downloadUrl)

            const response = await api.jobProducts.downloadFile(productId, fileIndex)

            const finalUrl = typeof response === 'string' ? response : downloadUrl
            console.log("Fetching file from:", finalUrl)

            const fileResponse = await fetch(finalUrl)

            if (!fileResponse.ok) {
                throw new Error(`HTTP error! status: ${fileResponse.status}`)
            }

            console.log("Creating blob...")
            const blob = await fileResponse.blob()
            console.log("Blob size:", (blob.size / 1024 / 1024).toFixed(2), "MB")

            const blobUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = fileName
            link.style.display = 'none'

            document.body.appendChild(link)
            link.click()

            setTimeout(() => {
                document.body.removeChild(link)
                URL.revokeObjectURL(blobUrl)
            }, 100)

            toast.showToast("Download started!", "success")
            console.log("=== DOWNLOAD SUCCESS ===")
        } catch (error) {
            console.error("=== DOWNLOAD ERROR ===", error)
            toast.showToast("Download failed. Opening file in new tab.", "warning")
            window.open(fileUrl, '_blank')
        }
    }

    if (loading) {
        return (
            <div className="text-center py-8">
                <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-indigo-600" />
                <p className="text-sm text-gray-600">Loading products...</p>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Products Submitted Yet</h4>
                <p className="text-sm text-gray-600">
                    Freelancers who have applied to this job haven&apos;t submitted any products yet.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                {products.map((product) => (
                    <div key={product.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 bg-white">
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex-1">
                                {/* Header Info */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{product.title}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(product.status)}`}>
                                                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                <span>Submitted {formatDate(product.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>
                                )}

                                {/* Files */}
                                {product.files && product.files.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Attached Files ({product.files.length})
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {product.files.map((file: ProductFile | string, index: number) => {
                                                const fileUrl = typeof file === 'string' ? file : file.path
                                                const fileName = typeof file === 'string'
                                                    ? file.split('/').pop()?.split('?')[0] || 'file'
                                                    : file.name
                                                const fileSize = typeof file === 'string' ? 0 : file.size

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleDownload(fileUrl, fileName, product.id, index)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors group/file"
                                                    >
                                                        <FileText className="w-4 h-4 text-gray-500" />
                                                        <span className="font-medium">{fileName}</span>
                                                        {fileSize > 0 && (
                                                            <span className="text-xs text-gray-500">
                                                                ({(fileSize / 1024).toFixed(1)} KB)
                                                            </span>
                                                        )}
                                                        <Download className="w-3.5 h-3.5 text-gray-400 group-hover/file:text-indigo-600 transition-colors" />
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Rejection Reason */}
                                {product.status === "rejected" && product.rejection_reason && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-red-900 mb-1">Rejection Reason</h4>
                                                <p className="text-sm text-red-800">{product.rejection_reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Review Info */}
                                {product.reviewed_at && (
                                    <p className="text-xs text-gray-500">Reviewed {formatDate(product.reviewed_at)}</p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 flex-shrink-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDetailsModal(product)}
                                    className="gap-2 bg-white hover:bg-gray-50 border-gray-300"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                </Button>

                                {product.status === "pending" && (
                                    <>
                                        <Button
                                            size="sm"
                                            onClick={() => handleApprove(product.id)}
                                            disabled={actionLoading === `approve-${product.id}`}
                                            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            {actionLoading === `approve-${product.id}` ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <CheckCircle className="w-4 h-4" />
                                            )}
                                            Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => openRejectModal(product)}
                                            disabled={!!actionLoading}
                                            variant="destructive"
                                            className="gap-2"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            <RejectModal
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                deliverable={selectedProduct}
                rejectionReason={rejectionReason}
                onReasonChange={setRejectionReason}
                onConfirm={handleReject}
                isLoading={!!actionLoading}
            />

            <DetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                deliverable={viewingProduct}
                onDownloadFile={handleDownload}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
            />
        </>
    )
}
