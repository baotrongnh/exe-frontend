"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Wallet } from "@/types/wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wallet as WalletIcon, Plus, Minus, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/toast";

export function WalletCard() {
     const [wallet, setWallet] = useState<Wallet | null>(null);
     const [loading, setLoading] = useState(true);
     const [creating, setCreating] = useState(false);
     const { showToast } = useToast();

     useEffect(() => {
          fetchWallet();
     }, []);

     const fetchWallet = async () => {
          try {
               setLoading(true);
               const data = await api.wallet.get();

               console.log("💰 Wallet API Response:", data);
               console.log("💰 Response structure:", {
                    hasData: !!data,
                    dataKeys: data ? Object.keys(data) : [],
                    wallet: data?.wallet,
                    data: data?.data,
                    rawData: data
               });

               // Handle different response formats
               const walletData = data?.wallet || data?.data || data;

               if (walletData && walletData.id) {
                    setWallet(walletData);
                    console.log("✅ Wallet set:", walletData);
               } else {
                    console.log("⚠️ No valid wallet data found");
                    setWallet(null);
               }
          } catch (error: any) {
               console.error("❌ Error fetching wallet:", error);
               console.error("❌ Error details:", {
                    status: error?.response?.status,
                    statusText: error?.response?.statusText,
                    data: error?.response?.data,
                    message: error?.message
               });

               // If wallet doesn't exist, don't show error
               if (error?.response?.status !== 404) {
                    showToast("Failed to load wallet information", "error");
               }
               setWallet(null);
          } finally {
               setLoading(false);
          }
     };

     const createWallet = async () => {
          try {
               setCreating(true);
               const response = await api.wallet.create({
                    currency: "VND",
                    initial_balance: 0,
               });

               console.log("🆕 Create wallet response:", response);
               console.log("🆕 Response structure:", {
                    status: response.status,
                    statusText: response.statusText,
                    dataKeys: response.data ? Object.keys(response.data) : [],
                    wallet: response.data?.wallet,
                    data: response.data?.data,
                    rawData: response.data
               });

               // Handle different response formats
               const walletData = response.data?.wallet || response.data?.data || response.data;

               // Check if status is 201 (Created)
               if (response.status === 201 && walletData) {
                    setWallet(walletData);
                    showToast("🎉 Wallet created successfully! Your wallet is ready to use.", "success");
                    console.log("✅ Wallet created and set:", walletData);
               } else if (walletData) {
                    setWallet(walletData);
                    showToast("Wallet created successfully!", "success");
                    console.log("✅ Wallet created:", walletData);
               } else {
                    console.error("⚠️ Wallet created but no data returned");
                    showToast("Wallet created but unable to load data. Please refresh.", "warning");
               }
          } catch (error: any) {
               console.error("❌ Error creating wallet:", error);
               console.error("❌ Error details:", {
                    status: error?.response?.status,
                    data: error?.response?.data,
                    message: error?.message
               });
               showToast(error?.response?.data?.message || "Failed to create wallet", "error");
          } finally {
               setCreating(false);
          }
     };

     const formatCurrency = (amount: number) => {
          return new Intl.NumberFormat("vi-VN", {
               style: "currency",
               currency: "VND",
          }).format(amount);
     };

     if (loading) {
          return (
               <Card>
                    <CardContent className="flex items-center justify-center py-8">
                         <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </CardContent>
               </Card>
          );
     }

     if (!wallet) {
          return (
               <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                              <WalletIcon className="h-5 w-5" />
                              Wallet
                         </CardTitle>
                         <CardDescription>
                              You don&apos;t have a wallet yet. Create one to manage your finances.
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Button
                              onClick={createWallet}
                              disabled={creating}
                              className="w-full"
                         >
                              {creating ? (
                                   <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                   </>
                              ) : (
                                   <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Wallet
                                   </>
                              )}
                         </Button>
                    </CardContent>
               </Card>
          );
     }

     return (
          <Card>
               <CardHeader>
                    <div className="flex items-center justify-between">
                         <CardTitle className="flex items-center gap-2">
                              <WalletIcon className="h-5 w-5" />
                              My Wallet
                         </CardTitle>
                         <Button
                              variant="ghost"
                              size="icon"
                              onClick={fetchWallet}
                              title="Refresh"
                         >
                              <RefreshCcw className="h-4 w-4" />
                         </Button>
                    </div>
                    <CardDescription>
                         Manage your account balance and transactions
                    </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                    <div className="rounded-lg border bg-card p-6">
                         <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Available Balance</p>
                              <p className="text-3xl font-bold">{formatCurrency(wallet.balance)}</p>
                              <Badge variant="secondary">{wallet.currency}</Badge>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                         {/* <Button variant="default" className="w-full">
                              <Plus className="mr-2 h-4 w-4" />
                              Deposit
                         </Button>
                         <Button variant="outline" className="w-full">
                              <Minus className="mr-2 h-4 w-4" />
                              Withdraw
                         </Button> */}
                    </div>

                    <div className="text-xs text-muted-foreground space-y-1">
                         <p>Wallet ID: {wallet.id}</p>
                         <p>Created: {new Date(wallet.created_at).toLocaleDateString("vi-VN")}</p>
                    </div>
               </CardContent>
          </Card>
     );
}
