import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant } from '../types';
import {
  Camera,
  X,
  Upload,
  User,
  Sliders,
  RotateCw,
  Sparkles,
  Share2,
  Download,
  AlertCircle,
  Check,
  Glasses,
  Maximize2,
} from 'lucide-react';

const MODEL_PHOTOS = [
  { id: 'm-1', name: 'Rhea (Oval Face)', gender: 'Female', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', eyeY: 42, eyeGap: 24, bridgeY: 43 },
  { id: 'm-2', name: 'Kabir (Square Face)', gender: 'Male', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', eyeY: 40, eyeGap: 25, bridgeY: 41 },
  { id: 'm-3', name: 'Ananya (Round Face)', gender: 'Female', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', eyeY: 41, eyeGap: 23, bridgeY: 42 },
  { id: 'm-4', name: 'Arjun (Heart Face)', gender: 'Male', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', eyeY: 39, eyeGap: 26, bridgeY: 40 },
];

export const VirtualTryOnModal: React.FC = () => {
  const {
    isTryOnModalOpen,
    setIsTryOnModalOpen,
    selectedProductForTryOn,
    setSelectedProductForTryOn,
    products,
    openLensCustomizer,
    setActiveView,
  } = useStore();

  const [mode, setMode] = useState<'camera' | 'models' | 'upload'>('models');
  const [selectedModel, setSelectedModel] = useState(MODEL_PHOTOS[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Camera stream state
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // AR calibration controls
  const [frameScale, setFrameScale] = useState<number>(100); // 80% to 120%
  const [verticalOffset, setVerticalOffset] = useState<number>(0); // -20px to +20px
  const [rotationAngle, setRotationAngle] = useState<number>(0); // -15 deg to +15 deg
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [snapshotTaken, setSnapshotTaken] = useState<string | null>(null);

  const currentProduct = selectedProductForTryOn || products[0];
  const currentVariant: ProductVariant | undefined = currentProduct?.variants?.[selectedVariantIndex] || currentProduct?.variants?.[0];

  // Camera stream handler
  useEffect(() => {
    if (isTryOnModalOpen && mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isTryOnModalOpen, mode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasCameraPermission(true);
    } catch (err: any) {
      console.warn('Camera access denied or unsupported:', err);
      setHasCameraPermission(false);
      setCameraError('Camera access was not granted or is not supported. Switched to high-fidelity face models.');
      setMode('models');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  const captureSnapshot = () => {
    // Generate snapshot canvas
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 720, 720);

    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src =
      mode === 'camera' && videoRef.current
        ? '' // will fallback
        : mode === 'upload' && uploadedImage
        ? uploadedImage
        : selectedModel.url;

    bgImg.onload = () => {
      ctx.drawImage(bgImg, 0, 0, 720, 720);

      // Draw eyeglasses frame
      const frameImg = new Image();
      frameImg.crossOrigin = 'anonymous';
      frameImg.src = currentVariant.image;
      frameImg.onload = () => {
        const frameW = 340 * (frameScale / 100);
        const frameH = 150 * (frameScale / 100);
        const frameX = (720 - frameW) / 2;
        const frameY = 300 + verticalOffset;
        ctx.drawImage(frameImg, frameX, frameY, frameW, frameH);

        // Watermark branding
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.fillRect(0, 660, 720, 60);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Outfit, sans-serif';
        ctx.fillText('AR VISION Eye Care • 3D Virtual Try-On', 24, 695);
        ctx.fillStyle = '#f59e0b';
        ctx.font = '14px sans-serif';
        ctx.fillText(`${currentProduct.name} - ₹${currentProduct.sellingPrice}`, 460, 695);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setSnapshotTaken(dataUrl);
      };
    };

    // If camera mode without image load
    if (mode === 'camera' && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, 720, 720);
      const frameImg = new Image();
      frameImg.crossOrigin = 'anonymous';
      frameImg.src = currentVariant.image;
      frameImg.onload = () => {
        const frameW = 340 * (frameScale / 100);
        const frameH = 150 * (frameScale / 100);
        const frameX = (720 - frameW) / 2;
        const frameY = 300 + verticalOffset;
        ctx.drawImage(frameImg, frameX, frameY, frameW, frameH);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setSnapshotTaken(dataUrl);
      };
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out how the ${currentProduct.name} (${currentProduct.brand}) looks on me in AR Vision 3D Try-On! Price: ₹${currentProduct.sellingPrice}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!isTryOnModalOpen) return null;

  if (!currentProduct) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-white shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-heading">No Frames Available for 3D Try-On</h3>
          <p className="text-xs text-slate-400">
            Please add eyewear products from the Admin Portal to experience live 3D webcam try-on.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <button
              onClick={() => setIsTryOnModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                setIsTryOnModalOpen(false);
                setActiveView('admin-portal');
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-bold text-white transition cursor-pointer"
            >
              Open Admin Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-heading">
                  3D Virtual Try-On AR
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  REAL-TIME FIT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentProduct.brand} • {currentProduct.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Selector Tabs */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-xl text-xs">
              <button
                onClick={() => setMode('camera')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  mode === 'camera'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Webcam Live</span>
              </button>
              <button
                onClick={() => setMode('models')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  mode === 'models'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Model Faces</span>
              </button>
              <label
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition ${
                  mode === 'upload'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload Selfie</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <button
              onClick={() => setIsTryOnModalOpen(false)}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Close Try-On"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera Warning Banner if any */}
        {cameraError && (
          <div className="bg-amber-950/80 border-b border-amber-800/50 px-4 py-2 text-xs text-amber-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Main AR Display Viewport */}
        <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* 1. Live Camera Feed */}
          {mode === 'camera' && (
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              {/* Pupil tracking guide crosshair subtle overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-72 h-48 border border-cyan-400/30 rounded-3xl relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-cyan-300 bg-black/60 px-2 py-0.5 rounded-full font-mono">
                    Align Eyes with Guide
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Model Faces Feed */}
          {mode === 'models' && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedModel.url}
                alt={selectedModel.name}
                className="w-full h-full max-h-[500px] object-cover object-center"
              />
            </div>
          )}

          {/* 3. Uploaded Selfie Feed */}
          {mode === 'upload' && uploadedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={uploadedImage}
                alt="User Selfie"
                className="w-full h-full max-h-[500px] object-contain"
              />
            </div>
          )}

          {/* Eyewear AR Frame Overlay on Face */}
          <div
            className="absolute z-20 pointer-events-none transition-transform duration-75"
            style={{
              top: `${(mode === 'models' ? selectedModel.eyeY : 42) + verticalOffset / 10}%`,
              transform: `translate(-50%, -50%) scale(${frameScale / 100}) rotate(${rotationAngle}deg)`,
              left: '50%',
            }}
          >
            <div className="relative flex items-center justify-center">
              <img
                src={currentVariant?.image || currentProduct.images[0]}
                alt={currentProduct.name}
                className="w-72 sm:w-80 max-w-none drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
              />
              {/* Optical anti-reflective lens reflection gleam */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 via-white/20 to-transparent rounded-full opacity-60 mix-blend-overlay pointer-events-none" />
            </div>
          </div>

          {/* Floating AR Calibration Controls on bottom left */}
          <div className="absolute bottom-20 left-4 z-30 bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/10 space-y-2 text-xs w-48 hidden sm:block">
            <div className="flex items-center justify-between font-semibold text-slate-300">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-cyan-400" />
                Fit Calibrate
              </span>
              <button
                onClick={() => {
                  setFrameScale(100);
                  setVerticalOffset(0);
                  setRotationAngle(0);
                }}
                className="text-[10px] text-cyan-400 hover:underline"
              >
                Reset
              </button>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>Frame Scale</span>
                <span>{frameScale}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="125"
                value={frameScale}
                onChange={(e) => setFrameScale(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>Nose Height</span>
                <span>{verticalOffset > 0 ? `+${verticalOffset}` : verticalOffset}px</span>
              </div>
              <input
                type="range"
                min="-20"
                max="20"
                value={verticalOffset}
                onChange={(e) => setVerticalOffset(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Top Right Face Switcher when in Models Mode */}
          {mode === 'models' && (
            <div className="absolute top-4 right-4 z-30 flex gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
              {MODEL_PHOTOS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition ${
                    selectedModel.id === model.id ? 'border-cyan-400 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={`${model.name} (${model.gender})`}
                >
                  <img src={model.url} alt={model.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Snapshot Trigger Button on Right */}
          <div className="absolute bottom-20 right-4 z-30 flex flex-col gap-2">
            <button
              onClick={captureSnapshot}
              className="p-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg font-bold transition hover:scale-105 cursor-pointer"
              title="Snap & Save Look"
            >
              <Camera className="w-5 h-5" />
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition hover:scale-105 cursor-pointer"
              title="Share on WhatsApp"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Snapshot Modal Overlay if taken */}
        {snapshotTaken && (
          <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="max-w-sm w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Your AR Try-On Look
              </h4>
              <img
                src={snapshotTaken}
                alt="AR Try-On Snapshot"
                className="w-full rounded-xl border border-slate-800"
              />
              <div className="flex gap-2">
                <a
                  href={snapshotTaken}
                  download={`AR_Vision_${currentProduct.name.replace(/\s+/g, '_')}.jpg`}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Photo</span>
                </a>
                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
              <button
                onClick={() => setSnapshotTaken(null)}
                className="w-full py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Back to Try-On
              </button>
            </div>
          </div>
        )}

        {/* Bottom Eyewear Switcher Carousel */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 z-20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">
                Switch Eyewear:
              </span>
              <span className="text-xs text-cyan-400 font-bold">
                {currentProduct.name} (₹{currentProduct.sellingPrice})
              </span>
            </div>

            {/* Color variants of current frame */}
            {currentProduct.variants.length > 1 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">Color:</span>
                {currentProduct.variants.map((v: any, i: number) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantIndex(i)}
                    style={{ backgroundColor: v.colorHex }}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      selectedVariantIndex === i
                        ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-900 scale-110'
                        : 'border-slate-500'
                    }`}
                    title={v.colorName}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            {products.map((prod) => {
              const isSelected = prod.id === currentProduct.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProductForTryOn(prod);
                    setSelectedVariantIndex(0);
                  }}
                  className={`flex-shrink-0 w-28 p-2 rounded-xl border cursor-pointer transition flex flex-col items-center text-center ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-400 ring-1 ring-cyan-400 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-16 h-10 object-contain mb-1"
                  />
                  <span className="text-[10px] font-semibold text-slate-200 truncate w-full">
                    {prod.name}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400">
                    ₹{prod.sellingPrice}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Buy from Try-On CTA */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Approximate fit based on standard human pupillary distance (PD 63mm).
            </div>
            <button
              onClick={() => {
                setIsTryOnModalOpen(false);
                openLensCustomizer(currentProduct);
              }}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-lg transition cursor-pointer flex items-center gap-2"
            >
              <Glasses className="w-4 h-4" />
              <span>Select Lenses & Buy (₹{currentProduct.sellingPrice})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
