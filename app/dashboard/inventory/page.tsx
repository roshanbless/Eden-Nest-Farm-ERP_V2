'use client';

import React, { useState, useEffect } from 'react';
import { fetchInventory, fetchProducts, InventoryItem, Product, mockInventory, mockProducts } from '@/lib/api/commerce';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // Form State
  const [selectedItem, setSelectedItem] = useState(mockInventory[0].id);
  const [adjustType, setAdjustType] = useState<'stock_in' | 'stock_out' | 'waste' | 'damage'>('stock_in');
  const [quantity, setQuantity] = useState('100');
  const [reason, setReason] = useState('Production Batch Receiving');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const invData = await fetchInventory();
      const prodData = await fetchProducts();
      setInventory(invData);
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
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Inventory & Stock Tracking</h1>
          <p className="text-xs text-slate-400 mt-1">
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
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Stock Available</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{totalAvailable.toLocaleString()} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="text-xs text-slate-500 mt-1">Ready for dispatch & order allocation</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reserved for Active Orders</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1">{totalReserved.toLocaleString()} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="text-xs text-slate-500 mt-1">Committed to confirmed sales orders</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Damaged / Waste Logged</div>
          <div className="text-3xl font-extrabold text-red-400 mt-1">{totalDamaged} <span className="text-xs text-slate-400 font-normal">units</span></div>
          <div className="text-xs text-slate-500 mt-1">0.7% Inventory Breakage Ratio</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Warehouse Rack Locations</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">4 Cold Racks</div>
          <div className="text-xs text-slate-500 mt-1">Chilled storage 14°C maintained</div>
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
            <div key={prod.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 glass-card-hover">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    {prod.sku}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-tight">{prod.name}</h3>
                </div>
                <div className="text-xl font-extrabold text-amber-400 font-mono">₹{prod.base_price}</div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{prod.description}</p>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Stock Level:</span>
                <span className="font-bold text-white font-mono">{prod.stock_quantity.toLocaleString()} {prod.unit_of_measure}s</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warehouse Stock & Batch Items Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Batch Stock Inventory & Racks</h3>
            <p className="text-xs text-slate-400">Batch-level stock reservation, rack allocation, and recount status</p>
          </div>
          <span className="text-xs text-slate-400">{inventory.length} Active Batches</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">PRODUCT / BATCH</th>
                <th className="pb-3">FARM SITE</th>
                <th className="pb-3">WAREHOUSE RACK</th>
                <th className="pb-3">AVAILABLE</th>
                <th className="pb-3">RESERVED</th>
                <th className="pb-3">DAMAGED</th>
                <th className="pb-3 text-right">LAST COUNTED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-white">{item.product_name}</div>
                    <div className="text-[10px] font-mono text-emerald-400">{item.batch_number}</div>
                  </td>
                  <td className="text-slate-300 font-medium">{item.farm_name}</td>
                  <td className="text-slate-300 font-mono">{item.warehouse_location}</td>
                  <td className="font-extrabold text-emerald-400 font-mono">{item.quantity_available.toLocaleString()}</td>
                  <td className="font-bold text-blue-400 font-mono">{item.quantity_reserved.toLocaleString()}</td>
                  <td className="font-bold text-red-400 font-mono">{item.quantity_damaged}</td>
                  <td className="text-right text-slate-400 font-mono">
                    {new Date(item.last_counted).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Perform Stock Adjustment</h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjust} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Batch / Inventory Item</label>
                <select
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {inventory.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.batch_number} - {i.product_name} ({i.quantity_available} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Adjustment Type</label>
                  <select
                    value={adjustType}
                    onChange={(e: any) => setAdjustType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="stock_in">Stock-In (+) Receiving</option>
                    <option value="stock_out">Stock-Out (-) Dispatch</option>
                    <option value="damage">Damage / Cracked Log</option>
                    <option value="waste">Spill / Expiry Waste</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Quantity Change</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Reason / Reference Notes</label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Production Batch Receiving or Transit Damage..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
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
