import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/components/toast"
import { ProductCard } from "./ProductCard"

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

interface ProductListProps {
    jobId: string
}

export function ProductList({ jobId }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
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
            toast.showToast("Failed to load products", "error")
        } finally {
            setLoading(false)
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

    const handleDownload = async (productId: string, fileIndex: number, fileName: string) => {
        try {
            const blob = await api.jobProducts.downloadFile(productId, fileIndex)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.showToast("Download started", "success")
        } catch (err: unknown) {
            console.error("Error downloading file:", err)
            toast.showToast("Failed to download file", "error")
        }
    }

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                        className="w-8 h-8 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                    </svg>
                </div>
                <p className="text-sm text-muted-foreground">No products uploaded yet</p>
                <p className="text-xs text-muted-foreground mt-1">Click &quot;Upload Product&quot; to submit your work</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-foreground mb-4">Submitted Products ({products.length})</h4>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onDelete={handleDelete}
                    onDownload={handleDownload}
                />
            ))}
        </div>
    )
}
