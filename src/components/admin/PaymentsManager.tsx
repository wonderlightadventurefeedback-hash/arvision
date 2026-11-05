import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentTransaction, Order } from '../../types';
import { PaymentReceiptModal } from '../receipt/PaymentReceiptModal';
import {
  CreditCard,
  Search,
  Filter,
  Download,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Eye,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Receipt,
  X,
} from 'lucide-react';

interface PaymentsManagerProps {
  onViewOrder?: (order: Order) => void;
}

export const PaymentsManager: React.FC<PaymentsManagerProps> = ({ onViewOrder }) => {
  const { paymentTransactions, orders, processRefund } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Success' | 'Pending' | 'Failed' | 'Refunded'>('All');
  const [methodFilter, setMethodFilter] = useState<string>('All');
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [receiptTx, setReceiptTx] = useState<PaymentTransaction | null>(null);
  const [refundModalTx, setRefundModalTx] = useState<PaymentTransaction | null>(null);
  const [refundReason, setRefundReason] = useState('Customer optical lens prescription update requested');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return paymentTransactions.filter((tx) => {
      if (statusFilter !== 'All') {
        if (statusFilter === 'Refunded' && tx.refundStatus !== 'Refunded') return false;
        if (statusFilter !== 'Refunded' && tx.status !== statusFilter) return false;
      }
      if (methodFilter !== 'All' && !tx.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = tx.id.toLowerCase().includes(q) || tx.gatewayPaymentId.toLowerCase().includes(q);
        const matchOrder = tx.orderNumber?.toLowerCase().includes(q) || tx.orderId?.toLowerCase().includes(q);
        const matchCust = tx.customerName.toLowerCase().includes(q) || tx.customerEmail.toLowerCase().includes(q);
        const matchProd = tx.productSummary?.toLowerCase().includes(q);
        if (!matchId && !matchOrder && !matchCust && !matchProd) return false;
      }
      return true;
    });
  }, [paymentTransactions, statusFilter, methodFilter, searchQuery]);

  // Aggregate Metrics
  const totalVolume = paymentTransactions
    .filter((t) => t.status === 'Success')
    .reduce((sum, t) => sum + t.amount, 0);

  const successfulCount = paymentTransactions.filter((t) => t.status === 'Success').length;
  const pendingCount = paymentTransactions.filter((t) => t.status === 'Pending').length;
  const refundedCount = paymentTransactions.filter((t) => t.refundStatus === 'Refunded').length;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Date',
      'Method',
      'Amount (INR)',
      'Status',
      'Refund Status',
      'Gateway Payment ID',
    ];

    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.orderNumber || tx.orderId || '',
      `"${tx.customerName}"`,
      tx.customerEmail,
      `"${new Date(tx.createdAt).toLocaleString('en-IN')}"`,
      tx.paymentMethod,
      tx.amount,
      tx.status,
      tx.refundStatus || 'N/A',
      tx.gatewayPaymentId,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AR_Vision_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleProcessRefundSubmit = () => {
    if (!refundModalTx) return;
    processRefund(refundModalTx.id, refundReason);
    setRefundModalTx(null);
  };

  const getLinkedOrder = (tx: PaymentTransaction): Order | null => {
    return orders.find((o) => o.id === tx.orderId || o.orderNumber === tx.orderNumber) || null;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Razorpay Optical Gateway & Double Verification</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading">
            Payments & Transactions
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Real-time audit log of customer payments, verified webhook receipts, automated stock restoration on refunds, and instant tax invoice downloads.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer border border-slate-700 self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Settled Volume
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">
            ₹{totalVolume.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Server Verified</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Successful Payments
          </div>
          <div className="text-2xl font-black text-slate-900 font-heading">
            {successfulCount}
          </div>
          <div className="text-[11px] text-slate-500">
            UPI, Cards, NetBanking, Wallets
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pending / In Flight
          </div>
          <div className="text-2xl font-black text-amber-600 font-heading">
            {pendingCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Awaiting webhook confirmation
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Refunds Processed
          </div>
          <div className="text-2xl font-black text-indigo-700 font-heading">
            {refundedCount}
          </div>
          <div className="text-[11px] text-slate-500">
            With automatic stock restoration
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
            placeholder="Search by Tx ID, Order #, Customer, or Product..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            {(['All', 'Success', 'Pending', 'Failed', 'Refunded'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="All">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="NetBanking">Net Banking</option>
            <option value="Wallet">Wallets</option>
            <option value="Cash">Cash on Delivery</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Method</th>
                <th className="py-3 px-3">Product Summary</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-2 text-center">Payment Status</th>
                <th className="py-3 px-2 text-center">Refund Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No transactions found matching active filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isRefunded = tx.refundStatus === 'Refunded' || tx.status === 'Refunded';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3">
                        <div className="font-mono font-bold text-slate-900">{tx.id}</div>
                        <div className="font-mono text-[10px] text-slate-400 truncate max-w-[130px]">
                          {tx.gatewayPaymentId}
                        </div>
                      </td>
                      <td className="py-3 px-2 font-mono font-semibold text-indigo-700">
                        {tx.orderNumber || tx.orderId || '-'}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{tx.customerName}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {tx.customerEmail}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-2">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-800 text-[11px]">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-600 max-w-[180px] truncate" title={tx.productSummary}>
                        {tx.productSummary || 'Eyewear Frame'}
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-black text-slate-900">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            tx.status === 'Success'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : tx.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : tx.status === 'Refunded'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`text-[11px] font-semibold ${
                            isRefunded ? 'text-indigo-700 font-bold' : 'text-slate-400'
                          }`}
                        >
                          {tx.refundStatus || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedTx(tx)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                            title="View Transaction Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setReceiptTx(tx)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-indigo-600 transition"
                            title="Download / View Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                          {tx.status === 'Success' && !isRefunded && (
                            <button
                              onClick={() => {
                                setRefundModalTx(tx);
                                setRefundReason('Customer returned optical frame or requested prescription changes');
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition flex items-center gap-1"
                              title="Process Refund & Restore Stock"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Refund</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold font-heading">
                Transaction Audit Record
              </h3>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedTx.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gateway Ref:</span>
                  <span className="font-mono text-indigo-700">{selectedTx.gatewayPaymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedTx.orderNumber || selectedTx.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Settled:</span>
                  <strong className="text-slate-900 font-bold font-mono">₹{selectedTx.amount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Gateway:</span>
                  <span className="font-semibold text-slate-800">{selectedTx.gateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt Number:</span>
                  <span className="font-mono text-slate-700">{selectedTx.receiptNumber || 'REC-GEN'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-700">Customer Details:</div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div><strong>Name:</strong> {selectedTx.customerName}</div>
                  <div><strong>Email:</strong> {selectedTx.customerEmail}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-700">Purchased Optical Items:</div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white text-slate-600 leading-relaxed">
                  {selectedTx.productSummary || 'Optical frames and custom prescription lenses.'}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                {onViewOrder && getLinkedOrder(selectedTx) && (
                  <button
                    onClick={() => {
                      const ord = getLinkedOrder(selectedTx);
                      if (ord) {
                        setSelectedTx(null);
                        onViewOrder(ord);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-black transition flex items-center gap-1.5"
                  >
                    <span>View Linked Order</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    const tx = selectedTx;
                    setSelectedTx(null);
                    setReceiptTx(tx);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>View Official Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Refund Modal */}
      {refundModalTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold font-heading flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Process Customer Refund</span>
              </h3>
              <button onClick={() => setRefundModalTx(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-rose-900">
                <div className="font-bold">Transaction: {refundModalTx.id}</div>
                <div>Amount to Refund: <strong className="font-mono text-sm">₹{refundModalTx.amount}</strong></div>
                <div>Customer: {refundModalTx.customerName} ({refundModalTx.customerEmail})</div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Reason for Refund (Mandatory Audit Requirement)
                </label>
                <textarea
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none focus:border-rose-500 text-slate-800"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Processing this refund will automatically return all frame quantities back into inventory stock and generate an audit log.
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRefundModalTx(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessRefundSubmit}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-md"
                >
                  Confirm & Process Refund (₹{refundModalTx.amount})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {receiptTx && (
        <PaymentReceiptModal
          order={
            getLinkedOrder(receiptTx) || {
              id: receiptTx.orderId || 'ord-rec',
              orderNumber: receiptTx.orderNumber || 'ARV-2026-REC',
              createdAt: receiptTx.createdAt,
              customerName: receiptTx.customerName,
              customerEmail: receiptTx.customerEmail,
              customerPhone: '+91 98200 12345',
              shippingAddress: {
                addressLine: 'Registered Shipping Address',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400050',
              },
              items: [
                {
                  id: 'item-receipt',
                  product: {
                    id: 'prod-rec',
                    name: receiptTx.productSummary || 'Curated Optical Frames',
                    brand: 'AR-Vision Eyecare',
                    category: 'Eyeglasses',
                    shape: 'Square',
                    material: 'Titanium',
                    originalPrice: receiptTx.amount,
                    sellingPrice: receiptTx.amount,
                    discountPercentage: 0,
                    rating: 4.9,
                    reviewCount: 1,
                    images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371'],
                    variants: [],
                    dimensions: { lensWidth: 52, bridgeWidth: 18, templeLength: 142 },
                    gender: 'Unisex',
                    size: 'Medium',
                    isBogoEligible: false,
                    isBestSeller: true,
                    sku: 'ARV-OPT-902',
                    description: 'Optical eyewear',
                  },
                  quantity: 1,
                  unitPrice: receiptTx.amount,
                  totalPrice: receiptTx.amount,
                },
              ],
              subtotal: receiptTx.amount,
              discount: 0,
              tax: Math.round(receiptTx.amount * 0.18),
              shipping: 0,
              totalAmount: receiptTx.amount,
              paymentMethod: receiptTx.paymentMethod,
              paymentStatus: receiptTx.status === 'Success' ? 'Paid' : (receiptTx.status as any),
              orderStatus: 'Confirmed',
              statusHistory: [],
            }
          }
          transaction={receiptTx}
          onClose={() => setReceiptTx(null)}
        />
      )}
    </div>
  );
};
