import React, { useEffect } from 'react';
import { ArrowUpRight, ExternalLink, Terminal, X } from 'lucide-react';
import { ProjectDiagram } from './ProjectDiagram';
import { ProjectItem } from '../data/portfolio';

interface ProjectSpecCardProps {
  project: ProjectItem;
  index: number;
  onSelect: (project: ProjectItem) => void;
  className?: string;
}

export const ProjectSpecCard: React.FC<ProjectSpecCardProps> = ({
  project,
  index,
  onSelect,
  className = '',
}) => {
  const numericCode = String(index + 1).padStart(2, '0');
  const isCyanAccent = index % 2 === 1;

  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      className={`group relative text-left w-full rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-[#11131C] p-2 shadow-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#3B82F6] dark:hover:border-[#06B6D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] cursor-pointer ${className}`}
    >
      {/* Inner Crisp Architectural Border Frame */}
      <div className="relative h-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-[#0D0F17] p-4 sm:p-5 flex flex-col justify-between gap-4">
        {/* Top Corner Index & Diagram Preview */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-center leading-none">
              <span
                className={`font-display text-lg font-extrabold tracking-tight ${
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
            <ProjectDiagram type={project.diagramType} />
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <span>{project.serial}</span>
            <span>{project.year}</span>
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
                className={`font-display text-sm font-extrabold tracking-tight ${
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
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-[#11131C] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F17]">
          <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
            {project.serial} — {project.category}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal detail proyek"
            className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          >
            <span>ESC</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        <ProjectDiagram type={project.diagramType} />

        <div className="p-6 sm:p-8 space-y-5">
          <div>
            <div className="font-mono text-xs text-[#3B82F6] dark:text-[#06B6D4] mb-1.5">
              {project.category} · {project.year}
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
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium transition-colors"
              >
                <span>Buka Live App</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                Proyek akademik &amp; kolaborasi tim
              </span>
            )}

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
