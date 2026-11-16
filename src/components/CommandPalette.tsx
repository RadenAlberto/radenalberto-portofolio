import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  Code2,
  Compass,
  Copy,
  Download,
  ExternalLink,
  FolderGit2,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react';
import {
  CERTIFICATES,
  FOCUS_ITEMS,
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
} from '../data/portfolio';
import type { PageId } from './HomeHighlights';

interface CommandItem {
  id: string;
  label: string;
  subtitle?: string;
  category: 'Halaman' | 'Proyek' | 'Keahlian & Sertifikat' | 'Fokus' | 'Aksi Cepat';
  keywords: string;
  hint?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  theme: 'dark' | 'light';
  onClose: () => void;
  onNavigate: (page: PageId) => void;
  onSelectProject: (projectId: string) => void;
  onCopyEmail: () => void;
  onToggleTheme: (next: 'dark' | 'light') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  theme,
  onClose,
  onNavigate,
  onSelectProject,
  onCopyEmail,
  onToggleTheme,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPage = (page: PageId) => {
    onClose();
    onNavigate(page);
  };

  const commands: CommandItem[] = useMemo(() => {
    const pageCommands: CommandItem[] = [
      {
        id: 'nav-beranda',
        label: 'Beranda — Profil & Highlight Ruang Kerja',
        subtitle: 'Ringkasan utama, ketersediaan magang & shortcut halaman',
        category: 'Halaman',
        keywords: 'beranda home profil magang mbkm untar utama',
        hint: '#beranda',
        icon: <ArrowRight className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
        action: () => openPage('beranda'),
      },
      {
        id: 'nav-tentang',
        label: 'Tentang Saya, Progres Studi & 3D Gedung II UNTAR',
        subtitle: 'about-me.md · 05/08 Semester · IPK 3.23 · Model 3D',
        category: 'Halaman',
        keywords: 'tentang about ipk semester untar gedung 3d threejs',
        hint: '#tentang',
        icon: <ArrowRight className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
        action: () => openPage('tentang'),
      },
      {
        id: 'nav-fokus',
        label: 'Sedang Dipelajari Saat Ini',
        subtitle: 'Full-Stack & Cloud DB · Big Data & Mobile',
        category: 'Halaman',
        keywords: 'fokus belajar fullstack cloud big data mobile',
        hint: '#fokus',
        icon: <ArrowRight className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
        action: () => openPage('fokus'),
      },
      {
        id: 'nav-proyek',
        label: 'Portofolio Proyek (4 Karya)',
        subtitle: 'CatatanApp, Uniqlo Mobile UI, Big Data NYC Taxi, SPK AHP',
        category: 'Halaman',
        keywords: 'proyek project portfolio karya web mobile data sistem',
        hint: '#proyek',
        icon: <ArrowRight className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
        action: () => openPage('proyek'),
      },
      {
        id: 'nav-sertifikat',
        label: 'Keahlian, Sertifikat & Aktivitas Kode',
        subtitle: 'Tech stack, Python Pro Algonova, Kurikulum UNTAR, CV',
        category: 'Halaman',
        keywords: 'sertifikat keahlian skill cv github activity',
        hint: '#sertifikat',
        icon: <ArrowRight className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
        action: () => openPage('sertifikat'),
      },
      {
        id: 'nav-off-clock',
        label: 'Off The Clock',
        subtitle: 'Musik Lofi, piano instrumental, Luau & Roblox Studio',
        category: 'Halaman',
        keywords: 'off the clock hobi lofi piano luau roblox',
        hint: '#off-the-clock',
        icon: <ArrowRight className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
        action: () => openPage('off-the-clock'),
      },
    ];

    const projectCommands: CommandItem[] = PROJECTS.map((project) => ({
      id: `proj-${project.id}`,
      label: project.title,
      subtitle: `${project.serial} · ${project.stack.join(' · ')}`,
      category: 'Proyek',
      keywords: `${project.serial} ${project.title} ${project.category} ${project.summary} ${project.detail} ${project.stack.join(' ')}`,
      hint: project.category,
      icon: <FolderGit2 className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
      action: () => {
        onClose();
        onSelectProject(project.id);
      },
    }));

    const focusCommands: CommandItem[] = FOCUS_ITEMS.map((item) => ({
      id: `focus-${item.filename}`,
      label: item.title,
      subtitle: `${item.filename} · ${item.highlights.join(' · ')}`,
      category: 'Fokus',
      keywords: `${item.title} ${item.filename} ${item.description} ${item.highlights.join(' ')}`,
      hint: 'Fokus',
      icon: <Compass className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
      action: () => openPage('fokus'),
    }));

    const skillGroupCommands: CommandItem[] = SKILL_GROUPS.map((group) => ({
      id: `skill-${group.filename}`,
      label: `Keahlian ${group.title}`,
      subtitle: group.items.join(' · '),
      category: 'Keahlian & Sertifikat',
      keywords: `${group.title} ${group.filename} ${group.items.join(' ')}`,
      hint: 'Stack',
      icon: <Code2 className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
      action: () => openPage('sertifikat'),
    }));

    const certCommands: CommandItem[] = CERTIFICATES.map((cert) => ({
      id: `cert-${cert.serial}`,
      label: cert.title,
      subtitle: `${cert.serial} · ${cert.period}`,
      category: 'Keahlian & Sertifikat',
      keywords: `${cert.serial} ${cert.title} ${cert.period} ${cert.description}`,
      hint: cert.serial,
      icon: <Award className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
      action: () => openPage('sertifikat'),
    }));

    const actionCommands: CommandItem[] = [
      {
        id: 'act-email',
        label: `Salin Email (${PROFILE.email})`,
        subtitle: 'Salin alamat email ke clipboard',
        category: 'Aksi Cepat',
        keywords: 'salin email kontak gmail hubungi',
        hint: 'Clipboard',
        icon: <Copy className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
        action: () => {
          onCopyEmail();
          onClose();
        },
      },
      {
        id: 'act-cv',
        label: 'Unduh CV (PDF)',
        subtitle: 'CV_Raden_Alberto.pdf',
        category: 'Aksi Cepat',
        keywords: 'unduh download cv resume pdf',
        hint: 'PDF',
        icon: <Download className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
        action: () => {
          const a = document.createElement('a');
          a.href = PROFILE.cvUrl;
          a.download = 'CV_Raden_Alberto.pdf';
          a.click();
          onClose();
        },
      },
      {
        id: 'act-github',
        label: 'Buka Profil GitHub (radenalberto)',
        subtitle: PROFILE.githubUrl,
        category: 'Aksi Cepat',
        keywords: 'github repositori kode profil',
        hint: 'Eksternal',
        icon: <ExternalLink className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4]" />,
        action: () => {
          window.open(PROFILE.githubUrl, '_blank', 'noopener,noreferrer');
          onClose();
        },
      },
      {
        id: 'act-theme',
        label:
          theme === 'dark'
            ? 'Ganti ke Mode Terang (LIGHT)'
            : 'Ganti ke Mode Gelap (NIGHT)',
        subtitle: 'Ubah tema antarmuka ruang kerja',
        category: 'Aksi Cepat',
        keywords: 'tema theme dark night light terang gelap',
        hint: theme === 'dark' ? 'LIGHT' : 'NIGHT',
        icon:
          theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#3B82F6]" />
          ),
        action: () => {
          onToggleTheme(theme === 'dark' ? 'light' : 'dark');
          onClose();
        },
      },
    ];

    return [
      ...pageCommands,
      ...projectCommands,
      ...skillGroupCommands,
      ...certCommands,
      ...focusCommands,
      ...actionCommands,
    ];
  }, [
    theme,
    onClose,
    onNavigate,
    onSelectProject,
    onCopyEmail,
    onToggleTheme,
  ]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Show curated default suggestions (Halaman + Proyek + Aksi Cepat) before typing
      return commands.filter(
        (c) => c.category === 'Halaman' || c.category === 'Aksi Cepat'
      );
    }

    const terms = q.split(/\s+/).filter(Boolean);
    return commands.filter((c) => {
      const haystack = `${c.label} ${c.subtitle ?? ''} ${c.category} ${c.keywords}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    });
  }, [commands, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length > 0 ? (prev + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filtered.length > 0 ? (prev - 1 + filtered.length) % filtered.length : 0
        );
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  const quickChips = ['Next.js', 'Flutter', 'Python', 'Oracle', 'C++', 'CV'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette Navigasi Cepat"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#11131C] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-white/10">
          <Search className="w-4 h-4 text-[#3B82F6] dark:text-[#06B6D4] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik proyek, skill (Next.js, Python, Flutter), atau halaman..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Hapus kata kunci"
              className="px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              CLEAR
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Command Palette"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Suggestion Filters */}
        <div className="px-4 py-2 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-[#0D0F17]/60 flex items-center gap-1.5 overflow-x-auto">
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 mr-1 shrink-0">
            Saran:
          </span>
          {quickChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setQuery(chip)}
              className="px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] hover:border-[#3B82F6]/60 dark:hover:border-[#06B6D4]/60 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Live Search Suggestions List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center space-y-1">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tidak ada saran yang cocok dengan "{query}".
              </p>
              <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
                Coba kata kunci seperti CatatanApp, Flutter, Pandas, AHP, atau UNTAR.
              </p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const active = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#3B82F6]/12 dark:bg-[#3B82F6]/20 text-slate-900 dark:text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="mt-0.5 shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{item.label}</div>
                      <div className="font-mono text-[11px] text-slate-400 dark:text-slate-400 truncate">
                        {item.category}
                        {item.subtitle ? ` · ${item.subtitle}` : ''}
                      </div>
                    </div>
                  </div>
                  {item.hint && (
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 shrink-0 whitespace-nowrap">
                      {item.hint}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Keyboard Help Footer */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0D0F17] flex items-center justify-between font-mono text-[11px] text-slate-400 dark:text-slate-500">
          <span>↑↓ navigasi · Enter pilih · {filtered.length} hasil</span>
          <span>ESC tutup</span>
        </div>
      </div>
    </div>
  );
};
