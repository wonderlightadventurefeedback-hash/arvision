import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { PaymentReceiptModal } from '../receipt/PaymentReceiptModal';
import {
  ShoppingBag,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Eye,
  Receipt,
  RotateCcw,
  User,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Package,
} from 'lucide-react';

export const ORDER_STATUSES: OrderStatus[] = [
  'Confirmed',
  'Prescription Review',
  'Processing',
  'Lens Preparation',
  'Quality Check',
  'Dispatched',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Refunded',
];

export const OrdersManager: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setOrderStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [editingTrackingOrderId, setEditingTrackingOrderId] = useState<string | null>(null);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== 'All' && order.orderStatus !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchNum = order.orderNumber.toLowerCase().includes(q);
        const matchCust = order.customerName.toLowerCase().includes(q) || order.customerEmail.toLowerCase().includes(q);
        const matchPhone = order.customerPhone?.toLowerCase().includes(q);
        const matchItem = order.items.some((i) => i.product.name.toLowerCase().includes(q));
        if (!matchNum && !matchCust && !matchPhone && !matchItem) return false;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const note = statusNote || `Status updated to ${newStatus}`;
    updateOrderStatus(orderId, newStatus, note);
    setStatusNote('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>10-Stage Optical Fulfillment Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading">
            Order Fulfillment & Tracking Hub
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Manage customer optical orders through prescription review, CNC lens edging, quality inspection, express courier dispatch, and doorstep delivery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Orders</div>
            <div className="text-xl font-bold font-mono text-cyan-300">{orders.length}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, customer name, email, phone, or frame..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="All">All 10 Statuses</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            No orders found matching the filter criteria.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isCancelledOrRefunded = order.orderStatus === 'Cancelled' || order.orderStatus === 'Refunded';
            return (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 hover:border-indigo-300 transition"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-extrabold text-slate-900">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isCancelledOrRefunded
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold">Change Status:</span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-1.5 text-xs font-bold outline-none cursor-pointer hover:border-indigo-500"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Body Row: Customer, Address, Items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Customer Info
                    </div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="text-slate-600 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.customerEmail}</span>
                    </div>
                    <div className="text-slate-600 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{order.customerPhone}</span>
                    </div>
                  </div>

                  {/* Delivery Address & Tracking */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Shipping & AWB Tracking
                    </div>
                    <div className="text-slate-700 leading-relaxed flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>
                        {order.shippingAddress.addressLine}, {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </span>
                    </div>
                    <div className="pt-1 flex items-center gap-1.5 text-indigo-700 font-mono">
                      <Truck className="w-3.5 h-3.5" />
                      <span>{order.trackingNumber || 'DELHIVERY-ARV98234'}</span>
                    </div>
                  </div>

                  {/* Order Financials & Actions */}
                  <div className="space-y-2 md:border-l md:border-slate-100 md:pl-4 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Financial Summary
                      </div>
                      <div className="text-lg font-black text-slate-900 font-heading">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Paid via <strong className="text-slate-800">{order.paymentMethod}</strong> • {order.paymentStatus}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Details</span>
                      </button>
                      <button
                        onClick={() => setReceiptOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs transition flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>GST Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center gap-4">
                  <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                    Frames ({order.items.length}):
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-7 h-7 rounded-md object-cover bg-white border border-slate-200"
                      />
                      <span className="font-semibold text-slate-800">
                        {item.product.name} (x{item.quantity})
                      </span>
                      {item.lensSelection && (
                        <span className="text-[11px] text-indigo-600 font-medium">
                          [{item.lensSelection.name}]
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-bold font-heading">
                  Order #{selectedOrder.orderNumber} Comprehensive Profile
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Order Status History Timeline */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-sm">Status Progression Timeline</div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  {selectedOrder.statusHistory?.map((hist, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900">
                          {hist.status} <span className="text-[11px] font-normal text-slate-400">({hist.timestamp})</span>
                        </div>
                        {hist.note && <div className="text-slate-600 text-[11px] mt-0.5">{hist.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-sm">Ordered Eyewear & Custom Lenses</div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">Item</th>
                        <th className="p-2.5">SKU</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((i, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5">
                            <div className="font-bold text-slate-900">{i.product.name}</div>
                            {i.lensSelection && (
                              <div className="text-[11px] text-indigo-600 font-medium">
                                Lens: {i.lensSelection.name} (+₹{i.lensSelection.price})
                              </div>
                            )}
                          </td>
                          <td className="p-2.5 font-mono text-slate-500">{i.product.sku}</td>
                          <td className="p-2.5 text-center font-bold text-slate-900">{i.quantity}</td>
                          <td className="p-2.5 text-right font-mono">₹{i.unitPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => {
                    const ord = selectedOrder;
                    setSelectedOrder(null);
                    setReceiptOrder(ord);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Download / Print GST Tax Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {receiptOrder && (
        <PaymentReceiptModal
          order={receiptOrder}
          onClose={() => setReceiptOrder(null)}
        />
      )}
    </div>
  );
};
