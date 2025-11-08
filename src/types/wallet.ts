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
     transaction_type: "DEPOSIT" | "WITHDRAW" | "JOB_POST" | "REFUND" | "PAYMENT_RECEIVED" | "PAYMENT" | "payment" | "deposit" | "withdraw" | "refund" | "job_post";
     amount: string | number;
     currency?: string;
     balance_before?: string | number;
     balance_after?: string | number;
     reference_id?: string | null;
     reference_type?: string | null;
     description?: string;
     status: "pending" | "completed" | "failed" | "cancelled";
     metadata?: Record<string, unknown>;
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
