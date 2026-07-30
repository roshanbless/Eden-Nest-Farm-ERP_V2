'use client';

import React, { useState, useEffect } from 'react';
import { fetchInventory, fetchProducts, InventoryItem, Product, mockProducts } from '@/lib/api/commerce';
import { useLanguage } from '@/lib/i18n/languageContext';

export default function InventoryPage() {
  const { t } = useLanguage();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(true);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // Form State
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [adjustType, setAdjustType] = useState<'stock_in' | 'stock_out' | 'waste' | 'damage'>('stock_in');
  const [quantity, setQuantity] = useState('100');
  const [reason, setReason] = useState('Production Batch Receiving');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const invData = await fetchInventory();
      const prodData = await fetchProducts();
      setInventory(invData);
      if (invData.length > 0) {
        setSelectedItem(invData[0].id);
      }
      setProducts(prodData);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalAvailable = inventory.reduce((sum, item) => sum + item.quantity_available, 0);
  const totalReserved = inventory.reduce((sum, item) => sum + item.quantity_reserved, 0);
  const totalDamaged = inventory.reduce((sum, item) => sum + item.quantity_damaged, 0);

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault();

    const changeNum = parseInt(quantity) || 0;
    const updated = inventory.map((item) => {
      if (item.id === selectedItem) {
        let newAvail = item.quantity_available;
        let newDamaged = item.quantity_damaged;

        if (adjustType === 'stock_in') newAvail += changeNum;
        if (adjustType === 'stock_out') newAvail = Math.max(0, newAvail - changeNum);
        if (adjustType === 'damage' || adjustType === 'waste') {
          newAvail = Math.max(0, newAvail - changeNum);
          newDamaged += changeNum;
        }

        return { ...item, quantity_available: newAvail, quantity_damaged: newDamaged };
      }
      return item;
    });

    setInventory(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eden_inventory', JSON.stringify(updated));
    }
    setShowAdjustModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            📦 Warehouse & Inventory Control
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t.inventory}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Track batch-level egg inventory, warehouse rack allocations, reserved order stock, and damage adjustments.
          </p>
        </div>

        <button
          onClick={() => setShowAdjustModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Perform Stock Adjustment
        </button>
      </div>

      {/* Aggregate Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-emerald-500/30 glass-card">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Total Stock Available</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{totalAvailable.toLocaleString()} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">Ready for dispatch</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-blue-500/30 glass-card">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Reserved for Active Orders</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1 font-mono">{totalReserved.toLocaleString()} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="text-xs text-blue-400 font-semibold mt-1">Committed stock</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-red-500/30 glass-card">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Damaged / Waste Logged</div>
          <div className="text-3xl font-extrabold text-red-400 mt-1 font-mono">{totalDamaged} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="text-xs text-red-400 font-semibold mt-1">Breakage log</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-amber-500/30 glass-card">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Warehouse Cold Storage</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1 font-mono">14°C Nominal</div>
          <div className="text-xs text-amber-400 font-semibold mt-1">Chilled storage</div>
        </div>
      </div>

      {/* Product Catalog Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Active Product Catalog SKUs</h2>
          <span className="text-xs text-slate-400">{products.length} Products Registered</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((prod) => (
            <div key={prod.id} className="p-5 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4 glass-card">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    {prod.sku}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-tight">{prod.name}</h3>
                </div>
                <div className="text-xl font-extrabold text-amber-400 font-mono">₹{prod.base_price}</div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2">{prod.description}</p>

              <div className="pt-3 border-t border-[#133e2b] flex items-center justify-between text-xs">
                <span className="text-slate-400">Stock Level:</span>
                <span className="font-bold text-white font-mono">{prod.stock_quantity.toLocaleString()} {prod.unit_of_measure}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fresh Clean State / Inventory Batch Table */}
      {inventory.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-2xl">
            📦
          </div>
          <h3 className="text-xl font-bold text-white">No Inventory Batches Logged Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Demo sample inventory cleared. Click below to adjust stock level and add batch inventory with real live sync!
          </p>
          <button
            onClick={() => setShowAdjustModal(true)}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2"
          >
            <span>Perform First Stock Adjustment</span>
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 glass-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                  <th className="pb-3">BATCH NUMBER</th>
                  <th className="pb-3">PRODUCT</th>
                  <th className="pb-3">FARM LOCATION</th>
                  <th className="pb-3">AVAILABLE</th>
                  <th className="pb-3">RESERVED</th>
                  <th className="pb-3">LOCATION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#133e2b]/60">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#133e2b]/40 transition-colors">
                    <td className="py-4 font-mono font-extrabold text-white text-sm">{item.batch_number}</td>
                    <td className="font-semibold text-emerald-300">{item.product_name}</td>
                    <td className="text-slate-300">{item.farm_name}</td>
                    <td className="font-mono text-emerald-400 font-bold text-sm">{item.quantity_available.toLocaleString()}</td>
                    <td className="font-mono text-blue-400">{item.quantity_reserved.toLocaleString()}</td>
                    <td className="font-mono text-slate-300">{item.warehouse_location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Adjust Stock Level */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-lg font-bold text-white">📦 Perform Stock Adjustment</h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjust} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Inventory Batch</label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                >
                  {inventory.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.batch_number} - {inv.product_name} ({inv.quantity_available} avail)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Adjustment Action</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-emerald-300 font-semibold"
                >
                  <option value="stock_in">➕ Receive Production Stock (Stock In)</option>
                  <option value="stock_out">➖ Dispatch Order (Stock Out)</option>
                  <option value="damage">⚠️ Log Damaged / Cracked Eggs</option>
                  <option value="waste">🗑️ Log Waste / Expiry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono text-base"
                />
              </div>

              <div className="pt-3 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
                >
                  Save Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
