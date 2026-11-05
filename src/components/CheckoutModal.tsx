import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  ArrowRight,
  Lock,
  Wallet,
  Receipt,
  FileText,
  Clock,
  RotateCw,
} from 'lucide-react';
import { PaymentReceiptModal } from './receipt/PaymentReceiptModal';
import { Order, PaymentTransaction } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartShipping,
    cartTotal,
    createOrder,
    setIsOrderTrackingOpen,
    setActiveTrackingOrder,
    paymentTransactions,
  } = useStore();

  const [step, setStep] = useState<1 | 2>(1);

  // Address inputs
  const [customerName, setCustomerName] = useState('Pooja Nair');
  const [customerEmail, setCustomerEmail] = useState('pooja.nair@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98201 12345');
  const [addressLine, setAddressLine] = useState('Flat 502, Orchid Heights, Palm Beach Road');
  const [pincode, setPincode] = useState('400050');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Wallets' | 'Cash on Delivery'>('UPI');
  const [upiId, setUpiId] = useState('pooja@okhdfcbank');
  const [selectedWallet, setSelectedWallet] = useState<'Paytm' | 'PhonePe' | 'Amazon Pay' | 'Mobikwik'>('Paytm');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [matchedTransaction, setMatchedTransaction] = useState<PaymentTransaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  if (!isCheckoutOpen) return null;

  // Auto-fill city/state based on Indian PIN codes
  const handlePincodeChange = (pin: string) => {
    setPincode(pin);
    if (pin.startsWith('400')) {
      setCity('Mumbai');
      setState('Maharashtra');
    } else if (pin.startsWith('110')) {
      setCity('New Delhi');
      setState('Delhi');
    } else if (pin.startsWith('560')) {
      setCity('Bengaluru');
      setState('Karnataka');
    } else if (pin.startsWith('500')) {
      setCity('Hyderabad');
      setState('Telangana');
    } else if (pin.startsWith('600')) {
      setCity('Chennai');
      setState('Tamil Nadu');
    } else if (pin.startsWith('411')) {
      setCity('Pune');
      setState('Maharashtra');
    }
  };

  const handleCompleteOrder = () => {
    setIsProcessingPayment(true);
    setVerificationProgress('Connecting to Razorpay Indian Optical Gateway...');

    setTimeout(() => {
      setVerificationProgress('Verifying HMAC-SHA256 signature and bank token...');
    }, 600);

    setTimeout(() => {
      setVerificationProgress('Simulating server-side double verification...');
    }, 1100);

    setTimeout(() => {
      const order = createOrder({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: {
          addressLine,
          city,
          state,
          pincode,
        },
        items: [...cart],
        subtotal: cartSubtotal,
        discount: cartDiscount,
        tax: cartTax,
        shipping: cartShipping,
        totalAmount: cartTotal,
        paymentMethod: paymentMethod === 'Wallets' ? `Wallet (${selectedWallet})` : paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      });

      setIsProcessingPayment(false);
      setCompletedOrder(order);

      // Find the created transaction in store or synthesize
      const tx = paymentTransactions.find((t) => t.orderId === order.id) || {
        id: `tx-${Date.now()}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        amount: order.totalAmount,
        currency: 'INR',
        gateway: 'Razorpay',
        gatewayPaymentId: `pay_razor_${Math.random().toString(36).substr(2, 9)}`,
        status: order.paymentStatus === 'Paid' ? 'Success' : 'Pending',
        paymentMethod: order.paymentMethod,
        receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
        productSummary: order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(', '),
        createdAt: new Date().toISOString(),
      };
      setMatchedTransaction(tx);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }, 1700);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Top Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold font-heading">
                AR VISION Secure Optical Checkout (256-Bit SSL)
              </h3>
            </div>
            <button
              onClick={() => {
                setIsCheckoutOpen(false);
                setCompletedOrder(null);
                setStep(1);
              }}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Completed Order Confirmation View */}
          {completedOrder ? (
            <div className="p-6 sm:p-8 text-center space-y-5 overflow-y-auto flex-1">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payment Verified by Razorpay
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                  Your Order Has Been Confirmed!
                </h4>
                <p className="text-xs text-slate-500">
                  A confirmation receipt and tracking updates have been dispatched to{' '}
                  <strong className="text-slate-800">{completedOrder.customerEmail}</strong>
                </p>
              </div>

              {/* Order & Payment ID Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto text-left">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Order ID</div>
                  <div className="font-mono font-bold text-slate-900 text-xs truncate">
                    {completedOrder.orderNumber}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Payment ID</div>
                  <div className="font-mono font-semibold text-indigo-700 text-xs truncate">
                    {matchedTransaction?.gatewayPaymentId || `pay_ar_${completedOrder.id.slice(-6)}`}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Payment Status</div>
                  <div className="font-bold text-emerald-600 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{completedOrder.paymentStatus}</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Payment Date</div>
                  <div className="font-semibold text-slate-800 text-xs truncate">
                    {new Date(completedOrder.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </div>
                </div>
              </div>

              {/* Ordered Products Brief List */}
              <div className="max-w-xl mx-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-left space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 flex justify-between">
                  <span>Ordered Products ({completedOrder.items.reduce((acc, i) => acc + i.quantity, 0)} Items)</span>
                  <span>Price</span>
                </div>
                <div className="divide-y divide-slate-200/70 max-h-40 overflow-y-auto pr-1 space-y-2">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="pt-2 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">
                            {item.product.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Qty: <strong className="text-slate-800">{item.quantity}</strong> • {item.selectedVariant?.colorName || 'Default'}
                            {item.lensSelection && ` • Lens: ${item.lensSelection.name}`}
                          </div>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 shrink-0">
                        ₹{(item.unitPrice + (item.lensSelection?.price || 0)) * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Product Price (Subtotal):</span>
                    <span className="font-mono">₹{completedOrder.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {completedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount:</span>
                      <span className="font-mono">-₹{completedOrder.discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Charge:</span>
                    <span className="font-mono">
                      {completedOrder.shipping === 0 ? 'FREE' : `₹${completedOrder.shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-200">
                    <span>Total Paid:</span>
                    <span className="font-mono text-indigo-700">₹{completedOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                    <Truck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Delivery Address & Estimated Delivery</span>
                  </div>
                  <div className="text-slate-600">
                    {completedOrder.customerName} • {completedOrder.shippingAddress.addressLine},{' '}
                    {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} -{' '}
                    {completedOrder.shippingAddress.pincode}
                  </div>
                  <div className="text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Estimated Arrival: 3-4 Business Days via Priority Optical Air Express</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
                <button
                  onClick={() => setIsReceiptOpen(true)}
                  className="py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-white" />
                  <span>Download Payment Receipt</span>
                </button>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setActiveTrackingOrder(completedOrder);
                    setIsOrderTrackingOpen(true);
                  }}
                  className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>View Order & Tracking</span>
                </button>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setCompletedOrder(null);
                    setStep(1);
                  }}
                  className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1 vs Step 2 Navigation Tabs */}
              <div className="grid grid-cols-2 border-b border-slate-200 text-xs font-semibold text-center bg-slate-50">
                <div
                  className={`py-3 ${
                    step === 1 ? 'border-b-2 border-indigo-600 text-indigo-700 bg-white font-bold' : 'text-slate-500'
                  }`}
                >
                  1. Delivery & Address
                </div>
                <div
                  className={`py-3 ${
                    step === 2 ? 'border-b-2 border-indigo-600 text-indigo-700 bg-white font-bold' : 'text-slate-500'
                  }`}
                >
                  2. Payment Method & Authorization
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                {/* STEP 1: DELIVERY & ADDRESS */}
                {step === 1 && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Mobile Number (for SMS & WhatsApp Tracking)
                        </label>
                        <input
                          type="text"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Email Address (for GST Tax Invoice PDF)
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        Street Address / House No. / Landmark
                      </label>
                      <input
                        type="text"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => handlePincodeChange(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-950 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>PIN Code Serviceability Checked: BlueDart / Delhivery Priority Air Express</span>
                    </div>
                  </div>
                )}

                {/* STEP 2: PAYMENT METHOD SELECTION */}
                {step === 2 && (
                  <div className="space-y-4 text-xs">
                    <div className="font-bold text-slate-800 text-sm">
                      Select Payment Method (Supported Indian Gateway)
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          id: 'UPI',
                          name: 'UPI / QR Code',
                          desc: 'Google Pay, PhonePe, Paytm, BHIM',
                          icon: <QrCode className="w-5 h-5 text-indigo-600" />,
                        },
                        {
                          id: 'Card',
                          name: 'Credit / Debit Card',
                          desc: 'Visa, MasterCard, RuPay, Amex',
                          icon: <CreditCard className="w-5 h-5 text-indigo-600" />,
                        },
                        {
                          id: 'NetBanking',
                          name: 'Net Banking',
                          desc: 'HDFC, ICICI, SBI, Axis, Kotak',
                          icon: <Building className="w-5 h-5 text-indigo-600" />,
                        },
                        {
                          id: 'Wallets',
                          name: 'Wallets & Prepaids',
                          desc: 'Paytm, PhonePe, Amazon Pay',
                          icon: <Wallet className="w-5 h-5 text-indigo-600" />,
                        },
                        {
                          id: 'Cash on Delivery',
                          name: 'Cash on Delivery',
                          desc: 'Pay at your doorstep',
                          icon: <Banknote className="w-5 h-5 text-emerald-600" />,
                        },
                      ].map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id as any)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                            paymentMethod === m.id
                              ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="p-2 rounded-xl bg-white border border-slate-200">
                            {m.icon}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{m.name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{m.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <label className="block text-slate-700 font-bold">
                          Enter UPI VPA ID:
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs focus:border-indigo-500 outline-none"
                        />
                        <p className="text-[11px] text-slate-500">
                          Supports any UPI App: Google Pay, PhonePe, Paytm, BHIM, CRED
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'Wallets' && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                        <label className="block text-slate-700 font-bold">
                          Select Wallet Provider:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'] as const).map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => setSelectedWallet(w)}
                              className={`py-2 px-3 rounded-xl border text-xs font-semibold text-left transition ${
                                selectedWallet === w
                                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {w} Wallet
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary Box */}
                    <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                      <div className="flex justify-between text-slate-300">
                        <span>Total Optical Order Amount:</span>
                        <strong className="text-white text-base font-bold font-heading">
                          ₹{cartTotal.toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        14-Day Free Exchange & 1-Year Comprehensive Lens Coating Warranty Included.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Step Actions */}
              <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                {step === 2 ? (
                  <button
                    onClick={() => setStep(1)}
                    disabled={isProcessingPayment}
                    className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    Back to Address
                  </button>
                ) : (
                  <div className="text-xs text-slate-500">
                    Step 1 of 2
                  </div>
                )}

                {step === 1 ? (
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteOrder}
                    disabled={isProcessingPayment}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <div className="flex items-center gap-2">
                        <RotateCw className="w-4 h-4 animate-spin text-white" />
                        <span>{verificationProgress || 'Verifying Payment...'}</span>
                      </div>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Complete Payment (₹{cartTotal.toLocaleString('en-IN')})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Downloadable / Printable Payment Receipt Modal */}
      {isReceiptOpen && completedOrder && (
        <PaymentReceiptModal
          order={completedOrder}
          transaction={matchedTransaction}
          onClose={() => setIsReceiptOpen(false)}
        />
      )}
    </>
  );
};
