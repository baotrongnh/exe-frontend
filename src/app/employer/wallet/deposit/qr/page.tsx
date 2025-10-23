"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast";
import { api } from "@/lib/api";
import { generateQRCodeUrl } from "@/lib/qr";
import { ArrowLeft, CheckCircle2, XCircle, Loader2, Clock, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const POLLING_INTERVAL = 5000; // 5 seconds
const MAX_DURATION = 180000; // 3 minutes in milliseconds

function QRContent() {
     const router = useRouter();
     const searchParams = useSearchParams();
     const { showToast } = useToast();

     const code = searchParams.get("code") || "";

     const [status, setStatus] = useState<"pending" | "success" | "failed" | "expired">("pending");
     const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
     const [qrUrl, setQrUrl] = useState<string>("");

     const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
     const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
     const startTimeRef = useRef<number>(Date.now());

     useEffect(() => {
          // Validate params
          if (!code) {
               showToast("Thông tin không hợp lệ", "error");
               router.push("/employer/wallet");
               return;
          }

          // Generate QR code URL
          const bankNumber = process.env.NEXT_PUBLIC_BANK_NUMBER || "1029118580";
          const url = generateQRCodeUrl(bankNumber, code);
          setQrUrl(url);

          // Start timer countdown
          timerIntervalRef.current = setInterval(() => {
               const elapsed = Date.now() - startTimeRef.current;
               const remaining = Math.max(0, Math.floor((MAX_DURATION - elapsed) / 1000));
               setTimeLeft(remaining);

               if (remaining === 0) {
                    handleTimeout();
               }
          }, 1000);

          // Start polling for payment status
          startPolling();

          return () => {
               if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
               }
               if (timerIntervalRef.current) {
                    clearInterval(timerIntervalRef.current);
               }
          };
     }, []);

     const startPolling = () => {
          // Initial check
          checkPaymentStatus();

          // Poll every 5 seconds
          pollingIntervalRef.current = setInterval(() => {
               checkPaymentStatus();
          }, POLLING_INTERVAL);
     };

     const checkPaymentStatus = async () => {
          try {
               const response = await api.wallet.checkPayment(code);

               if (response.status === "success" || response.success === true) {
                    handleSuccess();
               } else if (response.status === "failed") {
                    handleFailure();
               }
               // If pending, continue polling
          } catch (error: any) {
               console.error("Error checking payment:", error);
               // Don't show error toast during polling, only log
               if (error?.response?.status === 404) {
                    // Payment not found yet, continue polling
                    return;
               }
          }
     };

     const handleSuccess = () => {
          setStatus("success");
          if (pollingIntervalRef.current) {
               clearInterval(pollingIntervalRef.current);
          }
          if (timerIntervalRef.current) {
               clearInterval(timerIntervalRef.current);
          }
          showToast("Nạp tiền thành công!", "success");

          // Redirect to wallet page after 2 seconds
          setTimeout(() => {
               router.push("/employer/wallet");
          }, 2000);
     };

     const handleFailure = () => {
          setStatus("failed");
          if (pollingIntervalRef.current) {
               clearInterval(pollingIntervalRef.current);
          }
          if (timerIntervalRef.current) {
               clearInterval(timerIntervalRef.current);
          }
          showToast("Giao dịch thất bại", "error");
     };

     const handleTimeout = () => {
          setStatus("expired");
          if (pollingIntervalRef.current) {
               clearInterval(pollingIntervalRef.current);
          }
          if (timerIntervalRef.current) {
               clearInterval(timerIntervalRef.current);
          }
          showToast("Mã QR đã hết hạn", "error");

          // Redirect to deposit page after 3 seconds
          setTimeout(() => {
               router.push("/employer/wallet");
          }, 3000);
     };

     const formatTime = (seconds: number) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `${mins}:${secs.toString().padStart(2, "0")}`;
     };

     const handleRetry = () => {
          router.push("/employer/wallet");
     };

     if (status === "success") {
          return (
               <div className="container mx-auto py-6 max-w-2xl">
                    <Card className="border-green-500">
                         <CardContent className="pt-6">
                              <div className="text-center space-y-4">
                                   <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
                                   <h2 className="text-2xl font-bold text-green-600">
                                        Nạp tiền thành công!
                                   </h2>
                                   <p className="text-muted-foreground">
                                        Số tiền đã được cập nhật vào ví của bạn
                                   </p>
                                   <p className="text-sm text-muted-foreground">
                                        Đang chuyển hướng về trang ví...
                                   </p>
                              </div>
                         </CardContent>
                    </Card>
               </div>
          );
     }

     if (status === "failed") {
          return (
               <div className="container mx-auto py-6 max-w-2xl">
                    <Card className="border-red-500">
                         <CardContent className="pt-6">
                              <div className="text-center space-y-4">
                                   <XCircle className="h-20 w-20 text-red-500 mx-auto" />
                                   <h2 className="text-2xl font-bold text-red-600">
                                        Giao dịch thất bại
                                   </h2>
                                   <p className="text-muted-foreground">
                                        Vui lòng thử lại hoặc liên hệ hỗ trợ
                                   </p>
                                   <Button onClick={handleRetry} size="lg">
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Thử lại
                                   </Button>
                              </div>
                         </CardContent>
                    </Card>
               </div>
          );
     }

     if (status === "expired") {
          return (
               <div className="container mx-auto py-6 max-w-2xl">
                    <Card className="border-orange-500">
                         <CardContent className="pt-6">
                              <div className="text-center space-y-4">
                                   <Clock className="h-20 w-20 text-orange-500 mx-auto" />
                                   <h2 className="text-2xl font-bold text-orange-600">
                                        Mã QR đã hết hạn
                                   </h2>
                                   <p className="text-muted-foreground">
                                        Vui lòng tạo mã QR mới để tiếp tục
                                   </p>
                                   <p className="text-sm text-muted-foreground">
                                        Đang chuyển hướng về trang nạp tiền...
                                   </p>
                              </div>
                         </CardContent>
                    </Card>
               </div>
          );
     }

     return (
          <div className="container mx-auto py-6 max-w-2xl">
               <div className="mb-6">
                    <Link href="/employer/wallet">
                         <Button variant="ghost" className="mb-4">
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Quay lại
                         </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Quét mã QR để thanh toán</h1>
                    <p className="text-muted-foreground mt-2">
                         Sử dụng ứng dụng ngân hàng để quét mã QR
                    </p>
               </div>

               <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                         <CardHeader>
                              <CardTitle>Mã QR thanh toán</CardTitle>
                              <CardDescription>
                                   Quét mã để chuyển khoản
                              </CardDescription>
                         </CardHeader>
                         <CardContent className="flex flex-col items-center space-y-4">
                              {qrUrl ? (
                                   <div className="relative w-full max-w-sm aspect-square">
                                        <Image
                                             src={qrUrl}
                                             alt="QR Code"
                                             fill
                                             className="object-contain"
                                             priority
                                        />
                                   </div>
                              ) : (
                                   <div className="w-full max-w-sm aspect-square flex items-center justify-center bg-muted">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                   </div>
                              )}

                              <div className="flex items-center gap-2 text-sm">
                                   <Clock className="h-4 w-4" />
                                   <span className={timeLeft < 60 ? "text-red-500 font-semibold" : ""}>
                                        Thời gian còn lại: {formatTime(timeLeft)}
                                   </span>
                              </div>
                         </CardContent>
                    </Card>

                    <div className="space-y-6">
                         <Card>
                              <CardHeader>
                                   <CardTitle>Thông tin chuyển khoản</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div>
                                        <p className="text-sm text-muted-foreground">Nội dung chuyển khoản</p>
                                        <p className="font-mono font-semibold text-lg">LENSOR {code}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                             Vui lòng nhập chính xác nội dung này khi chuyển khoản
                                        </p>
                                   </div>
                                   <div>
                                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                                        <div className="flex items-center gap-2 mt-1">
                                             <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                             <span className="font-medium">Đang chờ thanh toán...</span>
                                        </div>
                                   </div>
                              </CardContent>
                         </Card>

                         <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                              <CardHeader>
                                   <CardTitle className="text-blue-900 dark:text-blue-100">
                                        Hướng dẫn thanh toán
                                   </CardTitle>
                              </CardHeader>
                              <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                                   <ol className="list-decimal list-inside space-y-1">
                                        <li>Mở ứng dụng ngân hàng trên điện thoại</li>
                                        <li>Chọn chức năng quét mã QR</li>
                                        <li>Quét mã QR hiển thị bên trái</li>
                                        <li>Kiểm tra thông tin và xác nhận chuyển khoản</li>
                                        <li>Đợi hệ thống xác nhận (tự động)</li>
                                   </ol>
                                   <p className="mt-4 font-semibold">
                                        ⚠️ Không tắt trang này trong khi chờ xác nhận
                                   </p>
                              </CardContent>
                         </Card>
                    </div>
               </div>
          </div>
     );
}

export default function QRPage() {
     return (
          <Suspense fallback={
               <div className="container mx-auto py-6 max-w-2xl">
                    <Card>
                         <CardContent className="pt-6">
                              <div className="flex items-center justify-center py-8">
                                   <Loader2 className="h-8 w-8 animate-spin" />
                              </div>
                         </CardContent>
                    </Card>
               </div>
          }>
               <QRContent />
          </Suspense>
     );
}
