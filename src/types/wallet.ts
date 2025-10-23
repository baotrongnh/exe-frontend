export interface Wallet {
     id: string;
     user_id: string;
     balance: number;
     currency: string;
     created_at: string;
     updated_at: string;
}

export interface WalletTransaction {
     id: string;
     wallet_id: string;
     amount: number;
     transaction_type: "deposit" | "withdraw" | "payment" | "refund";
     status: "pending" | "completed" | "failed" | "cancelled";
     description?: string;
     reference_id?: string;
     created_at: string;
     updated_at: string;
}

export interface WalletCreateRequest {
     currency?: string;
     initial_balance?: number;
}

export interface WalletTransactionRequest {
     amount: number;
     method: string;
     description?: string;
}
