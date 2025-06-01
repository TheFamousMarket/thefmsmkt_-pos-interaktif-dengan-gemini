import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import KioskButton from '../../components/common/KioskButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '../../contexts/ToastContext';
import { Product, PurchaseOrder, StockInScanResult, PurchaseOrderItem } from '../../types';
import { mockProducts, mockPurchaseOrders } from '../../constants/mockData';
import PurchaseOrderSelector from '../../components/inventory/PurchaseOrderSelector';
import ScannedItemsTable from '../../components/inventory/ScannedItemsTable';
import CameraFeedDisplay from '../VisionCheckout/CameraFeedDisplay'; // Reusing for visual simulation

const VisionStockInPage: React.FC = () => {
  const { translate } = useLanguage();
  const { showToast } = useToast();

  const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
  const [currentPO, setCurrentPO] = useState<PurchaseOrder | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<StockInScanResult[]>([]);
  // const [simulationLog, setSimulationLog] = useState<string[]>([]); // Optional for debugging

  useEffect(() => {
    if (selectedPoId) {
      const po = mockPurchaseOrders.find(p => p.id === selectedPoId);
      setCurrentPO(po || null);
      if (po) {
        const initialResults = po.items.map(item => {
            const productDetails = mockProducts.find(p => p.id === item.productId);
            return {
                productId: item.productId,
                productName: productDetails?.name || 'Unknown Product',
                sku: productDetails?.sku,
                expectedQuantity: item.expectedQuantity,
                scannedQuantity: 0,
                discrepancy: -item.expectedQuantity,
                status: 'Pending Scan',
                simulatedExpiryDate: productDetails?.hasExpiryDate ? undefined : undefined, // Will be set on scan
            } as StockInScanResult;
        });
        setScanResults(initialResults);
        showToast(translate('toast_po_selected', { poNumber: po.poNumber }), 'success');
      } else {
        setScanResults([]);
      }
    } else {
      setCurrentPO(null);
      setScanResults([]);
    }
  }, [selectedPoId, translate, showToast]);


  const processScannedItem = useCallback((scannedProduct: Product, quantityInBatch: number) => {
    setScanResults(prevResults => {
        const updatedResults = [...prevResults];
        let itemFoundInResults = false;
        let itemIndex = -1;

        for(let i=0; i < updatedResults.length; i++) {
            if(updatedResults[i].productId === scannedProduct.id) {
                itemFoundInResults = true;
                itemIndex = i;
                break;
            }
        }
        
        let poItemDetails: PurchaseOrderItem | undefined;
        if(currentPO) {
            poItemDetails = currentPO.items.find(item => item.productId === scannedProduct.id);
        }

        if (itemFoundInResults) { 
            const currentItem = updatedResults[itemIndex];
            currentItem.scannedQuantity += quantityInBatch;
            currentItem.discrepancy = currentItem.scannedQuantity - currentItem.expectedQuantity;
            
            if (scannedProduct.hasExpiryDate && (!currentItem.simulatedExpiryDate || currentItem.simulatedExpiryDate === 'YYYY-MM-DD')) { 
                const futureDays = Math.floor(Math.random() * 365) + 30; 
                const expiry = new Date();
                expiry.setDate(expiry.getDate() + futureDays);
                currentItem.simulatedExpiryDate = expiry.toISOString().split('T')[0];
                showToast(translate('toast_stock_in_expiry_sim', {itemName: scannedProduct.name, expiryDate: currentItem.simulatedExpiryDate }), 'info', 2000);
            }

            if (currentItem.expectedQuantity > 0) { 
                 if (currentItem.scannedQuantity < currentItem.expectedQuantity) currentItem.status = 'Under Quantity';
                 else if (currentItem.scannedQuantity === currentItem.expectedQuantity) currentItem.status = scannedProduct.hasExpiryDate ? 'OK with Expiry' : 'OK';
                 else currentItem.status = 'Over Quantity';
            } else { 
                 currentItem.status = 'Unexpected Item'; 
            }

        } else { 
            const expectedQty = poItemDetails ? poItemDetails.expectedQuantity : 0;
            const newScan: StockInScanResult = {
                productId: scannedProduct.id,
                productName: scannedProduct.name,
                sku: scannedProduct.sku,
                expectedQuantity: expectedQty,
                scannedQuantity: quantityInBatch,
                discrepancy: quantityInBatch - expectedQty,
                status: 'Pending Scan', // Initial status, will be updated
            };
            
            if (scannedProduct.hasExpiryDate) {
                const futureDays = Math.floor(Math.random() * 365) + 30;
                const expiry = new Date();
                expiry.setDate(expiry.getDate() + futureDays);
                newScan.simulatedExpiryDate = expiry.toISOString().split('T')[0];
                showToast(translate('toast_stock_in_expiry_sim', {itemName: scannedProduct.name, expiryDate: newScan.simulatedExpiryDate }), 'info', 2000);
            }

            if (expectedQty > 0) { // Item was on PO
                if (newScan.scannedQuantity < newScan.expectedQuantity) newScan.status = 'Under Quantity';
                else if (newScan.scannedQuantity === newScan.expectedQuantity) newScan.status = scannedProduct.hasExpiryDate ? 'OK with Expiry' : 'OK';
                else newScan.status = 'Over Quantity';
            } else { // Item was not on PO
                newScan.status = 'Unexpected Item';
            }
            updatedResults.push(newScan);
        }
        showToast(translate('toast_stock_in_item_scanned', {itemName: scannedProduct.name, quantity: quantityInBatch }), 'success', 1500);
        return updatedResults;
    });
  }, [currentPO, showToast, translate]);


  // Simulation interval for batch scanning
  useEffect(() => {
    let scanIntervalId: NodeJS.Timeout;
    if (isScanning && currentPO) {
      scanIntervalId = setInterval(() => {
        const numDistinctProductsInBatch = Math.floor(Math.random() * 3) + 1; // 1 to 3 distinct products per batch

        for (let i = 0; i < numDistinctProductsInBatch; i++) {
          // Simulate detecting a random product for this part of the batch
          const shouldScanPoItem = Math.random() < 0.85; // 85% chance to scan a PO item
          let productToScan: Product | undefined;
          const poItemsNotFullyScanned = scanResults.filter(sr => sr.expectedQuantity > 0 && sr.scannedQuantity < sr.expectedQuantity);


          if (shouldScanPoItem && currentPO.items.length > 0) {
            if (poItemsNotFullyScanned.length > 0 && Math.random() < 0.7) { // Prioritize not-fully-scanned PO items
                const randomUnscannedPoItemIndex = Math.floor(Math.random() * poItemsNotFullyScanned.length);
                productToScan = mockProducts.find(p => p.id === poItemsNotFullyScanned[randomUnscannedPoItemIndex].productId);
            } else { // Or pick any PO item (might lead to overscan)
                const randomPoItemIndex = Math.floor(Math.random() * currentPO.items.length);
                productToScan = mockProducts.find(p => p.id === currentPO.items[randomPoItemIndex].productId);
            }
          } else {
            // Scan a random product from the catalog (could be on PO or not, simulates unexpected item)
            const randomIndex = Math.floor(Math.random() * mockProducts.length);
            productToScan = mockProducts[randomIndex];
          }
          
          if (productToScan) {
            const quantityForThisProductInBatch = Math.floor(Math.random() * 5) + 1; // 1 to 5 units for this product in this batch
            // Simulate processing delay for each item in the batch
            const delay = Math.random() * 300 + 100; // Shorter delay per item within a batch
            setTimeout(() => {
                if (!isScanning) return; 
                processScannedItem(productToScan!, quantityForThisProductInBatch);
            }, delay * i); // Stagger processing within the batch slightly
          }
        }
      }, 4000); // Simulate a new "batch scan" every 4 seconds
    }
    return () => clearInterval(scanIntervalId);
  }, [isScanning, currentPO, mockProducts, scanResults, processScannedItem]);


  const handleStartScan = () => {
    if (!selectedPoId || !currentPO) {
        showToast(translate('toast_stock_in_no_po_selected'), 'warning');
        return;
    }
    setIsScanning(true);
    showToast(translate('toast_stock_in_scan_started'), 'info');
  };

  const handleStopScan = () => {
    setIsScanning(false);
    showToast(translate('toast_stock_in_scan_stopped'), 'info');
  };
  
  const handleFinalizeShipment = () => {
    if (!currentPO) return;
    setIsScanning(false); 
    showToast(translate('toast_stock_in_finalize_sim', {poNumber: currentPO.poNumber}), 'success', 4000);
    setSelectedPoId(null); 
    setCurrentPO(null);
    setScanResults([]);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={translate('vision_stock_in_title')}
        subtitle={translate('vision_stock_in_subtitle')}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow">
        {/* Left Column: PO Selection & Camera Feed */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <PurchaseOrderSelector 
            purchaseOrders={mockPurchaseOrders} 
            selectedPoId={selectedPoId}
            onPoSelect={setSelectedPoId} 
          />
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg flex-grow">
            <p className="text-sm text-center text-stone-400 mb-2">{translate('vision_stock_in_camera_feed_title')}</p>
            <CameraFeedDisplay isScanning={isScanning} />
          </div>
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg space-y-3">
            <KioskButton
              variant={isScanning ? 'danger' : 'primary'}
              onClick={isScanning ? handleStopScan : handleStartScan}
              fullWidth
              disabled={!currentPO}
            >
              {isScanning ? translate('vision_stock_in_btn_stop_scan') : translate('vision_stock_in_btn_start_scan')}
            </KioskButton>
             <KioskButton 
                variant="primary" 
                onClick={handleFinalizeShipment} 
                fullWidth
                disabled={!currentPO || scanResults.length === 0 || isScanning}
                className="!bg-teal-500 hover:!bg-teal-600"
             >
                {translate('vision_stock_in_btn_finalize_shipment')}
            </KioskButton>
          </div>
        </div>

        {/* Right Column: Scanned Items Table */}
        <div className="lg:col-span-2 flex flex-col">
          <ScannedItemsTable items={scanResults} />
        </div>
      </div>
    </div>
  );
};

export default VisionStockInPage;
