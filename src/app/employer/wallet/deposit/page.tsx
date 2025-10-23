"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/toast";
import { api } from "@/lib/api";
import { ArrowLeft, Wallet, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DepositPage() {
     const router = useRouter();
     const { showToast } = useToast();
     const [amount, setAmount] = useState<string>("");
     const [loading, setLoading] = useState(false);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          const amountNumber = parseFloat(amount);

          if (!amount || amountNumber <= 0) {
               showToast("Vui lòng nhập số tiền hợp lệ", "error");
               return;
          }

          if (amountNumber < 10000) {
               showToast("Số tiền tối thiểu là 10,000 VND", "error");
               return;
          }

          try {
               setLoading(true);

               // Call API to get code
               const response = await api.wallet.getCode();

               if (response.data.wallet_code) {
                    // Navigate to QR page with amount and code
                    router.push(`/employer/wallet/deposit/qr?amount=${amountNumber}&code=${response.data.wallet_code}`);
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
               setLoading(false);
          }
     };

     const formatCurrency = (value: string) => {
          const number = parseFloat(value.replace(/[^\d]/g, ""));
          if (isNaN(number)) return "";
          return new Intl.NumberFormat("vi-VN").format(number);
     };

     const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value.replace(/[^\d]/g, "");
          setAmount(value);
     };

     const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

     return (
          <div className="container mx-auto py-6 max-w-2xl">
               <div className="mb-6">
                    <Link href="/employer/wallet">
                         <Button variant="ghost" className="mb-4">
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Quay lại
                         </Button>
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                         <Wallet className="h-8 w-8" />
                         Nạp tiền vào ví
                    </h1>
                    <p className="text-muted-foreground mt-2">
                         Nhập số tiền bạn muốn nạp vào ví
                    </p>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>Thông tin nạp tiền</CardTitle>
                         <CardDescription>
                              Sau khi nhập số tiền, bạn sẽ được chuyển đến trang quét mã QR để hoàn tất giao dịch
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <form onSubmit={handleSubmit} className="space-y-6">
                              <div className="space-y-2">
                                   <Label htmlFor="amount">Số tiền (VND)</Label>
                                   <Input
                                        id="amount"
                                        type="text"
                                        placeholder="Nhập số tiền"
                                        value={formatCurrency(amount)}
                                        onChange={handleAmountChange}
                                        disabled={loading}
                                        className="text-lg font-semibold"
                                   />
                                   <p className="text-sm text-muted-foreground">
                                        Số tiền tối thiểu: 10,000 VND
                                   </p>
                              </div>

                              <div className="space-y-2">
                                   <Label>Chọn nhanh</Label>
                                   <div className="grid grid-cols-3 gap-2">
                                        {quickAmounts.map((quickAmount) => (
                                             <Button
                                                  key={quickAmount}
                                                  type="button"
                                                  variant="outline"
                                                  onClick={() => setAmount(quickAmount.toString())}
                                                  disabled={loading}
                                                  className="font-semibold"
                                             >
                                                  {new Intl.NumberFormat("vi-VN").format(quickAmount)}
                                             </Button>
                                        ))}
                                   </div>
                              </div>

                              {amount && parseFloat(amount) > 0 && (
                                   <div className="p-4 bg-muted rounded-lg">
                                        <div className="flex justify-between items-center">
                                             <span className="text-sm font-medium">Tổng tiền nạp:</span>
                                             <span className="text-2xl font-bold text-primary">
                                                  {new Intl.NumberFormat("vi-VN", {
                                                       style: "currency",
                                                       currency: "VND",
                                                  }).format(parseFloat(amount))}
                                             </span>
                                        </div>
                                   </div>
                              )}

                              <Button
                                   type="submit"
                                   className="w-full"
                                   size="lg"
                                   disabled={loading || !amount || parseFloat(amount) < 10000}
                              >
                                   {loading ? (
                                        <>
                                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                             Đang xử lý...
                                        </>
                                   ) : (
                                        "Tiếp tục"
                                   )}
                              </Button>
                         </form>
                    </CardContent>
               </Card>

               <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                         Lưu ý quan trọng:
                    </h3>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                         <li>Vui lòng kiểm tra kỹ số tiền trước khi tiếp tục</li>
                         <li>Mã QR sẽ có hiệu lực trong 3 phút</li>
                         <li>Số tiền sẽ được cập nhật vào ví sau khi thanh toán thành công</li>
                         <li>Không tắt trình duyệt trong quá trình thanh toán</li>
                    </ul>
               </div>
          </div>
     );
}
