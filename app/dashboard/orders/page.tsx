'use client';

import React, { useState, useEffect } from 'react';
import { fetchOrders, Order, mockOrders, mockProducts } from '@/lib/api/commerce';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Order Form State
  const [customerName, setCustomerName] = useState('Metro Fresh Mart');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 22110');
  const [orderType, setOrderType] = useState<'one_time' | 'subscription' | 'bulk_order'>('bulk_order');
  const [selectedProductId, setSelectedProductId] = useState('prod-01');
  const [quantity, setQuantity] = useState('10');
  const [deliveryAddress, setDeliveryAddress] = useState('Indiranagar, Bengaluru 560038');
  const [discount, setDiscount] = useState('100');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    }
    loadData();
  }, []);

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
    const subtotalCalc = prod.base_price * qtyNum;
    const discNum = parseInt(discount) || 0;
    const totalCalc = subtotalCalc + 250 - discNum;

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
          product_name: prod.name,
          quantity: qtyNum,
          unit_price: prod.base_price,
          line_total: subtotalCalc,
        },
      ],
    };

    setOrders([newOrder, ...orders]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🛒 Sales Order Workflow State Machine
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Order Management & Fulfillment</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage incoming sales orders, confirm inventory reservations, pack batches, and track dispatch deliveries.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/60 flex items-center gap-2 self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Sales Order
        </button>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Revenue</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Gross sales across all channels</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Confirmation</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">{pendingCount} Orders</div>
          <div className="text-xs text-slate-500 mt-1">Requires sales verification</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Packing / Preparation</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-1">{confirmedCount} Orders</div>
          <div className="text-xs text-slate-500 mt-1">Stock allocated from cold storage</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Out for Delivery</div>
          <div className="text-3xl font-extrabold text-purple-400 mt-1">{inTransitCount} Shipments</div>
          <div className="text-xs text-slate-500 mt-1">En route to customer destinations</div>
        </div>
      </div>

      {/* Order Workflow Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs font-semibold">
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
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">ORDER #</th>
                <th className="pb-3">CUSTOMER</th>
                <th className="pb-3">ORDER TYPE</th>
                <th className="pb-3">ITEMS / QUANTITY</th>
                <th className="pb-3">TOTAL</th>
                <th className="pb-3">PAYMENT</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4">
                    <div className="font-extrabold text-white font-mono">{order.order_number}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Date: {order.scheduled_delivery_date}</div>
                  </td>
                  <td>
                    <div className="font-bold text-white">{order.customer_name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{order.delivery_address}</div>
                  </td>
                  <td>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase">
                      {order.order_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="text-slate-300">
                    {order.items?.map((item) => (
                      <div key={item.id} className="font-medium">
                        {item.quantity}x {item.product_name}
                      </div>
                    ))}
                  </td>
                  <td className="font-extrabold text-emerald-400 font-mono text-sm">
                    ₹{order.total.toLocaleString()}
                  </td>
                  <td>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
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
                    {order.order_status !== 'delivered' && (
                      <button
                        onClick={() => advanceStatus(order.id, order.order_status)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-all shadow-md shadow-emerald-950"
                      >
                        {order.order_status === 'pending'
                          ? 'Confirm Order →'
                          : order.order_status === 'confirmed'
                          ? 'Mark Packed →'
                          : order.order_status === 'packed'
                          ? 'Dispatch →'
                          : 'Mark Delivered ✓'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Customer Phone</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Order Type</label>
                  <select
                    value={orderType}
                    onChange={(e: any) => setOrderType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="bulk_order">Wholesale Bulk Order</option>
                    <option value="one_time">Retail One-Time</option>
                    <option value="subscription">Recurring Subscription</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Select Product SKU</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {mockProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.base_price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Order Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
                >
                  Create & Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
