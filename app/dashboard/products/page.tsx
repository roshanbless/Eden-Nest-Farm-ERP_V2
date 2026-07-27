'use client';

import React, { useState, useEffect } from 'react';
import { fetchProducts, Product, mockProducts } from '@/lib/api/commerce';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Product State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Product['category']>('eggs_bulk');
  const [unit, setUnit] = useState<Product['unit_of_measure']>('tray');
  const [price, setPrice] = useState('210');
  const [weight, setWeight] = useState('1800');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: name || 'New Egg Product',
      sku: sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      description: description || 'Fresh farm layer eggs.',
      category: category,
      unit_of_measure: unit,
      base_price: parseFloat(price) || 210,
      weight_grams: parseInt(weight) || 1800,
      is_active: true,
      stock_quantity: 500,
    };

    setProducts([...products, newProd]);
    setShowAddModal(false);
    setName('');
    setSku('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🏷️ Product Catalog & Pricing Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Product Catalog & SKUs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage egg product SKUs, packaging specifications, base prices, and channel pricing rules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product SKU
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          <div key={prod.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between glass-card-hover">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {prod.sku}
                </span>
                <span className="text-xs font-bold text-slate-400 font-mono">
                  {prod.weight_grams}g
                </span>
              </div>

              <h3 className="text-lg font-bold text-white leading-tight">{prod.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{prod.description}</p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">Unit Price</span>
                <span className="text-xl font-extrabold text-amber-400 font-mono">₹{prod.base_price}</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 font-mono capitalize">
                Per {prod.unit_of_measure}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">Add Product SKU</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jumbo Brown Layer Eggs 30-Tray"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="EGGS-JUMBO-30"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="eggs_bulk">Bulk Eggs (Tray/Carton)</option>
                    <option value="eggs_dozen">Egg Dozen Packs</option>
                    <option value="processed">Processed / Chilled Liquid</option>
                    <option value="feed">Feed</option>
                    <option value="packaging">Packaging</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Unit of Measure</label>
                  <select
                    value={unit}
                    onChange={(e: any) => setUnit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="pack_6">6-Egg Pack (6 Eggs Carton)</option>
                    <option value="pack_12">12-Egg Pack (12 Eggs Carton / Dozen)</option>
                    <option value="tray">30-Egg Tray (30 Eggs Pulp Tray)</option>
                    <option value="carton">Commercial Carton (210 Eggs / 7 Trays)</option>
                    <option value="bag_5kg">5 kg Organic Manure Zip Pouch</option>
                    <option value="bag_10kg">10 kg Organic Manure Garden Bag</option>
                    <option value="bag_50kg">50 kg Organic Manure Commercial Sack</option>
                    <option value="kg">Kilogram (Kg)</option>
                    <option value="litre">Litre (L)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Grade A Selected fresh farm eggs..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
                >
                  Save Product SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
