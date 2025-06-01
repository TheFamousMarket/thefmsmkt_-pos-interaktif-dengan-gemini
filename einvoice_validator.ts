// Validator for Malaysian E-Invoice data structure
// Reference: LHDN e-Invoice guidelines (https://www.hasil.gov.my/en/e-invoice/)
import { EInvoice } from './einvoice_models';

/**
 * Validates an EInvoice object for required fields as per Malaysian LHDN guidelines.
 * Returns true if valid, or an array of error messages if invalid.
 */
export function validateEInvoiceData(eInvoiceObject: EInvoice): true | string[] {
  const errors: string[] = [];

  // Invoice Number
  if (!eInvoiceObject.invoiceNumber) {
    errors.push('Invoice Number is required.');
  }
  // Invoice Date
  if (!eInvoiceObject.invoiceDate) {
    errors.push('Invoice Date is required.');
  }
  // Supplier Name
  if (!eInvoiceObject.supplierName) {
    errors.push('Supplier Name is required.');
  }
  // Supplier BRN
  if (!eInvoiceObject.supplierBRN) {
    errors.push('Supplier Business Registration Number (BRN) is required.');
  }
  // Supplier Address
  if (!eInvoiceObject.supplierAddress) {
    errors.push('Supplier Address is required.');
  }
  // Supplier Contact
  if (!eInvoiceObject.supplierContact) {
    errors.push('Supplier Contact is required.');
  }
  // Customer Name (B2C) or Customer BRN (B2B)
  if (!eInvoiceObject.customerName && !eInvoiceObject.customerBRN) {
    errors.push('Customer Name (for B2C) or Customer BRN (for B2B) is required.');
  }
  // Customer Address
  if (!eInvoiceObject.customerAddress) {
    errors.push('Customer Address is required.');
  }
  // Customer Contact
  if (!eInvoiceObject.customerContact) {
    errors.push('Customer Contact is required.');
  }
  // Line Items
  if (!eInvoiceObject.lineItems || !Array.isArray(eInvoiceObject.lineItems) || eInvoiceObject.lineItems.length === 0) {
    errors.push('At least one line item is required.');
  } else {
    eInvoiceObject.lineItems.forEach((item, idx) => {
      if (!item.description) errors.push(`Line item #${idx+1}: Description is required.`);
      if (item.quantity == null || item.quantity <= 0) errors.push(`Line item #${idx+1}: Quantity must be greater than 0.`);
      if (item.unitPrice == null) errors.push(`Line item #${idx+1}: Unit Price is required.`);
      if (item.totalAmount == null) errors.push(`Line item #${idx+1}: Total Amount is required.`);
      if (!item.taxType) errors.push(`Line item #${idx+1}: Tax Type is required.`);
      if (item.taxRate == null) errors.push(`Line item #${idx+1}: Tax Rate is required.`);
      if (item.taxAmount == null) errors.push(`Line item #${idx+1}: Tax Amount is required.`);
    });
  }
  // Subtotal
  if (eInvoiceObject.subtotal == null) {
    errors.push('Subtotal is required.');
  }
  // Total Tax Amount
  if (eInvoiceObject.totalTaxAmount == null) {
    errors.push('Total Tax Amount is required.');
  }
  // Total Amount Due
  if (eInvoiceObject.totalAmountDue == null) {
    errors.push('Total Amount Due is required.');
  }
  // Payment Mode
  if (!eInvoiceObject.paymentMode) {
    errors.push('Payment Mode is required.');
  }
  // Currency Code
  if (!eInvoiceObject.currencyCode) {
    errors.push('Currency Code is required.');
  }
  // Created/Updated timestamps
  if (!eInvoiceObject.createdAt) {
    errors.push('Created timestamp is required.');
  }
  if (!eInvoiceObject.updatedAt) {
    errors.push('Updated timestamp is required.');
  }

  return errors.length === 0 ? true : errors;
}
