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
  Sparkles,
  Lock,
} from 'lucide-react';

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
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery'>('UPI');
  const [upiId, setUpiId] = useState('pooja@okhdfcbank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

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
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      });

      setIsProcessingPayment(false);
      setCompletedOrder(order);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold font-heading">
              Secure Optical Checkout (256-Bit SSL)
            </h3>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completed Order Confirmation View */}
        {completedOrder ? (
          <div className="p-8 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Order Successfully Placed & Verified
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900 font-heading">
                Thank you, {completedOrder.customerName}!
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                Order ID: <strong className="text-slate-900 font-bold">{completedOrder.orderNumber}</strong>
              </p>
            </div>

            {/* Order Brief Summary */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Total Paid:</span>
                <strong className="text-slate-900 font-bold">₹{completedOrder.totalAmount}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Mode:</span>
                <span className="font-semibold text-indigo-700">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping To:</span>
                <span className="text-right truncate max-w-[200px]">{completedOrder.shippingAddress.addressLine}, {completedOrder.shippingAddress.city}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Delivery:</span>
                <span className="text-emerald-700 font-bold">3-4 Business Days</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setIsOrderTrackingOpen(true);
                }}
                className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Track 6-Stage Lens Preparation</span>
              </button>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setCompletedOrder(null);
                }}
                className="py-3 px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
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
                2. Payment & Verification
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
                    Select Payment Gateway
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
                    </div>
                  )}

                  {/* Summary Box */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Total Optical Order Amount:</span>
                      <strong className="text-white text-base font-bold font-heading">
                        ₹{cartTotal}
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
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
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
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition flex items-center gap-1.5"
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
                    <span>Verifying Optical Order...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authorize & Place Order (₹{cartTotal})</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
