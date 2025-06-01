import { Product, Customer, Employee, CategorySalesDataPoint, TopSellingProductDataPoint, SalesByEmployeeDataPoint, PaymentMethodDataPoint, PurchaseOrder, ShelfDisplayConfig } from '../types';

export const mockProducts: Product[] = [
    { id: 1, name: 'Kopi Ais Kaw', price: 5.00, category: 'Minuman', image: '🥤', stock: 50, sku: 'DRK-001', reorderLevel: 10, shelfLocationId: 'SHELF-A1-01', currentShelfLocationId: 'SHELF-A1-01', hasExpiryDate: false },
    { id: 2, name: 'Nasi Lemak Ayam', price: 12.00, category: 'Makanan', image: '🍚', stock: 30, sku: 'FOD-001', reorderLevel: 5, shelfLocationId: 'SHELF-B1-01', currentShelfLocationId: 'SHELF-B1-01', hasExpiryDate: true },
    { id: 3, name: 'Teh O Ais Limau', price: 3.50, category: 'Minuman', image: '🍹', stock: 8, sku: 'DRK-002', reorderLevel: 15, shelfLocationId: 'SHELF-A1-02', currentShelfLocationId: 'SHELF-A1-02', hasExpiryDate: false }, // Low stock example
    { id: 4, name: 'Sandwich Tuna', price: 7.00, category: 'Makanan', image: '🥪', stock: 25, sku: 'FOD-002', isVisuallyAmbiguous: true, similarProductIds: [17], reorderLevel: 10, shelfLocationId: 'SHELF-B2-01', currentShelfLocationId: 'SHELF-C1-03', hasExpiryDate: true }, // Misplaced example
    { id: 5, name: 'Baju T-Shirt Plain (Merah)', price: 35.00, category: 'Pakaian', image: '👕', stock: 40, sku: 'APR-001', isVisuallyAmbiguous: true, similarProductIds: [19], reorderLevel: 5, shelfLocationId: 'SHELF-D1-01', currentShelfLocationId: 'SHELF-D1-01', hasExpiryDate: false },
    { id: 6, name: 'Seluar Jeans Biru', price: 89.00, category: 'Pakaian', image: '👖', stock: 15, sku: 'APR-002', reorderLevel: 3, shelfLocationId: 'SHELF-D2-01', currentShelfLocationId: 'SHELF-D2-01', hasExpiryDate: false },
    { id: 9, name: "Oreo Cadbury Cookies 54g", price: 2.90, category: "Biskut & Snek", image: '🍪', stock: 60, sku: 'SNK-001', reorderLevel: 20, shelfLocationId: 'SHELF-C1-01', currentShelfLocationId: 'SHELF-C1-01', hasExpiryDate: true },
    { id: 10, name: "Hup Seng Cream Crackers 428g", price: 4.99, category: "Biskut & Snek", image: '🍘', stock: 45, sku: 'SNK-002', reorderLevel: 15, shelfLocationId: 'SHELF-C1-02', currentShelfLocationId: 'SHELF-C1-02', hasExpiryDate: true },
    { id: 11, name: "Mission Wraps Whole Grains", price: 7.50, category: "Roti & Pastri", image: '🌯', stock: 20, sku: 'BKY-001', reorderLevel: 8, shelfLocationId: 'SHELF-E1-01', currentShelfLocationId: 'SHELF-E1-01', hasExpiryDate: true },
    { id: 14, name: "Ikan Kembung Segar (per kg)", price: 15.00, category: "Sejuk Beku", image: '🐟', stock: 22, sku: 'FRZ-001', requiresScale: true, pricePerUnit: 15.00, unitName: 'kg', reorderLevel: 5, shelfLocationId: 'SHELF-F1-01', currentShelfLocationId: 'SHELF-F1-01', hasExpiryDate: true },
    { id: 18, name: "Gardenia Original Classic 400g", price: 3.00, category: "Roti & Pastri", image: '🍞', stock: 70, sku: 'BKY-002', reorderLevel: 25, shelfLocationId: 'SHELF-E1-02', currentShelfLocationId: 'SHELF-E1-02', hasExpiryDate: true },
    { id: 67, name: "KLEENSO 99 Floor Cleaner Serai Wangi 900g", price: 8.50, category: "Penjagaan Diri & Rumah", image: '🧼', stock: 30, sku: 'HMC-001', reorderLevel: 10, shelfLocationId: 'SHELF-G1-01', currentShelfLocationId: 'SHELF-G1-01', hasExpiryDate: false },
    { id: 96, name: "Farm Fresh UHT Full Cream Milk 200ml", price: 3.20, category: "Tenusu & Telur", image: '🥛', stock: 60, sku: 'DRY-001', reorderLevel: 15, shelfLocationId: 'SHELF-A2-01', currentShelfLocationId: 'SHELF-A2-01', hasExpiryDate: true },
    { id: 127, name: "7-Eleven Rendang Chicken Basmathi Rice 270g", price: 9.90, category: "Makanan Segera", image: '🍛', stock: 30, sku: 'RTE-001', reorderLevel: 10, shelfLocationId: 'SHELF-B3-01', currentShelfLocationId: 'SHELF-B3-01', hasExpiryDate: true },
    { id: 150, name: "Tomato (per kg)", price: 5.50, category: "Barangan Runcit", image: '🍅', stock: 3, sku: 'CKG-001', requiresScale: true, pricePerUnit: 5.50, unitName: 'kg', reorderLevel: 5, shelfLocationId: 'SHELF-H1-01', currentShelfLocationId: 'SHELF-H1-01', hasExpiryDate: false }, // Low stock
    { id: 172, name: "Kad tambah nilai prabayar", price: 10.00, category: "Lain-lain", image: '📱', stock: 100, sku: 'OTH-001', reorderLevel: 20, shelfLocationId: 'COUNTER-01', currentShelfLocationId: 'COUNTER-01', hasExpiryDate: false },
    { id: 17, name: 'Sandwich Ayam', price: 7.50, category: 'Makanan', image: '🥪', stock: 20, sku: 'FOD-003', reorderLevel: 8, shelfLocationId: 'SHELF-B2-02', currentShelfLocationId: 'SHELF-B2-02', hasExpiryDate: true }, // Similar to Sandwich Tuna
    { id: 19, name: 'Baju T-Shirt Plain (Biru)', price: 35.00, category: 'Pakaian', image: '👕', stock: 35, sku: 'APR-003', reorderLevel: 5, shelfLocationId: 'SHELF-D1-02', currentShelfLocationId: 'SHELF-D1-02', hasExpiryDate: false }, // Similar to Baju T-Shirt (Merah)
    { id: 20, name: 'Epal Fuji (loose)', price: 1.50, category: 'Barangan Runcit', image: '🍎', stock: 100, sku: 'FRT-001', requiresScale: true, pricePerUnit: 7.50, unitName: 'kg', reorderLevel: 10, shelfLocationId: 'SHELF-H1-02', currentShelfLocationId: 'SHELF-H1-02', hasExpiryDate: false } // Approx 5 apples per kg
];

// For POSPage category filter, using direct translated names from posCategoryTranslationKeys
export const mockProductCategories: string[] = [
    "Semua", "Makanan", "Minuman", "Pakaian", "Biskut & Snek",
    "Barangan Runcit", "Penjagaan Diri & Rumah", "Roti & Pastri",
    "Makanan Segera", "Sejuk Beku", "Tenusu & Telur", "Masakan", "Lain-lain"
];


export const mockCustomers: Customer[] = [
    { id: 'C001', name: 'Ahmad bin Ismail', email: 'ahmad@mail.com', phone: '012-3456789', totalSpent: 5670.50 },
    { id: 'C002', name: 'Siti Saleha', email: 'siti@mail.com', phone: '019-8765432', totalSpent: 890.00 },
    { id: 'C003', name: 'John Doe', email: 'john.doe@example.com', phone: '011-1234567', totalSpent: 1250.75 },
];

export let mockEmployeesData: Employee[] = [
    {
        id: 'E001',
        fullname: 'Ali bin Abu',
        email: 'ali@pos.com',
        phone: '012-1112222',
        department: 'sales',
        role: 'cashier',
        pin: '1234',
        startDate: '2023-01-15',
        status: 'Aktif',
        permissions: {manualDiscount: true, processRefund: false, fullAccess: false}
    },
    {
        id: 'E002',
        fullname: 'Siti binti Kassim',
        email: 'siti@pos.com',
        phone: '012-3334444',
        department: 'management',
        role: 'manager',
        pin: '5678',
        startDate: '2022-05-20',
        status: 'Aktif',
        permissions: {manualDiscount: true, processRefund: true, fullAccess: true}
    },
     {
        id: 'E003',
        fullname: 'David Lee',
        email: 'david@pos.com',
        phone: '012-5556666',
        department: 'sales',
        role: 'cashier',
        pin: '1122',
        startDate: '2023-03-10',
        status: 'Aktif',
        permissions: {manualDiscount: true, processRefund: false, fullAccess: false}
    },
];

// Mock Data For Reports Page
export const mockDailySalesData = [
    { name: 'Mon', sales: 1200 }, { name: 'Tue', sales: 1500 }, { name: 'Wed', sales: 1100 },
    { name: 'Thu', sales: 1800 }, { name: 'Fri', sales: 2200 }, { name: 'Sat', sales: 2500 },
    { name: 'Sun', sales: 1900 }
];

export const mockWeeklySalesData = [ // Example for "Weekly" view, could be sum of dailies
    { name: 'Week 1', sales: 7500 }, { name: 'Week 2', sales: 8200 },
    { name: 'Week 3', sales: 7900 }, { name: 'Week 4', sales: 8500 }
];

export const mockMonthlySalesData = [ // Example for "Monthly" view
    { name: 'Jan', sales: 30000 }, { name: 'Feb', sales: 28000 },
    { name: 'Mar', sales: 32000 }, { name: 'Apr', sales: 31000 }
];


export const mockCategorySalesData: CategorySalesDataPoint[] = [
    { categoryKey: 'pos_cat_food', sales: 4500 },
    { categoryKey: 'pos_cat_drinks', sales: 3200 },
    { categoryKey: 'pos_cat_apparel', sales: 2800 },
    { categoryKey: 'pos_cat_snacks', sales: 1800 },
    { categoryKey: 'pos_cat_others', sales: 1500 }
];

export const mockTopSellingProducts: TopSellingProductDataPoint[] = [
    { productId: 2, productName: 'Nasi Lemak Ayam', quantitySold: 250, totalRevenue: 3000.00 },
    { productId: 1, productName: 'Kopi Ais Kaw', quantitySold: 400, totalRevenue: 2000.00 },
    { productId: 3, productName: 'Teh O Ais Limau', quantitySold: 350, totalRevenue: 1225.00 },
    { productId: 5, productName: 'Baju T-Shirt Plain (Merah)', quantitySold: 50, totalRevenue: 1750.00 },
    { productId: 9, productName: "Oreo Cadbury Cookies 54g", quantitySold: 300, totalRevenue: 870.00 },
];

export const mockSalesByEmployee: SalesByEmployeeDataPoint[] = [
    { employeeId: 'E002', employeeName: 'Siti binti Kassim', totalSales: 12500, transactions: 150 },
    { employeeId: 'E001', employeeName: 'Ali bin Abu', totalSales: 9800, transactions: 120 },
    { employeeId: 'E003', employeeName: 'David Lee', totalSales: 7500, transactions: 90 },
];

export const mockPaymentMethodData: PaymentMethodDataPoint[] = [
    { methodKey: 'payment_method_cash', totalAmount: 15200, transactionCount: 180 },
    { methodKey: 'payment_method_card', totalAmount: 10800, transactionCount: 95 },
    { methodKey: 'payment_method_ewallet', totalAmount: 3800, transactionCount: 85 },
];

// Mock Data for Vision AI Stock In
export const mockPurchaseOrders: PurchaseOrder[] = [
    {
        id: 'PO2024001',
        poNumber: 'PO-XYZ-001',
        orderDate: '2024-07-15',
        supplierName: 'Snek Borong Sdn Bhd',
        status: 'Pending',
        items: [
            { productId: 9, productName: "Oreo Cadbury Cookies 54g", expectedQuantity: 100 },
            { productId: 10, productName: "Hup Seng Cream Crackers 428g", expectedQuantity: 50 },
        ]
    },
    {
        id: 'PO2024002',
        poNumber: 'PO-ABC-007',
        orderDate: '2024-07-18',
        supplierName: 'Minuman Segar Global',
        status: 'Pending',
        items: [
            { productId: 1, productName: "Kopi Ais Kaw", expectedQuantity: 200 },
            { productId: 3, productName: "Teh O Ais Limau", expectedQuantity: 150 },
            { productId: 96, productName: "Farm Fresh UHT Full Cream Milk 200ml", expectedQuantity: 120 },
        ]
    },
    {
        id: 'PO2024003',
        poNumber: 'PO-MIX-112',
        orderDate: '2024-07-20',
        supplierName: 'MegaMart Supplies',
        status: 'Pending',
        items: [
            { productId: 2, productName: "Nasi Lemak Ayam", expectedQuantity: 50 },
            { productId: 18, productName: "Gardenia Original Classic 400g", expectedQuantity: 80 },
            { productId: 14, productName: "Ikan Kembung Segar (per kg)", expectedQuantity: 30 }, // Expected in kg
        ]
    }
];

// Mock Data for Inventory Monitoring Shelf Display
export const shelfLayoutConfig: ShelfDisplayConfig = {
    layoutName: "Kedai Utama",
    shelves: [
        { id: "SHELF-A", name: "Rak Minuman & Tenusu", rows: 2, columns: 3, productSlots: [{productId: 1, row:0, col:0},{productId: 3, row:0, col:1},{productId: 96, row:1, col:0}]},
        { id: "SHELF-B", name: "Rak Makanan & Sedia Dimakan", rows: 3, columns: 2, productSlots: [{productId: 2, row:0, col:0},{productId: 4, row:1, col:0},{productId: 17, row:1, col:1},{productId: 127, row:2, col:0}] },
        { id: "SHELF-C", name: "Rak Snek & Biskut", rows: 1, columns: 3, productSlots: [{productId: 9, row:0, col:0},{productId: 10, row:0, col:1}] },
        { id: "SHELF-D", name: "Rak Pakaian", rows: 2, columns: 2, productSlots: [{productId: 5, row:0, col:0},{productId: 19, row:0, col:1},{productId: 6, row:1, col:0}] },
        { id: "SHELF-E", name: "Rak Roti & Pastri", rows: 1, columns: 2, productSlots: [{productId: 11, row:0, col:0},{productId: 18, row:0, col:1}] },
        { id: "SHELF-F", name: "Rak Sejuk Beku", rows: 1, columns: 1, productSlots: [{productId: 14, row:0, col:0}] },
        { id: "SHELF-G", name: "Rak Penjagaan Rumah", rows: 1, columns: 1, productSlots: [{productId: 67, row:0, col:0}] },
        { id: "SHELF-H", name: "Rak Barangan Runcit (Buah/Sayur)", rows: 1, columns: 2, productSlots: [{productId: 150, row:0, col:0},{productId: 20, row:0, col:1}] },
        { id: "COUNTER", name: "Kawasan Kaunter", rows: 1, columns: 1, productSlots: [{productId: 172, row:0, col:0}] },
    ]
};