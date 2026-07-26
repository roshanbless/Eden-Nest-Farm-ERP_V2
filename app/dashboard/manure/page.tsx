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
  pack5kgCount: number;
  pack10kgCount: number;
  bagCount50kg: number;
  availableForSale: boolean;
}

interface ManureSale {
  id: string;
  saleNumber: string;
  buyerName: string;
  buyerType: 'Tea Estate' | 'Rubber Plantation' | 'Cardamom Farmer' | 'Retail Nursery' | 'Home Garden Subscriber';
  packageType: '5 kg Retail Pouch' | '10 kg Retail Bag' | '50 kg Commercial Sack' | 'Bulk Ton Truckload';
  quantityUnits: number;
  unitPrice: number;
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
    pack5kgCount: 420,
    pack10kgCount: 280,
    bagCount50kg: 190,
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
    pack5kgCount: 650,
    pack10kgCount: 410,
    bagCount50kg: 210,
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
    pack5kgCount: 0,
    pack10kgCount: 0,
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
    packageType: '50 kg Commercial Sack',
    quantityUnits: 500,
    unitPrice: 350,
    totalAmount: 175000,
    paymentStatus: 'Paid',
    dispatchDate: '2026-07-21',
  },
  {
    id: 'SALE-902',
    saleNumber: 'MN-ORD-8822',
    buyerName: 'Green Leaf Nursery & Garden Center',
    buyerType: 'Retail Nursery',
    packageType: '5 kg Retail Pouch',
    quantityUnits: 200,
    unitPrice: 150,
    totalAmount: 30000,
    paymentStatus: 'Paid',
    dispatchDate: '2026-07-22',
  },
  {
    id: 'SALE-903',
    saleNumber: 'MN-ORD-8823',
    buyerName: 'Kochi Urban Organic Gardeners',
    buyerType: 'Home Garden Subscriber',
    packageType: '10 kg Retail Bag',
    quantityUnits: 150,
    unitPrice: 280,
    totalAmount: 42000,
    paymentStatus: 'Paid',
    dispatchDate: '2026-07-24',
  },
  {
    id: 'SALE-904',
    saleNumber: 'MN-ORD-8824',
    buyerName: 'Highrange Spices & Cardamom Co',
    buyerType: 'Cardamom Farmer',
    packageType: 'Bulk Ton Truckload',
    quantityUnits: 10,
    unitPrice: 4500,
    totalAmount: 45000,
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
  const [pouch5kg, setPouch5kg] = useState('200');
  const [bag10kg, setBag10kg] = useState('150');
  const [sack50kg, setSack50kg] = useState('100');

  // Form states for New Sale
  const [buyerName, setBuyerName] = useState('');
  const [buyerType, setBuyerType] = useState<'Tea Estate' | 'Rubber Plantation' | 'Cardamom Farmer' | 'Retail Nursery' | 'Home Garden Subscriber'>('Retail Nursery');
  const [packageType, setPackageType] = useState<'5 kg Retail Pouch' | '10 kg Retail Bag' | '50 kg Commercial Sack' | 'Bulk Ton Truckload'>('5 kg Retail Pouch');
  const [units, setUnits] = useState('50');
  const [unitPrice, setUnitPrice] = useState('150');

  const totalRawStock = mockManureBatches.reduce((acc, b) => acc + b.rawWeightTons, 0);
  const total5kgPouches = mockManureBatches.reduce((acc, b) => acc + b.pack5kgCount, 0);
  const total10kgBags = mockManureBatches.reduce((acc, b) => acc + b.pack10kgCount, 0);
  const total50kgSacks = mockManureBatches.reduce((acc, b) => acc + b.bagCount50kg, 0);
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
            Manage hen manure collection, curing stages, <strong>5 kg & 10 kg retail packs</strong>, 50 kg commercial sacks, and B2B/Retail distribution.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2 rounded-xl bg-[#0a2017] border border-emerald-500/40 text-emerald-300 font-semibold text-xs hover:bg-[#133e2b] transition-all flex items-center gap-2"
          >
            <span>🚜 Log Harvest & Bagging</span>
          </button>
          <button
            onClick={() => setShowSaleModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/40 transition-all flex items-center gap-2"
          >
            <span>💰 Record Retail/B2B Sale</span>
          </button>
        </div>
      </div>

      {/* Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-[#0a2017] border border-emerald-500/30 space-y-1.5 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Harvest Collected</span>
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">🌱</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalRawStock.toFixed(1)} <span className="text-xs font-normal text-emerald-300">Tons</span></div>
          <div className="text-[11px] text-emerald-400 font-semibold">Raw & Cured Litter</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a2017] border border-emerald-500/40 space-y-1.5 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>5 kg Retail Pouches</span>
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">🛍️</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{total5kgPouches} <span className="text-xs font-normal text-emerald-300 font-mono">Packs</span></div>
          <div className="text-[11px] text-emerald-400 font-semibold">₹150 / 5kg Retail Pack</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a2017] border border-amber-500/30 space-y-1.5 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>10 kg Garden Bags</span>
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-300">🎒</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{total10kgBags} <span className="text-xs font-normal text-amber-300 font-mono">Bags</span></div>
          <div className="text-[11px] text-amber-400 font-semibold">₹280 / 10kg Garden Pack</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a2017] border border-blue-500/30 space-y-1.5 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>50 kg Sacks</span>
            <span className="p-1 rounded-lg bg-blue-500/20 text-blue-300">📦</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{total50kgSacks} <span className="text-xs font-normal text-blue-300 font-mono">Sacks</span></div>
          <div className="text-[11px] text-blue-400 font-semibold">₹350 / 50kg B2B Sack</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a2017] border border-purple-500/30 space-y-1.5 glass-card">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Total Revenue</span>
            <span className="p-1 rounded-lg bg-purple-500/20 text-purple-300">💵</span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">₹{(totalSalesRevenue / 100000).toFixed(2)} <span className="text-xs font-normal text-purple-300">Lakhs</span></div>
          <div className="text-[11px] text-emerald-400 font-semibold">+22.4% Profit Margin</div>
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
          📦 Manure Curing & Packaging Inventory ({mockManureBatches.length})
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeTab === 'sales'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🚛 B2B & Retail Orders ({mockManureSales.length})
        </button>
      </div>

      {/* Tab 1: Manure Inventory & Curing Batches */}
      {activeTab === 'inventory' && (
        <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4 glass-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Manure Collection & Multi-Pack Inventory</h3>
            <span className="text-xs text-amber-400 font-mono">Retail Packs: 5kg Pouch | 10kg Bag | 50kg Sack</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                  <th className="pb-3">BATCH CODE / SHED</th>
                  <th className="pb-3">COLLECTION DATE</th>
                  <th className="pb-3">RAW HARVEST</th>
                  <th className="pb-3">CURING STAGE</th>
                  <th className="pb-3">MOISTURE</th>
                  <th className="pb-3">RETAIL 5KG PACKS</th>
                  <th className="pb-3">RETAIL 10KG BAGS</th>
                  <th className="pb-3">COMMERCIAL 50KG</th>
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
                    <td className="text-emerald-300 font-bold font-mono">{b.pack5kgCount} Pouches</td>
                    <td className="text-amber-300 font-bold font-mono">{b.pack10kgCount} Bags</td>
                    <td className="text-blue-300 font-bold font-mono">{b.bagCount50kg} Sacks</td>
                    <td className="text-right">
                      {b.availableForSale ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          ✓ Available for Dispatch
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px]">
                          ⏳ In Curing Pit
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

      {/* Tab 2: B2B & Retail Manure Sales */}
      {activeTab === 'sales' && (
        <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4 glass-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">B2B Planters & Retail Nursery Sales Orders</h3>
            <span className="text-xs text-emerald-400 font-mono">Retail Pricing: 5kg @ ₹150 | 10kg @ ₹280 | 50kg @ ₹350</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                  <th className="pb-3">ORDER / BUYER</th>
                  <th className="pb-3">BUYER CATEGORY</th>
                  <th className="pb-3">PACKAGING TYPE</th>
                  <th className="pb-3">QUANTITY</th>
                  <th className="pb-3">UNIT PRICE</th>
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
                    <td>
                      <span className="font-semibold text-emerald-300 text-[11px]">{s.packageType}</span>
                    </td>
                    <td className="text-white font-bold font-mono">{s.quantityUnits} Packs</td>
                    <td className="text-slate-300 font-mono">₹{s.unitPrice.toLocaleString()}</td>
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

      {/* Modal: Log Harvest & Bagging */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-lg font-bold text-white">🚜 Log Harvest & Packaging Breakdown</h3>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Raw Weight (Tons)</label>
                  <input
                    type="number"
                    value={rawWeight}
                    onChange={(e) => setRawWeight(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Processing Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  >
                    <option value="Raw Litter">Raw Litter (Fresh Harvest)</option>
                    <option value="Fermenting">Fermenting (Curing Pit)</option>
                    <option value="Cured Compost">Cured Compost (Moisture Controlled)</option>
                    <option value="Bagged & Ready">Bagged & Ready (Multi-Pack)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#06140e] border border-[#133e2b] space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase">Packaging Breakdown</div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">5 kg Pouches</label>
                    <input
                      type="number"
                      value={pouch5kg}
                      onChange={(e) => setPouch5kg(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">10 kg Garden Bags</label>
                    <input
                      type="number"
                      value={bag10kg}
                      onChange={(e) => setBag10kg(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">50 kg Sacks</label>
                    <input
                      type="number"
                      value={sack50kg}
                      onChange={(e) => setSack50kg(e.target.value)}
                      className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#133e2b]">
              <button onClick={() => setShowLogModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs">Cancel</button>
              <button
                onClick={() => {
                  alert(`Logged ${rawWeight} Tons harvest with ${pouch5kg} (5kg pouches), ${bag10kg} (10kg bags), and ${sack50kg} (50kg sacks)!`);
                  setShowLogModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
              >
                Save Packaging Inventory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Retail / B2B Manure Sale */}
      {showSaleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-lg font-bold text-white">💰 Record Retail & B2B Manure Order</h3>
              <button onClick={() => setShowSaleModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Buyer / Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Green Leaf Nursery / John Doe"
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
                    <option value="Retail Nursery">Retail Nursery</option>
                    <option value="Home Garden Subscriber">Home Garden Subscriber</option>
                    <option value="Tea Estate">Tea Estate</option>
                    <option value="Rubber Plantation">Rubber Plantation</option>
                    <option value="Cardamom Farmer">Cardamom Farmer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Package Selection</label>
                  <select
                    value={packageType}
                    onChange={(e) => {
                      const pType = e.target.value as any;
                      setPackageType(pType);
                      if (pType === '5 kg Retail Pouch') setUnitPrice('150');
                      else if (pType === '10 kg Retail Bag') setUnitPrice('280');
                      else if (pType === '50 kg Commercial Sack') setUnitPrice('350');
                      else if (pType === 'Bulk Ton Truckload') setUnitPrice('4300');
                    }}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-semibold text-emerald-300"
                  >
                    <option value="5 kg Retail Pouch">5 kg Retail Pouch (₹150)</option>
                    <option value="10 kg Retail Bag">10 kg Retail Bag (₹280)</option>
                    <option value="50 kg Commercial Sack">50 kg Commercial Sack (₹350)</option>
                    <option value="Bulk Ton Truckload">Bulk Ton Truckload (₹4,300/Ton)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quantity (Units / Tons)</label>
                  <input
                    type="number"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#06140e] border border-[#133e2b] text-right">
                <span className="text-slate-400 text-[10px]">Total Order Price: </span>
                <span className="text-amber-400 font-bold text-sm font-mono">₹{(parseFloat(units || '0') * parseFloat(unitPrice || '0')).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#133e2b]">
              <button onClick={() => setShowSaleModal(false)} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs">Cancel</button>
              <button
                onClick={() => {
                  alert(`Recorded sale of ${units} x ${packageType} to ${buyerName || 'Customer'}!`);
                  setShowSaleModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Save Order & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
