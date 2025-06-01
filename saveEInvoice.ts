// Utility to save e-invoice data as a JSON file (for prototyping)
// In production, replace with DB insert logic
import fs from 'fs';
import path from 'path';
import { saveEInvoiceToDB } from './saveEInvoiceToDB';

/**
 * Saves the e-invoice object, status, and submission response as a JSON file.
 * @param eInvoiceObject The EInvoice object
 * @param status Status string (e.g., 'generated', 'submitted', 'failed', 'acknowledged_by_irbm')
 * @param submissionResponse The response from the submission service (can be null)
 */
export async function saveEInvoice(eInvoiceObject: any, status: string, submissionResponse: any) {
  try {
    await saveEInvoiceToDB(eInvoiceObject, status, submissionResponse);
    console.log('E-invoice saved to database.');
    return true;
  } catch (err) {
    console.error('Failed to save e-invoice to database:', err);
    return false;
  }
}
