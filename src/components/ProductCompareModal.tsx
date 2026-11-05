import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Trash2,
  Eye,
  Star,
  Check,
  Glasses,
  Scale,
} from 'lucide-react';

export const ProductCompareModal: React.FC = () => {
  const {
    isCompareModalOpen,
    setIsCompareModalOpen,
    comparisonList,
    products,
    toggleCompare,
    clearCompare,
    openLensCustomizer,
    openPDP,
  } = useStore();

  if (!isCompareModalOpen) return null;

  const comparedProducts = products.filter((p) => comparisonList.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold font-heading">
                Side-by-Side Optical Comparison Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Compare dimensions, materials, weights, and optical fits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1">
          {comparedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Scale className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">
                No frames selected for comparison
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the "Compare" checkbox on any product card in the catalog to inspect up to 4 frames side-by-side.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 font-bold text-slate-400 w-36">Frame Spec</th>
                    {comparedProducts.map((p) => (
                      <th key={p.id} className="py-3 px-4 min-w-[200px] text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={() => toggleCompare(p.id)}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-slate-200 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition"
                            title="Remove from comparison"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-32 h-20 object-contain mx-auto"
                          />
                        </div>
                        <h5 className="font-bold text-slate-900 mt-2 text-xs line-clamp-1">
                          {p.name}
                        </h5>
                        <div className="text-[11px] text-indigo-700 font-bold uppercase mt-0.5">
                          {p.brand}
                        </div>
                        <div className="text-sm font-extrabold text-slate-900 mt-1">
                          ₹{p.sellingPrice}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">Frame Shape</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center text-slate-800 font-bold">
                        {p.shape}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">Material</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center text-slate-800">
                        {p.material}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">Weight (Grams)</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center font-bold text-indigo-700">
                        {p.weight} grams
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">Lens Width</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center font-mono">
                        {p.dimensions.lensWidth} mm
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">Bridge Width</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center font-mono">
                        {p.dimensions.bridgeWidth} mm
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">Temple Length</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center font-mono">
                        {p.dimensions.templeLength} mm
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">Rating</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                          {p.rating} ({p.reviewCount})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">BOGO Eligible</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center font-bold">
                        {p.isBogoEligible ? (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            YES (Buy 1 Get 1)
                          </span>
                        ) : (
                          <span className="text-slate-400">Regular</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-700 bg-slate-50">Quick Actions</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="py-3 px-4 text-center space-y-1.5">
                        <button
                          onClick={() => {
                            setIsCompareModalOpen(false);
                            openPDP(p);
                          }}
                          className="w-full py-1.5 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-[11px] flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-indigo-600" />
                          <span>View Specs</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsCompareModalOpen(false);
                            openLensCustomizer(p);
                          }}
                          className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center gap-1"
                        >
                          <Glasses className="w-3 h-3" />
                          <span>Buy (₹{p.sellingPrice})</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
