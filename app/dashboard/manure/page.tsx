'use client';

import React, { useState } from 'react';

interface ManureBatch {
  id: string;
  batchNumber: string;
  farmShed: string;
  collectionDate: string;
  rawWeightTons: number;
  curingStage: 'Raw Litter' | 'Fermenting' | 'Cured Compost' | 'Bagged & Ready';
  moisturePercentage: number;
  bagCount50kg: number;
  availableForSale: boolean;
}

interface ManureSale {
  id: string;
  saleNumber: string;
  buyerName: string;
  buyerType: 'Tea Estate' | 'Rubber Plantation' | 'Cardamom Farmer' | 'Retail Nursery';
  quantityTons: number;
  bagCount50kg: number;
  pricePerTon: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  dispatchDate: string;
}

const mockManureBatches: ManureBatch[] = [
  {
    id: 'MN-101',
    batchNumber: 'MN-2026-0720-A',
    farmShed: 'Eden Nest HQ (Shed A Layer)',
    collectionDate: '2026-07-20',
    rawWeightTons: 14.5,
    curingStage: 'Bagged & Ready',
    moisturePercentage: 14.2,
    bagCount50kg: 290,
    availableForSale: true,
  },
  {
    id: 'MN-102',
    batchNumber: 'MN-2026-0722-B',
    farmShed: 'Eden Nest HQ (Shed B Layer)',
    collectionDate: '2026-07-22',
    rawWeightTons: 18.2,
    curingStage: 'Cured Compost',
    moisturePercentage: 18.5,
    bagCount50kg: 364,
    availableForSale: true,
  },
  {
    id: 'MN-103',
    batchNumber: 'MN-2026-0724-C',
    farmShed: 'Valley Site (Shed C Pullet)',
    collectionDate: '2026-07-24',
    rawWeightTons: 12.0,
    curingStage: 'Fermenting',
    moisturePercentage: 28.0,
    bagCount50kg: 0,
    availableForSale: false,
  },
];

const mockManureSales: ManureSale[] = [
  {
    id: 'SALE-901',
    saleNumber: 'MN-ORD-8821',
    buyerName: 'Munnar Tea Estates Ltd',
    buyerType: 'Tea Estate',
    quantityTons: 25.0,
    bagCount50kg: 500,
    pricePerTon: 4200,
    totalAmount: 105000,
    paymentStatus: 'Paid',
    dispatchDate: '2026-07-21',
  },
  {
    id: 'SALE-902',
    saleNumber: 'MN-ORD-8822',
    buyerName: 'Highrange Spices & Cardamom Co',
    buyerType: 'Cardamom Farmer',
    quantityTons: 10.0,
    bagCount50kg: 200,
    pricePerTon: 4500,
    totalAmount: 45000,
    paymentStatus: 'Paid',
    dispatchDate: '2026-07-23',
  },
  {
    id: 'SALE-903',
    saleNumber: 'MN-ORD-8823',
    buyerName: 'Kottayam Rubber Planters Coop',
    buyerType: 'Rubber Plantation',
    quantityTons: 15.0,
    bagCount50kg: 300,
    pricePerTon: 4300,
    totalAmount: 64500,
    paymentStatus: 'Pending',
    dispatchDate: '2026-07-25',
  },
];

export default function ManurePage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'sales'>('inventory');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);

  // Form states for Logging Collection
  const [shed, setShed] = useState('Eden Nest HQ (Shed A Layer)');
  const [rawWeight, setRawWeight] = useState('15');
  const [stage, setStage] = useState<'Raw Litter' | 'Fermenting' | 'Cured Compost' | 'Bagged & Ready'>('Bagged & Ready');

  // Form states for New Sale
  const [buyerName, setBuyerName] = useState('');
  const [buyerType, setBuyerType] = useState<'Tea Estate' | 'Rubber Plantation' | 'Cardamom Farmer' | 'Retail Nursery'>('Tea Estate');
  const [saleTons, setSaleTons] = useState('10');
  const [pricePerTon, setPricePerTon] = useState('4500');

  const totalRawStock = mockManureBatches.reduce((acc, b) => acc + b.rawWeightTons, 0);
  const readyStockBags = mockManureBatches.reduce((acc, b) => acc + b.bagCount50kg, 0);
  const totalSalesRevenue = mockManureSales.reduce((acc, s) => acc + s.totalAmount, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🌱 Organic Manure & Bio-Fertilizer Business Module
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Poultry Manure & Bio-Compost Operations</h1>
          <p className="text-xs text-slate-300 mt-1">
            Track hen manure collection, curing stages, 50kg bagging inventory, and B2B sales to tea, rubber & cardamom estates in Kerala.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2 rounded-xl bg-[#0a2017] border border-emerald-500/40 text-emerald-300 font-semibold text-xs hover:bg-[#133e2b] transition-all flex items-center gap-2"
          >
            <span>🚜 Log Manure Harvest</span>
          </button>
          <button
            onClick={() => setShowSaleModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/40 transition-all flex items-center gap-2"
          >
            <span>💰 Record B2B Manure Sale</span>
          </button>
        </div>
      </div>

      {/* Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-emerald-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Total Stock Collected</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">🌱</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{totalRawStock.toFixed(1)} <span className="text-xs font-normal text-emerald-300">Tons</span></div>
          <div className="text-xs text-emerald-400 font-semibold">Processed across 3 sheds</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-amber-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Ready 50kg Bags</span>
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">🛍️</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{readyStockBags} <span className="text-xs font-normal text-amber-300">Bags</span></div>
          <div className="text-xs text-amber-400 font-semibold">Cured & nitrogen-rich</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-blue-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Monthly Manure Sales</span>
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">🚚</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">50.0 <span className="text-xs font-normal text-blue-300">Tons</span></div>
          <div className="text-xs text-blue-400 font-semibold">Dispatched to 3 B2B Planters</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-purple-500/30 space-y-2 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Secondary Revenue</span>
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">💵</span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">₹{(totalSalesRevenue / 100000).toFixed(2)} <span className="text-xs font-normal text-purple-300">Lakhs</span></div>
          <div className="text-xs text-emerald-400 font-semibold">+18.5% High Margin Profit</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-[#133e2b] flex items-center gap-6">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'inventory'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📦 Manure Curing & Stock Batches ({mockManureBatches.length})
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'sales'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🚛 B2B Planter Sales & Dispatches ({mockManureSales.length})
        </button>
      </div>

      {/* Tab 1: Manure Inventory & Curing Batches */}
      {activeTab === 'inventory' && (
        <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4 glass-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Manure Collection & Fermentation Batches</h3>
            <span className="text-xs text-amber-400 font-mono">NPK Ratio: 3-2-2 High Organic Content</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                  <th className="pb-3">BATCH CODE / SHED</th>
                  <th className="pb-3">COLLECTION DATE</th>
                  <th className="pb-3">RAW WEIGHT</th>
                  <th className="pb-3">CURING STAGE</th>
                  <th className="pb-3">MOISTURE %</th>
                  <th className="pb-3">50KG BAGS</th>
                  <th className="pb-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#133e2b]/60">
                {mockManureBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-[#133e2b]/40 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-white text-sm font-mono">{b.batchNumber}</div>
                      <div className="text-[10px] text-slate-400">{b.farmShed}</div>
                    </td>
                    <td className="text-slate-300 font-mono">{b.collectionDate}</td>
                    <td className="text-white font-bold font-mono">{b.rawWeightTons} Tons</td>
                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.curingStage === 'Bagged & Ready'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : b.curingStage === 'Cured Compost'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {b.curingStage}
                      </span>
                    </td>
                    <td className="text-slate-300 font-mono">{b.moisturePercentage}%</td>
                    <td className="text-white font-bold font-mono">{b.bagCount50kg} Bags</td>
                    <td className="text-right">
                      {b.availableForSale ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          ✓ Available for B2B Sale
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                          ⏳ In Fermentation
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: B2B Manure Sales */}
      {activeTab === 'sales' && (
        <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4 glass-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">B2B Manure Orders & Dispatch Telemetry</h3>
            <span className="text-xs text-emerald-400 font-mono">Avg Price: ₹4,300 / Ton</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                  <th className="pb-3">ORDER / BUYER</th>
                  <th className="pb-3">CATEGORY</th>
                  <th className="pb-3">QUANTITY</th>
                  <th className="pb-3">PRICE / TON</th>
                  <th className="pb-3">TOTAL AMOUNT</th>
                  <th className="pb-3">DISPATCH DATE</th>
                  <th className="pb-3 text-right">PAYMENT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#133e2b]/60">
                {mockManureSales.map((s) => (
                  <tr key={s.id} className="hover:bg-[#133e2b]/40 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-white text-sm">{s.buyerName}</div>
                      <div className="text-[10px] text-amber-400 font-mono">{s.saleNumber}</div>
                    </td>
                    <td>
                      <span className="px-2 py-0.5 rounded-full bg-[#06140e] text-slate-300 border border-slate-700 text-[10px]">
                        {s.buyerType}
                      </span>
                    </td>
                    <td className="text-white font-bold font-mono">{s.quantityTons} Tons ({s.bagCount50kg} Bags)</td>
                    <td className="text-slate-300 font-mono">₹{s.pricePerTon.toLocaleString()}</td>
                    <td className="text-emerald-400 font-bold font-mono text-sm">₹{s.totalAmount.toLocaleString()}</td>
                    <td className="text-slate-300 font-mono">{s.dispatchDate}</td>
                    <td className="text-right">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          s.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {s.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Log Manure Collection */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-lg font-bold text-white">🚜 Log Manure Harvest Collection</h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Farm Shed</label>
                <select
                  value={shed}
                  onChange={(e) => setShed(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                >
                  <option value="Eden Nest HQ (Shed A Layer)">Eden Nest HQ (Shed A Layer)</option>
                  <option value="Eden Nest HQ (Shed B Layer)">Eden Nest HQ (Shed B Layer)</option>
                  <option value="Valley Site (Shed C Pullet)">Valley Site (Shed C Pullet)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Raw Harvest Weight (Tons)</label>
                <input
                  type="number"
                  value={rawWeight}
                  onChange={(e) => setRawWeight(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Curing / Processing Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                >
                  <option value="Raw Litter">Raw Litter (Fresh Harvest)</option>
                  <option value="Fermenting">Fermenting (Curing Pit)</option>
                  <option value="Cured Compost">Cured Compost (Moisture Controlled)</option>
                  <option value="Bagged & Ready">Bagged & Ready (50kg Bags Packed)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#133e2b]">
              <button onClick={() => setShowLogModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs">Cancel</button>
              <button
                onClick={() => {
                  alert(`Logged ${rawWeight} Tons of manure harvest for ${shed}!`);
                  setShowLogModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
              >
                Save Manure Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New B2B Manure Sale */}
      {showSaleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-lg font-bold text-white">💰 Record B2B Manure Sale</h3>
              <button onClick={() => setShowSaleModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Buyer / Estate Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wayanad Organic Tea Estate"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Buyer Sector</label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  >
                    <option value="Tea Estate">Tea Estate</option>
                    <option value="Rubber Plantation">Rubber Plantation</option>
                    <option value="Cardamom Farmer">Cardamom Farmer</option>
                    <option value="Retail Nursery">Retail Nursery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quantity (Tons)</label>
                  <input
                    type="number"
                    value={saleTons}
                    onChange={(e) => setSaleTons(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Price per Ton (₹)</label>
                <input
                  type="number"
                  value={pricePerTon}
                  onChange={(e) => setPricePerTon(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#06140e] border border-[#133e2b] text-right">
                <span className="text-slate-400 text-[10px]">Total Order Amount: </span>
                <span className="text-amber-400 font-bold text-sm">₹{(parseFloat(saleTons || '0') * parseFloat(pricePerTon || '0')).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#133e2b]">
              <button onClick={() => setShowSaleModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs">Cancel</button>
              <button
                onClick={() => {
                  alert(`Recorded sale of ${saleTons} Tons to ${buyerName || 'Buyer'}!`);
                  setShowSaleModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Save Manure Dispatch Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
