"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { XCircle, Loader2 } from "lucide-react";

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

interface RejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    deliverable: Deliverable | null;
    rejectionReason: string;
    onReasonChange: (reason: string) => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export function RejectModal({
    isOpen,
    onClose,
    deliverable,
    rejectionReason,
    onReasonChange,
    onConfirm,
    isLoading,
}: RejectModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-5 h-5" />
                        Reject Deliverable
                    </DialogTitle>
                    <DialogDescription>
                        Please provide a clear reason for rejecting this deliverable. This will help the freelancer understand what
                        needs to be improved.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {deliverable && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-1">{deliverable.title}</h4>
                            <p className="text-sm text-gray-600">{deliverable.applicant?.full_name || "Unknown Applicant"}</p>
                        </div>
                    )}
                    <div>
                        <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-2">
                            Rejection Reason <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                            id="rejection-reason"
                            placeholder="Explain what's wrong and what needs to be improved..."
                            value={rejectionReason}
                            onChange={(e) => onReasonChange(e.target.value)}
                            rows={5}
                            className="resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 10 characters required</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={!rejectionReason.trim() || rejectionReason.length < 10 || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Rejecting...
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Confirm Rejection
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
