import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, Check, Copy, FileDown, Github, Linkedin, User } from 'lucide-react';
import { PROFILE } from '../data/portfolio';
import { downloadFileFromUrl } from '../utils/downloadFile';

export interface HeroViewProps {
  copied: boolean;
  onCopyEmail: () => void;
  onExploreProjects: () => void;
  onExploreAbout?: () => void;
  theme?: 'dark' | 'light';
}

export const HeroSection: React.FC<HeroViewProps> = ({
  copied,
  onCopyEmail,
  onExploreProjects,
}) => {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <section
      id="top"
      aria-label="Beranda Raden Alberto Lumintu Negoro"
      className="pt-8 sm:pt-12 lg:pt-16 pb-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Clean Editorial Intro */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400">
            <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">01</span>
            <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
            <span>Raden Alberto · Portofolio 2026</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.4rem] font-extrabold uppercase tracking-tight leading-[0.94] text-slate-900 dark:text-slate-100 text-balance">
            <span className="block">Raden</span>
            <span className="block text-[#3B82F6] dark:text-[#06B6D4]">Alberto</span>
            <span className="block">Lumintu Negoro</span>
          </h1>

          <p className="font-editorial text-base sm:text-[1.12rem] text-slate-700 dark:text-slate-200 leading-[1.65] max-w-xl">
            {PROFILE.headlineSub}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2.5">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white/85 dark:bg-[#0D0F17]/90 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] text-slate-800 dark:text-slate-100 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
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

            {PROFILE.cvUrl && (
              <a
                href={PROFILE.cvUrl}
                download={PROFILE.cvDownloadName}
                onClick={(e) => {
                  e.preventDefault();
                  void downloadFileFromUrl(PROFILE.cvUrl, PROFILE.cvDownloadName);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-white/20 bg-white/85 dark:bg-[#0D0F17]/90 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] text-slate-800 dark:text-slate-100 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
              >
                <FileDown className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />
                <span>Unduh CV</span>
              </a>
            )}

            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Profil GitHub Raden Alberto"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 dark:border-white/20 bg-white/85 dark:bg-[#0D0F17]/90 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] text-slate-700 dark:text-slate-200 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
            >
              <Github className="w-4 h-4" />
            </a>

            {PROFILE.linkedinUrl && (
              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Profil LinkedIn Raden Alberto"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 dark:border-white/20 bg-white/85 dark:bg-[#0D0F17]/90 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] text-slate-700 dark:text-slate-200 transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] tracking-wide text-slate-500 dark:text-slate-400">
            <span>UNTAR · Jakarta Barat</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#3B82F6] dark:text-[#06B6D4]">
              Terbuka Magang IT / MBKM (Des 2026 – Jun 2027)
            </span>
          </div>
        </div>

        {/* Right: Clean Circular Portrait Frame */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="group relative w-[260px] sm:w-[310px] lg:w-[350px] aspect-square rounded-full border border-slate-300 dark:border-white/20 ring-1 ring-[#3B82F6]/25 dark:ring-[#06B6D4]/30 hover:ring-[#3B82F6]/55 dark:hover:ring-[#06B6D4]/60 ring-offset-4 ring-offset-[#F8FAFC] dark:ring-offset-[#090A0F] bg-gradient-to-b from-slate-100 via-white to-slate-200/70 dark:from-[#161A29] dark:via-[#11131C] dark:to-[#0B0D14] overflow-hidden shadow-sm hover:shadow-md transition-[box-shadow,border-color] duration-300 will-change-transform"
          >
            {!photoFailed ? (
              <>
                <div className="w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover:scale-100 will-change-transform">
                  <img
                    src={PROFILE.photoUrl}
                    alt={`Foto profil ${PROFILE.fullName}`}
                    referrerPolicy="no-referrer"
                    onError={() => setPhotoFailed(true)}
                    className="w-full h-full object-cover object-[50%_70%] scale-[1.16] origin-center"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_24px_rgba(9,10,15,0.22)]"
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 space-y-3">
                <div className="w-20 h-20 rounded-full border border-slate-300 dark:border-white/15 bg-white/80 dark:bg-white/5 flex items-center justify-center text-[#3B82F6] dark:text-[#06B6D4] transition-transform duration-300 group-hover:scale-105">
                  <User className="w-9 h-9" />
                </div>
                <div className="space-y-1">
                  <p className="font-display text-xl font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                    {PROFILE.shortName}
                  </p>
                  <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    Taruh foto di <span className="text-[#3B82F6] dark:text-[#06B6D4]">public/foto-profil.jpeg</span>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
