// Utility to get e-invoice status for a transaction (JSON file version)
import fs from 'fs';
import path from 'path';

/**
 * Retrieves the stored e-invoice data and its status for a given transaction/invoice number.
 * @param transactionIdOrInvoiceNumber The transaction ID or invoice number
 * @returns { status: string, eInvoice: any } or null if not found
 */
export function getEInvoiceStatus(transactionIdOrInvoiceNumber: string) {
  try {
    const dir = path.join(process.cwd(), 'einvoices');
    if (!fs.existsSync(dir)) return null;
    // Find the file(s) matching the invoice number
    const files = fs.readdirSync(dir).filter(f => f.startsWith(transactionIdOrInvoiceNumber));
    if (files.length === 0) return null;
    // If multiple, pick the latest by modified time
    const fileWithLatestMtime = files
      .map(f => ({ f, mtime: fs.statSync(path.join(dir, f)).mtime }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())[0].f;
    const filePath = path.join(dir, fileWithLatestMtime);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    return {
      status: data.status,
      eInvoice: data,
    };
  } catch (err) {
    console.error('Failed to get e-invoice status:', err);
    return null;
  }
}

export default getEInvoiceStatus;
