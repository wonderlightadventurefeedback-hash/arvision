import React from 'react';
import { Order, PaymentTransaction } from '../../types';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';

interface PaymentReceiptModalProps {
  order: Order | null;
  transaction?: PaymentTransaction | null;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  order,
  transaction,
  onClose,
}) => {
  if (!order) return null;

  const receiptNumber = transaction?.receiptNumber || `REC-${order.orderNumber.replace(/[^0-9]/g, '') || Date.now()}`;
  const transactionId = transaction?.gatewayPaymentId || `pay_ar_${order.id.slice(-8)}`;
  const transactionDate = transaction?.createdAt
    ? new Date(transaction.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      })
    : new Date(order.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata',
      });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `
================================================================
          AR VISION EYE CARE - OFFICIAL PAYMENT RECEIPT
================================================================
Receipt No:      ${receiptNumber}
Order ID:        ${order.orderNumber}
Transaction ID:  ${transactionId}
Date & Time:     ${transactionDate}
Payment Status:  ${order.paymentStatus === 'Paid' ? 'PAID & VERIFIED' : order.paymentStatus.toUpperCase()}
Payment Method:  ${order.paymentMethod}

----------------------------------------------------------------
CUSTOMER DETAILS
----------------------------------------------------------------
Name:    ${order.customerName}
Email:   ${order.customerEmail}
Phone:   ${order.customerPhone}
Address: ${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}

----------------------------------------------------------------
ORDERED ITEMS
----------------------------------------------------------------
${order.items
  .map(
    (item, idx) =>
      `${idx + 1}. ${item.product.name} (${item.selectedVariant?.colorName || 'Standard'})
   SKU: ${item.product.sku} | Qty: ${item.quantity} | Unit: ₹${item.unitPrice}
   ${item.lensSelection ? `Lens: ${item.lensSelection.name} (+₹${item.lensSelection.price})` : 'Frame Only'}
   Item Total: ₹${(item.unitPrice + (item.lensSelection?.price || 0)) * item.quantity}`
  )
  .join('\n\n')}

----------------------------------------------------------------
PAYMENT SUMMARY
----------------------------------------------------------------
Subtotal:        ₹${order.subtotal.toLocaleString('en-IN')}
Discount:       -₹${order.discount.toLocaleString('en-IN')}
GST Tax (18%):   ₹${order.tax.toLocaleString('en-IN')}
Shipping:        ${order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
----------------------------------------------------------------
TOTAL PAID:      ₹${order.totalAmount.toLocaleString('en-IN')}
================================================================
AR VISION EYE CARE PVT. LTD.
Registered Optical Center & Clinical Optometry Hub
1-Year Comprehensive Lens Coating Warranty & 14-Day Free Exchange
Support: support@arvisioneyecare.com | +91 98200 12345
================================================================
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AR_Vision_Receipt_${order.orderNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Toolbar - Hidden in Print */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold font-heading">
              Official Optical Payment Receipt & Tax Invoice
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadText}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              title="Download Receipt"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition ml-2"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-slate-800 print:p-8 font-sans">
          {/* Header */}
          <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md">
                <Eye className="w-7 h-7 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                  AR VISION EYE CARE
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Premium Eyewear, Clinical Optometry & Precision Lenses
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  GSTIN: 27AABCV1234F1Z8 • Reg No: ARV-OPT-2026-MH
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                {order.paymentStatus === 'Paid' ? 'Payment Confirmed' : order.paymentStatus}
              </span>
              <p className="text-xs text-slate-500">
                Receipt No: <strong className="text-slate-900 font-mono">{receiptNumber}</strong>
              </p>
              <p className="text-xs text-slate-500">
                Date: <span className="text-slate-700">{transactionDate}</span>
              </p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Customer & Delivery Details
              </div>
              <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
              <div className="text-slate-600 font-mono">{order.customerEmail}</div>
              <div className="text-slate-600 font-mono">{order.customerPhone}</div>
              <div className="text-slate-600 leading-relaxed mt-1">
                {order.shippingAddress.addressLine}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </div>
            </div>

            <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Transaction Details
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-900">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono text-indigo-700 font-semibold">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="font-semibold text-slate-800">
                  Razorpay Secure Optical Gateway
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-bold text-emerald-700">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order Status:</span>
                <span className="font-semibold text-indigo-700">{order.orderStatus}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Item / Optical Product</th>
                  <th className="py-2.5 px-2">SKU</th>
                  <th className="py-2.5 px-2 text-center">Qty</th>
                  <th className="py-2.5 px-2 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {order.items.map((item, idx) => {
                  const lineTotal =
                    (item.unitPrice + (item.lensSelection?.price || 0)) * item.quantity;
                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{item.product.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Color: {item.selectedVariant?.colorName || 'Default'}
                          {item.lensSelection && (
                            <span className="ml-2 font-medium text-indigo-600">
                              • Lens: {item.lensSelection.name} (+₹{item.lensSelection.price})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 font-mono text-[11px] text-slate-500">
                        {item.product.sku}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-slate-900">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-2 text-right font-mono">
                        ₹{item.unitPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{lineTotal.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pricing Breakdown */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Savings:</span>
                  <span className="font-mono">-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST Tax (18% Included):</span>
                <span className="font-mono">₹{order.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping & Express Delivery:</span>
                <span className="font-mono">
                  {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                </span>
              </div>
              <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-base font-extrabold text-slate-900 font-heading">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-indigo-900">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Guarantee / Footer Note */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>
                1-Year Coating Warranty • 14-Day Free Exchange • Authenticity Guaranteed
              </span>
            </div>
            <div className="text-right">
              Questions? Email <strong className="text-slate-700">support@arvisioneyecare.com</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
