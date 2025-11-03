import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WalletTransaction } from "@/types/wallet"
import { Loader2, ArrowUpRight, ArrowDownRight, Clock, Receipt } from "lucide-react"

interface TransactionListProps {
    transactions: WalletTransaction[]
    loading: boolean
    onRetry: () => void
}

export function TransactionList({ transactions, loading, onRetry }: TransactionListProps) {
    const formatCurrency = (amount: number | string) => {
        const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(numAmount)
    }

    const getTransactionIcon = (type: string) => {
        const upperType = type.toUpperCase()
        switch (upperType) {
            case "DEPOSIT":
            case "REFUND":
            case "PAYMENT_RECEIVED":
                return <ArrowDownRight className="h-4 w-4 text-green-600" />
            case "WITHDRAW":
            case "PAYMENT":
            case "SERVICE_FEE":
                return <ArrowUpRight className="h-4 w-4 text-red-600" />
            default:
                return <Clock className="h-4 w-4" />
        }
    }

    const getStatusBadge = (status: string) => {
        const variants: Record<
            string,
            "default" | "secondary" | "destructive" | "outline"
        > = {
            completed: "default",
            pending: "secondary",
            failed: "destructive",
            cancelled: "outline",
        }

        return <Badge variant={variants[status] || "outline"}>{status}</Badge>
    }

    const isIncomeTransaction = (type: string) => {
        const upperType = type.toUpperCase()
        return upperType === "DEPOSIT" || upperType === "REFUND" || upperType === "PAYMENT_RECEIVED"
    }

    return (
        <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-card to-muted/20 border-b">
                <CardTitle className="text-2xl font-bold">Transaction History</CardTitle>
                <CardDescription>
                    View all your wallet transactions and earnings
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground font-medium">
                            Loading transactions...
                        </p>
                    </div>
                ) : !Array.isArray(transactions) ? (
                    <div className="text-center py-12 space-y-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <Receipt className="w-8 h-8 text-red-600" />
                        </div>
                        <p className="text-red-600 font-semibold text-lg">⚠️ Data Error</p>
                        <p className="text-muted-foreground">
                            Transactions data is not in the correct format
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRetry}
                            className="mt-4"
                        >
                            🔄 Retry
                        </Button>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Receipt className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            No transactions found
                        </h3>
                        <p className="text-muted-foreground">
                            Your transaction history will appear here after you receive payments or make deposits
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/30 hover:bg-accent/50 transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-muted shadow-sm">
                                        {getTransactionIcon(transaction.transaction_type)}
                                    </div>
                                    <div>
                                        <p className="font-semibold capitalize text-foreground">
                                            {transaction.transaction_type.replace(/_/g, " ")}
                                        </p>
                                        {transaction.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {transaction.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(transaction.created_at).toLocaleString("vi-VN")}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <p
                                        className={`font-bold text-lg ${isIncomeTransaction(transaction.transaction_type)
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {isIncomeTransaction(transaction.transaction_type) ? "+" : "-"}
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
    )
}
