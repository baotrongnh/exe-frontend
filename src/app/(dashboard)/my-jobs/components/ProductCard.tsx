import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Trash2, FileText, CheckCircle, XCircle, Clock } from "lucide-react"

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
    files: ProductFile[]
    status: "pending" | "rejected" | "approved"
    rejection_reason: string | null
    reviewed_at: string | null
    reviewed_by: string | null
    created_at: string
    updated_at: string
}

interface ProductCardProps {
    product: Product
    onDelete: (productId: string) => void
    onDownload: (productId: string, fileIndex: number, fileName: string) => void
}

export function ProductCard({ product, onDelete, onDownload }: ProductCardProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Review
                    </Badge>
                )
            case "approved":
                return (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                    </Badge>
                )
            default:
                return null
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes"
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <Card className="p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h5 className="font-semibold text-foreground">{product.title}</h5>
                            <p className="text-xs text-muted-foreground mt-1">
                                Submitted: {formatDate(product.created_at)}
                            </p>
                        </div>
                        {getStatusBadge(product.status)}
                    </div>

                    {product.description && (
                        <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                    )}

                    {product.status === "rejected" && product.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                            <p className="text-sm text-red-800">
                                <span className="font-semibold">Rejection Reason: </span>
                                {product.rejection_reason}
                            </p>
                        </div>
                    )}

                    {/* Files */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase">
                            Attached Files ({product.files.length})
                        </p>
                        {product.files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between bg-muted/50 rounded-md p-2"
                            >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(file.size)} • {file.mimetype}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => onDownload(product.id, index, file.name)}
                                    className="flex-shrink-0"
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delete Button - Only for pending products */}
                {product.status === "pending" && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </Card>
    )
}
