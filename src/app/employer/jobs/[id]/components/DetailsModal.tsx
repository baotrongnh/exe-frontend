"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Package,
    Calendar,
    FileText,
    Download,
    AlertCircle,
} from "lucide-react";

interface ProductFile {
    name: string;
    path: string;
    size: number;
    mimetype: string;
}

interface Product {
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
}

interface DetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    deliverable: Product | null;
    onDownloadFile: (fileUrl: string, fileName: string, productId: string, fileIndex: number) => void;
    formatDate: (dateString: string) => string;
    getStatusColor: (status: string) => string;
}

export function DetailsModal({
    isOpen,
    onClose,
    deliverable,
    onDownloadFile,
    formatDate,
    getStatusColor,
}: DetailsModalProps) {
    if (!deliverable) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-indigo-600" />
                        Product Details
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                        <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                                deliverable.status
                            )}`}
                        >
                            {deliverable.status.charAt(0).toUpperCase() +
                                deliverable.status.slice(1).replace("_", " ")}
                        </span>
                        {deliverable.reviewed_at && (
                            <span className="text-sm text-gray-500">Reviewed {formatDate(deliverable.reviewed_at)}</span>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{deliverable.title}</h3>
                    </div>

                    {/* Submission Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                            Submitted on {new Date(deliverable.created_at).toLocaleDateString()} at{" "}
                            {new Date(deliverable.created_at).toLocaleTimeString()}
                        </span>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                            {deliverable.description}
                        </p>
                    </div>

                    {/* Files */}
                    {deliverable.files && deliverable.files.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">
                                Attached Files ({deliverable.files.length})
                            </h4>
                            <div className="space-y-2">
                                {deliverable.files.map((file: ProductFile | string, index: number) => {
                                    const fileUrl = typeof file === 'string' ? file : file.path
                                    const fileName = typeof file === 'string'
                                        ? file.split('/').pop()?.split('?')[0] || 'file'
                                        : file.name
                                    const fileSize = typeof file === 'string' ? 0 : file.size
                                    const fileMimetype = typeof file === 'string' ? 'Unknown' : file.mimetype

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <FileText className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">{fileName}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {fileSize > 0 ? `${(fileSize / 1024).toFixed(1)} KB • ${fileMimetype}` : 'File'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => onDownloadFile(fileUrl, fileName, deliverable.id, index)}
                                                className="gap-2 flex-shrink-0"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Rejection Reason */}
                    {deliverable.status === "rejected" && deliverable.rejection_reason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-semibold text-red-900 mb-2">Rejection Reason</h4>
                                    <p className="text-sm text-red-800">{deliverable.rejection_reason}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
