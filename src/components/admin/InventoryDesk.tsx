import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Minus,
  CheckCircle2,
  Bell,
  Clock,
  History,
  Mail,
  RotateCcw,
  Sparkles,
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export const InventoryDesk: React.FC = () => {
  const {
    products,
    websiteSettings,
    getUnitsSoldForProduct,
    inventoryMovements,
    adjustProductStock,
    getProductStock,
    backInStockSubscriptions,
    stockNotificationLogs,
    currentAdminUser,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'movements' | 'subscribers'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'All' | 'in_stock' | 'low_stock' | 'out_of_stock'>('All');

  // Adjustment Modal
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Purchase Order Replenishment');
  const [customReason, setCustomReason] = useState('');

  const lowStockThreshold = websiteSettings?.lowStockThreshold ?? 5;

  // Aggregated KPIs
  const totalProducts = products.length;
  const totalUnitsInStock = products.reduce((sum, p) => sum + getProductStock(p), 0);
  const totalUnitsSold = products.reduce((sum, p) => sum + getUnitsSoldForProduct(p.id), 0);
  const outOfStockCount = products.filter((p) => getProductStock(p) === 0).length;
  const lowStockCount = products.filter((p) => {
    const s = getProductStock(p);
    return s > 0 && s <= lowStockThreshold;
  }).length;
  const totalValuation = products.reduce((sum, p) => sum + getProductStock(p) * p.sellingPrice, 0);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const stock = getProductStock(p);
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (stockStatusFilter === 'out_of_stock' && stock > 0) return false;
      if (stockStatusFilter === 'low_stock' && (stock === 0 || stock > lowStockThreshold)) return false;
      if (stockStatusFilter === 'in_stock' && stock === 0) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [products, categoryFilter, stockStatusFilter, searchQuery, lowStockThreshold, getProductStock]);

  const handleApplyAdjustment = () => {
    if (!adjustingProduct) return;
    const finalReason = adjustReason === 'Other' ? customReason || 'Manual Inventory Correction' : adjustReason;
    adjustProductStock(adjustingProduct.id, adjustingProduct.variants[0]?.id, adjustDelta, finalReason);
    setAdjustingProduct(null);
    setAdjustDelta(10);
    setAdjustReason('Purchase Order Replenishment');
    setCustomReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Package className="w-3.5 h-3.5" />
            <span>Real-Time Atomic Inventory & Restock Automation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading">
            Stock & Inventory Dashboard
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Real-time stock deduction on customer checkout, automatic back-in-stock email notifications when restocked, and immutable movement audit logs.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'catalog' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Catalog Stock ({totalUnitsInStock})
          </button>
          <button
            onClick={() => setActiveSubTab('movements')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'movements' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Movement Audit Log ({inventoryMovements.length})
          </button>
          <button
            onClick={() => setActiveSubTab('subscribers')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === 'subscribers' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Restock Alerts ({backInStockSubscriptions.length})
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (Section 8 requirement) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Products</div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-heading">{totalProducts}</div>
          <div className="text-[10px] text-slate-500">Live SKUs</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Units in Stock</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 font-heading">{totalUnitsInStock}</div>
          <div className="text-[10px] text-slate-500">Across all variants</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Units Sold</div>
          <div className="text-xl sm:text-2xl font-black text-indigo-700 font-heading">{totalUnitsSold}</div>
          <div className="text-[10px] text-slate-500">From verified orders</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Low Stock (&le;{lowStockThreshold})</div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 font-heading">{lowStockCount}</div>
          <div className="text-[10px] text-amber-700 font-semibold">Replenish soon</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Out of Stock (=0)</div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 font-heading">{outOfStockCount}</div>
          <div className="text-[10px] text-rose-700 font-semibold">Email notify active</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stock Valuation</div>
          <div className="text-lg sm:text-xl font-black text-slate-900 font-heading truncate">
            ₹{totalValuation.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500">Retail Inventory value</div>
        </div>
      </div>

      {/* SUB-TAB 1: CATALOG STOCK MANAGEMENT */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search frame name, SKU, or brand..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="All">All Categories</option>
                <option value="Eyeglasses">Eyeglasses</option>
                <option value="Sunglasses">Sunglasses</option>
                <option value="Computer Glasses">Computer Glasses</option>
                <option value="Contact Lenses">Contact Lenses</option>
              </select>

              {/* Status Filter */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                {(['All', 'in_stock', 'low_stock', 'out_of_stock'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStockStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg transition ${
                      stockStatusFilter === st
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st === 'All'
                      ? 'All'
                      : st === 'in_stock'
                      ? 'In Stock'
                      : st === 'low_stock'
                      ? 'Low Stock'
                      : 'Out of Stock'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Product Name & Brand</th>
                    <th className="py-3 px-2">SKU</th>
                    <th className="py-3 px-2 text-right">Selling Price</th>
                    <th className="py-3 px-2 text-center">Units Sold</th>
                    <th className="py-3 px-2 text-center">Remaining Stock</th>
                    <th className="py-3 px-2 text-center">Inventory Health</th>
                    <th className="py-3 px-3 text-right">Stock Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredProducts.map((p) => {
                    const stock = getProductStock(p);
                    const unitsSold = getUnitsSoldForProduct(p.id);
                    const isOut = stock === 0;
                    const isLow = stock > 0 && stock <= lowStockThreshold;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-9 h-9 rounded-lg object-contain bg-slate-50 border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">{p.name}</div>
                              <div className="text-[11px] text-slate-400">
                                {p.brand} • {p.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-mono text-cyan-700 font-semibold">{p.sku}</td>
                        <td className="py-3 px-2 text-right font-mono font-bold text-slate-900">
                          ₹{p.sellingPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-indigo-700">{unitsSold}</td>
                        <td className="py-3 px-2 text-center font-mono">
                          <span
                            className={`font-black text-sm px-2 py-0.5 rounded-lg ${
                              isOut
                                ? 'bg-rose-100 text-rose-700'
                                : isLow
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {stock}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          {isOut ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              OUT OF STOCK
                            </span>
                          ) : isLow ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              LOW STOCK ALERT
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              OPTIMAL STOCK
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setAdjustingProduct(p);
                                setAdjustDelta(10);
                                setAdjustReason('Purchase Order Replenishment');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Adjust Stock Quantity & Log Reason"
                            >
                              <span>Adjust</span>
                            </button>
                            <button
                              onClick={() =>
                                adjustProductStock(p.id, p.variants[0]?.id, 20, 'Quick Restock (+20 units)')
                              }
                              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-bold transition cursor-pointer"
                              title="Quick Restock +20 units"
                            >
                              +20
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MOVEMENT AUDIT LOG */}
      {activeSubTab === 'movements' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-3 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-heading">
                Stock Movement & Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Automatic ledger tracking every order sale deduction, admin replenishment, and cancellation return.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {inventoryMovements.length} Total Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Movement ID</th>
                  <th className="py-2.5 px-2">Date & Time</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-2">SKU</th>
                  <th className="py-2.5 px-2 text-center">Type</th>
                  <th className="py-2.5 px-2 text-center">Delta</th>
                  <th className="py-2.5 px-2 text-center">Remaining Stock</th>
                  <th className="py-2.5 px-3">Reason / Details</th>
                  <th className="py-2.5 px-2">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                {inventoryMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{mov.id}</td>
                    <td className="py-3 px-2 text-[11px] text-slate-500 whitespace-nowrap">{mov.timestamp}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{mov.productName}</td>
                    <td className="py-3 px-2 font-mono text-cyan-700">{mov.sku}</td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          mov.type === 'sale'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : mov.type === 'restock'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : mov.type === 'cancellation_return'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {mov.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold">
                      <span className={mov.quantityChange > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-900">
                      {mov.remainingStock}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs">{mov.reason}</td>
                    <td className="py-3 px-2 text-[11px] font-semibold text-slate-800">{mov.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: OUT OF STOCK SUBSCRIBERS & RESTOCK NOTIFICATIONS */}
      {activeSubTab === 'subscribers' && (
        <div className="space-y-6">
          {/* Subscriptions Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-heading flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <span>Out-of-Stock Customer Alert Registrations</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Customers who submitted their email on out-of-stock product pages. Automatically notified when stock is replenished.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {backInStockSubscriptions.length} Subscribers
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Customer Email</th>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-2">SKU</th>
                    <th className="py-2.5 px-2">Subscribed Date</th>
                    <th className="py-2.5 px-2 text-center">Status</th>
                    <th className="py-2.5 px-2">Dispatched Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {backInStockSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No customer restock alert subscriptions logged yet.
                      </td>
                    </tr>
                  ) : (
                    backInStockSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-bold text-slate-900">{sub.customerEmail}</td>
                        <td className="py-3 px-3 font-semibold text-slate-800">{sub.productName}</td>
                        <td className="py-3 px-2 font-mono text-cyan-700">{sub.productSku}</td>
                        <td className="py-3 px-2 text-[11px] text-slate-500">{sub.subscribedAt}</td>
                        <td className="py-3 px-2 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              sub.status === 'notified'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {sub.status === 'notified' ? 'Email Sent' : 'Pending Restock'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-[11px] text-slate-500">
                          {sub.notifiedAt ? new Date(sub.notifiedAt).toLocaleString('en-IN') : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sent Notifications Log */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-xs font-heading flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-emerald-600" />
                <span>Restock Notification Dispatch Audit Log ({stockNotificationLogs.length})</span>
              </h4>
            </div>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {stockNotificationLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">
                      Sent to: <span className="font-mono text-indigo-700">{log.customerEmail}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{log.subject}</div>
                  </div>
                  <div className="text-right text-[11px] space-y-0.5">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {log.status} ({log.channel})
                    </span>
                    <div className="text-slate-400 font-mono">{log.sentAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold font-heading">
                Adjust Product Stock Level
              </h3>
              <button onClick={() => setAdjustingProduct(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm">{adjustingProduct.name}</div>
                <div className="text-slate-500 font-mono">SKU: {adjustingProduct.sku}</div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-600">Current Available Stock:</span>
                  <strong className="font-mono text-sm text-slate-900">
                    {getProductStock(adjustingProduct)} units
                  </strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Quantity Adjustment (positive to add stock, negative to reduce)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustDelta((prev) => prev - 5)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(Number(e.target.value))}
                    className="flex-1 px-3 py-2 text-center text-sm font-bold font-mono border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustDelta((prev) => prev + 5)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  New stock will be:{' '}
                  <strong className="font-mono text-slate-900">
                    {Math.max(0, getProductStock(adjustingProduct) + adjustDelta)} units
                  </strong>
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Reason for Adjustment *
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                >
                  <option value="Purchase Order Replenishment">Purchase Order Replenishment (PO)</option>
                  <option value="Factory Stock Intake">Factory Stock Intake</option>
                  <option value="Customer Return Restock">Customer Return Restock</option>
                  <option value="Damaged Frame / Optical Lab Scrap">Damaged Frame / Optical Lab Scrap (-)</option>
                  <option value="Inventory Physical Count Correction">Inventory Physical Count Correction</option>
                  <option value="Other">Other (Specify Below)</option>
                </select>
              </div>

              {adjustReason === 'Other' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Custom Reason</label>
                  <input
                    type="text"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Describe reason for audit log..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              )}

              {getProductStock(adjustingProduct) === 0 && adjustDelta > 0 && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    This product was out of stock. Restocking will automatically dispatch email notifications to all waiting subscribers!
                  </span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAdjustingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyAdjustment}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition shadow-md"
                >
                  Save & Update Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

