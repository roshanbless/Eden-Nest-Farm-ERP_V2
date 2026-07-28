'use client';

import React, { useState, useEffect } from 'react';
import { fetchProducts, Product, mockProducts } from '@/lib/api/commerce';

interface ChannelPricing {
  id: string;
  name: string;
  code: string;
  multiplier: number; // e.g. 1.05 for D2C (+5%), 0.97 for HORECA (-3%)
  description: string;
  badgeColor: string;
}

const defaultChannels: ChannelPricing[] = [
  {
    id: 'ch-d2c',
    name: 'Direct Farm-to-Consumer (D2C)',
    code: 'DIRECT_D2C',
    multiplier: 1.05,
    description: 'Farm doorstep & subscription deliveries (+5% retail premium)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'ch-retail',
    name: 'Branded Retail Packs',
    code: 'BRANDED_RETAIL',
    multiplier: 1.00,
    description: 'Modern trade supermarkets & grocery retail packs',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    id: 'ch-horeca',
    name: 'Hotels, Bakeries & Restaurants (HORECA)',
    code: 'HOTEL_BAKERY',
    multiplier: 0.97,
    description: 'Commercial kitchens, premium bakeries & restaurant supply (-3% volume tier)',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    id: 'ch-inst',
    name: 'Institutional Contracts',
    code: 'INSTITUTIONAL',
    multiplier: 0.92,
    description: 'Schools, defense hostels & govt bulk tender contracts (-8% fixed tier)',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
  {
    id: 'ch-necc',
    name: 'NECC Overflow Wholesale',
    code: 'NECC_OVERFLOW',
    multiplier: 0.88,
    description: 'National Egg Coordination Committee daily spot clearing (-12% wholesale tier)',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Dynamic Market Base Rate Control per Egg
  const [marketBaseEggPrice, setMarketBaseEggPrice] = useState<number>(8.00);
  const [channels, setChannels] = useState<ChannelPricing[]>(defaultChannels);

  // New Product State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Product['category']>('eggs_bulk');
  const [unit, setUnit] = useState<Product['unit_of_measure']>('pack_30');
  const [price, setPrice] = useState('240');
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

  const handleMarketBasePriceChange = (newRate: number) => {
    setMarketBaseEggPrice(newRate);
    setProducts((prev) =>
      prev.map((p) => {
        let count = 1;
        if (p.unit_of_measure === 'pack_6') count = 6;
        if (p.unit_of_measure === 'pack_12') count = 12;
        if (p.unit_of_measure === 'pack_30') count = 30;
        if (p.unit_of_measure === 'carton') count = 210;

        return {
          ...p,
          base_price: Math.round(count * newRate),
        };
      })
    );
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: name || 'New Egg Product SKU',
      sku: sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      description: description || 'Fresh layer eggs.',
      category: category,
      unit_of_measure: unit,
      base_price: parseFloat(price) || 240,
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
            🏷️ Dynamic NECC Market Base Price & Sales Channel Matrix
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Product Catalog & Channel Pricing</h1>
          <p className="text-xs text-slate-300 mt-1">
            Edit daily <strong>Market Base Price per Egg</strong> (NECC benchmark) and manage 5 channel tiers: <strong>Direct, Hotels/Bakeries, Institutional, Branded Retail & NECC Overflow</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product SKU
        </button>
      </div>

      {/* DYNAMIC MARKET BASE PRICE EDITOR (NECC BENCHMARK CONTROL) */}
      <div className="p-6 rounded-3xl bg-[#091b12] border border-amber-500/40 space-y-4 shadow-xl glass-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#133e2b] pb-4">
          <div>
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">NECC DAILY SPOT MARKET BENCHMARK</div>
            <h2 className="text-xl font-extrabold text-white">Editable Market Base Price Control</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjusting this base rate automatically updates SKU prices across all sales channels in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Base Rate</div>
              <div className="text-2xl font-extrabold text-amber-400 font-mono">
                ₹{marketBaseEggPrice.toFixed(2)} <span className="text-xs font-normal text-slate-300">/ Egg</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.10"
                value={marketBaseEggPrice}
                onChange={(e) => handleMarketBasePriceChange(parseFloat(e.target.value) || 8.00)}
                className="w-28 p-2.5 rounded-xl bg-slate-900 border border-amber-500/60 text-amber-300 font-mono font-extrabold text-base text-center"
              />
              <button
                onClick={() => handleMarketBasePriceChange(8.00)}
                className="px-3 py-2 rounded-xl bg-[#06140e] border border-slate-700 text-xs text-slate-300 font-bold hover:text-white"
              >
                Reset ₹8.00
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Calculated SKU Quick-Rates Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-2xl bg-[#06140e] border border-[#133e2b]">
            <div className="text-slate-400 text-[10px]">Pack of 6 (6 Eggs)</div>
            <div className="text-base font-bold text-emerald-400 font-mono">₹{Math.round(6 * marketBaseEggPrice)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#06140e] border border-[#133e2b]">
            <div className="text-slate-400 text-[10px]">Pack of 12 (12 Eggs)</div>
            <div className="text-base font-bold text-emerald-400 font-mono">₹{Math.round(12 * marketBaseEggPrice)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#06140e] border border-[#133e2b]">
            <div className="text-slate-400 text-[10px]">Pack of 30 (30 Eggs)</div>
            <div className="text-base font-bold text-emerald-400 font-mono">₹{Math.round(30 * marketBaseEggPrice)}</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#06140e] border border-[#133e2b]">
            <div className="text-slate-400 text-[10px]">Carton (210 Eggs)</div>
            <div className="text-base font-bold text-emerald-400 font-mono">₹{Math.round(210 * marketBaseEggPrice).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* SALES CHANNEL MIX & PRICING MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Sales Channel Mix & Tier Pricing Matrix</h2>
          <span className="text-xs text-amber-400 font-mono font-semibold">5 Active Channels Configured</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {channels.map((ch) => {
            const channelEggRate = (marketBaseEggPrice * ch.multiplier).toFixed(2);
            return (
              <div key={ch.id} className="p-4 rounded-2xl bg-[#091b12] border border-[#133e2b] space-y-3 glass-card">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${ch.badgeColor}`}>
                    {ch.code}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-xs leading-snug">{ch.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">{ch.description}</p>
                </div>

                <div className="pt-2 border-t border-[#133e2b]/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">Calculated Rate</span>
                  <span className="text-sm font-extrabold text-amber-400 font-mono">₹{channelEggRate} <span className="text-[9px] text-slate-400 font-normal">/ egg</span></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Active Product SKUs ({products.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div key={prod.id} className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4 flex flex-col justify-between glass-card">
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

              <div className="pt-4 border-t border-[#133e2b]/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">Base Price</span>
                  <span className="text-xl font-extrabold text-amber-400 font-mono">₹{prod.base_price}</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-xl bg-[#06140e] text-slate-300 border border-slate-700 font-mono font-semibold">
                  Per {prod.unit_of_measure.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product SKU Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-lg font-bold text-white">Add New Product SKU</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product SKU Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pack of 30 (30 Eggs)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SKU Code</label>
                  <input
                    type="text"
                    placeholder="e.g. EGGS-PACK-30"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit of Measure</label>
                  <select
                    value={unit}
                    onChange={(e: any) => setUnit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-semibold text-emerald-300"
                  >
                    <option value="pack_6">Pack of 6 (6 Eggs)</option>
                    <option value="pack_12">Pack of 12 (12 Eggs)</option>
                    <option value="pack_30">Pack of 30 (30 Eggs / Tray)</option>
                    <option value="carton">Commercial Carton (210 Eggs)</option>
                    <option value="bag_5kg">5 kg Organic Manure Zip Pouch</option>
                    <option value="bag_10kg">10 kg Organic Manure Garden Bag</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-amber-500/60 text-amber-300 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Weight (Grams)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Fresh Grade A organic farm layer eggs..."
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#133e2b]">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white">Cancel</button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md"
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
