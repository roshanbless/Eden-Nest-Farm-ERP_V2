'use client';

import React, { useState, useEffect } from 'react';
import { fetchDeliveries, Delivery, mockDeliveries, mockZones } from '@/lib/api/logistics';

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);
  const [loading, setLoading] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  // Collection Form State
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card'>('cash');
  const [amountCollected, setAmountCollected] = useState('630');
  const [recipientSignature, setRecipientSignature] = useState('Recipient Signed');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchDeliveries();
      setDeliveries(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalScheduled = deliveries.length;
  const inTransitCount = deliveries.filter((d) => d.status === 'in_transit').length;
  const completedCount = deliveries.filter((d) => d.status === 'delivered').length;
  const totalCashCollected = deliveries
    .filter((d) => d.payment_status === 'collected' || d.payment_status === 'verified')
    .reduce((sum, d) => sum + (d.amount_collected || 0), 0);

  const advanceDeliveryStatus = (delId: string, currentStatus: string) => {
    const seq = ['assigned', 'picked_up', 'in_transit', 'delivered'];
    const nextIdx = seq.indexOf(currentStatus) + 1;
    if (nextIdx < seq.length) {
      const nextStatus = seq[nextIdx] as any;
      setDeliveries((prev) =>
        prev.map((d) => (d.id === delId ? { ...d, status: nextStatus, delivery_time: nextStatus === 'delivered' ? new Date().toISOString() : d.delivery_time } : d))
      );
    }
  };

  const handleRecordCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === selectedDelivery.id) {
          return {
            ...d,
            payment_status: 'verified',
            amount_collected: parseFloat(amountCollected) || d.amount_collected,
            payment_method: paymentMethod as any,
          };
        }
        return d;
      })
    );
    setShowCollectModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            🚚 Logistics & Driver Dispatch Telemetry
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Deliveries & Fulfillment Routes</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage delivery zone routes, driver assignments, route sequencing, and driver cash/UPI collection verification.
          </p>
        </div>
      </div>

      {/* Aggregate Telemetry Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Today</div>
          <div className="text-3xl font-extrabold text-white mt-1">{totalScheduled} Deliveries</div>
          <div className="text-xs text-slate-500 mt-1">Across 3 Cluster Delivery Zones</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In-Transit Drivers</div>
          <div className="text-3xl font-extrabold text-purple-400 mt-1">{inTransitCount} En Route</div>
          <div className="text-xs text-slate-500 mt-1">Live GPS Telemetry active</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Successfully Delivered</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-1">{completedCount} Delivered</div>
          <div className="text-xs text-slate-500 mt-1">100% On-time delivery rate</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 glass-card">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cash / UPI Collection</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">₹{totalCashCollected.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Verified driver collections</div>
        </div>
      </div>

      {/* Delivery Zone Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Active Delivery Clusters & Drivers</h2>
          <span className="text-xs text-slate-400">{mockZones.length} Active Zones</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockZones.map((zone) => (
            <div key={zone.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 glass-card-hover">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  {zone.zone_code}
                </span>
                <span className="text-xs text-slate-400 font-mono">⏱ ~{zone.avg_delivery_time_minutes} mins</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white leading-tight">{zone.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{zone.description}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Driver:</span>
                  <span className="font-semibold text-white">{zone.assigned_driver_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="font-mono text-slate-300 text-[11px]">{zone.vehicle_number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Days:</span>
                  <span className="font-semibold text-emerald-400">{zone.delivery_days}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliveries Route Table */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Driver Route Dispatch List</h3>
            <p className="text-xs text-slate-400">Sequence tracking, recipient addresses, and cash collection verification</p>
          </div>
          <span className="text-xs text-slate-400">{deliveries.length} Shipments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">SEQ / SHIPMENT #</th>
                <th className="pb-3">RECIPIENT & ADDRESS</th>
                <th className="pb-3">DRIVER & VEHICLE</th>
                <th className="pb-3">TIME WINDOW</th>
                <th className="pb-3">COLLECTION (₹)</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ROUTE ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {deliveries.map((del) => (
                <tr key={del.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-extrabold font-mono text-xs flex items-center justify-center">
                        #{del.route_sequence}
                      </span>
                      <div>
                        <div className="font-bold text-white font-mono">{del.order_number}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{del.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-white">{del.recipient_name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{del.delivery_address}</div>
                  </td>
                  <td>
                    <div className="font-semibold text-slate-200">{del.driver_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{del.vehicle_number}</div>
                  </td>
                  <td className="text-slate-300 font-mono">{del.estimated_delivery_time}</td>
                  <td>
                    <div className="font-extrabold text-amber-400 font-mono">₹{del.amount_collected}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">{del.payment_method} ({del.payment_status})</span>
                  </td>
                  <td>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        del.status === 'assigned'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : del.status === 'picked_up'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : del.status === 'in_transit'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {del.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="text-right space-x-2">
                    {del.status !== 'delivered' && (
                      <button
                        onClick={() => advanceDeliveryStatus(del.id, del.status)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-all shadow-md"
                      >
                        {del.status === 'assigned'
                          ? 'Pick Up →'
                          : del.status === 'picked_up'
                          ? 'Start Route →'
                          : 'Confirm Delivery ✓'}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedDelivery(del);
                        setAmountCollected(del.amount_collected.toString());
                        setShowCollectModal(true);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                      title="Verify Payment"
                    >
                      💰 Collect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Collection Modal */}
      {showCollectModal && selectedDelivery && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Record Driver Collection</h3>
                <p className="text-xs text-slate-400">Verify cash or UPI payment collected for {selectedDelivery.order_number}</p>
              </div>
              <button onClick={() => setShowCollectModal(false)} className="text-slate-400 hover:text-white text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordCollection} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="font-bold text-white">{selectedDelivery.recipient_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver:</span>
                  <span className="font-semibold text-slate-300">{selectedDelivery.driver_name}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="cash">Cash on Delivery (COD)</option>
                    <option value="upi">UPI / QR Code Scan</option>
                    <option value="card">Card POS Terminal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Amount Collected (₹)</label>
                  <input
                    type="number"
                    value={amountCollected}
                    onChange={(e) => setAmountCollected(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-emerald-400 font-extrabold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Delivery Confirmation & Notes</label>
                <input
                  type="text"
                  value={recipientSignature}
                  onChange={(e) => setRecipientSignature(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950"
                >
                  Verify Collection Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
