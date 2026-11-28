import React, { useEffect, useState } from 'react';
import { LayoutGrid, LayoutTemplate, List } from 'lucide-react';
import { ProjectDetailModal, ProjectSpecCard } from './ProjectSpecCard';
import { RevealOnScroll } from './RevealOnScroll';
import {
  PROJECT_SECTION_CONFIG,
  PROJECTS,
  ProjectCategory,
  ProjectItem,
  ProjectLayoutMode,
} from '../data/portfolio';

const CATEGORIES: ProjectCategory[] = ['Semua', 'Web & Mobile', 'Data & Sistem'];

const LAYOUT_OPTIONS: Array<{
  id: ProjectLayoutMode;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: 'bento', label: 'Sorotan', icon: <LayoutTemplate className="w-3.5 h-3.5" /> },
  { id: 'grid', label: 'Grid', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { id: 'list', label: 'Baris', icon: <List className="w-3.5 h-3.5" /> },
];

interface ProjectsSectionProps {
  requestedProjectId?: string | null;
  onClearRequestedProject?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  requestedProjectId,
  onClearRequestedProject,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('Semua');
  const [layoutMode, setLayoutMode] = useState<ProjectLayoutMode>(
    PROJECT_SECTION_CONFIG.defaultLayout
  );
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    if (!requestedProjectId) return;
    const match = PROJECTS.find((p) => p.id === requestedProjectId);
    if (match) {
      setActiveCategory('Semua');
      setSelectedProject(match);
    }
    onClearRequestedProject?.();
  }, [requestedProjectId, onClearRequestedProject]);

  const filteredProjects =
    activeCategory === 'Semua'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  const orderedProjects =
    layoutMode === 'bento'
      ? [
          ...filteredProjects.filter((p) => p.featured),
          ...filteredProjects.filter((p) => !p.featured),
        ]
      : filteredProjects;

  return (
    <section id="proyek" className="py-8 sm:py-12 space-y-10">
      <RevealOnScroll>
        <div className="pb-6 border-b border-slate-200 dark:border-white/15 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">04</span>
              <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
              <span>KARYA &amp; EKSPERIMEN</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-none">
              Portofolio Proyek
            </h2>
          </div>

          {/* Filter Kategori + Switcher Tata Letak */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            <div
              role="tablist"
              aria-label="Filter kategori proyek"
              className="inline-flex items-center gap-1 p-1 rounded-lg border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#11131C]/90"
            >
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#3B82F6] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div
              role="group"
              aria-label="Pilih tata letak tampilan proyek"
              className="inline-flex items-center gap-1 p-1 rounded-lg border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#11131C]/90"
            >
              {LAYOUT_OPTIONS.map((opt) => {
                const isActive = layoutMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setLayoutMode(opt.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {opt.icon}
                    <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </RevealOnScroll>

      {/* Project Cards Container according to chosen layout */}
      {layoutMode === 'list' ? (
        <div className="space-y-4">
          {orderedProjects.map((project) => {
            const originalIdx = PROJECTS.findIndex((p) => p.id === project.id);
            return (
              <RevealOnScroll key={project.id} delayMs={originalIdx * 50}>
                <ProjectSpecCard
                  project={project}
                  index={originalIdx}
                  variant="list"
                  onSelect={setSelectedProject}
                />
              </RevealOnScroll>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {orderedProjects.map((project, displayIdx) => {
            const originalIdx = PROJECTS.findIndex((p) => p.id === project.id);
            const isBentoLead =
              layoutMode === 'bento' && displayIdx === 0 && orderedProjects.length > 1;
            return (
              <RevealOnScroll
                key={project.id}
                delayMs={displayIdx * 60}
                className={`flex ${isBentoLead ? 'md:col-span-2' : ''}`}
              >
                <ProjectSpecCard
                  project={project}
                  index={originalIdx}
                  variant={isBentoLead ? 'featured' : 'card'}
                  onSelect={setSelectedProject}
                />
              </RevealOnScroll>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
