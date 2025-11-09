"use client";

import { Button } from "@/components/ui/button";
import {
    CheckCircle,
    XCircle,
    Download,
    Eye,
    FileText,
    Calendar,
    User,
    Briefcase,
    Loader2,
    AlertCircle,
} from "lucide-react";

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
    files: (ProductFile | string)[];
    created_at: string;
    reviewed_at?: string | null;
    rejection_reason?: string | null;
    reviewed_by?: string | null;
    updated_at: string;
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

interface DeliverableCardProps {
    deliverable: Deliverable;
    onApprove: (id: string) => void;
    onReject: (deliverable: Deliverable) => void;
    onViewDetails: (deliverable: Deliverable) => void;
    onDownloadFile: (fileUrl: string, fileName: string, productId: string, fileIndex: number) => void;
    actionLoading: string | null;
    formatDate: (dateString: string) => string;
    getStatusColor: (status: string) => string;
}

export function DeliverableCard({
    deliverable,
    onApprove,
    onReject,
    onViewDetails,
    onDownloadFile,
    actionLoading,
    formatDate,
    getStatusColor,
}: DeliverableCardProps) {
    return (
        <div className="p-6 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-transparent transition-all duration-200 group">
            <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                    {/* Header Info */}
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-600 font-semibold text-lg">
                                {deliverable.applicant?.full_name?.charAt(0).toUpperCase() || "F"}
                            </span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{deliverable.title}</h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                        deliverable.status
                                    )}`}
                                >
                                    {deliverable.status.charAt(0).toUpperCase() +
                                        deliverable.status.slice(1).replace("_", " ")}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                {deliverable.applicant?.full_name && (
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-4 h-4" />
                                        <span className="font-medium">{deliverable.applicant.full_name}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{deliverable.job?.title || "Unknown Job"}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>Submitted {formatDate(deliverable.created_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 leading-relaxed">{deliverable.description}</p>

                    {/* Files */}
                    {deliverable.files && deliverable.files.length > 0 && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">
                                    Attached Files ({deliverable.files.length})
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {deliverable.files.map((file, index) => {
                                    const fileUrl = typeof file === 'string' ? file : file.path
                                    const fileName = typeof file === 'string'
                                        ? file.split('/').pop()?.split('?')[0] || `File ${index + 1}`
                                        : file.name
                                    const fileSize = typeof file === 'string' ? 0 : file.size

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => onDownloadFile(fileUrl, fileName, deliverable.id, index)}
                                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-700 transition-colors group/file"
                                        >
                                            <FileText className="w-4 h-4 text-gray-500" />
                                            <span className="font-medium">{fileName}</span>
                                            {fileSize > 0 && (
                                                <span className="text-xs text-gray-500">({(fileSize / 1024).toFixed(1)} KB)</span>
                                            )}
                                            <Download className="w-3.5 h-3.5 text-gray-400 group-hover/file:text-indigo-600 transition-colors" />
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Rejection Reason */}
                    {deliverable.status === "rejected" && deliverable.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-red-900 mb-1">Rejection Reason</h4>
                                    <p className="text-sm text-red-800">{deliverable.rejection_reason}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Review Info */}
                    {deliverable.reviewed_at && (
                        <p className="text-xs text-gray-500">Reviewed {formatDate(deliverable.reviewed_at)}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(deliverable)}
                        className="gap-2 bg-white hover:bg-gray-50 border-gray-300"
                    >
                        <Eye className="w-4 h-4" />
                        View Details
                    </Button>

                    {deliverable.status === "pending" && (
                        <>
                            <Button
                                size="sm"
                                onClick={() => onApprove(deliverable.id)}
                                disabled={actionLoading === `approve-${deliverable.id}`}
                                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                            >
                                {actionLoading === `approve-${deliverable.id}` ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => onReject(deliverable)}
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
    );
}
