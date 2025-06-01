import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function getEInvoiceStatusFromDB(invoiceNumber: string) {
  const db = await open({ filename: './pos.db', driver: sqlite3.Database });
  const row = await db.get('SELECT status, * FROM EInvoices WHERE invoice_number = ?', invoiceNumber);
  await db.close();
  return row;
}
