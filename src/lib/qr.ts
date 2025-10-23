/**
 * Creates VietQR data string for generating QR code
 * Format: Bank ID|Account Number|Description
 * Note: Amount is not required in the new flow
 * 
 * @param bankNumber - Bank account number
 * @param code - Transaction code from backend
 * @returns QR data string
 */
export function createQRData(bankNumber: string, code: string): string {
     // VietQR format without amount
     const bankId = "970422"; // MB Bank
     const description = `LENSOR ${code}`;

     return `${bankId}|${bankNumber}|${description}`;
}/**
 * Generates VietQR URL for displaying QR code image
 * According to VietQR documentation: https://www.vietqr.io/en/danh-sach-api/link-tao-ma-nhanh/
 * 
 * @param bankNumber - Bank account number  
 * @param code - Transaction code from backend (used as description)
 * @param accountName - Account holder name (optional)
 * @returns URL to QR code image
 */
export function generateQRCodeUrl(bankNumber: string, code: string, accountName: string = "HOANG KIM LONG"): string {
     const bankId = "VCB"; // VCB Bank BIN code
     const template = "compact"; // 540x640 - Includes QR, logos, and transfer info
     const description = `${code}`;

     // VietQR Quick Link format (amount is optional, not included here)
     const encodedDescription = encodeURIComponent(description);
     const encodedAccountName = encodeURIComponent(accountName);

     return `https://img.vietqr.io/image/${bankId}-${bankNumber}-${template}.png?addInfo=${encodedDescription}&accountName=${encodedAccountName}`;
}

/**
 * Format amount to VND currency
 */
export function formatVND(amount: number): string {
     return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
     }).format(amount);
}
