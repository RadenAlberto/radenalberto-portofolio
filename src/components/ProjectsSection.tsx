import React, { useEffect, useState } from 'react';
import { ProjectDetailModal, ProjectSpecCard } from './ProjectSpecCard';
import { RevealOnScroll } from './RevealOnScroll';
import { PROJECTS, ProjectCategory, ProjectItem } from '../data/portfolio';

const CATEGORIES: ProjectCategory[] = ['Semua', 'Web & Mobile', 'Data & Sistem'];

interface ProjectsSectionProps {
  requestedProjectId?: string | null;
  onClearRequestedProject?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  requestedProjectId,
  onClearRequestedProject,
}) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('Semua');
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

  return (
    <section id="proyek" className="py-8 sm:py-12 space-y-10">
      <RevealOnScroll>
        <div className="pb-6 border-b border-slate-200 dark:border-white/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
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

          {/* Clean Segmented Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter kategori proyek"
            className="inline-flex items-center gap-1 p-1 rounded-lg border border-slate-200 dark:border-white/15 bg-white/80 dark:bg-[#11131C]/90 self-start sm:self-auto"
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
                  className={`px-3.5 py-1.5 rounded-md text-xs font-mono font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
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
        </div>
      </RevealOnScroll>

      {/* Architectural Project Spec Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {filteredProjects.map((project) => {
          const originalIdx = PROJECTS.findIndex((p) => p.id === project.id);
          return (
            <RevealOnScroll key={project.id} delayMs={originalIdx * 70} className="flex">
              <ProjectSpecCard
                project={project}
                index={originalIdx}
                onSelect={setSelectedProject}
              />
            </RevealOnScroll>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
