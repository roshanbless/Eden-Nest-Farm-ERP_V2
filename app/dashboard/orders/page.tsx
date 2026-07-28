'use client';

import React, { useState, useEffect } from 'react';
import { fetchOrders, Order, mockOrders, mockProducts, Product } from '@/lib/api/commerce';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrderPrice, setEditingOrderPrice] = useState<Order | null>(null);

  // New Order Form State
  const [customerName, setCustomerName] = useState('Metro Fresh Mart');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 22110');
  const [orderType, setOrderType] = useState<'one_time' | 'subscription' | 'bulk_order'>('bulk_order');
  const [packagingMode, setPackagingMode] = useState<'single' | 'pack' | 'bulk'>('pack');
  const [selectedProductId, setSelectedProductId] = useState('prod-01');
  
  // EDITABLE PRICE & QUANTITY FIELDS
  const [editableUnitPrice, setEditableUnitPrice] = useState('240');
  const [quantity, setQuantity] = useState('10');
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

  // Sync default price when packaging mode or product changes
  const handleProductOrModeChange = (productId: string, mode: 'single' | 'pack' | 'bulk') => {
    setSelectedProductId(productId);
    setPackagingMode(mode);

    if (mode === 'single') {
      setEditableUnitPrice('8.00');
    } else {
      const prod = mockProducts.find((p) => p.id === productId) || mockProducts[0];
      setEditableUnitPrice(prod.base_price.toString());
    }
  };

  // Filter orders by tab
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true;
    return o.order_status === activeTab;
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.order_status === 'pending').length;
  const confirmedCount = orders.filter((o) => o.order_status === 'confirmed' || o.order_status === 'packed').length;
  const inTransitCount = orders.filter((o) => o.order_status === 'out_for_delivery').length;

  // Next status transition helper
  const advanceStatus = (orderId: string, currentStatus: string) => {
    const statusSequence = ['pending', 'confirmed', 'packed', 'out_for_delivery', 'delivered'];
    const nextIdx = statusSequence.indexOf(currentStatus) + 1;
    if (nextIdx < statusSequence.length) {
      const nextStatus = statusSequence[nextIdx] as any;
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: nextStatus } : o))
      );
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = mockProducts.find((p) => p.id === selectedProductId) || mockProducts[0];
    const qtyNum = parseInt(quantity) || 1;
    const unitPriceNum = parseFloat(editableUnitPrice) || prod.base_price;
    const subtotalCalc = unitPriceNum * qtyNum;
    const discNum = parseFloat(discount) || 0;
    const totalCalc = Math.max(0, subtotalCalc + 250 - discNum);

    let modeLabel = 'Pack Trays';
    if (packagingMode === 'single') modeLabel = 'Single Loose Eggs';
    if (packagingMode === 'bulk') modeLabel = 'Bulk Commercial Load';

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
      shipping_cost: 250,
      discount: discNum,
      total: totalCalc,
      order_status: 'pending',
      payment_status: 'paid',
      created_at: new Date().toISOString(),
      items: [
        {
          id: `item-${Date.now()}`,
          product_id: prod.id,
          product_name: `${prod.name} [${modeLabel}]`,
          quantity: qtyNum,
          unit_price: unitPriceNum,
          line_total: subtotalCalc,
        },
      ],
    };

    setOrders([newOrder, ...orders]);
    setShowCreateModal(false);
  };

  const openPriceEditModal = (order: Order) => {
    setEditingOrderPrice(order);
    const item = order.items?.[0];
    setModUnitPrice(item?.unit_price ? item.unit_price.toString() : '210');
    setModDiscount(order.discount ? order.discount.toString() : '0');
  };

  const handleSavePriceModification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrderPrice) return;

    const newPrice = parseFloat(modUnitPrice) || 1;
    const newDisc = parseFloat(modDiscount) || 0;

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

          return {
            ...o,
            subtotal,
            discount: newDisc,
            total: newTotal,
            items: updatedItems,
          };
        }
        return o;
      })
    );

    setEditingOrderPrice(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🛒 Sales Order Workflow & Custom Pricing Engine
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Management & Custom Pricing</h1>
          <p className="text-xs text-slate-300 mt-1">
            Create B2B & Retail sales orders in <strong>Single Loose, Pack Trays, or Bulk Wholesale</strong> with <strong>100% Editable Unit Prices</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Sales Order
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0a2017] border border-emerald-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Sales Revenue</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">Single, Pack & Bulk channel sales</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-amber-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Pending Confirmation</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mt-1">{pendingCount} Orders</div>
          <div className="text-xs text-amber-400 font-semibold mt-1">Editable B2B pricing verification</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-blue-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">In Packing / Preparation</div>
          <div className="text-3xl font-extrabold text-blue-400 font-mono mt-1">{confirmedCount} Orders</div>
          <div className="text-xs text-blue-400 font-semibold mt-1">Cold storage batch allocation</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0a2017] border border-purple-500/30 glass-card">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Out for Delivery</div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono mt-1">{inTransitCount} Shipments</div>
          <div className="text-xs text-purple-400 font-semibold mt-1">Driver route dispatches</div>
        </div>
      </div>

      {/* Order Workflow Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#133e2b] text-xs font-semibold">
        {[
          { key: 'all', label: 'All Orders' },
          { key: 'pending', label: '⏳ Pending' },
          { key: 'confirmed', label: '✓ Confirmed' },
          { key: 'packed', label: '📦 Packed' },
          { key: 'out_for_delivery', label: '🚚 Out for Delivery' },
          { key: 'delivered', label: '✅ Delivered' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-emerald-600 text-white border border-emerald-400/40 shadow-sm'
                : 'text-slate-300 hover:text-white bg-[#06140e] border border-[#133e2b]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-3xl bg-[#091b12] border border-[#133e2b] space-y-5 glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#133e2b] text-slate-300 font-bold uppercase tracking-wider">
                <th className="pb-3">ORDER #</th>
                <th className="pb-3">CUSTOMER</th>
                <th className="pb-3">ORDER TYPE</th>
                <th className="pb-3">ITEMS / EDITABLE UNIT PRICE</th>
                <th className="pb-3">TOTAL PRICE</th>
                <th className="pb-3">PAYMENT</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#133e2b]/60">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#133e2b]/40 transition-colors">
                  <td className="py-4">
                    <div className="font-extrabold text-white font-mono text-sm">{order.order_number}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Date: {order.scheduled_delivery_date}</div>
                  </td>
                  <td>
                    <div className="font-bold text-white text-sm">{order.customer_name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{order.delivery_address}</div>
                  </td>
                  <td>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#06140e] border border-slate-700 text-slate-300 font-semibold uppercase">
                      {order.order_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="text-slate-300">
                    {order.items?.map((item) => (
                      <div key={item.id} className="space-y-0.5">
                        <div className="font-semibold text-white">{item.quantity}x {item.product_name}</div>
                        <div className="text-[11px] text-emerald-400 font-mono">
                          Unit Price: ₹{item.unit_price} / unit
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="font-extrabold text-emerald-400 font-mono text-base">
                    ₹{order.total.toLocaleString()}
                  </td>
                  <td>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      {order.payment_status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        order.order_status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : order.order_status === 'confirmed'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : order.order_status === 'packed'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : order.order_status === 'out_for_delivery'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {order.order_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openPriceEditModal(order)}
                        className="px-2.5 py-1.5 rounded-xl font-semibold text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all flex items-center gap-1"
                      >
                        <span>✏️ Edit Price</span>
                      </button>
                      {order.order_status !== 'delivered' && (
                        <button
                          onClick={() => advanceStatus(order.id, order.order_status)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-all shadow-md"
                        >
                          {order.order_status === 'pending'
                            ? 'Confirm →'
                            : order.order_status === 'confirmed'
                            ? 'Pack →'
                            : order.order_status === 'packed'
                            ? 'Dispatch →'
                            : 'Delivered ✓'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Create Sales Order with Single, Pack, Bulk & Editable Price */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <h3 className="text-xl font-bold text-white">Create Sales Order</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Customer / Enterprise Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Metro Fresh Mart"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="block font-semibold text-slate-300 mb-1">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e: any) => setOrderType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  >
                    <option value="bulk_order">Wholesale Bulk Order</option>
                    <option value="one_time">Retail One-Time</option>
                    <option value="subscription">Recurring Subscription</option>
                  </select>
                </div>
              </div>

              {/* Packaging Mode Selector (Single, Pack, Bulk) */}
              <div className="p-3 rounded-xl bg-[#06140e] border border-[#133e2b] space-y-2">
                <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Select Packaging Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleProductOrModeChange(selectedProductId, 'single')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border ${
                      packagingMode === 'single'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    🥚 Single Eggs
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProductOrModeChange(selectedProductId, 'pack')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border ${
                      packagingMode === 'pack'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    📦 Pack Trays
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProductOrModeChange(selectedProductId, 'bulk')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border ${
                      packagingMode === 'bulk'
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    🚚 Bulk Wholesale
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Select Product SKU</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductOrModeChange(e.target.value, packagingMode)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white"
                  >
                    {mockProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* EDITABLE UNIT PRICE FIELD */}
                <div>
                  <label className="block font-semibold text-amber-300 mb-1">
                    Editable Unit Price (₹) ✏️
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editableUnitPrice}
                    onChange={(e) => setEditableUnitPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-500/60 text-amber-300 font-mono font-extrabold text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Order Quantity (Units)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Custom Discount (₹)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-emerald-300 font-mono"
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

              {/* Real-Time Total Calculation Banner */}
              <div className="p-3 rounded-xl bg-[#06140e] border border-[#133e2b] flex items-center justify-between text-xs">
                <span className="text-slate-400">Calculated Total Price:</span>
                <span className="text-amber-400 font-extrabold font-mono text-base">
                  ₹{Math.max(0, (parseFloat(editableUnitPrice || '0') * (parseInt(quantity) || 1)) + 250 - (parseFloat(discount) || 0)).toLocaleString()}
                </span>
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
                  Create & Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Price on Existing Order */}
      {editingOrderPrice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#091b12] border border-[#133e2b] rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#133e2b] pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">NEGOTIATE / EDIT ORDER PRICING</span>
                <h3 className="text-lg font-bold text-white">Edit Price for {editingOrderPrice.order_number}</h3>
              </div>
              <button onClick={() => setEditingOrderPrice(null)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePriceModification} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#06140e] border border-[#133e2b] space-y-1">
                <div className="font-bold text-white">{editingOrderPrice.customer_name}</div>
                <div className="text-slate-400 text-[11px]">{editingOrderPrice.items?.[0]?.product_name} (Qty: {editingOrderPrice.items?.[0]?.quantity})</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-amber-300 mb-1">New Unit Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={modUnitPrice}
                    onChange={(e) => setModUnitPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-500/60 text-amber-300 font-mono font-extrabold text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Discount Amount (₹)</label>
                  <input
                    type="number"
                    value={modDiscount}
                    onChange={(e) => setModDiscount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#06140e] border border-[#133e2b] text-emerald-300 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#06140e] border border-[#133e2b] flex items-center justify-between">
                <span className="text-slate-400">Updated Order Total:</span>
                <span className="text-amber-400 font-extrabold font-mono text-base">
                  ₹{Math.max(0, (parseFloat(modUnitPrice || '0') * (editingOrderPrice.items?.[0]?.quantity || 1)) + (editingOrderPrice.shipping_cost || 0) - (parseFloat(modDiscount) || 0)).toLocaleString()}
                </span>
              </div>

              <div className="pt-3 border-t border-[#133e2b] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingOrderPrice(null)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg"
                >
                  Save New Order Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
