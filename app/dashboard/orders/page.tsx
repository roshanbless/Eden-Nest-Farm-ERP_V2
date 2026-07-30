'use client';

import React, { useState, useEffect } from 'react';
import { fetchOrders, saveOrderToSupabase, Order, mockProducts, Product } from '@/lib/api/commerce';
import { useLanguage } from '@/lib/i18n/languageContext';

interface ChannelPricing {
  id: string;
  name: string;
  code: string;
  multiplier: number;
}

const salesChannels: ChannelPricing[] = [
  { id: 'ch-d2c', name: 'Direct Farm-to-Consumer (D2C)', code: 'DIRECT_D2C', multiplier: 1.05 },
  { id: 'ch-retail', name: 'Branded Retail Packs', code: 'BRANDED_RETAIL', multiplier: 1.00 },
  { id: 'ch-horeca', name: 'Hotels, Bakeries & Restaurants (HORECA)', code: 'HOTEL_BAKERY', multiplier: 0.97 },
  { id: 'ch-inst', name: 'Institutional Contracts', code: 'INSTITUTIONAL', multiplier: 0.92 },
  { id: 'ch-necc', name: 'NECC Overflow Wholesale', code: 'NECC_OVERFLOW', multiplier: 0.88 },
];

export default function OrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrderPrice, setEditingOrderPrice] = useState<Order | null>(null);

  // New Order Form State
  const [customerName, setCustomerName] = useState('Metro Fresh Mart');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 22110');
  const [orderType, setOrderType] = useState<'one_time' | 'subscription' | 'bulk_order'>('bulk_order');
  const [selectedChannelId, setSelectedChannelId] = useState('ch-d2c');
  const [packagingMode, setPackagingMode] = useState<'single' | 'pack' | 'bulk'>('pack');
  const [selectedProductId, setSelectedProductId] = useState('prod-00');
  
  // Dynamic Base Rate per Egg & Editable Unit Price
  const [marketBaseEggPrice, setMarketBaseEggPrice] = useState<number>(8.00);
  const [editableUnitPrice, setEditableUnitPrice] = useState('50.40');
  const [quantity, setQuantity] = useState('1');
  const [shippingCostInput, setShippingCostInput] = useState('0');
  const [deliveryAddress, setDeliveryAddress] = useState('Indiranagar, Bengaluru 560038');
  const [discount, setDiscount] = useState('0');

  // Edit Existing Order Price Form State
  const [modUnitPrice, setModUnitPrice] = useState('');
  const [modDiscount, setModDiscount] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Recalculate default price when channel, packaging mode, or product changes
  const updateCalculatedRate = (channelId: string, mode: 'single' | 'pack' | 'bulk', productId: string) => {
    setSelectedChannelId(channelId);
    setPackagingMode(mode);
    setSelectedProductId(productId);

    const channel = salesChannels.find((c) => c.id === channelId) || salesChannels[0];
    const prod = mockProducts.find((p) => p.id === productId) || mockProducts[0];
    const ratePerEgg = marketBaseEggPrice * channel.multiplier;

    let computedPrice = ratePerEgg;
    if (mode === 'single') {
      computedPrice = ratePerEgg;
    } else if (mode === 'pack') {
      let eggsInPack = 6;
      if (prod.sku === 'EGGS-PACK-12') eggsInPack = 12;
      if (prod.sku === 'EGGS-PACK-30') eggsInPack = 30;
      if (prod.sku === 'EGGS-CARTON-210') eggsInPack = 210;
      computedPrice = ratePerEgg * eggsInPack;
    } else if (mode === 'bulk') {
      computedPrice = ratePerEgg * 210; // Wholesale Carton
    }

    setEditableUnitPrice(computedPrice.toFixed(2));
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const prod = mockProducts.find((p) => p.id === selectedProductId) || mockProducts[0];
    const ch = salesChannels.find((c) => c.id === selectedChannelId) || salesChannels[0];

    const unitPriceNum = parseFloat(editableUnitPrice) || 8.0;
    const qtyNum = parseInt(quantity) || 1;
    const shipNum = parseFloat(shippingCostInput) || 0;
    const discNum = parseFloat(discount) || 0;

    const subtotalCalc = unitPriceNum * qtyNum;
    const totalCalc = Math.max(0, subtotalCalc + shipNum - discNum);

    const modeLabel = packagingMode === 'single' ? 'Single Loose' : packagingMode === 'pack' ? 'Pack Tray' : 'Wholesale Bulk';

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      order_number: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: `cust-${Date.now()}`,
      customer_name: customerName,
      customer_phone: customerPhone,
      order_type: orderType,
      source: 'sales_team',
      scheduled_delivery_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      delivery_address: deliveryAddress,
      subtotal: subtotalCalc,
      tax: Math.round(subtotalCalc * 0.05),
      shipping_cost: shipNum,
      discount: discNum,
      total: totalCalc,
      order_status: 'pending',
      payment_status: 'paid',
      created_at: new Date().toISOString(),
      items: [
        {
          id: `item-${Date.now()}`,
          product_id: prod.id,
          product_name: `${prod.name} [${ch.name} - ${modeLabel}]`,
          quantity: qtyNum,
          unit_price: unitPriceNum,
          line_total: subtotalCalc,
        },
      ],
    };

    setOrders([newOrder, ...orders]);
    setShowCreateModal(false);

    // Save to Dual Persistence (LocalStorage + Supabase DB)
    await saveOrderToSupabase(newOrder);
  };

  const openPriceEditModal = (order: Order) => {
    setEditingOrderPrice(order);
    const item = order.items?.[0];
    setModUnitPrice(item?.unit_price ? item.unit_price.toString() : '50.40');
    setModDiscount(order.discount ? order.discount.toString() : '0');
  };

  const handleSavePriceModification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrderPrice) return;

    const newPrice = parseFloat(modUnitPrice) || 1;
    const newDisc = parseFloat(modDiscount) || 0;

    let updatedTargetObj: Order | null = null;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === editingOrderPrice.id) {
          const qty = o.items?.[0]?.quantity || 1;
          const subtotal = newPrice * qty;
          const newTotal = Math.max(0, subtotal + (o.shipping_cost || 0) - newDisc);

          const updatedItems = o.items?.map((item, idx) =>
            idx === 0
              ? { ...item, unit_price: newPrice, line_total: subtotal }
              : item
          );

          updatedTargetObj = {
            ...o,
            subtotal: subtotal,
            discount: newDisc,
            total: newTotal,
            items: updatedItems,
          };
          return updatedTargetObj;
        }
        return o;
      })
    );

    setEditingOrderPrice(null);

    if (updatedTargetObj) {
      await saveOrderToSupabase(updatedTargetObj);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true;
    return o.order_status === activeTab;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.order_status === 'pending').length;
  const deliveredCount = orders.filter((o) => o.order_status === 'delivered').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🛒 B2B & D2C Sales Order Processing
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t.createOrder}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Create and track orders with single, tray pack & bulk wholesale options with 100% editable unit prices.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          ➕ Create Sales Order
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-emerald-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Sales Revenue</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">From {orders.length} total orders</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-amber-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Pending Confirmation</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">{pendingCount}</div>
          <div className="text-xs text-amber-400 font-semibold mt-1">Awaiting dispatch</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-blue-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Delivered Orders</div>
          <div className="text-3xl font-extrabold text-blue-400 font-mono mt-1">{deliveredCount}</div>
          <div className="text-xs text-blue-400 font-semibold mt-1">Completed doorstep & B2B drops</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-purple-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Base Egg Rate</div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono mt-1">₹{marketBaseEggPrice.toFixed(2)}</div>
          <div className="text-xs text-purple-400 font-semibold mt-1">Editable NECC base rate per egg</div>
        </div>
      </div>

      {/* Fresh Clean State / Orders Table */}
      {orders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-2xl">
            🛒
          </div>
          <h3 className="text-xl font-bold text-white">No Sales Orders Created Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Demo sample orders have been cleared. Click below to create your first order with editable rates & live database sync!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2"
          >
            <span>➕ Create Your First Sales Order</span>
          </button>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 glass-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                  <th className="pb-3">ORDER #</th>
                  <th className="pb-3">CUSTOMER</th>
                  <th className="pb-3">PRODUCTS & TIER</th>
                  <th className="pb-3">SUBTOTAL</th>
                  <th className="pb-3">NET TOTAL</th>
                  <th className="pb-3">STATUS</th>
                  <th className="pb-3 text-right">EDIT PRICE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#133e2b]/60">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#133e2b]/40 transition-colors">
                    <td className="py-4">
                      <div className="font-extrabold text-white font-mono text-sm">{ord.order_number}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ord.created_at.split('T')[0]}</div>
                    </td>
                    <td>
                      <div className="font-bold text-white text-sm">{ord.customer_name}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{ord.delivery_address}</div>
                    </td>
                    <td className="font-semibold text-emerald-300">
                      {ord.items?.[0]?.product_name || 'Egg Order Pack'}
                    </td>
                    <td className="font-mono text-slate-300">₹{ord.subtotal.toLocaleString()}</td>
                    <td className="font-extrabold text-amber-400 font-mono text-base">
                      ₹{ord.total.toLocaleString()}
                    </td>
                    <td>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        🟢 {ord.order_status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => openPriceEditModal(ord)}
                        className="px-3 py-1.5 rounded-xl bg-[#06140e] border border-amber-500/40 text-amber-300 font-bold text-[10px] hover:bg-amber-500/20 transition-all"
                      >
                        ✏️ Edit Price
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Sales Order */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-xl font-bold text-white">➕ Create New Sales Order</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Customer / B2B Account Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Metro Fresh Mart"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Customer Phone</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Sales Channel Tier</label>
                  <select
                    value={selectedChannelId}
                    onChange={(e) => updateCalculatedRate(e.target.value, packagingMode, selectedProductId)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-emerald-300 font-semibold"
                  >
                    {salesChannels.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">{t.packagingSpec}</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'single', label: `🥚 ${t.singleEggs}` },
                    { key: 'pack', label: `📦 ${t.packTrays}` },
                    { key: 'bulk', label: `🚚 ${t.bulkWholesale}` },
                  ].map((mode) => (
                    <button
                      key={mode.key}
                      type="button"
                      onClick={() => updateCalculatedRate(selectedChannelId, mode.key as any, selectedProductId)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        packagingMode === mode.key
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                          : 'bg-[#06140e] text-slate-300 border-[#133e2b]'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">{t.editableUnitPrice}</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editableUnitPrice}
                    onChange={(e) => setEditableUnitPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-amber-500/50 text-amber-300 font-extrabold font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">{t.orderQuantity}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                />
              </div>

              <div className="pt-3 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg"
                >
                  Save & Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Order Price */}
      {editingOrderPrice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-lg font-bold text-white">✏️ Edit Order Unit Price</h3>
              <button onClick={() => setEditingOrderPrice(null)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePriceModification} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">New Unit Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={modUnitPrice}
                  onChange={(e) => setModUnitPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-amber-500/50 text-amber-300 font-extrabold font-mono text-base"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Order Discount (₹)</label>
                <input
                  type="number"
                  value={modDiscount}
                  onChange={(e) => setModDiscount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                />
              </div>

              <div className="pt-3 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOrderPrice(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold shadow-lg"
                >
                  Save New Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
