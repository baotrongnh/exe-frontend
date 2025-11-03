"use client";

import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

interface StatsCardsProps {
    allCount: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    onTabChange: (tab: string) => void;
}

export function StatsCards({
    allCount,
    pendingCount,
    approvedCount,
    rejectedCount,
    onTabChange,
}: StatsCardsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-5 cursor-pointer"
                onClick={() => onTabChange("all")}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-gray-600">All Deliverables</div>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-600" />
                    </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{allCount}</div>
            </div>
            <div
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-yellow-200 p-5 cursor-pointer"
                onClick={() => onTabChange("pending")}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-yellow-700">Pending Review</div>
                    <div className="w-10 h-10 bg-yellow-200 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                </div>
                <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
            </div>
            <div
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-green-200 p-5 cursor-pointer"
                onClick={() => onTabChange("approved")}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-green-700">Approved</div>
                    <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                </div>
                <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
            </div>
            <div
                className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-red-200 p-5 cursor-pointer"
                onClick={() => onTabChange("rejected")}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-red-700">Rejected</div>
                    <div className="w-10 h-10 bg-red-200 rounded-lg flex items-center justify-center">
                        <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                </div>
                <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
            </div>
        </div>
    );
}
