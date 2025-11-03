"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { WalletTransaction } from "@/types/wallet";
import { WalletCard } from "@/components/wallet-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Plus,
} from "lucide-react";
import { useToast } from "@/components/toast";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDeposit, setLoadingDeposit] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.wallet.getTransactions({
        page,
        limit: 10,
      });

      console.log("📊 Transactions API Response:", response);

      // Handle API response format: { success: true, data: { transactions: [...], pagination: {...} } }
      let transactionsList = [];
      let total = 1;

      if (response?.data?.data?.transactions) {
        // New format: { data: { data: { transactions: [...], pagination: {...} } } }
        transactionsList = response.data.data.transactions;
        total = response.data.data.pagination?.total_pages || 1;
      } else if (response?.data?.transactions) {
        // Format: { data: { transactions: [...], pagination: {...} } }
        transactionsList = response.data.transactions;
        total = response.data.pagination?.total_pages || 1;
      } else if (response?.transactions) {
        // Direct format: { transactions: [...] }
        transactionsList = response.transactions;
        total = response.totalPages || response.total_pages || 1;
      }

      // Ensure transactionsList is an array
      const validTransactions = Array.isArray(transactionsList)
        ? transactionsList
        : [];

      setTransactions(validTransactions);
      setTotalPages(total);

      console.log("✅ Transactions loaded:", validTransactions.length, "items");
    } catch (error: any) {
      console.error("❌ Error fetching transactions:", error);
      console.error("❌ Error details:", {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
      });

      if (error?.response?.status !== 404) {
        showToast("Failed to load transactions", "error");
      }

      // Set empty array on error
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(numAmount);
  };

  const getTransactionIcon = (type: string) => {
    const upperType = type.toUpperCase();
    switch (upperType) {
      case "DEPOSIT":
      case "REFUND":
        return <ArrowDownRight className="h-4 w-4 text-green-600" />;
      case "WITHDRAW":
      case "JOB_POST":
      case "PAYMENT":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      cancelled: "outline",
    };

    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const handleDeposit = async () => {
    try {
      setLoadingDeposit(true);

      // Call API to get code directly
      const response = await api.wallet.getCode();

      if (response.data.wallet_code) {
        // Navigate to QR page with code
        router.push(
          `/employer/wallet/deposit/qr?code=${response.data.wallet_code}`
        );
      } else {
        showToast("Không thể tạo mã giao dịch", "error");
      }
    } catch (error: any) {
      console.error("Error getting code:", error);
      showToast(
        error?.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại",
        "error"
      );
    } finally {
      setLoadingDeposit(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Debug Panel */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm font-medium mb-2">🔧 Debug Panel</p>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("=== Testing Wallet API ===");
                fetchTransactions();
              }}
            >
              🔄 Refresh Transactions
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                console.log("=== Testing /api/wallet ===");
                try {
                  const data = await api.wallet.get();
                  console.log("✅ Wallet API success:", data);
                } catch (error) {
                  console.error("❌ Wallet API error:", error);
                }
              }}
            >
              📊 Test Wallet API
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                console.log("=== Testing /api/wallet/balance ===");
                try {
                  const data = await api.wallet.getBalance();
                  console.log("✅ Balance API success:", data);
                } catch (error) {
                  console.error("❌ Balance API error:", error);
                }
              }}
            >
              💰 Test Balance API
            </Button>
            <p className="text-xs text-muted-foreground self-center">
              Open DevTools Console (F12) to see API responses
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Wallet Management</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Manage your wallet and view transaction history
            </p>
          </div>
          <Button
            onClick={handleDeposit}
            size="lg"
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
            disabled={loadingDeposit}
          >
            {loadingDeposit ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Nạp tiền
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <WalletCard />
          </div>

          <div className="md:col-span-2">
            <Card className="border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200">
                <CardTitle className="text-2xl font-bold text-gray-900">Transaction History</CardTitle>
                <CardDescription className="text-gray-600">
                  View all your wallet transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
                    <p className="text-gray-600 font-medium">Loading transactions...</p>
                  </div>
                ) : !Array.isArray(transactions) ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-red-600 font-semibold text-lg">⚠️ Data Error</p>
                    <p className="text-gray-600">
                      Transactions data is not in the correct format
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("Current transactions:", transactions);
                        console.log("Is array:", Array.isArray(transactions));
                        fetchTransactions();
                      }}
                      className="mt-4"
                    >
                      🔄 Retry
                    </Button>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
                    <p className="text-gray-600">
                      Transactions will appear here after you make deposits or payments
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Array.isArray(transactions) &&
                      transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-transparent transition-all duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                              {getTransactionIcon(transaction.transaction_type)}
                            </div>
                            <div>
                              <p className="font-semibold capitalize text-gray-900">
                                {transaction.transaction_type}
                              </p>
                              {transaction.description && (
                                <p className="text-sm text-gray-600">
                                  {transaction.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">
                                {new Date(transaction.created_at).toLocaleString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <p
                              className={`font-bold text-lg ${transaction.transaction_type?.toUpperCase() ===
                                  "DEPOSIT" ||
                                  transaction.transaction_type?.toUpperCase() ===
                                  "REFUND"
                                  ? "text-green-600"
                                  : "text-red-600"
                                }`}
                            >
                              {transaction.transaction_type?.toUpperCase() ===
                                "DEPOSIT" ||
                                transaction.transaction_type?.toUpperCase() ===
                                "REFUND"
                                ? "+"
                                : "-"}
                              {formatCurrency(transaction.amount)}
                            </p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
