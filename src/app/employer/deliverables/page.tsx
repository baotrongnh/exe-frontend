"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Package, FileDown, Loader2 } from "lucide-react";
import { DeliverableCard, RejectModal, DetailsModal, StatsCards } from "./components";
import { useToast } from "@/components/toast";

interface ProductFile {
    name: string;
    path: string;
    size: number;
    mimetype: string;
}

interface Deliverable {
    id: string;
    job_id: string;
    applicant_id: string;
    title: string;
    description: string;
    status: "pending" | "approved" | "rejected";
    files: ProductFile[];
    created_at: string;
    reviewed_at?: string | null;
    rejection_reason?: string | null;
    reviewed_by?: string | null;
    updated_at: string;
    // Populated fields from backend (if available)
    job?: {
        id: string;
        title: string;
    };
    applicant?: {
        id: string;
        full_name: string;
        email: string;
    };
}

export default function EmployerDeliverablesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTab, setSelectedTab] = useState("all");
    const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<{ is_verified: boolean } | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Reject Modal State
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    // View Details Modal State
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [viewingDeliverable, setViewingDeliverable] = useState<Deliverable | null>(null);

    const { user } = useAuth();
    const router = useRouter();
    const toast = useToast();

    // Check authentication and verification status
    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await api.employer.getProfile();
                console.log("Profile response:", response);

                if (response && response.id) {
                    setProfile(response);

                    if (!response.is_verified) {
                        toast.showToast("You need to be verified to view deliverables", "warning");
                        router.push("/employer/dashboard");
                    }
                } else {
                    console.error("Invalid profile response:", response);
                    toast.showToast("Failed to fetch profile", "error");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.showToast("Failed to fetch profile", "error");
            }
        };

        fetchProfile();
    }, [user, router]);

    // Fetch all deliverables (job products) for all jobs
    useEffect(() => {
        if (!profile?.is_verified) {
            return;
        }

        const fetchDeliverables = async () => {
            try {
                setLoading(true);

                // Get all jobs for the employer
                const jobsResponse = await api.jobs.getMyJobs();
                console.log("Jobs response:", jobsResponse);

                if (!jobsResponse.success || !jobsResponse.data) {
                    setDeliverables([]);
                    return;
                }

                // Fetch products for each job
                const allProducts: Deliverable[] = [];
                for (const job of jobsResponse.data) {
                    try {
                        const productsResponse = await api.jobProducts.getByJob(job.id);
                        console.log(`Products for job ${job.id}:`, productsResponse);

                        if (productsResponse.success && productsResponse.data?.products) {
                            // Add job info to each product and log detailed structure
                            const productsWithJob = productsResponse.data.products.map((product: Deliverable) => {
                                console.log("Product structure:", {
                                    id: product.id,
                                    hasFiles: !!product.files,
                                    filesLength: product.files?.length,
                                    files: product.files,
                                    hasApplicant: !!product.applicant,
                                    applicant: product.applicant,
                                });
                                return {
                                    ...product,
                                    job: {
                                        id: job.id,
                                        title: job.title,
                                    },
                                };
                            });
                            allProducts.push(...productsWithJob);
                        }
                    } catch (error) {
                        console.error(`Error fetching products for job ${job.id}:`, error);
                    }
                }

                console.log("All products:", allProducts);
                setDeliverables(allProducts);
            } catch (error) {
                console.error("Error fetching deliverables:", error);
                toast.showToast("Failed to load deliverables", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchDeliverables();
    }, [profile]);

    // Helper function to format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    // Handle Approve Deliverable
    const handleApprove = async (deliverableId: string) => {
        try {
            setActionLoading(`approve-${deliverableId}`);

            console.log("=== Approve Product ===");
            console.log("Product ID:", deliverableId);

            await api.jobProducts.review(deliverableId, {
                status: "approved",
            });

            // Update local state
            setDeliverables((prev) =>
                prev.map((d) =>
                    d.id === deliverableId
                        ? { ...d, status: "approved" as const, reviewed_at: new Date().toISOString() }
                        : d
                )
            );

            toast.showToast("Product approved successfully!", "success");
        } catch (error) {
            console.error("Error approving product:", error);
            toast.showToast("Failed to approve product. Please try again.", "error");
        } finally {
            setActionLoading(null);
        }
    };

    // Open Reject Modal
    const openRejectModal = (deliverable: Deliverable) => {
        setSelectedDeliverable(deliverable);
        setRejectionReason("");
        setRejectModalOpen(true);
    };

    // Handle Reject Product
    const handleReject = async () => {
        if (!selectedDeliverable || !rejectionReason.trim()) {
            toast.showToast("Please provide a reason for rejection", "warning");
            return;
        }

        try {
            setActionLoading(`reject-${selectedDeliverable.id}`);

            console.log("=== Reject Product ===");
            console.log("Product ID:", selectedDeliverable.id);
            console.log("Rejection Reason:", rejectionReason);

            await api.jobProducts.review(selectedDeliverable.id, {
                status: "rejected",
                rejection_reason: rejectionReason,
            });

            // Update local state
            setDeliverables((prev) =>
                prev.map((d) =>
                    d.id === selectedDeliverable.id
                        ? {
                            ...d,
                            status: "rejected" as const,
                            rejection_reason: rejectionReason,
                            reviewed_at: new Date().toISOString(),
                        }
                        : d
                )
            );

            toast.showToast("Product rejected successfully!", "success");
            setRejectModalOpen(false);
            setSelectedDeliverable(null);
            setRejectionReason("");
        } catch (error) {
            console.error("Error rejecting product:", error);
            toast.showToast("Failed to reject product. Please try again.", "error");
        } finally {
            setActionLoading(null);
        }
    };

    // Open Details Modal
    const openDetailsModal = (deliverable: Deliverable) => {
        setViewingDeliverable(deliverable);
        setDetailsModalOpen(true);
    };

    // Handle Download File
    const handleDownloadFile = async (fileUrl: string, fileName: string, productId: string, fileIndex: number) => {
        try {
            console.log("=== DOWNLOAD FILE START ===");
            console.log("Product ID:", productId);
            console.log("File Index:", fileIndex);
            console.log("File Name:", fileName);

            // Get backend download URL
            const backendUrl = await api.jobProducts.downloadFile(productId, fileIndex);
            console.log("Backend download URL:", backendUrl);

            // Fetch file with authentication (axios will add auth token automatically)
            // We need to use the jobProductsApiClient which has auth interceptor
            const response = await fetch(backendUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${(await import('@/lib/supabase').then(m => m.supabase.auth.getSession())).data.session?.access_token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Convert response to blob
            const blob = await response.blob();
            console.log("Blob created:", (blob.size / 1024 / 1024).toFixed(2), "MB");

            // Create blob URL and trigger download
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
                console.log("=== DOWNLOAD SUCCESS ===");
            }, 100);

            toast.showToast("Download started! Check your Downloads folder.", "success");
        } catch (error) {
            console.error("=== DOWNLOAD ERROR ===", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.showToast(`Download failed: ${errorMessage}. Opening file in new tab...`, "warning");

            // Fallback: use original file URL (Firebase direct URL)
            if (fileUrl && fileUrl !== '') {
                console.log("Falling back to original file URL:", fileUrl);
                window.open(fileUrl, '_blank');
            } else {
                toast.showToast("Failed to download file. Please try again.", "error");
            }
        }
    };

    // Filter deliverables
    const filteredDeliverables = deliverables.filter((deliverable) => {
        const matchesSearch =
            (deliverable.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (deliverable.job?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (deliverable.applicant?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = selectedTab === "all" || deliverable.status === selectedTab;
        return matchesSearch && matchesTab;
    });

    // Count by status
    const allCount = deliverables.length;
    const pendingCount = deliverables.filter((d) => d.status === "pending").length;
    const approvedCount = deliverables.filter((d) => d.status === "approved").length;
    const rejectedCount = deliverables.filter((d) => d.status === "rejected").length;

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "approved":
                return "bg-green-100 text-green-800 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-800 border-red-200";
            case "revision_requested":
                return "bg-orange-100 text-orange-800 border-orange-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Deliverables</h1>
                            <p className="text-gray-600 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Review and approve freelancer work submissions
                            </p>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                            <FileDown className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <StatsCards
                    allCount={allCount}
                    pendingCount={pendingCount}
                    approvedCount={approvedCount}
                    rejectedCount={rejectedCount}
                    onTabChange={setSelectedTab}
                />

                {/* Deliverables List */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search by title, job, or freelancer..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm"
                                    />
                                </div>
                            </div>
                            <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 border-gray-300 shadow-sm">
                                <Filter className="w-4 h-4" />
                                Filter
                            </Button>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-2">
                            {[
                                { key: "all", label: "All", count: allCount },
                                { key: "pending", label: "Pending Review", count: pendingCount },
                                { key: "approved", label: "Approved", count: approvedCount },
                                { key: "rejected", label: "Rejected", count: rejectedCount },
                            ].map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setSelectedTab(tab.key)}
                                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap rounded-t-lg ${selectedTab === tab.key
                                        ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        }`}
                                >
                                    {tab.label}{" "}
                                    <span className="ml-1.5 px-2 py-0.5 rounded-full text-xs bg-gray-200">{tab.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {loading ? (
                            <div className="p-16 text-center">
                                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                                <p className="text-gray-600 mt-6 text-lg font-medium">Loading deliverables...</p>
                            </div>
                        ) : (
                            filteredDeliverables.map((deliverable) => (
                                <DeliverableCard
                                    key={deliverable.id}
                                    deliverable={deliverable}
                                    onApprove={handleApprove}
                                    onReject={openRejectModal}
                                    onViewDetails={openDetailsModal}
                                    onDownloadFile={handleDownloadFile}
                                    actionLoading={actionLoading}
                                    formatDate={formatDate}
                                    getStatusColor={getStatusColor}
                                />
                            ))
                        )}
                    </div>

                    {!loading && filteredDeliverables.length === 0 && (
                        <div className="p-16 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Package className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deliverables found</h3>
                            <p className="text-gray-600 mb-6">There are no deliverables matching your criteria</p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedTab("all");
                                }}
                                className="bg-white hover:bg-gray-50"
                            >
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <RejectModal
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                deliverable={selectedDeliverable}
                rejectionReason={rejectionReason}
                onReasonChange={setRejectionReason}
                onConfirm={handleReject}
                isLoading={!!actionLoading}
            />

            <DetailsModal
                isOpen={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                deliverable={viewingDeliverable}
                onDownloadFile={handleDownloadFile}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
            />
        </div>
    );
}
