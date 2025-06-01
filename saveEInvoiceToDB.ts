import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function saveEInvoiceToDB(eInvoiceObject: any, status: string, submissionResponse: any) {
  const db = await open({ filename: './pos.db', driver: sqlite3.Database });
  await db.run(
    `INSERT INTO EInvoices (
      invoice_number, invoice_date, supplier_name, supplier_brn, supplier_sst_reg_no, supplier_address, supplier_contact,
      customer_name, customer_brn, customer_sst_reg_no, customer_address, customer_contact,
      line_items, subtotal, total_tax_amount, total_amount_due, payment_mode, currency_code,
      irbm_unique_identifier, digital_signature, qr_code_data, created_at, updated_at, status, submission_response
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      eInvoiceObject.invoiceNumber,
      eInvoiceObject.invoiceDate,
      eInvoiceObject.supplierName,
      eInvoiceObject.supplierBRN,
      eInvoiceObject.supplierSSTRegNo,
      JSON.stringify(eInvoiceObject.supplierAddress),
      eInvoiceObject.supplierContact,
      eInvoiceObject.customerName,
      eInvoiceObject.customerBRN,
      eInvoiceObject.customerSSTRegNo,
      JSON.stringify(eInvoiceObject.customerAddress),
      eInvoiceObject.customerContact,
      JSON.stringify(eInvoiceObject.lineItems),
      eInvoiceObject.subtotal,
      eInvoiceObject.totalTaxAmount,
      eInvoiceObject.totalAmountDue,
      eInvoiceObject.paymentMode,
      eInvoiceObject.currencyCode,
      eInvoiceObject.irbmUniqueIdentifier,
      eInvoiceObject.digitalSignature,
      eInvoiceObject.qrCodeData,
      eInvoiceObject.createdAt,
      eInvoiceObject.updatedAt,
      status,
      JSON.stringify(submissionResponse)
    ]
  );
  await db.close();
}
