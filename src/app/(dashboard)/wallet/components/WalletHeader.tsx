import { Button } from "@/components/ui/button"
import { Loader2, Plus, Wallet } from "lucide-react"

interface WalletHeaderProps {
    onDeposit: () => void
    loadingDeposit: boolean
}

export function WalletHeader({ onDeposit, loadingDeposit }: WalletHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <Wallet className="w-10 h-10 text-primary" />
                    My Wallet
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                    Manage your earnings and transactions
                </p>
            </div>
            <Button
                onClick={onDeposit}
                size="lg"
                className="gap-2 shadow-lg hover:shadow-xl transition-all"
                disabled={loadingDeposit}
            >
                {loadingDeposit ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Plus className="h-5 w-5" />
                        Deposit Money
                    </>
                )}
            </Button>
        </div>
    )
}
