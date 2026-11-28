import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Images,
  Terminal,
  X,
} from 'lucide-react';
import { ProjectDiagram } from './ProjectDiagram';
import { ProjectItem } from '../data/portfolio';

export function getProjectImages(project: ProjectItem): string[] {
  const raw = [project.imageUrl, ...(project.gallery ?? [])].filter(
    (src): src is string => Boolean(src && src.trim())
  );
  return Array.from(new Set(raw));
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring' as const, stiffness: 320, damping: 32 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98,
    transition: {
      x: { type: 'spring' as const, stiffness: 320, damping: 32 },
      opacity: { duration: 0.18 },
      scale: { duration: 0.18 },
    },
  }),
};

const ProjectMediaPreview: React.FC<{
  project: ProjectItem;
  className?: string;
}> = ({ project, className = 'h-44' }) => {
  const images = useMemo(() => getProjectImages(project), [project]);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFailedUrls({});
  }, [project.id, project.imageUrl, project.gallery]);

  const validImages = images.filter((src) => !failedUrls[src]);
  const coverSrc = validImages[0];
  const fitClass =
    project.imageFit === 'contain' ? 'object-contain p-2' : 'object-cover';

  if (coverSrc) {
    return (
      <div className={`relative w-full ${className} bg-slate-900/95 overflow-hidden`}>
        <img
          src={coverSrc}
          alt={`Pratinjau ${project.title}`}
          referrerPolicy="no-referrer"
          onError={() =>
            setFailedUrls((prev) => ({ ...prev, [coverSrc]: true }))
          }
          className={`w-full h-full ${fitClass} transition-transform duration-500 group-hover:scale-[1.03]`}
        />
        {validImages.length > 1 && (
          <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px] backdrop-blur-xs">
            <Images className="w-3 h-3 text-[#22D3EE]" />
            <span className="tabular-nums">{validImages.length} foto</span>
          </div>
        )}
      </div>
    );
  }

  return <ProjectDiagram type={project.diagramType ?? 'catatan'} />;
};

interface ProjectSpecCardProps {
  project: ProjectItem;
  index: number;
  onSelect: (project: ProjectItem) => void;
  variant?: 'card' | 'featured' | 'list';
  className?: string;
}

export const ProjectSpecCard: React.FC<ProjectSpecCardProps> = ({
  project,
  index,
  onSelect,
  variant = 'card',
  className = '',
}) => {
  const numericCode = String(index + 1).padStart(2, '0');
  const isCyanAccent = index % 2 === 1;

  if (variant === 'featured') {
    return (
      <button
        type="button"
        onClick={() => onSelect(project)}
        className={`group relative text-left w-full rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-[#11131C] p-2 shadow-md transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] cursor-pointer ${className}`}
      >
        <div className="relative h-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#0D0F17] p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 items-center">
          <div className="md:col-span-7 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
            <ProjectMediaPreview project={project} className="h-52 sm:h-64 md:h-72" />
          </div>

          <div className="md:col-span-5 flex flex-col justify-between gap-4 h-full py-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">
                  {numericCode} · {project.role ?? 'KARYA UTAMA'}
                </span>
                <span>
                  {project.category} · {project.year}
                </span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-[1.05] group-hover:text-[#3B82F6] dark:group-hover:text-[#06B6D4] transition-colors">
                {project.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-end justify-between gap-3">
              <div className="flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <ArrowUpRight className="w-4 h-4 shrink-0 text-[#3B82F6] dark:text-[#06B6D4] opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>
        </div>
      </button>
    );
  }

  if (variant === 'list') {
    return (
      <button
        type="button"
        onClick={() => onSelect(project)}
        className={`group relative text-left w-full rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-[#11131C] p-2 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] cursor-pointer ${className}`}
      >
        <div className="relative rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#0D0F17] p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
          <div className="sm:w-56 md:w-64 shrink-0 rounded-md overflow-hidden border border-slate-200 dark:border-white/10">
            <ProjectMediaPreview project={project} className="h-40 sm:h-36" />
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">
                  {numericCode} · {project.role ?? project.serial}
                </span>
                <span>
                  {project.category} · {project.year}
                </span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-tight group-hover:text-[#3B82F6] dark:group-hover:text-[#06B6D4] transition-colors">
                {project.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                {project.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <ArrowUpRight className="w-4 h-4 shrink-0 text-[#3B82F6] dark:text-[#06B6D4] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      className={`group relative text-left w-full rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-[#11131C] p-2 shadow-sm hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] cursor-pointer ${className}`}
    >
      {/* Inner Crisp Architectural Border Frame */}
      <div className="relative h-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#0D0F17] p-4 sm:p-5 flex flex-col justify-between gap-4">
        {/* Top Corner Index & Media Preview */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-center leading-none">
              <span
                className={`font-display text-lg font-extrabold tracking-tight tabular-nums ${
                  isCyanAccent
                    ? 'text-[#0891B2] dark:text-[#22D3EE]'
                    : 'text-[#2563EB] dark:text-[#60A5FA]'
                }`}
              >
                {numericCode}
              </span>
              <Terminal
                className={`w-3 h-3 mt-0.5 ${
                  isCyanAccent
                    ? 'text-[#0891B2] dark:text-[#22D3EE]'
                    : 'text-[#2563EB] dark:text-[#60A5FA]'
                }`}
              />
            </div>

            <span className="font-mono text-[10px] tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {project.category}
            </span>
          </div>

          <div className="rounded-md overflow-hidden border border-slate-200 dark:border-white/10">
            <ProjectMediaPreview project={project} className="h-44 sm:h-48" />
          </div>

          <div className="flex items-center justify-between gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span className="truncate">{project.role ?? project.serial}</span>
            <span className="tabular-nums shrink-0">{project.year}</span>
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-[1.08] group-hover:text-[#3B82F6] dark:group-hover:text-[#06B6D4] transition-colors">
            {project.title}
          </h3>

          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Bottom Unboxed Stack + Mirrored Inverted Index */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {project.stack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpRight className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            <div className="flex flex-col items-center leading-none rotate-180 select-none">
              <span
                className={`font-display text-sm font-extrabold tracking-tight tabular-nums ${
                  isCyanAccent
                    ? 'text-[#0891B2] dark:text-[#22D3EE]'
                    : 'text-[#2563EB] dark:text-[#60A5FA]'
                }`}
              >
                {numericCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  const images = useMemo(
    () => (project ? getProjectImages(project) : []),
    [project]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setActiveIndex(0);
    setDirection(0);
    setFailedUrls({});
  }, [project]);

  const validImages = images.filter((src) => !failedUrls[src]);

  const paginate = (newDirection: number) => {
    if (validImages.length <= 1) return;
    setDirection(newDirection);
    setActiveIndex((prev) => (prev + newDirection + validImages.length) % validImages.length);
  };

  const jumpToIndex = (newIndex: number) => {
    if (newIndex === activeIndex || validImages.length <= 1) return;
    setDirection(newIndex > activeIndex ? 1 : -1);
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && validImages.length > 1) {
        paginate(1);
      } else if (e.key === 'ArrowLeft' && validImages.length > 1) {
        paginate(-1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose, validImages.length, activeIndex]);

  if (!project) return null;

  const safeIndex = validImages.length > 0 ? activeIndex % validImages.length : 0;
  const activeSrc = validImages[safeIndex];
  const activeCaption = project.galleryCaptions?.[safeIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-[#11131C] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/95 dark:bg-[#0D0F17]/95 backdrop-blur-sm">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-slate-300">
            <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">
              {project.serial}
            </span>
            <span>—</span>
            <span>{project.category}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal detail proyek"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
          >
            <span>ESC</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Direction-Aware Animated Horizontal Carousel Viewer */}
        {activeSrc ? (
          <div className="bg-slate-950 border-b border-slate-200 dark:border-white/10">
            {/* Main Slide Stage with Side-by-Side Transition */}
            <div className="relative w-full h-64 sm:h-84 md:h-[420px] flex items-center justify-center overflow-hidden bg-slate-950">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={activeSrc}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag={validImages.length > 1 ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, { offset, velocity }) => {
                    if (offset.x < -40 || velocity.x < -300) {
                      paginate(1);
                    } else if (offset.x > 40 || velocity.x > 300) {
                      paginate(-1);
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center p-2 sm:p-4 cursor-grab active:cursor-grabbing select-none"
                >
                  <img
                    src={activeSrc}
                    alt={`${project.title} — Slide ${safeIndex + 1}`}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedUrls((prev) => ({ ...prev, [activeSrc]: true }))
                    }
                    className="w-full h-full object-contain pointer-events-none rounded-md shadow-2xl"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev & Next Navigation Buttons */}
              {validImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => paginate(-1)}
                    aria-label="Slide sebelumnya"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs border border-white/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => paginate(1)}
                    aria-label="Slide berikutnya"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs border border-white/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-md bg-black/75 text-white font-mono text-xs tabular-nums border border-white/10 backdrop-blur-xs">
                    <span className="text-[#22D3EE] font-semibold">{safeIndex + 1}</span> / {validImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Stage Caption Bar: Highlights which product step is being showcased */}
            {activeCaption && (
              <div className="px-4 sm:px-6 py-3 bg-[#0B0E17] border-t border-white/10 flex items-start sm:items-center gap-3">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider bg-[#06B6D4]/20 text-[#22D3EE] border border-[#06B6D4]/40 shrink-0">
                  Slide {safeIndex + 1}/{validImages.length}
                </span>
                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                  {activeCaption}
                </p>
              </div>
            )}

            {/* Thumbnail Navigation Strip with Step Badges */}
            {validImages.length > 1 && (
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/95 border-t border-white/10 overflow-x-auto">
                {validImages.map((src, idx) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => jumpToIndex(idx)}
                    aria-label={`Buka slide ${idx + 1}`}
                    className={`relative w-16 sm:w-20 h-11 sm:h-12 rounded-md overflow-hidden border shrink-0 cursor-pointer transition-all ${
                      idx === safeIndex
                        ? 'border-[#06B6D4] ring-2 ring-[#06B6D4]/60 scale-105'
                        : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 px-1.5 py-0.2 bg-black/80 font-mono text-[9px] font-bold text-white tabular-nums rounded-tl">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ProjectDiagram type={project.diagramType ?? 'catatan'} />
        )}

        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <div className="font-mono text-xs text-[#3B82F6] dark:text-[#06B6D4] mb-1.5">
              {project.category} · {project.year}
              {project.role ? ` · ${project.role}` : ''}
            </div>
            <h3
              id="project-modal-title"
              className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              {project.title}
            </h3>
          </div>

          <div className="space-y-3 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            <p className="font-medium text-slate-800 dark:text-slate-100">
              {project.summary}
            </p>
            <p>{project.detail}</p>
          </div>

          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10">
            <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-2">
              Tech Stack &amp; Metode
            </div>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] font-mono text-xs text-slate-700 dark:text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium transition-colors"
                >
                  <span>Buka Live App</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-white/20 text-sm font-medium text-slate-800 dark:text-slate-100 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Lihat Kode</span>
                </a>
              )}
              {!project.liveUrl && !project.repoUrl && (
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  {project.role ?? 'Proyek akademik & kolaborasi tim'}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
