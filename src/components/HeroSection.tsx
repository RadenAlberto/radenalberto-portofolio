import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { ArrowDownRight, Check, Copy, Github } from 'lucide-react';
import { HeroSenna3D, type SennaWaypointId } from './HeroSenna3D';
import { PROFILE } from '../data/portfolio';

interface HeroSectionProps {
  copied: boolean;
  onCopyEmail: () => void;
  onExploreProjects: () => void;
  theme?: 'dark' | 'light';
}

const WAYPOINTS: Array<{ id: SennaWaypointId; index: string; label: string; targetT: number }> = [
  { id: 'exterior', index: '01', label: 'Eksterior', targetT: 0 },
  { id: 'wheel', index: '02', label: 'Roda', targetT: 0.24 },
  { id: 'cockpit', index: '03', label: 'Kokpit', targetT: 0.62 },
  { id: 'wing', index: '04', label: 'Sayap', targetT: 0.98 },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  copied,
  onCopyEmail,
  onExploreProjects,
  theme = 'dark',
}) => {
  const stageRef = useRef<HTMLElement | null>(null);
  const scrollProgressRef = useRef(0);
  const progressMV = useMotionValue(0);
  const stageWidthMV = useMotionValue(1100);

  const [activeWaypoint, setActiveWaypoint] = useState<SennaWaypointId>('exterior');
  const [heroInteractive, setHeroInteractive] = useState(true);
  const [aeroExpanded, setAeroExpanded] = useState(false);

  // Compositor-only fades & glides synced directly to scroll position
  const heroCopyOpacity = useTransform(progressMV, [0.02, 0.16], [1, 0]);
  const heroCopyY = useTransform(progressMV, [0.02, 0.16], [0, -32]);
  const discOpacity = useTransform(progressMV, [0.02, 0.2], [1, 0]);
  const scrollPromptOpacity = useTransform(progressMV, [0, 0.08], [1, 0]);
  const railScaleX = useTransform(progressMV, [0, 1], [0, 1]);

  // Align the compact waypoint bar cleanly underneath the Senna at scroll=0 (74%) then smoothly center on scroll
  const tabOffsetX = useTransform([progressMV, stageWidthMV], ([t, w]) => {
    const numT = typeof t === 'number' ? t : 0;
    const numW = typeof w === 'number' ? w : 1100;
    if (numW < 900) return 0;
    const blend = Math.max(0, 1 - numT / 0.22);
    return Math.round(numW * 0.24 * blend);
  });

  useEffect(() => {
    let rafPending = false;
    const syncScroll = () => {
      rafPending = false;
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      stageWidthMV.set(el.clientWidth || 1100);
      const totalTravel = Math.max(1, el.offsetHeight - window.innerHeight);
      const t = Math.min(1, Math.max(0, -rect.top / totalTravel));
      scrollProgressRef.current = t;
      progressMV.set(t);
      const shouldBeInteractive = t < 0.12;
      setHeroInteractive((prev) => (prev !== shouldBeInteractive ? shouldBeInteractive : prev));
    };

    const onScroll = () => {
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(syncScroll);
      }
    };

    syncScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [progressMV, stageWidthMV]);

  const handleJumpToWaypoint = useCallback((targetT: number) => {
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const docTop = window.scrollY + rect.top;
    const totalTravel = Math.max(1, el.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: Math.round(docTop + targetT * totalTravel),
      behavior: 'smooth',
    });
  }, []);

  return (
    <section
      id="top"
      ref={stageRef}
      aria-label="Beranda Raden Alberto dan pengalaman interaktif 3D McLaren Senna"
      className="relative h-[240vh] lg:h-[300vh]"
    >
      {/* Sticky Full-Stage Viewport */}
      <div className="sticky top-16 h-[calc(100vh-4rem)] min-h-[540px] max-h-[820px] w-full flex items-start lg:items-center overflow-hidden">
        {/* Striped Glowing Orbital Disc Centered at 74% (Exact Match to Senna Framing at Scroll 0) */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: discOpacity }}
          className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 lg:left-[74%] lg:top-1/2 lg:-translate-y-1/2 w-60 h-60 sm:w-72 sm:h-72 lg:w-[370px] lg:h-[370px] rounded-full overflow-hidden border border-[#3B82F6]/30 dark:border-[#06B6D4]/30 will-change-transform"
        >
          <div
            className="w-full h-full"
            style={{
              background:
                'radial-gradient(circle at 45% 35%, rgba(6,182,212,0.28), rgba(59,130,246,0.14) 62%, transparent 82%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 flex flex-col justify-evenly opacity-65 dark:opacity-80">
            {Array.from({ length: 7 }).map((_, idx) => (
              <div key={idx} className="w-full h-2.5 bg-[#F8FAFC] dark:bg-[#090A0F]" />
            ))}
          </div>
        </motion.div>

        {/* Full-Stage 3D Realistic McLaren Senna Canvas */}
        <div className="absolute inset-0 z-10">
          <HeroSenna3D
            theme={theme}
            scrollProgressRef={scrollProgressRef}
            onActiveWaypointChange={setActiveWaypoint}
            aeroExpanded={aeroExpanded}
          />
        </div>

        {/* Left Editorial Typography Column (Visible at Scroll 0, glides out cleanly on scroll down) */}
        <motion.div
          style={{ opacity: heroCopyOpacity, y: heroCopyY }}
          className={`relative z-20 w-full lg:w-[50%] pt-6 sm:pt-10 lg:pt-0 space-y-4 sm:space-y-6 will-change-transform ${
            heroInteractive ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400">
            <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">01</span>
            <span className="w-10 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
            <span>RADEN ALBERTO · PORTOFOLIO 2026</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.85rem] font-extrabold uppercase tracking-tight leading-[0.92] text-slate-900 dark:text-slate-100">
            <span className="block">Raden</span>
            <span className="block text-[#3B82F6] dark:text-[#06B6D4]">Alberto</span>
            <span className="block">Lumintu Negoro</span>
          </h1>

          <p className="font-editorial text-justify text-[0.98rem] sm:text-[1.16rem] text-slate-700 dark:text-slate-200 leading-[1.65] max-w-lg">
            {PROFILE.headlineSub}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExploreProjects}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium shadow-sm transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
            >
              <span>Lihat Proyek</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onCopyEmail}
              aria-label="Salin alamat email Raden Alberto"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-300 dark:border-white/20 bg-white/85 dark:bg-[#0D0F17]/90 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] text-slate-800 dark:text-slate-100 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />
                  <span>Salin Email</span>
                </>
              )}
            </button>

            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Profil GitHub Raden Alberto"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-slate-300 dark:border-white/20 bg-white/85 dark:bg-[#0D0F17]/90 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] text-slate-700 dark:text-slate-200 transition-colors shrink-0"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          <div className="pt-1 hidden sm:flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] tracking-wider text-slate-500 dark:text-slate-400">
            <span>UNTAR · JAKARTA BARAT</span>
            <span aria-hidden="true">·</span>
            <span>6°10′S 106°47′E</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#3B82F6] dark:text-[#06B6D4]">
              MAGANG IT / MBKM (DES 2026 – JUN 2027)
            </span>
          </div>
        </motion.div>

        {/* Compact Waypoint Bar Sized to Car Width & Aligned Beneath the Senna */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex flex-col items-center px-2">
          <motion.div
            style={{ x: tabOffsetX }}
            className="flex flex-col items-center gap-1.5 will-change-transform"
          >
            <motion.span
              style={{ opacity: scrollPromptOpacity }}
              className="hidden sm:inline-block font-mono text-[10px] tracking-wide text-slate-500 dark:text-slate-400 will-change-transform"
            >
              Putar 360° atau scroll ke kokpit kemudi
            </motion.span>

            <div className="pointer-events-auto relative inline-flex flex-wrap items-center justify-center gap-1 p-1 rounded-xl border border-slate-300/90 dark:border-white/15 bg-white/95 dark:bg-[#0D0F17]/95 shadow-sm overflow-hidden">
              <motion.span
                aria-hidden="true"
                style={{ scaleX: railScaleX, transformOrigin: 'left center' }}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#F97316] will-change-transform"
              />

              {WAYPOINTS.map((wp) => {
                const isActive = activeWaypoint === wp.id;
                return (
                  <button
                    key={wp.id}
                    type="button"
                    onClick={() => handleJumpToWaypoint(wp.targetT)}
                    className={`px-2 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] ${
                      isActive
                        ? 'bg-[#3B82F6] text-white font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {wp.index} {wp.label}
                  </button>
                );
              })}

              <span aria-hidden="true" className="w-px h-3.5 bg-slate-300 dark:bg-white/15 mx-0.5" />

              <button
                type="button"
                onClick={() => setAeroExpanded((prev) => !prev)}
                className={`px-2 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] ${
                  aeroExpanded
                    ? 'bg-[#F97316] text-white font-semibold'
                    : 'text-[#F97316] hover:bg-[#F97316]/10'
                }`}
              >
                {aeroExpanded ? 'Tutup Aero' : 'Active Aero'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
