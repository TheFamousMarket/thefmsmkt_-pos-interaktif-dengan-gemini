import React from 'react';
import { KioskMenuItem, EmployeePermission, PaymentMethod } from '../types'; // Added EmployeePermission, PaymentMethod
import { HomeIcon, ShoppingCartIcon, ArchiveBoxIcon, UsersIcon, UserGroupIcon, ChartBarIcon, Cog6ToothIcon, CameraIcon, EyeIcon, InboxArrowDownIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';


const iconClass = "h-6 w-6";
const kioskIconClass = "h-12 w-12 mb-3 text-white"; // Kiosk cards have white icons

export const sidebarMenuItems: KioskMenuItem[] = [
    { id: 'dashboard-content', translationKey: 'nav_dashboard', icon: <HomeIcon className={iconClass} />, color: '', path: '/dashboard' },
    { id: 'pos-content', translationKey: 'nav_pos', icon: <ShoppingCartIcon className={iconClass} />, color: '', path: '/pos' },
    { id: 'vision-checkout-content', translationKey: 'nav_vision_checkout', icon: <CameraIcon className={iconClass} />, color: '', path: '/vision-checkout'},
    { id: 'inventory-content', translationKey: 'nav_inventory', icon: <ArchiveBoxIcon className={iconClass} />, color: '', path: '/inventory' },
    { id: 'inventory-stock-in-content', translationKey: 'nav_vision_stock_in', icon: <InboxArrowDownIcon className={iconClass} />, color: '', path: '/inventory/vision-stock-in' },
    { id: 'inventory-monitoring-content', translationKey: 'nav_inventory_monitoring', icon: <EyeIcon className={iconClass} />, color: '', path: '/inventory/monitoring' },
    { id: 'crm-content', translationKey: 'nav_crm', icon: <UsersIcon className={iconClass} />, color: '', path: '/crm' },
    { id: 'employee-content', translationKey: 'nav_employee', icon: <UserGroupIcon className={iconClass} />, color: '', path: '/employees' },
    { id: 'reports-content', translationKey: 'nav_reports', icon: <ChartBarIcon className={iconClass} />, color: '', path: '/reports' },
    { id: 'whatsapp-webhook-content', translationKey: 'nav_whatsapp_webhook', icon: <ChatBubbleLeftRightIcon className={iconClass} />, color: '', path: '/whatsapp-webhook' },
    { id: 'settings-content', translationKey: 'nav_settings', icon: <Cog6ToothIcon className={iconClass} />, color: '', path: '/settings' },
];

export const kioskMenuItems: KioskMenuItem[] = sidebarMenuItems.map(item => ({
    ...item,
    // For kiosk cards, the icon is different and color is applied to the card background
    icon: React.cloneElement(item.icon, { className: kioskIconClass }),
    color: 'bg-green-500 hover:bg-green-600', // Example color for kiosk cards
    translationKey: item.translationKey.replace('nav_', 'kiosk_card_') // e.g. nav_dashboard -> kiosk_card_dashboard
})).filter(item => !item.path.startsWith('/inventory/')); // Filter out sub-inventory items from main kiosk for now, or create specific kiosk cards

// Add specific kiosk cards for the new inventory modules if desired
kioskMenuItems.push(
    { id: 'kiosk-inventory-stock-in', translationKey: 'kiosk_card_vision_stock_in', icon: <InboxArrowDownIcon className={kioskIconClass} />, color: 'bg-sky-500 hover:bg-sky-600', path: '/inventory/vision-stock-in' },
    { id: 'kiosk-inventory-monitoring', translationKey: 'kiosk_card_inventory_monitoring', icon: <EyeIcon className={kioskIconClass} />, color: 'bg-purple-500 hover:bg-purple-600', path: '/inventory/monitoring' }
);


export const departmentOptions = [
    { value: 'sales', labelKey: 'department_sales' },
    { value: 'inventory', labelKey: 'department_inventory' },
    { value: 'management', labelKey: 'department_management' },
];

export const roleOptions = [
    { value: 'cashier', labelKey: 'role_cashier' },
    { value: 'manager', labelKey: 'role_manager' },
    { value: 'admin', labelKey: 'role_admin' },
];

export const permissionOptions = [
    { id: 'perm-full-access', labelKey: 'perm_full_access', permissionKey: 'fullAccess' as keyof EmployeePermission },
    { id: 'perm-manual-discount', labelKey: 'perm_manual_discount', permissionKey: 'manualDiscount' as keyof EmployeePermission },
    { id: 'perm-process-refund', labelKey: 'perm_process_refund', permissionKey: 'processRefund' as keyof EmployeePermission },
];

export const posCategoryTranslationKeys = [
    "pos_cat_all", "pos_cat_food", "pos_cat_drinks", "pos_cat_apparel", "pos_cat_snacks",
    "pos_cat_groceries", "pos_cat_homecare", "pos_cat_bakery", "pos_cat_rte",
    "pos_cat_frozen", "pos_cat_dairy", "pos_cat_cooking", "pos_cat_others"
];

export const paymentMethods: PaymentMethod[] = [
    { key: 'cash', labelKey: 'payment_method_cash' },
    { key: 'card', labelKey: 'payment_method_card' },
    { key: 'ewallet', labelKey: 'payment_method_ewallet' },
    { key: 'points', labelKey: 'payment_method_points' },
];

export const returnActionTypes = [
    { value: 'refund', labelKey: 'return_type_refund' },
    { value: 'exchange', labelKey: 'return_type_exchange' },
    { value: 'store_credit', labelKey: 'return_type_store_credit' },
];