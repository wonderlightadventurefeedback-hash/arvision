import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  FileText,
  ShieldCheck,
  Calendar,
  Download,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export const PrescriptionVaultModal: React.FC = () => {
  const {
    isPrescriptionVaultOpen,
    setIsPrescriptionVaultOpen,
    savedPrescriptions,
  } = useStore();

  if (!isPrescriptionVaultOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold font-heading">
                Customer Prescription Vault
              </h3>
              <p className="text-xs text-slate-400">
                Encrypted optical prescriptions for 1-click checkout
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsPrescriptionVaultOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm">
              Saved Prescriptions ({savedPrescriptions.length})
            </span>
            <button
              onClick={() => alert('New prescription intake form is integrated into the 4-step Lens Customizer during checkout.')}
              className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Prescription</span>
            </button>
          </div>

          <div className="space-y-3">
            {savedPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {rx.label}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      VERIFIED DOCTOR RX
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono">
                    Issued: {rx.date}
                  </span>
                </div>

                <p className="text-slate-500 text-[11px]">
                  Doctor: {rx.doctorName} • Pupillary Distance: <strong className="text-slate-800 font-bold">{rx.pd}</strong>
                </p>

                {/* Prescription Optical Grid */}
                <div className="bg-white rounded-xl border border-slate-200 p-2.5 overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="py-1 font-sans">Eye</th>
                        <th className="py-1">SPH</th>
                        <th className="py-1">CYL</th>
                        <th className="py-1">AXIS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1 font-sans font-bold text-slate-700">OD (Right)</td>
                        <td className="py-1 text-indigo-700 font-bold">{rx.od.sph}</td>
                        <td className="py-1 text-slate-800">{rx.od.cyl}</td>
                        <td className="py-1 text-slate-800">{rx.od.axis}°</td>
                      </tr>
                      <tr>
                        <td className="py-1 font-sans font-bold text-slate-700">OS (Left)</td>
                        <td className="py-1 text-indigo-700 font-bold">{rx.os.sph}</td>
                        <td className="py-1 text-slate-800">{rx.os.cyl}</td>
                        <td className="py-1 text-slate-800">{rx.os.axis}°</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-emerald-700 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Standard Annual Retest Recommended
                  </span>
                  <button
                    onClick={() => alert(`Downloading verified prescription card for ${rx.label}...`)}
                    className="text-indigo-600 hover:underline font-bold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
