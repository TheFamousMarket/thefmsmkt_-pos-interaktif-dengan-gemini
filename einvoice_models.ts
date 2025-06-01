// Data structures for Malaysian e-invoicing
// Defines the EInvoice and EInvoiceLineItem types

export interface EInvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  taxType: string; // e.g., "SST", "VAT"
  taxRate: number;
  taxAmount: number;
}

export interface EInvoice {
  invoiceNumber: string; // unique
  invoiceDate: string; // ISO date string
  supplierName: string;
  supplierBRN: string;
  supplierSSTRegNo?: string;
  supplierAddress: string | Record<string, any>;
  supplierContact: string;
  customerName: string;
  customerBRN?: string; // if B2B
  customerSSTRegNo?: string; // optional, if B2B
  customerAddress: string | Record<string, any>;
  customerContact: string; // e.g., email
  lineItems: EInvoiceLineItem[];
  subtotal: number;
  totalTaxAmount: number;
  totalAmountDue: number;
  paymentMode: string;
  currencyCode?: string; // default "MYR"
  irbmUniqueIdentifier?: string; // placeholder for LHDN MyInvois
  digitalSignature?: string; // placeholder
  qrCodeData?: string; // placeholder
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
