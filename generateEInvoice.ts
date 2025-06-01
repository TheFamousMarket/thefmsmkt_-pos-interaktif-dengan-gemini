// Utility to generate EInvoice from a completed transaction
import { EInvoice, EInvoiceLineItem } from './einvoice_models';
import { einvoiceConfig } from './einvoice_config';

// Transaction type is inferred from POS logic and CartContext
// This is a generic type, adapt as needed for your actual transaction object
export interface TransactionForEInvoice {
  id: string;
  date: string; // ISO string
  customer?: {
    name: string;
    brn?: string;
    sstRegNo?: string;
    address?: string;
    contact: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    taxType: string;
    taxRate: number;
    taxAmount: number;
  }>;
  subtotal: number;
  totalTax: number;
  totalDue: number;
  paymentMode: string;
  currencyCode?: string;
}

let invoiceCounter = 1;

export function generateEInvoiceFromTransaction(transaction: TransactionForEInvoice): EInvoice | null {
  // Basic error handling
  if (!transaction || !transaction.items || transaction.items.length === 0) return null;

  // Generate unique invoice number: e.g., INV-20250601-0001
  const datePart = new Date().toISOString().slice(0,10).replace(/-/g, '');
  const invoiceNumber = `INV-${datePart}-${String(invoiceCounter++).padStart(4, '0')}`;

  // Map line items
  const lineItems: EInvoiceLineItem[] = transaction.items.map(item => ({
    description: item.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalAmount: item.total,
    taxType: item.taxType,
    taxRate: item.taxRate,
    taxAmount: item.taxAmount,
  }));

  // Supplier info from config or placeholder
  const supplier = einvoiceConfig.defaultSupplier || {};

  // Customer info
  const customer = transaction.customer || {};

  const now = new Date().toISOString();

  return {
    invoiceNumber,
    invoiceDate: transaction.date || now,
    supplierName: supplier.name || '',
    supplierBRN: supplier.brn || '',
    supplierSSTRegNo: supplier.sstRegNo || undefined,
    supplierAddress: supplier.address || '',
    supplierContact: supplier.contact || '',
    customerName: customer.name || 'Walk-in',
    customerBRN: customer.brn || undefined,
    customerSSTRegNo: customer.sstRegNo || undefined,
    customerAddress: customer.address || '',
    customerContact: customer.contact || '',
    lineItems,
    subtotal: transaction.subtotal,
    totalTaxAmount: transaction.totalTax,
    totalAmountDue: transaction.totalDue,
    paymentMode: transaction.paymentMode,
    currencyCode: transaction.currencyCode || 'MYR',
    irbmUniqueIdentifier: undefined, // placeholder
    digitalSignature: undefined, // placeholder
    qrCodeData: undefined, // placeholder
    createdAt: now,
    updatedAt: now,
  };
}
