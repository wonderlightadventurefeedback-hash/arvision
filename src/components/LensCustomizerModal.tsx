import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { LensSelection } from '../types';
import {
  X,
  Check,
  Eye,
  Shield,
  Sun,
  Layers,
  FileText,
  Upload,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const LensCustomizerModal: React.FC = () => {
  const {
    isLensCustomizerOpen,
    setIsLensCustomizerOpen,
    productForLensCustomizer,
    addToCart,
    setIsCartOpen,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Configuration selections
  const [visionType, setVisionType] = useState<'single_vision' | 'bifocal' | 'progressive' | 'zero_power'>('single_vision');
  const [lensType, setLensType] = useState<'blue_shield' | 'anti_reflective' | 'photochromic' | 'polarized'>('blue_shield');
  const [lensIndex, setLensIndex] = useState<'1.56_standard' | '1.60_thin' | '1.67_ultrathin'>('1.60_thin');

  // Prescription intake method
  const [prescriptionMethod, setPrescriptionMethod] = useState<'manual' | 'upload' | 'later'>('manual');
  const [odSph, setOdSph] = useState('-1.50');
  const [odCyl, setOdCyl] = useState('-0.50');
  const [odAxis, setOdAxis] = useState('90');
  const [odAdd, setOdAdd] = useState('0.00');
  const [osSph, setOsSph] = useState('-1.75');
  const [osCyl, setOsCyl] = useState('-0.25');
  const [osAxis, setOsAxis] = useState('85');
  const [osAdd, setOsAdd] = useState('0.00');
  const [pd, setPd] = useState('63');
  const [uploadedRxName, setUploadedRxName] = useState<string>('');

  if (!isLensCustomizerOpen || !productForLensCustomizer) return null;

  // Real-time lens pricing rules
  let baseLensPrice = 0;
  if (visionType === 'single_vision') baseLensPrice = 0; // standard single vision included with frame
  else if (visionType === 'zero_power') baseLensPrice = 0;
  else if (visionType === 'bifocal') baseLensPrice = 990;
  else if (visionType === 'progressive') baseLensPrice = 1890;

  let coatingPrice = 0;
  if (lensType === 'anti_reflective') coatingPrice = 390;
  else if (lensType === 'blue_shield') coatingPrice = 690;
  else if (lensType === 'photochromic') coatingPrice = 1490;
  else if (lensType === 'polarized') coatingPrice = 1690;

  let indexPrice = 0;
  if (lensIndex === '1.56_standard') indexPrice = 0;
  else if (lensIndex === '1.60_thin') indexPrice = 600;
  else if (lensIndex === '1.67_ultrathin') indexPrice = 1400;

  const totalLensPrice = baseLensPrice + coatingPrice + indexPrice;
  const grandTotal = productForLensCustomizer.sellingPrice + totalLensPrice;

  const handleFinishCustomization = () => {
    const lensSelection: LensSelection = {
      visionType,
      visionTypeName:
        visionType === 'single_vision'
          ? 'Single Vision Distance/Reading'
          : visionType === 'progressive'
          ? 'Progressive Multifocal (No Line)'
          : visionType === 'bifocal'
          ? 'Bifocal Dual Power'
          : 'Zero Power (Screen Shield)',
      lensType,
      lensTypeName:
        lensType === 'blue_shield'
          ? 'AR Blue Cut Digital Shield'
          : lensType === 'photochromic'
          ? 'Photochromic Sun-to-Clear'
          : lensType === 'polarized'
          ? 'DriveSafe Polarized'
          : 'Zero Glare Anti-Reflective',
      lensIndex,
      lensIndexName:
        lensIndex === '1.67_ultrathin'
          ? '1.67 Ultra-Thin Aspheric'
          : lensIndex === '1.60_thin'
          ? '1.60 Thin Hi-Index'
          : '1.56 Standard Index',
      price: totalLensPrice,
      prescriptionDetails: {
        method: prescriptionMethod,
        odSph,
        odCyl,
        odAxis,
        odAdd,
        osSph,
        osCyl,
        osAxis,
        osAdd,
        pd,
        fileName: uploadedRxName || undefined,
      },
    };

    addToCart(productForLensCustomizer, productForLensCustomizer.variants[0], lensSelection);
    setIsLensCustomizerOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={productForLensCustomizer.images[0]}
              alt={productForLensCustomizer.name}
              className="w-12 h-8 object-contain bg-white/10 rounded-md p-1"
            />
            <div>
              <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Step-by-Step Lens Customizer
              </div>
              <h3 className="text-base font-bold text-white">
                {productForLensCustomizer.name}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsLensCustomizerOpen(false)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-4 border-b border-slate-200 text-xs font-semibold text-center bg-slate-50">
          <button
            onClick={() => setStep(1)}
            className={`py-3 px-2 border-b-2 transition ${
              step === 1
                ? 'border-indigo-600 text-indigo-700 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Vision Need
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-3 px-2 border-b-2 transition ${
              step === 2
                ? 'border-indigo-600 text-indigo-700 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            2. Lens Tech & Coating
          </button>
          <button
            onClick={() => setStep(3)}
            className={`py-3 px-2 border-b-2 transition ${
              step === 3
                ? 'border-indigo-600 text-indigo-700 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            3. Index & Thinness
          </button>
          <button
            onClick={() => setStep(4)}
            className={`py-3 px-2 border-b-2 transition ${
              step === 4
                ? 'border-indigo-600 text-indigo-700 bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            4. Prescription
          </button>
        </div>

        {/* Step Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: VISION NEED */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-heading">
                  What vision correction do you require?
                </h4>
                <p className="text-xs text-slate-500">
                  Select your prescription type. If you wear glasses solely for computer screen protection, pick Zero Power.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'single_vision',
                    title: 'Single Vision (Standard)',
                    desc: 'Corrects either Distance OR Reading power. Most common prescription.',
                    badge: 'INCLUDED WITH FRAME',
                    price: 0,
                  },
                  {
                    id: 'zero_power',
                    title: 'Zero Power (Screen Shield)',
                    desc: 'No medical power needed. Pure blue-cut digital protection for coders and students.',
                    badge: 'INCLUDED WITH FRAME',
                    price: 0,
                  },
                  {
                    id: 'progressive',
                    title: 'Progressive Multifocal',
                    desc: 'Seamless vision for Distance, Intermediate computer, and Reading without ugly lines.',
                    badge: '+₹1,890',
                    price: 1890,
                  },
                  {
                    id: 'bifocal',
                    title: 'Bifocal Dual Power',
                    desc: 'Traditional split D-segment lens with distinct upper distance and lower reading powers.',
                    badge: '+₹990',
                    price: 990,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setVisionType(item.id as any)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      visionType === item.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.title}
                        </span>
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Doctor Verified Optical Standard</span>
                      {visionType === item.id && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: LENS TECH & COATING */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-heading">
                  Choose your lens coating & optical protection
                </h4>
                <p className="text-xs text-slate-500">
                  Every AR VISION lens includes standard scratch resistance and 100% UV400 blocking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'blue_shield',
                    title: 'AR Blue Shield Pro',
                    desc: 'Blocks 98% harmful blue light from monitors & phones. Reduces eye fatigue and headaches.',
                    price: 690,
                    popular: true,
                  },
                  {
                    id: 'photochromic',
                    title: 'Photochromic Sun-to-Clear',
                    desc: 'Lenses turn dark sunglasses outdoors in sunlight and clear crystal indoors.',
                    price: 1490,
                  },
                  {
                    id: 'anti_reflective',
                    title: 'Zero Glare Ultra Clarity',
                    desc: 'Multi-layer green anti-reflective coating for crystal clarity and night driving reflections.',
                    price: 390,
                  },
                  {
                    id: 'polarized',
                    title: 'DriveSafe Polarized',
                    desc: 'Eliminates blinding roadway and water surface glare. Enhanced contrast for motorists.',
                    price: 1690,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setLensType(item.id as any)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      lensType === item.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.title}
                        </span>
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full">
                          +₹{item.price}
                        </span>
                      </div>
                      {item.popular && (
                        <span className="inline-block text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded mb-1">
                          DOCTOR CHOICE
                        </span>
                      )}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Hydrophobic & Oleophobic Smudge Proof</span>
                      {lensType === item.id && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: INDEX & THINNESS */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-heading">
                  Select Lens Index (Thinness)
                </h4>
                <p className="text-xs text-slate-500">
                  Higher index numbers refract light more efficiently, making the lens flatter, lighter, and thinner at the edges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: '1.56_standard',
                    title: 'Standard 1.56',
                    ideal: 'Powers 0.00 to ±2.00',
                    thickness: 'Standard Thickness',
                    price: 0,
                    badge: 'Standard Included',
                  },
                  {
                    id: '1.60_thin',
                    title: 'Thin 1.60 Hi-Index',
                    ideal: 'Powers ±2.00 to ±4.50',
                    thickness: '25% Thinner & Lighter',
                    price: 600,
                    badge: '+₹600 (Recommended)',
                  },
                  {
                    id: '1.67_ultrathin',
                    title: 'Ultra-Thin 1.67',
                    ideal: 'Powers ±4.50 to ±10.00',
                    thickness: '40% Thinner Aspheric',
                    price: 1400,
                    badge: '+₹1,400 Featherweight',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setLensIndex(item.id as any)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                      lensIndex === item.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-indigo-700 mb-1">
                        {item.badge}
                      </div>
                      <h5 className="font-bold text-slate-900 text-sm">
                        {item.title}
                      </h5>
                      <p className="text-xs font-semibold text-emerald-700 mt-1">
                        {item.thickness}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-2">
                        Best suited for: {item.ideal}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>German Optic Lens</span>
                      {lensIndex === item.id && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: PRESCRIPTION INTAKE */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-heading">
                  How would you like to provide your prescription?
                </h4>
                <p className="text-xs text-slate-500">
                  Don't worry if you don't have it right now. You can place the order and WhatsApp us your slip afterwards!
                </p>
              </div>

              {/* Method Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setPrescriptionMethod('manual')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    prescriptionMethod === 'manual'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Enter Power Values
                </button>
                <button
                  onClick={() => setPrescriptionMethod('upload')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    prescriptionMethod === 'upload'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload Doctor Slip
                </button>
                <button
                  onClick={() => setPrescriptionMethod('later')}
                  className={`flex-1 py-2 rounded-lg transition ${
                    prescriptionMethod === 'later'
                      ? 'bg-white text-indigo-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Submit Later on WhatsApp
                </button>
              </div>

              {/* Option A: Manual Entry Grid */}
              {prescriptionMethod === 'manual' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                  <div className="text-xs font-bold text-slate-800">
                    Enter Optical Values (from doctor slip)
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500">
                          <th className="py-2">Eye</th>
                          <th className="py-2">SPH (Sphere)</th>
                          <th className="py-2">CYL (Cylinder)</th>
                          <th className="py-2">AXIS (Angle)</th>
                          <th className="py-2">ADD (Near)</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        <tr>
                          <td className="py-2 font-bold text-slate-800">OD (Right Eye)</td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={odSph}
                              onChange={(e) => setOdSph(e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-center"
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={odCyl}
                              onChange={(e) => setOdCyl(e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-center"
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={odAxis}
                              onChange={(e) => setOdAxis(e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-center"
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={odAdd}
                              onChange={(e) => setOdAdd(e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-center"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 font-bold text-slate-800">OS (Left Eye)</td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={osSph}
                              onChange={(e) => setOsSph(e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-center"
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={osCyl}
                              onChange={(e) => setOsCyl(e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-center"
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={osAxis}
                              onChange={(e) => setOsAxis(e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-center"
                            />
                          </td>
                          <td className="py-1">
                            <input
                              type="text"
                              value={osAdd}
                              onChange={(e) => setOsAdd(e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-center"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-700">
                      Pupillary Distance (PD):
                    </span>
                    <input
                      type="text"
                      value={pd}
                      onChange={(e) => setPd(e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-center text-xs"
                    />
                    <span className="text-[11px] text-slate-500">
                      mm (Default 63mm works for 95% adults)
                    </span>
                  </div>
                </div>
              )}

              {/* Option B: Photo Upload */}
              {prescriptionMethod === 'upload' && (
                <div className="p-8 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl text-center space-y-3">
                  <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
                  <div>
                    <h5 className="font-bold text-sm text-slate-800">
                      Drag & Drop or Take Photo of Prescription
                    </h5>
                    <p className="text-xs text-slate-500">
                      PNG, JPG, or PDF (Our optometrist will verify before edging)
                    </p>
                  </div>
                  <label className="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition">
                    Browse File
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setUploadedRxName(file.name);
                      }}
                      className="hidden"
                    />
                  </label>
                  {uploadedRxName && (
                    <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Uploaded: {uploadedRxName}
                    </div>
                  )}
                </div>
              )}

              {/* Option C: WhatsApp Later */}
              {prescriptionMethod === 'later' && (
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-amber-950 mb-1">
                      No prescription with you right now?
                    </h5>
                    <p className="leading-relaxed">
                      Complete your order today to lock in the festival BOGO pricing. Our customer care team will text you on WhatsApp or email you a private link to upload your prescription at your convenience.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Bar: Itemized Summary & Step Controls */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-slate-500">
              Frame ₹{productForLensCustomizer.sellingPrice} + Custom Lenses ₹{totalLensPrice}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900 font-heading">
                Total: ₹{grandTotal}
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                (Inclusive of 1-Year Coating Warranty)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
              >
                Back
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishCustomization}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-extrabold shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm & Add to Cart (₹{grandTotal})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
