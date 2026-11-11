import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdPoster } from '../../types';
import { AdminCameraCapture } from './AdminCameraCapture';
import {
  Plus,
  Upload,
  Camera,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Copy,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';

export const AdPosterManager: React.FC = () => {
  const { adPosters, addAdPoster, updateAdPoster, deleteAdPoster, activeScheduledPoster } = useStore();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPoster, setEditingPoster] = useState<AdPoster | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraField, setCameraField] = useState<'imageUrl' | 'mobileImage' | 'tabletImage'>('imageUrl');
  const [previewPoster, setPreviewPoster] = useState<AdPoster | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mobileImage, setMobileImage] = useState('');
  const [tabletImage, setTabletImage] = useState('');
  const [ctaText, setCtaText] = useState('Explore Collection');
  const [ctaLink, setCtaLink] = useState('Eyeglasses');
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState<'active' | 'inactive' | 'draft' | 'paused'>('active');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [repeatSchedule, setRepeatSchedule] = useState<'daily' | 'weekly' | 'none'>('daily');
  const [timeZone, setTimeZone] = useState('Asia/Kolkata');

  const openCreateModal = () => {
    setEditingPoster(null);
    setTitle('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1400&q=80');
    setMobileImage('');
    setTabletImage('');
    setCtaText('Shop Now');
    setCtaLink('Eyeglasses');
    setPriority(adPosters.length + 1);
    setStatus('active');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setStartTime('10:00');
    setEndTime('11:00');
    setDurationMinutes(60);
    setRepeatSchedule('daily');
    setTimeZone('Asia/Kolkata');
    setIsEditorOpen(true);
  };

  const openEditModal = (poster: AdPoster) => {
    setEditingPoster(poster);
    setTitle(poster.title);
    setDescription(poster.description || '');
    setImageUrl(poster.imageUrl || poster.desktopImage || '');
    setMobileImage(poster.mobileImage || '');
    setTabletImage(poster.tabletImage || '');
    setCtaText(poster.ctaText || 'Shop Now');
    setCtaLink(poster.ctaLink || 'Eyeglasses');
    setPriority(poster.priority || 1);
    setStatus(poster.status);
    setStartDate(poster.startDate || '');
    setEndDate(poster.endDate || '');
    setStartTime(poster.startTime || '10:00');
    setEndTime(poster.endTime || '11:00');
    setDurationMinutes(poster.durationMinutes || 60);
    setRepeatSchedule(poster.repeatSchedule || 'daily');
    setTimeZone(poster.timeZone || 'Asia/Kolkata');
    setIsEditorOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert('Please fill in the Poster Title and Image URL.');
      return;
    }

    if (editingPoster) {
      updateAdPoster(editingPoster.id, {
        title,
        description,
        imageUrl,
        desktopImage: imageUrl,
        mobileImage,
        tabletImage,
        ctaText,
        ctaLink,
        priority: Number(priority),
        status,
        startDate,
        endDate,
        startTime,
        endTime,
        durationMinutes: Number(durationMinutes),
        repeatSchedule,
        timeZone,
      });
    } else {
      addAdPoster({
        title,
        description,
        imageUrl,
        desktopImage: imageUrl,
        mobileImage,
        tabletImage,
        ctaText,
        ctaLink,
        priority: Number(priority),
        status,
        startDate,
        endDate,
        startTime,
        endTime,
        durationMinutes: Number(durationMinutes),
        repeatSchedule,
        timeZone,
      });
    }
    setIsEditorOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'imageUrl' | 'mobileImage' | 'tabletImage') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (targetField === 'imageUrl') setImageUrl(result);
        if (targetField === 'mobileImage') setMobileImage(result);
        if (targetField === 'tabletImage') setTabletImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: string, posterTitle: string) => {
    if (window.confirm(`Are you sure you want to delete advertisement poster "${posterTitle}"?`)) {
      deleteAdPoster(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Time-Slot Automated Scheduler</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading">
            Advertisement Poster Manager
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Upload and schedule rotating promotional posters. Posters automatically switch on the homepage based on time-slots, with responsive images for desktop, tablet, and mobile.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Ad Poster</span>
        </button>
      </div>

      {/* Currently Live Scheduled Poster Banner */}
      {activeScheduledPoster && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/30 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Currently Live on Homepage
              </div>
              <div className="text-sm font-bold text-white">
                {activeScheduledPoster.title} ({activeScheduledPoster.startTime || '00:00'} - {activeScheduledPoster.endTime || '23:59'})
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPreviewPoster(activeScheduledPoster);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Preview Live Poster</span>
            </button>
            <button
              onClick={() => openEditModal(activeScheduledPoster)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Live Poster</span>
            </button>
          </div>
        </div>
      )}

      {/* Posters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adPosters.map((poster) => {
          const isCurrentlyActive = activeScheduledPoster?.id === poster.id;
          return (
            <div
              key={poster.id}
              className={`relative bg-white rounded-2xl border overflow-hidden flex flex-col transition shadow-sm hover:shadow-md ${
                isCurrentlyActive ? 'border-emerald-500 ring-2 ring-emerald-400/40' : 'border-slate-200'
              }`}
            >
              {/* Poster Thumbnail */}
              <div className="relative aspect-16/9 bg-slate-900 overflow-hidden group">
                <img
                  src={poster.imageUrl}
                  alt={poster.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      poster.status === 'active'
                        ? 'bg-emerald-600 text-white'
                        : poster.status === 'draft'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {poster.status}
                  </span>
                  {isCurrentlyActive && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 animate-pulse">
                      Live Now
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-white">
                  Priority: #{poster.priority}
                </div>
              </div>

              {/* Poster Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{poster.title}</h4>
                  {poster.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {poster.description}
                    </p>
                  )}
                </div>

                {/* Schedule Info Box */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1 font-mono text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-600" />
                      <span>Slot Time:</span>
                    </span>
                    <strong className="text-slate-900 font-bold">
                      {poster.startTime || '00:00'} - {poster.endTime || '23:59'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>Repeat:</span>
                    </span>
                    <span className="capitalize font-semibold text-indigo-700">
                      {poster.repeatSchedule || 'Daily'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewPoster(poster)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition"
                      title="Preview Poster"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(poster)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-indigo-600 transition"
                      title="Edit Poster"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        updateAdPoster(poster.id, {
                          status: poster.status === 'active' ? 'inactive' : 'active',
                        })
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                        poster.status === 'active'
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {poster.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(poster.id, poster.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Poster"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <h3 className="text-base font-bold font-heading">
                {editingPoster ? 'Edit Advertisement Poster' : 'Create Advertisement Poster'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-900 dark:text-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Poster Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Morning Focus: Titanium Frames"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium border border-slate-300 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium border border-slate-300 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none"
                  >
                    <option value="active">Active (Published to Rotation)</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Description / Subtitle</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Ultra-lightweight Japanese aerospace-grade titanium frames."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium border border-slate-300 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none"
                />
              </div>

              {/* Image Upload / Capture Section */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">Poster Media & Camera Upload</div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    Desktop Image URL / Upload *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://... or upload file"
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-mono text-xs border border-slate-300 dark:border-slate-700 rounded-xl focus:border-indigo-500 outline-none"
                    />
                    <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl cursor-pointer flex items-center gap-1 font-semibold">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'imageUrl')}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setCameraField('imageUrl');
                        setIsCameraOpen(true);
                      }}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Camera</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Mobile Banner (Optional)
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={mobileImage}
                        onChange={(e) => setMobileImage(e.target.value)}
                        placeholder="Mobile image URL"
                        className="flex-1 px-3 py-1.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl font-mono text-xs"
                      />
                      <label className="p-2 bg-slate-200 hover:bg-slate-300 rounded-xl cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-slate-700" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'mobileImage')}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Tablet Banner (Optional)
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={tabletImage}
                        onChange={(e) => setTabletImage(e.target.value)}
                        placeholder="Tablet image URL"
                        className="flex-1 px-3 py-1.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl font-mono text-xs"
                      />
                      <label className="p-2 bg-slate-200 hover:bg-slate-300 rounded-xl cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-slate-700" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'tabletImage')}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                <div className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Rotation Schedule Configuration</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white text-slate-900 font-mono border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white text-slate-900 font-mono border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white text-slate-900 font-mono border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white text-slate-900 font-mono border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Repeat Cycle</label>
                    <select
                      value={repeatSchedule}
                      onChange={(e) => setRepeatSchedule(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white text-slate-900 font-medium border border-slate-300 rounded-xl"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="none">One Time Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Priority Order</label>
                    <input
                      type="number"
                      min={1}
                      value={priority}
                      onChange={(e) => setPriority(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono border border-slate-300 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Time Zone</label>
                    <input
                      type="text"
                      disabled
                      value={timeZone}
                      className="w-full px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-500 dark:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Explore Titanium"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Destination Link</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="e.g. Eyeglasses or Sunglasses"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold transition shadow-md cursor-pointer"
                >
                  {editingPoster ? 'Update Poster' : 'Create & Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewPoster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold font-heading">Poster Preview:</span>
                <span className="text-xs text-indigo-300">{previewPoster.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded-md ${previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1.5 rounded-md ${previewDevice === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                    title="Tablet Preview"
                  >
                    <Tablet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded-md ${previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                    title="Mobile Preview"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setPreviewPoster(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex items-center justify-center bg-slate-100 min-h-[350px]">
              <div
                className={`transition-all duration-300 rounded-2xl overflow-hidden shadow-xl bg-slate-950 text-white ${
                  previewDevice === 'mobile'
                    ? 'w-[360px]'
                    : previewDevice === 'tablet'
                    ? 'w-[640px]'
                    : 'w-full max-w-3xl'
                }`}
              >
                <div className="relative aspect-16/9 overflow-hidden">
                  <img
                    src={
                      previewDevice === 'mobile' && previewPoster.mobileImage
                        ? previewPoster.mobileImage
                        : previewDevice === 'tablet' && previewPoster.tabletImage
                        ? previewPoster.tabletImage
                        : previewPoster.imageUrl
                    }
                    alt={previewPoster.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent flex items-center p-6 sm:p-10">
                    <div className="max-w-xs sm:max-w-sm space-y-2">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-400 text-slate-950">
                        Scheduled Special
                      </span>
                      <h3 className="text-lg sm:text-2xl font-black font-heading leading-tight">
                        {previewPoster.title}
                      </h3>
                      {previewPoster.description && (
                        <p className="text-xs text-slate-300 line-clamp-2">
                          {previewPoster.description}
                        </p>
                      )}
                      {previewPoster.ctaText && (
                        <div className="pt-1">
                          <button className="px-3.5 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs flex items-center gap-1">
                            <span>{previewPoster.ctaText}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Device Camera Modal */}
      {isCameraOpen && (
        <AdminCameraCapture
          isOpen={isCameraOpen}
          onCapture={(capturedDataUrl) => {
            if (cameraField === 'imageUrl') setImageUrl(capturedDataUrl);
            if (cameraField === 'mobileImage') setMobileImage(capturedDataUrl);
            if (cameraField === 'tabletImage') setTabletImage(capturedDataUrl);
            setIsCameraOpen(false);
          }}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
};

