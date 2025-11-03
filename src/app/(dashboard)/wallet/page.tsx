"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { WalletTransaction } from "@/types/wallet"
import { WalletCard } from "@/components/wallet-card"
import { useToast } from "@/components/toast"
import { useRouter } from "next/navigation"
import { WalletHeader, TransactionList } from "./components"

export default function WalletPage() {
    const [transactions, setTransactions] = useState<WalletTransaction[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingDeposit, setLoadingDeposit] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const { showToast } = useToast()
    const router = useRouter()

    useEffect(() => {
        fetchTransactions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    const fetchTransactions = async () => {
        try {
            setLoading(true)
            const response = await api.wallet.getTransactions({
                page,
                limit: 10,
            })

            console.log("📊 Transactions API Response:", response)

            // Handle API response format
            let transactionsList = []
            let total = 1

            if (response?.data?.data?.transactions) {
                transactionsList = response.data.data.transactions
                total = response.data.data.pagination?.total_pages || 1
            } else if (response?.data?.transactions) {
                transactionsList = response.data.transactions
                total = response.data.pagination?.total_pages || 1
            } else if (response?.transactions) {
                transactionsList = response.transactions
                total = response.totalPages || response.total_pages || 1
            }

            const validTransactions = Array.isArray(transactionsList) ? transactionsList : []

            setTransactions(validTransactions)
            setTotalPages(total)

            console.log("✅ Transactions loaded:", validTransactions.length, "items")
        } catch (error: unknown) {
            const err = error as { response?: { status?: number; statusText?: string; data?: unknown }; message?: string }
            console.error("❌ Error fetching transactions:", error)
            
            if (err?.response?.status !== 404) {
                showToast("Failed to load transactions", "error")
            }

            setTransactions([])
        } finally {
            setLoading(false)
        }
    }

    const handleDeposit = async () => {
        try {
            setLoadingDeposit(true)

            // Call API to get code directly
            const response = await api.wallet.getCode()

            if (response.data.wallet_code) {
                // Navigate to QR page with code
                router.push(`/wallet/deposit/qr?code=${response.data.wallet_code}`)
            } else {
                showToast("Cannot create transaction code", "error")
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } }
            console.error("Error getting code:", error)
            showToast(
                err?.response?.data?.message || "An error occurred. Please try again",
                "error"
            )
        } finally {
            setLoadingDeposit(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <WalletHeader onDeposit={handleDeposit} loadingDeposit={loadingDeposit} />

                {/* Wallet Card and Transactions */}
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <WalletCard />
                    </div>

                    <div className="md:col-span-2">
                        <TransactionList 
                            transactions={transactions}
                            loading={loading}
                            onRetry={fetchTransactions}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
