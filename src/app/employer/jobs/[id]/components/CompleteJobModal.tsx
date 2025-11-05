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
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface JobDetail {
    id: string;
    title: string;
    status: string;
    applications_count: number;
    post_cost?: string;
}

interface Application {
    id: string;
    job_id: string;
    applicant_id: string;
    status: string;
    applicant?: {
        id: string;
        full_name: string;
        email: string;
    };
}

interface CompleteJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: JobDetail | null;
    acceptedApplication: Application | null;
    onConfirm: () => void;
    isLoading: boolean;
}

export function CompleteJobModal({
    isOpen,
    onClose,
    job,
    acceptedApplication,
    onConfirm,
    isLoading,
}: CompleteJobModalProps) {
    // Calculate platform fee (8%)
    const PLATFORM_FEE_PERCENTAGE = 8;
    const totalJobAmount = job?.post_cost ? parseFloat(job.post_cost) : 0;
    const platformFeeAmount = (totalJobAmount * PLATFORM_FEE_PERCENTAGE) / 100;
    const freelancerReceiveAmount = totalJobAmount - platformFeeAmount;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        Complete and Close Job
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to mark this job as complete and close it? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {job && (
                        <>
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                                <h4 className="font-semibold text-gray-900 mb-2">{job.title}</h4>
                                <div className="space-y-1 text-sm">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Status:</span>{" "}
                                        <span className="capitalize">{job.status}</span>
                                    </p>
                                    {acceptedApplication?.applicant && (
                                        <p className="text-gray-600">
                                            <span className="font-medium">Freelancer:</span> {acceptedApplication.applicant.full_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {totalJobAmount > 0 && (
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <h5 className="font-semibold text-blue-900 mb-3 text-sm">Payment Breakdown</h5>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Job Amount:</span>
                                            <span className="font-semibold text-gray-900">{formatCurrency(totalJobAmount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Platform Fee ({PLATFORM_FEE_PERCENTAGE}%):</span>
                                            <span className="font-semibold text-red-600">-{formatCurrency(platformFeeAmount)}</span>
                                        </div>
                                        <div className="h-px bg-blue-200 my-2"></div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-900 font-medium">Freelancer Receives:</span>
                                            <span className="font-bold text-green-600">{formatCurrency(freelancerReceiveAmount)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-amber-900">What happens next:</p>
                                        <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                                            <li>The job will be marked as completed</li>
                                            <li>Payment will be transferred to the freelancer</li>
                                            <li>Platform fee will be deducted automatically</li>
                                            <li>This action cannot be reversed</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Completing...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Yes, Complete Job
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
