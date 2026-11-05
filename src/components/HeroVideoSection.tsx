import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowDown,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface HeroVideoSectionProps {
  onSwitchToSlides?: () => void;
  hasSlides?: boolean;
}

export const HeroVideoSection: React.FC<HeroVideoSectionProps> = ({
  onSwitchToSlides,
  hasSlides = false,
}) => {
  const { setActiveCategory } = useStore();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [centerFeedback, setCenterFeedback] = useState<'play' | 'pause' | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  // Sync play/pause with video element
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      triggerCenterFeedback('pause');
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        triggerCenterFeedback('play');
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  // Sync mute/unmute with video element
  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);

    // If unmuting, ensure volume is 100% and playback is active
    if (!newMuted) {
      videoRef.current.volume = 1.0;
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const triggerCenterFeedback = (type: 'play' | 'pause') => {
    setCenterFeedback(type);
    setTimeout(() => {
      setCenterFeedback(null);
    }, 600);
  };

  // Update progress bar
  const handleTimeUpdate = () => {
    if (!videoRef.current || !videoRef.current.duration) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    setProgress((current / duration) * 100);
  };

  // Keyboard accessibility: Space to Play/Pause, M to Mute/Sound
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or textarea
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

  const scrollToCatalog = () => {
    const el = document.getElementById('product-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-[88vh] min-h-[560px] max-h-[880px] bg-black overflow-hidden select-none group">
      {/* 1. Main Background Video */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
          isVideoLoaded ? 'opacity-100' : 'opacity-80'
        }`}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        poster="/videos/hero-poster.jpg"
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => setIsVideoLoaded(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlayPause}
      >
        <source src="/videos/hero-video.mp4" type="video/mp4" />
        <source src="https://streamable.com/igvxhz" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. Ambient Gradient Scrims for Readability & Cinematic Look */}
      {/* Top Scrim for Navbar Contrast */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Bottom Scrim for Controls & Content Contrast */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

      {/* 3. Center Animated Play/Pause Feedback (when clicking video) */}
      {centerFeedback && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center animate-ping">
            {centerFeedback === 'play' ? (
              <Play className="w-8 h-8 fill-white ml-1" />
            ) : (
              <Pause className="w-8 h-8 fill-white" />
            )}
          </div>
        </div>
      )}

      {/* 4. Bottom-Left Hero Details & Scroll Indicator */}
      <div className="absolute bottom-8 left-6 sm:left-10 z-20 max-w-lg text-white pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider mb-3 text-amber-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cinematic Craftsmanship</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight drop-shadow-md text-white mb-2">
          Precision Optics • Pure Elegance
        </h1>
        <p className="text-xs sm:text-sm text-slate-200/90 drop-shadow-sm max-w-md line-clamp-2 mb-4 font-light leading-relaxed">
          Experience Japanese titanium frames, precision anti-glare lenses, and interactive 3D AR virtual try-on.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={scrollToCatalog}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all duration-200 shadow-xl cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>Explore Collection</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {hasSlides && onSwitchToSlides && (
            <button
              onClick={onSwitchToSlides}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-medium transition cursor-pointer hover:border-white/40"
              title="Switch to Promotional Slide Carousel"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-300" />
              <span>Slides Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. The 2 Requested Control Buttons: Move/Pause & Mute/Sound */}
      <div className="absolute bottom-8 right-6 sm:right-10 z-30 flex items-center gap-3">
        {/* Button 1: Move & Pause ("move and puse button") */}
        <button
          onClick={togglePlayPause}
          className={`group/btn px-4 py-2.5 rounded-full backdrop-blur-md border text-xs sm:text-sm font-semibold tracking-wide shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer ${
            isPlaying
              ? 'bg-black/50 hover:bg-black/75 border-white/25 text-white'
              : 'bg-amber-500/90 hover:bg-amber-500 border-amber-300 text-slate-950 shadow-amber-500/20'
          }`}
          title={isPlaying ? 'Pause video (Space)' : 'Move / Resume video (Space)'}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 text-amber-400 group-hover/btn:scale-110 transition-transform" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950 text-slate-950 group-hover/btn:scale-110 transition-transform" />
              <span>Move</span>
            </>
          )}
        </button>

        {/* Button 2: Mute & Sound ("mute and sound button") */}
        <button
          onClick={toggleMute}
          className={`group/btn px-4 py-2.5 rounded-full backdrop-blur-md border text-xs sm:text-sm font-semibold tracking-wide shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer ${
            isMuted
              ? 'bg-black/50 hover:bg-black/75 border-white/25 text-white'
              : 'bg-indigo-600/90 hover:bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/30'
          }`}
          title={isMuted ? 'Turn sound on (M)' : 'Mute sound (M)'}
          aria-label={isMuted ? 'Turn sound on' : 'Mute sound'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-slate-300 group-hover/btn:text-white transition-colors" />
              <span>Sound</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-cyan-300 animate-pulse" />
              {/* Equalizer animation bars */}
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-cyan-300 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
                <span className="w-0.5 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDuration: '0.4s' }} />
                <span className="w-0.5 h-3.5 bg-cyan-300 rounded-full animate-bounce" style={{ animationDuration: '0.8s' }} />
              </div>
              <span>Mute</span>
            </>
          )}
        </button>
      </div>

      {/* 6. Thin Progress Indicator Line at the Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/15 z-20">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-indigo-400 transition-all duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

