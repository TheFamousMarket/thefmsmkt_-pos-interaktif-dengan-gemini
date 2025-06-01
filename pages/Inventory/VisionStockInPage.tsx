import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

  // Memoize PO items not fully scanned for simulation
  const poItemsNotFullyScanned = useMemo(
    () =>
      scanResults.filter(
        sr => sr.expectedQuantity > 0 && sr.scannedQuantity < sr.expectedQuantity
      ),
    [scanResults]
  );

  // Helper: Generate simulated expiry date
  const generateSimulatedExpiryDate = useCallback((): string => {
    const futureDays = Math.floor(Math.random() * 365) + 30;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + futureDays);
    return expiry.toISOString().split('T')[0];
  }, []);

  // Helper: Determine status based on quantities and expiry
  const determineStatus = useCallback(
    (expected: number, scanned: number, hasExpiry: boolean): string => {
      if (expected > 0) {
        if (scanned < expected) return 'Under Quantity';
        if (scanned === expected) return hasExpiry ? 'OK with Expiry' : 'OK';
        return 'Over Quantity';
      }
      return 'Unexpected Item';
    },
    []
  );

  // Initialize scan results when PO changes
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
            simulatedExpiryDate: undefined,
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

  // Process a scanned item and update scan results
  const processScannedItem = useCallback(
    (scannedProduct: Product, quantityInBatch: number) => {
      setScanResults(prevResults => {
        const updatedResults = [...prevResults];
        const itemIndex = updatedResults.findIndex(item => item.productId === scannedProduct.id);
        const poItemDetails = currentPO?.items.find(item => item.productId === scannedProduct.id);

        if (itemIndex > -1) {
          const currentItem = updatedResults[itemIndex];
          currentItem.scannedQuantity += quantityInBatch;
          currentItem.discrepancy = currentItem.scannedQuantity - currentItem.expectedQuantity;

          if (
            scannedProduct.hasExpiryDate &&
            (!currentItem.simulatedExpiryDate || currentItem.simulatedExpiryDate === 'YYYY-MM-DD')
          ) {
            currentItem.simulatedExpiryDate = generateSimulatedExpiryDate();
            showToast(
              translate('toast_stock_in_expiry_sim', {
                itemName: scannedProduct.name,
                expiryDate: currentItem.simulatedExpiryDate,
              }),
              'info',
              2000
            );
          }

          currentItem.status = determineStatus(
            currentItem.expectedQuantity,
            currentItem.scannedQuantity,
            !!scannedProduct.hasExpiryDate
          );
        } else {
          const expectedQty = poItemDetails ? poItemDetails.expectedQuantity : 0;
          const newScan: StockInScanResult = {
            productId: scannedProduct.id,
            productName: scannedProduct.name,
            sku: scannedProduct.sku,
            expectedQuantity: expectedQty,
            scannedQuantity: quantityInBatch,
            discrepancy: quantityInBatch - expectedQty,
            status: 'Pending Scan',
          };

          if (scannedProduct.hasExpiryDate) {
            newScan.simulatedExpiryDate = generateSimulatedExpiryDate();
            showToast(
              translate('toast_stock_in_expiry_sim', {
                itemName: scannedProduct.name,
                expiryDate: newScan.simulatedExpiryDate,
              }),
              'info',
              2000
            );
          }

          newScan.status = determineStatus(
            expectedQty,
            newScan.scannedQuantity,
            !!scannedProduct.hasExpiryDate
          );
          updatedResults.push(newScan);
        }
        showToast(
          translate('toast_stock_in_item_scanned', {
            itemName: scannedProduct.name,
            quantity: quantityInBatch,
          }),
          'success',
          1500
        );
        return updatedResults;
      });
    },
    [currentPO, showToast, translate, generateSimulatedExpiryDate, determineStatus]
  );

  // Simulate batch scanning logic
  const simulateBatchScan = useCallback(() => {
    if (!isScanning || !currentPO) return;
    const numDistinctProductsInBatch = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numDistinctProductsInBatch; i++) {
      const shouldScanPoItem = Math.random() < 0.85;
      let productToScan: Product | undefined;

      if (shouldScanPoItem && currentPO.items.length > 0) {
        if (poItemsNotFullyScanned.length > 0 && Math.random() < 0.7) {
          const randomUnscannedPoItemIndex = Math.floor(Math.random() * poItemsNotFullyScanned.length);
          productToScan = mockProducts.find(
            p => p.id === poItemsNotFullyScanned[randomUnscannedPoItemIndex].productId
          );
        } else {
          const randomPoItemIndex = Math.floor(Math.random() * currentPO.items.length);
          productToScan = mockProducts.find(
            p => p.id === currentPO.items[randomPoItemIndex].productId
          );
        }
      } else {
        const randomIndex = Math.floor(Math.random() * mockProducts.length);
        productToScan = mockProducts[randomIndex];
      }

      if (productToScan) {
        const quantityForThisProductInBatch = Math.floor(Math.random() * 5) + 1;
        const delay = Math.random() * 300 + 100;
        setTimeout(() => {
          if (!isScanning) return;
          processScannedItem(productToScan!, quantityForThisProductInBatch);
        }, delay * i);
      }
    }
  }, [isScanning, currentPO, mockProducts, poItemsNotFullyScanned, processScannedItem]);

  // Simulation interval for batch scanning
  useEffect(() => {
    if (!isScanning || !currentPO) return;
    const scanIntervalId = setInterval(simulateBatchScan, 4000);
    return () => clearInterval(scanIntervalId);
  }, [isScanning, currentPO, simulateBatchScan]);

  // Handlers
  const handleStartScan = useCallback(() => {
    if (!selectedPoId || !currentPO) {
      showToast(translate('toast_stock_in_no_po_selected'), 'warning');
      return;
    }
    setIsScanning(true);
    showToast(translate('toast_stock_in_scan_started'), 'info');
  }, [selectedPoId, currentPO, showToast, translate]);

  const handleStopScan = useCallback(() => {
    setIsScanning(false);
    showToast(translate('toast_stock_in_scan_stopped'), 'info');
  }, [showToast, translate]);

  const handleFinalizeShipment = useCallback(() => {
    if (!currentPO) return;
    setIsScanning(false);
    showToast(
      translate('toast_stock_in_finalize_sim', { poNumber: currentPO.poNumber }),
      'success',
      4000
    );
    setSelectedPoId(null);
    setCurrentPO(null);
    setScanResults([]);
  }, [currentPO, showToast, translate]);

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
