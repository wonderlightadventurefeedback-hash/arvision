import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeft,
  X,
  ShoppingBag,
  Package,
  Truck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const MyOrdersModal: React.FC = () => {
  const {
    activeAccountModal,
    setActiveAccountModal,
    orders,
    setIsOrderTrackingOpen,
    setActiveTrackingOrder,
  } = useStore();

  if (activeAccountModal !== 'orders') return null;

  const handleTrack = (order: (typeof orders)[0]) => {
    setActiveAccountModal(null);
    setActiveTrackingOrder(order);
    setIsOrderTrackingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100 font-sans"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveAccountModal(null)}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 transition text-slate-800 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              My Orders
            </h2>
          </div>
          <button
            onClick={() => setActiveAccountModal(null)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
              <p className="text-xs text-slate-400">
                Explore our eyeglasses and sunglasses collection to place your first order.
              </p>
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {ord.orderNumber}
                    </span>
                    <p className="text-[10px] text-slate-400">{ord.createdAt}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      ord.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.orderStatus === 'Dispatched'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ord.orderStatus}
                  </span>
                </div>

                <div className="space-y-2">
                  {ord.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={it.selectedVariant.image || it.product.images[0]}
                          alt={it.product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">
                            {it.product.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Qty: {it.quantity} • {it.selectedVariant.colorName}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        ₹{it.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400">Total Amount</span>
                    <p className="font-extrabold text-sm text-slate-900">
                      ₹{ord.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleTrack(ord)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Track Package</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

