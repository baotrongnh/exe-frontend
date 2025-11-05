"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { WalletTransaction } from "@/types/wallet";
import { WalletCard } from "@/components/wallet-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUpRight, ArrowDownRight, Plus, History, TrendingUp, TrendingDown, RefreshCw, Clock } from "lucide-react";
import { useToast } from "@/components/toast";
import { useRouter } from "next/navigation";
import { LoadingSpinner, EmptyState, PageHeader } from "@/components/shared";

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
               const response = await api.wallet.getTransactions({ page, limit: 10 });

               let transactionsList = [];
               let total = 1;

               if (response?.data?.data?.transactions) {
                    transactionsList = response.data.data.transactions;
                    total = response.data.data.pagination?.total_pages || 1;
               } else if (response?.data?.transactions) {
                    transactionsList = response.data.transactions;
                    total = response.data.pagination?.total_pages || 1;
               } else if (response?.transactions) {
                    transactionsList = response.transactions;
                    total = response.totalPages || response.total_pages || 1;
               }

               const validTransactions = Array.isArray(transactionsList) ? transactionsList : [];
               setTransactions(validTransactions);
               setTotalPages(total);
          } catch (error: any) {
               if (error?.response?.status !== 404) {
                    showToast("Failed to load transactions", "error");
               }
               setTransactions([]);
          } finally {
               setLoading(false);
          }
     };

     const formatCurrency = (amount: number | string) => {
          const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
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
          const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
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
               const response = await api.wallet.getCode();

               if (response.data.wallet_code) {
                    router.push(`/employer/wallet/deposit/qr?code=${response.data.wallet_code}`);
               } else {
                    showToast("Không thể tạo mã giao dịch", "error");
               }
          } catch (error: any) {
               showToast(
                    error?.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại",
                    "error"
               );
          } finally {
               setLoadingDeposit(false);
          }
     };

     return (
          <div className="container mx-auto py-6 space-y-6">
               <PageHeader
                    title="Wallet Management"
                    description="Manage your wallet and view transaction history"
                    breadcrumbs={[
                         { label: "Dashboard", href: "/employer" },
                         { label: "Wallet" }
                    ]}
                    action={
                         <Button
                              onClick={handleDeposit}
                              size="lg"
                              className="gap-2"
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
                    }
               />

               <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                         <WalletCard />
                    </div>

                    <div className="md:col-span-2">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Transaction History</CardTitle>
                                   <CardDescription>
                                        View all your wallet transactions
                                   </CardDescription>
                              </CardHeader>
                              <CardContent>
                                   {loading ? (
                                        <LoadingSpinner size="lg" text="Loading transactions..." />
                                   ) : !Array.isArray(transactions) ? (
                                        <EmptyState
                                             icon="alert"
                                             title="Data Error"
                                             description="Transactions data is not in the correct format"
                                             action={{ label: "Retry", onClick: fetchTransactions }}
                                        />
                                   ) : transactions.length === 0 ? (
                                        <EmptyState
                                             icon="inbox"
                                             title="No transactions found"
                                             description="Transactions will appear here after you make deposits or payments"
                                        />
                                   ) : (
                                        <div className="space-y-3">
                                             {transactions.map((transaction) => (
                                                  <div
                                                       key={transaction.id}
                                                       className="group flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200 hover:border-primary/50"
                                                  >
                                                       <div className="flex items-center gap-4">
                                                            <div className={`p-3 rounded-xl ${transaction.transaction_type.toUpperCase() === 'DEPOSIT' ||
                                                                      transaction.transaction_type.toUpperCase() === 'REFUND'
                                                                      ? 'bg-green-100 dark:bg-green-900/20'
                                                                      : 'bg-red-100 dark:bg-red-900/20'
                                                                 }`}>
                                                                 {getTransactionIcon(transaction.transaction_type)}
                                                            </div>
                                                            <div className="space-y-1">
                                                                 <p className="font-medium capitalize leading-none">
                                                                      {transaction.transaction_type.toLowerCase().replace('_', ' ')}
                                                                 </p>
                                                                 {transaction.description && (
                                                                      <p className="text-sm text-muted-foreground line-clamp-1">
                                                                           {transaction.description}
                                                                      </p>
                                                                 )}
                                                                 <p className="text-xs text-muted-foreground">
                                                                      {new Date(transaction.created_at).toLocaleString("vi-VN", {
                                                                           year: 'numeric',
                                                                           month: 'short',
                                                                           day: 'numeric',
                                                                           hour: '2-digit',
                                                                           minute: '2-digit'
                                                                      })}
                                                                 </p>
                                                            </div>
                                                       </div>
                                                       <div className="text-right space-y-2">
                                                            <p className={`font-bold text-lg ${transaction.transaction_type.toUpperCase() === 'DEPOSIT' ||
                                                                      transaction.transaction_type.toUpperCase() === 'REFUND'
                                                                      ? "text-green-600 dark:text-green-500"
                                                                      : "text-red-600 dark:text-red-500"
                                                                 }`}>
                                                                 {transaction.transaction_type.toUpperCase() === 'DEPOSIT' ||
                                                                      transaction.transaction_type.toUpperCase() === 'REFUND' ? "+" : "-"}
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
     );
}
