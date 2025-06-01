import React from 'react'; // Added for React.ReactElement

export interface Product {
  id: number;
  name: string;
  price: number; // For items sold by unit, this is the unit price. For weight-based, this might be unused if pricePerUnit is set.
  category: string;
  image: string; // Emoji or URL
  stock: number;
  sku?: string; // Optional SKU

  // Vision AI Checkout related fields
  isVisuallyAmbiguous?: boolean;
  similarProductIds?: number[]; // IDs of products that look similar
  requiresScale?: boolean; // True if item needs to be weighed
  pricePerUnit?: number;   // e.g., price per kg or per 100g
  unitName?: string;       // e.g., 'kg', 'g', 'item'

  // Inventory Monitoring related fields
  reorderLevel?: number;
  shelfLocationId?: string; // e.g., "SHELF-A1"
  currentShelfLocationId?: string; // e.g., "SHELF-B3" if misplaced

  // Vision AI Stock In related fields
  hasExpiryDate?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  // For scaled items, price here would be the final calculated price.
  // The original product.price might be price/kg.
  weight?: number; // Optional: store weight for scaled items
}

// Specific type for items recognized by Vision AI Checkout, before final cart addition
export interface RecognizedItem extends Product {
  quantity: number;
  weight?: number; // Weight in unitName units (e.g., kg)
  calculatedPrice?: number; // Final price for this item, especially if weight-based
}


export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
}

export interface EmployeePermission {
  fullAccess: boolean;
  manualDiscount: boolean;
  processRefund: boolean;
}

export interface Employee {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  pin: string;
  startDate: string;
  status: 'Aktif' | 'Tidak Aktif';
  permissions: EmployeePermission;
}

export type Language = 'ms' | 'en';

export interface TranslationStrings {
  [key: string]: string | { [nestedKey: string]: string };
}

export interface AllTranslations {
  ms: TranslationStrings;
  en: TranslationStrings;
}

export interface KioskMenuItem {
  id: string;
  translationKey: string; // e.g. "nav_pos" which maps to "kiosk_card_pos"
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  color: string;
  path: string;
  children?: KioskMenuItem[]; // For sub-menus
}

export interface PaymentMethod {
  key: string;
  labelKey: string;
}

export enum ReportTimeRange {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
}

export interface SalesDataPoint { // Primarily for generic time-series sales
    name: string; // typically date or general category name (if not using specific categoryKey)
    sales: number;
}

export interface CategorySalesDataPoint {
    categoryKey: string; // translation key like 'pos_cat_food'
    sales: number;
}

export interface TopSellingProductDataPoint {
    productId: number;
    productName: string; // Direct name, translation handled if source is i18n
    quantitySold: number;
    totalRevenue: number;
}

export interface SalesByEmployeeDataPoint {
    employeeId: string; // Could be Emp ID
    employeeName: string; // Direct name
    totalSales: number;
    transactions: number;
}

export interface PaymentMethodDataPoint {
    methodKey: string; // translation key e.g., 'payment_method_cash'
    totalAmount: number;
    transactionCount: number;
}


export interface GeminiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface MetaResponse<T> {
  data: T | null;
  error: string | null;
}

// --- Vision AI Stock In Types ---
export interface PurchaseOrderItem {
  productId: number;
  productName: string; // For easy display, could be fetched/mapped
  expectedQuantity: number;
}

export interface PurchaseOrder {
  id: string; // e.g., PO-2024-001
  poNumber: string;
  orderDate: string; // ISO date string
  supplierName: string;
  items: PurchaseOrderItem[];
  status: 'Pending' | 'Partially Received' | 'Received' | 'Cancelled';
}

export interface StockInScanResult {
  productId: number;
  productName: string;
  sku?: string;
  expectedQuantity: number;
  scannedQuantity: number;
  discrepancy: number;
  simulatedExpiryDate?: string; // ISO date string or 'N/A' or 'Capture Failed'
  status: 'OK' | 'Under Quantity' | 'Over Quantity' | 'Unexpected Item' | 'Expiry Capture Failed' | 'OK with Expiry' | 'Pending Scan';
}

// --- Vision AI Customer Analytics Types ---
export interface AnonymizedCustomerAnalytics {
  ageGroup?: 'Child' | 'Teenager' | 'Young Adult' | 'Adult' | 'Senior';
  gender?: 'Male' | 'Female' | 'Other' | 'Unknown';
  sentiment?: 'Positive' | 'Neutral' | 'Negative' | 'Unknown';
}


// --- Inventory Monitoring Types ---
export interface ShelfConfig {
  id: string; // e.g., "SHELF-A"
  name: string; // e.g., "Aisle 1 - Snacks"
  rows: number;
  columns: number;
  productSlots?: { // Optional: pre-assign products to specific slots on a shelf for more detailed display
    productId: number;
    row: number; // 0-indexed
    col: number; // 0-indexed
  }[];
}

export interface ShelfDisplayConfig {
  layoutName: string;
  shelves: ShelfConfig[];
}