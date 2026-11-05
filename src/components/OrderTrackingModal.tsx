import React from 'react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';
import {
  X,
  CheckCircle2,
  Clock,
  Truck,
  Glasses,
  FileText,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Package,
} from 'lucide-react';

const STAGES: OrderStatus[] = [
  'Confirmed',
  'Prescription Review',
  'Processing',
  'Lens Preparation',
  'Dispatched',
  'Delivered',
];

export const OrderTrackingModal: React.FC = () => {
  const {
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    orders,
    activeTrackingOrder,
    setActiveTrackingOrder,
  } = useStore();

  if (!isOrderTrackingOpen) return null;

  const currentOrder = activeTrackingOrder || orders[0];

  const getStageIndex = (status: OrderStatus) => {
    return STAGES.indexOf(status);
  };

  const currentStageIndex = currentOrder ? getStageIndex(currentOrder.orderStatus) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold font-heading">
                Live Optical Order Tracking
              </h3>
              <p className="text-xs text-slate-400">
                Precision lens fabrication & delivery timeline
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Order Selector if multiple orders exist */}
          {orders.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
              <span className="font-semibold text-slate-500 whitespace-nowrap">Your Orders:</span>
              {orders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => setActiveTrackingOrder(ord)}
                  className={`px-3 py-1.5 rounded-lg border font-mono transition whitespace-nowrap ${
                    ord.id === currentOrder?.id
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                  }`}
                >
                  {ord.orderNumber} ({ord.orderStatus})
                </button>
              ))}
            </div>
          )}

          {currentOrder ? (
            <>
              {/* Order High-level Overview Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                    Order Reference
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 font-mono">
                    {currentOrder.orderNumber}
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Placed on: {new Date(currentOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block">Current Status</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    {currentOrder.orderStatus}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block">Total Amount</span>
                  <span className="text-base font-extrabold text-slate-900 font-heading">
                    ₹{currentOrder.totalAmount}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block">
                    {currentOrder.paymentMethod} • {currentOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* 6-Stage Timeline Visualizer */}
              <div className="space-y-3">
                <h5 className="font-bold text-sm text-slate-900">
                  Precision Lifecycle Progress
                </h5>

                <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-indigo-100 ml-4 py-2">
                  {STAGES.map((stage, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage} className="relative">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-100'
                              : 'bg-white border-slate-300 text-slate-300'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          )}
                        </div>

                        {/* Stage details */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold text-xs ${
                                isCurrent
                                  ? 'text-indigo-700 font-heading text-sm'
                                  : isDone
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {stage}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                                In Progress
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {stage === 'Confirmed' && 'Payment verified. Frame queued in optical lab.'}
                            {stage === 'Prescription Review' && 'Certified optometrist verifies SPH/CYL/AXIS values.'}
                            {stage === 'Processing' && 'Frame picked from inventory and inspected for surface zero defects.'}
                            {stage === 'Lens Preparation' && 'Lenses custom CNC edged, coated with anti-glare, and fitted.'}
                            {stage === 'Dispatched' && `Handed to courier partner (${currentOrder.trackingNumber || 'BlueDart Air'}).`}
                            {stage === 'Delivered' && 'Delivered to your doorstep in luxury case.'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items in this Order */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <h5 className="font-bold text-sm text-slate-900">
                  Purchased Eyewear & Custom Lenses
                </h5>

                <div className="space-y-2">
                  {currentOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.selectedVariant.image}
                          alt={item.product.name}
                          className="w-12 h-10 object-contain bg-white rounded-lg p-1 border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">
                            {item.product.name} (Qty: {item.quantity})
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Color: {item.selectedVariant.colorName} • Lens: {item.lensSelection?.lensTypeName || 'Demo Clear'}
                          </div>
                        </div>
                      </div>

                      <div className="font-extrabold text-sm text-slate-900 font-heading">
                        ₹{item.totalPrice}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Optometrist Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    Delivery Address
                  </span>
                  <p className="text-slate-600">
                    {currentOrder.customerName} ({currentOrder.customerPhone})
                  </p>
                  <p className="text-slate-500">
                    {currentOrder.shippingAddress.addressLine}, {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-950">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Prescription Audit Status
                  </span>
                  <p className="font-semibold text-emerald-700">
                    Status: {currentOrder.prescriptionStatus}
                  </p>
                  <p className="text-[11px] text-emerald-900">
                    Verified with Japanese 0.01D lensometer calibration before dispatch.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500">
              No orders found. Place an order to start live tracking!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
