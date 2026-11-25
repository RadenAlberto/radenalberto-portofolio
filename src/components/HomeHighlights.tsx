import React, { useMemo, useState } from 'react';
import { ArrowRight, Eye, Gamepad2, Headphones } from 'lucide-react';
import { CertificatePreviewModal } from './CertificatePreviewModal';
import { FocusArchitectureIllustration } from './FocusSection';
import { HeroSection } from './HeroSection';
import { LofiWorkspaceDisc } from './OffTheClockSection';
import { ProjectDetailModal, ProjectSpecCard } from './ProjectSpecCard';
import { RevealOnScroll } from './RevealOnScroll';
import { UntarBuilding3D } from './UntarBuilding3D';
import {
  CERTIFICATES,
  CertificateItem,
  FOCUS_ITEMS,
  PROFILE,
  PROJECTS,
  ProjectItem,
  getContributionWeeks,
} from '../data/portfolio';

export type PageId =
  | 'beranda'
  | 'tentang'
  | 'fokus'
  | 'proyek'
  | 'sertifikat'
  | 'off-the-clock';

interface HomeHighlightsProps {
  copied: boolean;
  onCopyEmail: () => void;
  onNavigate: (page: PageId) => void;
  theme?: 'dark' | 'light';
}

export const HomeHighlights: React.FC<HomeHighlightsProps> = ({
  copied,
  onCopyEmail,
  onNavigate,
  theme = 'dark',
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const deckProjects = PROJECTS.slice(0, 3);
  const weeks = useMemo(() => getContributionWeeks(), []);
  const totalContribs = useMemo(
    () => weeks.flat().reduce((acc, day) => acc + day.count, 0),
    [weeks]
  );

  const deckTransforms = [
    'md:-rotate-2 md:translate-y-2 md:hover:rotate-0 md:hover:z-20',
    'md:z-10 md:-translate-y-1 md:hover:z-20',
    'md:rotate-2 md:translate-y-2 md:hover:rotate-0 md:hover:z-20',
  ];

  return (
    <div className="space-y-14 sm:space-y-20 pb-8">
      {/* 01 — Clean Editorial Hero */}
      <HeroSection
        copied={copied}
        onCopyEmail={onCopyEmail}
        onExploreProjects={() => onNavigate('proyek')}
        onExploreAbout={() => onNavigate('tentang')}
        theme={theme}
      />

      {/* 02 — Blueprint Snapshot: Tentang & 3D Gedung II UNTAR */}
      <section aria-label="Ringkasan profil dan model 3D UNTAR">
        <RevealOnScroll>
          <div className="relative p-1.5 border border-slate-300 dark:border-white/20 bg-white/40 dark:bg-[#0D0F17]/45 backdrop-blur-[2px]">
            <span
              aria-hidden="true"
              className="hidden sm:block absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#3B82F6] dark:border-[#06B6D4]"
            />
            <span
              aria-hidden="true"
              className="hidden sm:block absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#3B82F6] dark:border-[#06B6D4]"
            />

            <div className="border border-slate-300/80 dark:border-white/15 p-4 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Info */}
                <div className="lg:col-span-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">02</span>
                      <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
                      <span>PROFIL &amp; AKADEMIK</span>
                    </div>
                    <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                      Tentang Saya
                    </h2>
                  </div>

                  <dl className="divide-y divide-slate-200 dark:divide-white/10 border-y border-slate-200 dark:border-white/10">
                    <div className="py-2.5 grid grid-cols-12 gap-2 items-baseline">
                      <dt className="col-span-4 font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Nama
                      </dt>
                      <dd className="col-span-8 text-sm font-medium text-slate-900 dark:text-slate-100">
                        {PROFILE.fullName}
                      </dd>
                    </div>
                    <div className="py-2.5 grid grid-cols-12 gap-2 items-baseline">
                      <dt className="col-span-4 font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Universitas
                      </dt>
                      <dd className="col-span-8 text-sm text-slate-700 dark:text-slate-200">
                        Universitas Tarumanagara
                      </dd>
                    </div>
                    <div className="py-2.5 grid grid-cols-12 gap-2 items-center">
                      <dt className="col-span-4 font-mono text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Program Studi
                      </dt>
                      <dd className="col-span-8 flex flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                        <span>S1 Sistem Informasi</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#3B82F6]/15 dark:bg-[#06B6D4]/20 border border-[#3B82F6]/30 dark:border-[#06B6D4]/40 font-mono text-[10px] font-semibold text-[#2563EB] dark:text-[#22D3EE]">
                          SEMESTER 5
                        </span>
                      </dd>
                    </div>
                  </dl>

                  {/* Compact Semester + IPK Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-slate-200 dark:border-white/15 bg-white/70 dark:bg-[#11131C]/80 space-y-2.5">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Semester
                      </div>
                      <div className="font-display text-3xl font-extrabold text-[#3B82F6] dark:text-[#06B6D4] tabular-nums leading-none">
                        05<span className="text-base text-slate-400 font-semibold">/08</span>
                      </div>
                      <div className="grid grid-cols-8 gap-1">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 rounded-full ${
                              i < 4
                                ? 'bg-[#3B82F6]'
                                : i === 4
                                ? 'bg-[#06B6D4] shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                                : 'bg-slate-200 dark:bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-200 dark:border-white/15 bg-white/70 dark:bg-[#11131C]/80 space-y-2.5">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        IPK Saat Ini
                      </div>
                      <div className="font-display text-3xl font-extrabold text-[#3B82F6] dark:text-[#06B6D4] tabular-nums leading-none">
                        3.23<span className="text-base text-slate-400 font-semibold">/4.00</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4]"
                          style={{ width: '80.75%' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => onNavigate('tentang')}
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#3B82F6] dark:text-[#06B6D4] hover:underline cursor-pointer"
                    >
                      <span>Buka Halaman Tentang Lengkap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Transparent 3D Gedung Utama UNTAR */}
                <div className="lg:col-span-6 pt-6 border-t border-slate-200/80 dark:border-white/10 lg:pt-0 lg:border-t-0">
                  <UntarBuilding3D theme={theme} />
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 03 — Alternating Editorial Highlights: Sedang Dipelajari */}
      <section aria-label="Fokus belajar saat ini" className="space-y-10">
        <RevealOnScroll>
          <div className="pb-5 border-b border-slate-200 dark:border-white/15 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">03</span>
                <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
                <span>FOKUS SAAT INI</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                Sedang Dipelajari
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('fokus')}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#3B82F6] dark:text-[#06B6D4] hover:underline self-start sm:self-auto cursor-pointer"
            >
              <span>Buka Halaman Fokus</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </RevealOnScroll>

        <div className="space-y-14">
          {FOCUS_ITEMS.map((item, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <RevealOnScroll key={item.filename} delayMs={idx * 70}>
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                    idx > 0 ? 'pt-10 border-t border-slate-200/80 dark:border-white/10' : ''
                  }`}
                >
                  <div
                    className={`lg:col-span-6 flex items-center justify-center ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <FocusArchitectureIllustration
                      variant={idx === 0 ? 'fullstack' : 'datamobile'}
                    />
                  </div>
                  <div
                    className={`lg:col-span-6 space-y-4 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    <div className="font-mono text-xs text-[#3B82F6] dark:text-[#06B6D4]">
                      {item.indexLabel} · <span className="text-slate-500 dark:text-slate-400">{item.filename}</span>
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-[1.04]">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* 04 — Fanned Interactive Project Deck (3 Featured Spec Cards) */}
      <section aria-label="Proyek pilihan dalam tampilan kartu kipas" className="space-y-10">
        <RevealOnScroll>
          <div className="pb-5 border-b border-slate-200 dark:border-white/15 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">04</span>
                <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
                <span>PORTOFOLIO PILIHAN</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                Karya &amp; Eksperimen
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('proyek')}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#3B82F6] dark:text-[#06B6D4] hover:underline self-start sm:self-auto cursor-pointer"
            >
              <span>Lihat Semua 4 Proyek</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-6 items-stretch pt-2 pb-4">
          {deckProjects.map((project, idx) => (
            <RevealOnScroll key={project.id} delayMs={idx * 80} className="flex">
              <ProjectSpecCard
                project={project}
                index={idx}
                onSelect={setSelectedProject}
                className={deckTransforms[idx] ?? ''}
              />
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* 05 — Perforated Credential Slips & Activity Ledger Snapshot */}
      <section aria-label="Ringkasan sertifikat, CV, dan aktivitas GitHub">
        <RevealOnScroll>
          <div className="pt-10 border-t border-slate-200 dark:border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Heading + CV */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400">
                <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">05</span>
                <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
                <span>KREDENSIAL &amp; AKTIVITAS</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-[0.95]">
                Sertifikat &amp;
                <span className="block text-[#3B82F6] dark:text-[#06B6D4]">Keahlian</span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Pelatihan Python OOP, kurikulum inti Sistem Informasi UNTAR, serta{' '}
                <span className="font-mono font-semibold text-[#3B82F6] dark:text-[#06B6D4]">
                  {totalContribs}
                </span>{' '}
                kontribusi kode dalam 26 minggu terakhir.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('sertifikat')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Lihat Keahlian &amp; Grid GitHub</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Perforated Credential Slips */}
            <div className="lg:col-span-7 space-y-4">
              {CERTIFICATES.map((cert, idx) => (
                <div
                  key={cert.serial}
                  className="relative flex flex-col sm:flex-row items-stretch rounded-lg border border-slate-300 dark:border-white/15 bg-white/95 dark:bg-[#11131C]/95 overflow-hidden shadow-sm"
                >
                  <div className="sm:w-24 shrink-0 flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0D0F17]">
                    <div
                      className={`w-12 h-12 rounded-lg border flex items-center justify-center font-display text-xl font-extrabold ${
                        idx % 2 === 0
                          ? 'border-[#3B82F6]/40 bg-[#3B82F6]/10 text-[#2563EB] dark:text-[#60A5FA]'
                          : 'border-[#06B6D4]/40 bg-[#06B6D4]/10 text-[#0891B2] dark:text-[#22D3EE]'
                      }`}
                    >
                      {cert.code ?? String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="hidden sm:flex flex-col justify-between w-px border-l border-dashed border-slate-300 dark:border-white/20"
                  >
                    <span className="w-3 h-3 -mt-1.5 -ml-[6px] rounded-full border border-slate-300 dark:border-white/15 bg-[#F8FAFC] dark:bg-[#090A0F]" />
                    <span className="w-3 h-3 -mb-1.5 -ml-[6px] rounded-full border border-slate-300 dark:border-white/15 bg-[#F8FAFC] dark:bg-[#090A0F]" />
                  </div>
                  <div className="flex-1 p-5 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                      <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">
                        {cert.serial}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">{cert.period}</span>
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {cert.description}
                    </p>
                    {cert.fileUrl && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedCert(cert)}
                          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#3B82F6] dark:text-[#06B6D4] hover:underline cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat File Sertifikat</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* 06 — Open-Canvas Off The Clock Spotlight */}
      <section aria-label="Off The Clock">
        <RevealOnScroll>
          <div className="pt-10 border-t border-slate-200 dark:border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <LofiWorkspaceDisc />
            </div>
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3 font-mono text-xs tracking-wider text-slate-500 dark:text-slate-400">
                <span className="text-[#3B82F6] dark:text-[#06B6D4] font-semibold">06</span>
                <span className="w-8 h-px bg-slate-300 dark:bg-white/20" aria-hidden="true" />
                <span>OFF THE CLOCK</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                Di Luar Jam Koding
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Saat sedang beristirahat dari tugas kuliah atau sesi ngoding, saya biasanya menikmati musik Lofi dan instrumental piano untuk menjaga fokus, atau mengeksplorasi mekanik pengembangan game ringan menggunakan Luau dan Roblox Studio.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <Headphones className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />
                    <span>Lofi &amp; Piano</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Gamepad2 className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />
                    <span>Luau · Roblox Studio</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('off-the-clock')}
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#3B82F6] dark:text-[#06B6D4] hover:underline cursor-pointer"
                >
                  <span>Buka Off The Clock</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* Direct Modal when clicking a card in the fanned deck */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <CertificatePreviewModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
};
