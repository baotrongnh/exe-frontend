"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Package, FileDown, Loader2 } from "lucide-react";
import { DeliverableCard, RejectModal, DetailsModal, StatsCards } from "./components";

interface Deliverable {
    id: string;
    job_id: string;
    freelancer_id: string;
    title: string;
    description: string;
    status: "pending" | "approved" | "rejected" | "revision_requested";
    files: string[];
    submitted_at: string;
    reviewed_at?: string;
    rejection_reason?: string;
    revision_notes?: string;
    // Populated fields
    job?: {
        id: string;
        title: string;
    };
    freelancer?: {
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
                        alert("You need to be verified to view deliverables");
                        router.push("/employer/dashboard");
                    }
                } else {
                    console.error("Invalid profile response:", response);
                    alert("Failed to fetch profile");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                alert("Failed to fetch profile");
            }
        };

        fetchProfile();
    }, [user, router]);

    // Fetch all deliverables for all jobs
    useEffect(() => {
        if (!profile?.is_verified) {
            return;
        }

        const fetchDeliverables = async () => {
            try {
                setLoading(true);

                // Mock data for now - replace with actual API call when backend is ready
                // const response = await api.deliverables.getAll();

                // Simulated data
                const mockDeliverables: Deliverable[] = [
                    {
                        id: "1",
                        job_id: "job-1",
                        freelancer_id: "freelancer-1",
                        title: "Website Homepage Design",
                        description: "Completed the homepage design with all requested features including hero section, services overview, and contact form.",
                        status: "pending",
                        files: ["homepage-design.fig", "assets.zip"],
                        submitted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        job: {
                            id: "job-1",
                            title: "Full Stack Website Development",
                        },
                        freelancer: {
                            id: "freelancer-1",
                            full_name: "John Doe",
                            email: "john@example.com",
                        },
                    },
                    {
                        id: "2",
                        job_id: "job-2",
                        freelancer_id: "freelancer-2",
                        title: "Mobile App UI/UX",
                        description: "Complete UI/UX design for the mobile application with all screens and user flows.",
                        status: "approved",
                        files: ["mobile-ui.fig", "prototype-link.txt"],
                        submitted_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                        reviewed_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
                        job: {
                            id: "job-2",
                            title: "Mobile App Design",
                        },
                        freelancer: {
                            id: "freelancer-2",
                            full_name: "Jane Smith",
                            email: "jane@example.com",
                        },
                    },
                    {
                        id: "3",
                        job_id: "job-3",
                        freelancer_id: "freelancer-3",
                        title: "Logo Design Initial Draft",
                        description: "First draft of the logo design with 3 different concepts as requested.",
                        status: "rejected",
                        files: ["logo-concepts.pdf"],
                        submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                        reviewed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        rejection_reason: "The color scheme doesn't match our brand guidelines. Please use our primary colors (Blue #1E40AF and Gray #6B7280).",
                        job: {
                            id: "job-3",
                            title: "Brand Identity Design",
                        },
                        freelancer: {
                            id: "freelancer-3",
                            full_name: "Mike Johnson",
                            email: "mike@example.com",
                        },
                    },
                ];

                setDeliverables(mockDeliverables);
            } catch (error) {
                console.error("Error fetching deliverables:", error);
                alert("Failed to load deliverables");
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

            console.log("=== Approve Deliverable ===");
            console.log("Deliverable ID:", deliverableId);

            // TODO: Replace with actual API call
            // await api.deliverables.approve(deliverableId);

            // Update local state
            setDeliverables((prev) =>
                prev.map((d) =>
                    d.id === deliverableId
                        ? { ...d, status: "approved" as const, reviewed_at: new Date().toISOString() }
                        : d
                )
            );

            alert("Deliverable approved successfully!");
        } catch (error) {
            console.error("Error approving deliverable:", error);
            alert("Failed to approve deliverable. Please try again.");
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

    // Handle Reject Deliverable
    const handleReject = async () => {
        if (!selectedDeliverable || !rejectionReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }

        try {
            setActionLoading(`reject-${selectedDeliverable.id}`);

            console.log("=== Reject Deliverable ===");
            console.log("Deliverable ID:", selectedDeliverable.id);
            console.log("Rejection Reason:", rejectionReason);

            // TODO: Replace with actual API call
            // await api.deliverables.reject(selectedDeliverable.id, { reason: rejectionReason });

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

            alert("Deliverable rejected successfully!");
            setRejectModalOpen(false);
            setSelectedDeliverable(null);
            setRejectionReason("");
        } catch (error) {
            console.error("Error rejecting deliverable:", error);
            alert("Failed to reject deliverable. Please try again.");
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
    const handleDownloadFile = (fileName: string) => {
        // TODO: Replace with actual file download
        console.log("Downloading file:", fileName);
        alert(`Downloading ${fileName}...`);
    };

    // Filter deliverables
    const filteredDeliverables = deliverables.filter((deliverable) => {
        const matchesSearch =
            (deliverable.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (deliverable.job?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (deliverable.freelancer?.full_name || "").toLowerCase().includes(searchQuery.toLowerCase());
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
