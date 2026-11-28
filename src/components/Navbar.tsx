import React, { useState } from 'react';
import { Menu, Moon, Search, Sun, Terminal, X } from 'lucide-react';
import { PROFILE } from '../data/portfolio';
import type { PageId } from './HomeHighlights';

interface NavbarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  theme: 'dark' | 'light';
  onToggleTheme: (next: 'dark' | 'light') => void;
  onOpenCommandPalette: () => void;
}

const NAV_LINKS: Array<{ page: PageId; label: string }> = [
  { page: 'beranda', label: 'Beranda' },
  { page: 'tentang', label: 'Tentang' },
  { page: 'fokus', label: 'Fokus' },
  { page: 'proyek', label: 'Proyek' },
  { page: 'sertifikat', label: 'Sertifikat' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-white/10 bg-[#F8FAFC]/85 dark:bg-[#090A0F]/85 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-6">
        {/* Left: Terminal icon + Name + Monospace Sub-label */}
        <button
          type="button"
          onClick={() => handleNavClick('beranda')}
          className="flex items-center gap-2.5 shrink-0 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] rounded-md cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] flex items-center justify-center text-[#3B82F6] dark:text-[#06B6D4] transition-colors">
            <Terminal className="w-4 h-4" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              {PROFILE.shortName}
            </span>
            <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Portofolio / 2026
            </span>
          </span>
        </button>

        {/* Center: Multi-Page Navigation Links */}
        <nav
          aria-label="Navigasi halaman utama"
          className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activePage === link.page;
            return (
              <button
                key={link.page}
                type="button"
                onClick={() => handleNavClick(link.page)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-[#3B82F6] dark:text-[#06B6D4] font-semibold'
                    : 'hover:text-[#3B82F6] dark:hover:text-[#06B6D4]'
                }`}
              >
                <span>{link.label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute left-0 bottom-0 w-full h-[2px] rounded-full bg-[#3B82F6] dark:bg-[#06B6D4] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Right: Theme Switch Pill + CTRL + K */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Pill Theme Switch */}
          <div
            role="group"
            aria-label="Pengaturan tema"
            className="inline-flex items-center p-0.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#11131C]"
          >
            <button
              type="button"
              onClick={() => onToggleTheme('light')}
              aria-pressed={theme === 'light'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sun className="w-3 h-3" />
              <span className="hidden sm:inline">LIGHT</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleTheme('dark')}
              aria-pressed={theme === 'dark'}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#3B82F6] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span className="hidden sm:inline">NIGHT</span>
            </button>
          </div>

          {/* Quick Search CTRL + K */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Buka pencarian cepat Command Palette"
            className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] hover:border-[#3B82F6]/50 dark:hover:border-[#06B6D4]/50 text-xs font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
          >
            <Search className="w-3.5 h-3.5 text-[#3B82F6] dark:text-[#06B6D4]" />
            <span className="hidden sm:inline">CTRL + K</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav */}
      {mobileOpen && (
        <nav
          aria-label="Navigasi seluler"
          className="lg:hidden border-t border-slate-200/80 dark:border-white/10 bg-[#F8FAFC] dark:bg-[#090A0F] px-4 py-3 flex flex-wrap gap-2"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activePage === link.page;
            return (
              <button
                key={link.page}
                type="button"
                onClick={() => handleNavClick(link.page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
