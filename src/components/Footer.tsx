import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { PROFILE } from '../data/portfolio';

interface FooterProps {
  onCopyEmail: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onCopyEmail }) => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="relative z-10 mt-16 overflow-hidden border-t border-slate-200/80 dark:border-white/10 bg-slate-100/80 dark:bg-[#07080D]/90">
        {/* Subtle Architectural Skyline Silhouette Along Bottom Horizon */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-24 text-slate-300/45 dark:text-[#141929]/80"
          fill="currentColor"
        >
          <path d="M0 120 V88 H70 V68 H115 V94 H185 V52 H235 V90 H310 V72 H360 V98 H440 V42 H495 V86 H560 V64 H620 V92 H710 V48 H760 V88 H845 V74 H905 V96 H980 V38 H1035 V84 H1110 V66 H1165 V94 H1200 V120 Z" />
        </svg>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="font-mono text-xs uppercase tracking-widest text-[#3B82F6] dark:text-[#06B6D4]">
                WORKSPACE SELESAI · MAGANG IT / MBKM 2026–2027
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                Mari Berkolaborasi.
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-mono text-xs tracking-wider uppercase">
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 dark:text-slate-200 hover:text-[#3B82F6] dark:hover:text-[#06B6D4] transition-colors"
              >
                GITHUB
              </a>
              <button
                type="button"
                onClick={onCopyEmail}
                className="text-slate-700 dark:text-slate-200 hover:text-[#3B82F6] dark:hover:text-[#06B6D4] transition-colors cursor-pointer"
              >
                SALIN EMAIL
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-300/70 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
            <span>© 2026 Raden Alberto Lumintu Negoro</span>
            <span>JAKARTA BARAT · 6°10′S 106°47′E</span>
          </div>
        </div>
      </footer>

      {/* Crisp Square Floating ↑ TOP Button */}
      {showTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Kembali ke atas halaman"
          className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-md border border-slate-300 dark:border-white/20 bg-white/95 dark:bg-[#11131C]/95 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] flex flex-col items-center justify-center gap-0.5 text-[10px] font-mono font-semibold text-slate-800 dark:text-slate-100 shadow-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
        >
          <ArrowUp className="w-3.5 h-3.5 text-[#3B82F6] dark:text-[#06B6D4]" />
          <span>TOP</span>
        </button>
      )}
    </>
  );
};
