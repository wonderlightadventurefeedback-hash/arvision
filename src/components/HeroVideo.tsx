import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Maximize2,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';

export const HeroVideo: React.FC = () => {
  const { setActiveCategory, setIsBookAppointmentOpen } = useStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video playback & audio states
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [centerFeedback, setCenterFeedback] = useState<'play' | 'pause' | 'sound' | 'mute' | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger brief visual feedback in center when toggled
  const showCenterFeedback = (type: 'play' | 'pause' | 'sound' | 'mute') => {
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    setCenterFeedback(type);
    feedbackTimeoutRef.current = setTimeout(() => {
      setCenterFeedback(null);
    }, 700);
  };

  // Button 1: Move & Pause ("move and puse button")
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          showCenterFeedback('play');
        })
        .catch((err) => {
          console.warn('Autoplay error:', err);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      showCenterFeedback('pause');
    }
  };

  // Button 2: Mute & Sound ("mute and sound button")
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      // If unmuting, ensure video is playing with sound
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true));
      }
      showCenterFeedback('sound');
    } else {
      showCenterFeedback('mute');
    }
  };

  // Handle direct click on video
  const handleVideoClick = () => {
    togglePlayPause();
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById('product-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard accessibility: Space to Play/Pause, M to Mute/Sound
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  return (
    <div className="relative w-full h-[88vh] min-h-[580px] max-h-[920px] bg-slate-950 overflow-hidden select-none group">
      {/* 1. Cinematic Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        poster="/videos/hero-poster.jpg"
        onLoadedData={() => setVideoLoaded(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={handleVideoClick}
        className="w-full h-full object-cover object-center cursor-pointer transition-transform duration-1000 ease-out"
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
        <source src="/videos/hero.mp4" type="video/mp4" />
        <source src="https://streamable.com/igvxhz" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      {/* 2. Top Scrim for Navbar Contrast */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/85 via-black/40 to-transparent z-10" />

      {/* 3. Subtle Vignette Scrim & Bottom Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-radial-[at_center_center] from-transparent via-black/10 to-black/60 z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />

      {/* 4. Center Momentary Ripple Feedback (when play/pause or sound is toggled) */}
      {centerFeedback && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20 animate-out fade-out zoom-out duration-500">
          <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition">
            {centerFeedback === 'play' && <Play className="w-9 h-9 fill-white translate-x-0.5" />}
            {centerFeedback === 'pause' && <Pause className="w-9 h-9 fill-white" />}
            {centerFeedback === 'sound' && <Volume2 className="w-9 h-9 text-cyan-400" />}
            {centerFeedback === 'mute' && <VolumeX className="w-9 h-9 text-amber-400" />}
          </div>
        </div>
      )}

      {/* 5. Bottom Left: Subtle Luxury Brand Title & Scroll Prompt */}
      <div className="absolute bottom-8 left-6 sm:left-10 lg:left-16 z-20 max-w-md text-white pointer-events-auto">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Mastery in Handcrafted Precision</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading text-white drop-shadow-md leading-tight">
            Crafted for Clarity. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Inspired by Acoustic Elegance.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-light line-clamp-2 max-w-sm">
            Experience our 2026 Titanium & Acoustic Art Series with precision zero-glare HD optics.
          </p>

          <div className="pt-1 flex items-center gap-3">
            <button
              onClick={handleScrollToCatalog}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-amber-400 hover:text-slate-950 transition shadow-lg shadow-black/40 cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsBookAppointmentOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs backdrop-blur-md border border-white/20 transition cursor-pointer"
            >
              <span>Book Free Eye Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Bottom Right: The 2 Requested Interactive Buttons (Move & Pause, Mute & Sound) */}
      <div className="absolute bottom-8 right-6 sm:right-10 lg:right-16 z-20 flex items-center gap-3">
        {/* Button 1: Move & Pause ("move and puse button") */}
        <button
          onClick={togglePlayPause}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md border shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
            isPlaying
              ? 'bg-black/50 hover:bg-black/75 border-white/25 text-white'
              : 'bg-amber-500 hover:bg-amber-400 border-amber-300 text-slate-950 font-bold animate-pulse'
          }`}
          title={isPlaying ? 'Pause Video' : 'Move / Play Video'}
          aria-label={isPlaying ? 'Pause Video' : 'Move and Play Video'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 text-white fill-white" />
              <span className="text-xs font-semibold tracking-wide uppercase">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-slate-950 fill-slate-950 translate-x-0.5" />
              <span className="text-xs font-bold tracking-wide uppercase">Move / Play</span>
            </>
          )}
        </button>

        {/* Button 2: Mute & Sound ("mute and sound button") */}
        <button
          onClick={toggleMute}
          className={`group flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md border shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
            isMuted
              ? 'bg-black/50 hover:bg-black/75 border-white/25 text-white'
              : 'bg-cyan-500/30 hover:bg-cyan-500/40 border-cyan-400 text-cyan-200 shadow-cyan-500/20'
          }`}
          title={isMuted ? 'Turn Sound ON' : 'Mute Sound'}
          aria-label={isMuted ? 'Turn Sound ON' : 'Mute Sound'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-white/80 group-hover:text-white" />
              <span className="text-xs font-semibold tracking-wide uppercase">Mute</span>
            </>
          ) : (
            <>
              {/* Sound ON animated equalizer wave bars */}
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.6s_ease-in-out_infinite] h-3" />
                <span className="w-1 bg-cyan-300 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-2" />
                <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_0.5s_ease-in-out_infinite] h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-wide uppercase text-cyan-300">Sound ON</span>
            </>
          )}
        </button>
      </div>

      {/* 7. Center Scroll Indicator */}
      <button
        onClick={handleScrollToCatalog}
        className="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex-col items-center text-white/60 hover:text-white transition cursor-pointer text-[10px] tracking-widest uppercase gap-1"
      >
        <span>Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-white/80" />
      </button>
    </div>
  );
};
