import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { HomepageVideo } from '../../types';
import {
  Plus,
  Play,
  Pause,
  Upload,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  MoveUp,
  MoveDown,
  Volume2,
  Film,
  RotateCw,
} from 'lucide-react';

export const HomepageVideoManager: React.FC = () => {
  const { homepageVideos, addHomepageVideo, updateHomepageVideo, deleteHomepageVideo, activeScheduledVideo } = useStore();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<HomepageVideo | null>(null);
  const [previewingVideo, setPreviewingVideo] = useState<HomepageVideo | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [ctaText, setCtaText] = useState('Explore Collection');
  const [ctaLink, setCtaLink] = useState('Eyeglasses');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [order, setOrder] = useState(1);
  const [status, setStatus] = useState<'active' | 'inactive' | 'draft' | 'scheduled'>('active');

  const openCreateModal = () => {
    setEditingVideo(null);
    setTitle('');
    setDescription('');
    setVideoUrl('/videos/hero-video.mp4');
    setThumbnailUrl('https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1400&q=80');
    setCtaText('Explore Collection');
    setCtaLink('Eyeglasses');
    setDurationMinutes(60);
    setOrder(homepageVideos.length + 1);
    setStatus('active');
    setIsEditorOpen(true);
  };

  const openEditModal = (video: HomepageVideo) => {
    setEditingVideo(video);
    setTitle(video.title);
    setDescription(video.description || '');
    setVideoUrl(video.videoUrl);
    setThumbnailUrl(video.thumbnailUrl || '');
    setCtaText(video.ctaText || 'Explore Collection');
    setCtaLink(video.ctaLink || 'Eyeglasses');
    setDurationMinutes(video.durationMinutes || 60);
    setOrder(video.order || 1);
    setStatus(video.status);
    setIsEditorOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      alert('Please fill in video title and URL.');
      return;
    }

    if (editingVideo) {
      updateHomepageVideo(editingVideo.id, {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        ctaText,
        ctaLink,
        durationMinutes: Number(durationMinutes),
        order: Number(order),
        priority: Number(order) || 1,
        status,
      });
    } else {
      addHomepageVideo({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        ctaText,
        ctaLink,
        durationMinutes: Number(durationMinutes),
        order: Number(order),
        priority: Number(order) || 1,
        status,
      });
    }
    setIsEditorOpen(false);
  };

  const handleDelete = (id: string, videoTitle: string) => {
    if (window.confirm(`Are you sure you want to remove promotional video "${videoTitle}"?`)) {
      deleteHomepageVideo(id);
    }
  };

  const handleMoveOrder = (id: string, delta: number) => {
    const sorted = [...homepageVideos].sort((a, b) => (a.order || 0) - (b.order || 0));
    const index = sorted.findIndex((v) => v.id === id);
    if (index === -1) return;
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const current = sorted[index];
    const target = sorted[targetIndex];

    const currentOrder = current.order || index + 1;
    const targetOrder = target.order || targetIndex + 1;

    updateHomepageVideo(current.id, { order: targetOrder });
    updateHomepageVideo(target.id, { order: currentOrder });
  };

  // Calculate next scheduled video
  const activeVideos = homepageVideos.filter((v) => v.status === 'active').sort((a, b) => (a.order || 0) - (b.order || 0));
  const currentActiveIndex = activeVideos.findIndex((v) => v.id === activeScheduledVideo?.id);
  const nextScheduledVideo = activeVideos.length > 1 && currentActiveIndex !== -1
    ? activeVideos[(currentActiveIndex + 1) % activeVideos.length]
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
            <Film className="w-3.5 h-3.5" />
            <span>Wall-Clock Hero Rotation Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading">
            Homepage Video Manager
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Upload and schedule promotional hero videos. Video rotation is synchronized to server wall-clock time so all online visitors view the same video at the same time.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Video</span>
        </button>
      </div>

      {/* Live Video Schedule Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Currently Playing Live Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-500/30 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Now Playing Live on Hero
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Duration: {activeScheduledVideo?.durationMinutes || 60}m
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 h-16 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden relative shrink-0">
              <img
                src={activeScheduledVideo?.thumbnailUrl || '/videos/hero-poster.jpg'}
                alt={activeScheduledVideo?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-sm truncate">
                {activeScheduledVideo?.title || 'Default Optical Hero'}
              </h4>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {activeScheduledVideo?.description || 'Crafted for Clarity & Precision'}
              </p>
              <div className="text-[11px] text-cyan-300 font-mono mt-1">
                Synchronized across all visitors
              </div>
            </div>
          </div>
        </div>

        {/* Next Scheduled Video Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Next In Rotation Queue
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Scheduled Duration: {nextScheduledVideo?.durationMinutes || 60}m
            </span>
          </div>

          {nextScheduledVideo ? (
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden relative shrink-0">
                <img
                  src={nextScheduledVideo.thumbnailUrl || '/videos/hero-poster.jpg'}
                  alt={nextScheduledVideo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm truncate">
                  {nextScheduledVideo.title}
                </h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {nextScheduledVideo.description}
                </p>
                <div className="text-[11px] text-amber-300/90 font-mono mt-1">
                  Switches automatically when current cycle completes
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-3">
              No additional active videos queued. Add more videos to enable dynamic rotation.
            </div>
          )}
        </div>
      </div>

      {/* Videos List & Ordering */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="font-bold text-slate-900 text-xs">
            Promotional Hero Video Library ({homepageVideos.length} Videos)
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Drag/Move controls dictate rotation order
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {homepageVideos.map((video, idx) => {
            const isLive = activeScheduledVideo?.id === video.id;
            return (
              <div
                key={video.id}
                className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
                  isLive ? 'bg-indigo-50/40' : 'hover:bg-slate-50/50'
                }`}
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Order Rank */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleMoveOrder(video.id, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-600"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold text-slate-700">#{video.order || idx + 1}</span>
                    <button
                      onClick={() => handleMoveOrder(video.id, 1)}
                      disabled={idx === homepageVideos.length - 1}
                      className="p-1 rounded hover:bg-slate-200 disabled:opacity-20 text-slate-600"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail */}
                  <div
                    onClick={() => setPreviewingVideo(video)}
                    className="w-24 h-16 rounded-xl bg-slate-900 overflow-hidden relative shrink-0 cursor-pointer group"
                  >
                    <img
                      src={video.thumbnailUrl || '/videos/hero-poster.jpg'}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{video.title}</h4>
                      {isLive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Live Now
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          video.status === 'active'
                            ? 'bg-slate-100 text-slate-700'
                            : video.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {video.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-md">
                      {video.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>Duration: {video.durationMinutes || 60} mins</span>
                      <span>•</span>
                      <span className="truncate max-w-[200px]">URL: {video.videoUrl}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => setPreviewingVideo(video)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                    title="Play Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(video)}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition"
                    title="Edit Settings"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      updateHomepageVideo(video.id, {
                        status: video.status === 'active' ? 'inactive' : 'active',
                      })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      video.status === 'active'
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {video.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(video.id, video.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold font-heading">
                {editingVideo ? 'Edit Promotional Video' : 'Add New Promotional Video'}
              </h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-900">
              <div>
                <label className="block text-slate-800 font-bold mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Acoustic Art & Titanium Eyewear Series"
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl font-medium focus:border-cyan-500 outline-none placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Precision CNC milled titanium with high-index anti-glare optics."
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl font-medium focus:border-cyan-500 outline-none placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Video File Path or MP4 Stream URL *
                </label>
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="/videos/hero-video.mp4 or https://..."
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono text-xs focus:border-cyan-500 outline-none placeholder:text-slate-400"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Supports MP4, WebM, and cloud video URLs. Muted autoplay is maintained by default.
                </p>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Poster / Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://... or /videos/hero-poster.jpg"
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono text-xs focus:border-cyan-500 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Order Priority</label>
                  <input
                    type="number"
                    min={1}
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="e.g. Explore Collection"
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl font-medium placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">CTA Destination Link</label>
                  <input
                    type="text"
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="e.g. Eyeglasses"
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition shadow-md"
                >
                  {editingVideo ? 'Update Video' : 'Add to Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            <div className="p-4 bg-black/60 flex items-center justify-between text-white border-b border-slate-800">
              <span className="font-bold text-sm font-heading">{previewingVideo.title}</span>
              <button
                onClick={() => setPreviewingVideo(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-16/9 bg-black">
              <video
                src={previewingVideo.videoUrl}
                poster={previewingVideo.thumbnailUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

