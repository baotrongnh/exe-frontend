"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { WalletTransaction } from "@/types/wallet";
import { WalletCard } from "@/components/wallet-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUpRight, ArrowDownRight, Clock, Plus } from "lucide-react";
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
               const data = await api.wallet.getTransactions({
                    page,
                    limit: 10,
               });

               console.log("📊 Transactions API Response:", data);
               console.log("📊 Response structure:", {
                    hasData: !!data,
                    dataKeys: data ? Object.keys(data) : [],
                    transactions: data?.transactions,
                    items: data?.items,
                    results: data?.results,
                    rawData: data
               });

               // Handle different response formats
               const transactionsList = data?.transactions || data?.items || data?.results || data?.data || [];
               const total = data?.totalPages || data?.total_pages || data?.pages || 1;

               // Ensure transactionsList is an array
               const validTransactions = Array.isArray(transactionsList) ? transactionsList : [];

               setTransactions(validTransactions);
               setTotalPages(total);

               console.log("✅ Transactions set:", validTransactions.length, "items");
               console.log("✅ Is array:", Array.isArray(validTransactions));
          } catch (error: any) {
               console.error("❌ Error fetching transactions:", error);
               console.error("❌ Error details:", {
                    status: error?.response?.status,
                    statusText: error?.response?.statusText,
                    data: error?.response?.data,
                    message: error?.message
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

     const formatCurrency = (amount: number) => {
          return new Intl.NumberFormat("vi-VN", {
               style: "currency",
               currency: "VND",
          }).format(amount);
     };

     const getTransactionIcon = (type: string) => {
          switch (type) {
               case "deposit":
               case "refund":
                    return <ArrowDownRight className="h-4 w-4 text-green-600" />;
               case "withdraw":
               case "payment":
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

     // Mock data for demonstration
     const getMockTransactions = (): WalletTransaction[] => [
          {
               id: "mock-1",
               wallet_id: "mock-wallet",
               amount: 500000,
               transaction_type: "deposit",
               status: "completed",
               description: "Nạp tiền qua QR Code",
               created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
               updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
               id: "mock-2",
               wallet_id: "mock-wallet",
               amount: 200000,
               transaction_type: "payment",
               status: "completed",
               description: "Thanh toán dịch vụ đăng tin",
               created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
               updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
               id: "mock-3",
               wallet_id: "mock-wallet",
               amount: 100000,
               transaction_type: "deposit",
               status: "pending",
               description: "Đang chờ xác nhận thanh toán",
               created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
               updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          },
     ];

     const handleDeposit = async () => {
          try {
               setLoadingDeposit(true);

               // Call API to get code directly
               const response = await api.wallet.getCode();

               if (response.data.wallet_code) {
                    // Navigate to QR page with code
                    router.push(`/employer/wallet/deposit/qr?code=${response.data.wallet_code}`);
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
          <div className="container mx-auto py-6 space-y-6">
               {/* Debug Panel */}
               <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg border border-dashed">
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

               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-3xl font-bold">Wallet Management</h1>
                         <p className="text-muted-foreground">
                              Manage your wallet and view transaction history
                         </p>
                    </div>
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
               </div>

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
                                        <div className="flex items-center justify-center py-8">
                                             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                        </div>
                                   ) : !Array.isArray(transactions) ? (
                                        <div className="text-center py-8 space-y-3">
                                             <p className="text-destructive font-medium">⚠️ Data Error</p>
                                             <p className="text-sm text-muted-foreground">
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
                                             >
                                                  🔄 Retry
                                             </Button>
                                        </div>
                                   ) : transactions.length === 0 ? (
                                        <div className="space-y-4">
                                             <div className="text-center py-4 text-muted-foreground">
                                                  <p className="mb-2">No transactions found</p>
                                                  <p className="text-xs">Transactions will appear here after you make deposits or payments</p>
                                             </div>

                                             {/* Mock data for preview */}
                                             <div className="border-t pt-4">
                                                  <p className="text-sm font-medium text-muted-foreground mb-3">Preview (Mock Data):</p>
                                                  {getMockTransactions().map((transaction) => (
                                                       <div
                                                            key={transaction.id}
                                                            className="flex items-center justify-between p-4 rounded-lg border mb-3 opacity-60"
                                                       >
                                                            <div className="flex items-center gap-4">
                                                                 <div className="p-2 rounded-full bg-muted">
                                                                      {getTransactionIcon(transaction.transaction_type)}
                                                                 </div>
                                                                 <div>
                                                                      <p className="font-medium capitalize">
                                                                           {transaction.transaction_type}
                                                                      </p>
                                                                      {transaction.description && (
                                                                           <p className="text-sm text-muted-foreground">
                                                                                {transaction.description}
                                                                           </p>
                                                                      )}
                                                                      <p className="text-xs text-muted-foreground">
                                                                           {new Date(transaction.created_at).toLocaleString("vi-VN")}
                                                                      </p>
                                                                 </div>
                                                            </div>
                                                            <div className="text-right space-y-1">
                                                                 <p className={`font-semibold ${transaction.transaction_type === "deposit" ||
                                                                      transaction.transaction_type === "refund"
                                                                      ? "text-green-600"
                                                                      : "text-red-600"
                                                                      }`}>
                                                                      {transaction.transaction_type === "deposit" ||
                                                                           transaction.transaction_type === "refund" ? "+" : "-"}
                                                                      {formatCurrency(transaction.amount)}
                                                                 </p>
                                                                 {getStatusBadge(transaction.status)}
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   ) : (
                                        <div className="space-y-4">
                                             {Array.isArray(transactions) && transactions.map((transaction) => (
                                                  <div
                                                       key={transaction.id}
                                                       className="flex items-center justify-between p-4 rounded-lg border"
                                                  >
                                                       <div className="flex items-center gap-4">
                                                            <div className="p-2 rounded-full bg-muted">
                                                                 {getTransactionIcon(transaction.transaction_type)}
                                                            </div>
                                                            <div>
                                                                 <p className="font-medium capitalize">
                                                                      {transaction.transaction_type}
                                                                 </p>
                                                                 {transaction.description && (
                                                                      <p className="text-sm text-muted-foreground">
                                                                           {transaction.description}
                                                                      </p>
                                                                 )}
                                                                 <p className="text-xs text-muted-foreground">
                                                                      {new Date(transaction.created_at).toLocaleString("vi-VN")}
                                                                 </p>
                                                            </div>
                                                       </div>
                                                       <div className="text-right space-y-1">
                                                            <p className={`font-semibold ${transaction.transaction_type === "deposit" ||
                                                                 transaction.transaction_type === "refund"
                                                                 ? "text-green-600"
                                                                 : "text-red-600"
                                                                 }`}>
                                                                 {transaction.transaction_type === "deposit" ||
                                                                      transaction.transaction_type === "refund" ? "+" : "-"}
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
