import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { AboutSection } from './components/AboutSection';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { CommandPalette } from './components/CommandPalette';
import { FocusSection } from './components/FocusSection';
import { Footer } from './components/Footer';
import { HomeHighlights, PageId } from './components/HomeHighlights';
import { IntroWorkspace } from './components/IntroWorkspace';
import { Navbar } from './components/Navbar';
import { OffTheClockSection } from './components/OffTheClockSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { SkillsCertsSection } from './components/SkillsCertsSection';
import { PROFILE } from './data/portfolio';

const VALID_PAGES: PageId[] = [
  'beranda',
  'tentang',
  'fokus',
  'proyek',
  'sertifikat',
  'off-the-clock',
];

function getInitialPage(): PageId {
  const hash = window.location.hash.replace('#', '') as PageId;
  return VALID_PAGES.includes(hash) ? hash : 'beranda';
}

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activePage, setActivePage] = useState<PageId>(getInitialPage);
  const [requestedProjectId, setRequestedProjectId] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync hash navigation for browser back/forward support
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      if (VALID_PAGES.includes(hash)) {
        setActivePage(hash);
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = useCallback((page: PageId) => {
    setActivePage(page);
    if (window.location.hash !== `#${page}`) {
      window.history.pushState(null, '', `#${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectProject = useCallback(
    (projectId: string) => {
      setRequestedProjectId(projectId);
      handleNavigate('proyek');
    },
    [handleNavigate]
  );

  // Global Ctrl+K / Cmd+K shortcut for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (!showIntro) {
          setCommandOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showIntro]);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = PROFILE.email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setToastMessage('Email berhasil disalin!');
    window.setTimeout(() => setCopied(false), 2200);
    window.setTimeout(() => setToastMessage(null), 2800);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#090A0F] text-[#0F172A] dark:text-slate-100 bg-arch-grid transition-colors duration-200">
        {/* Particle Constellation Backdrop */}
        {!showIntro && <AmbientBackdrop theme={theme} />}

        {/* Top Fixed Electric Blue Scroll Progress Indicator */}
        {!showIntro && <ScrollProgressBar />}

        {/* Auto-Playing Computer Screen Zoom-In Intro */}
        <IntroWorkspace isVisible={showIntro} onComplete={() => setShowIntro(false)} />

        {/* Sticky Glassmorphism Header */}
        <Navbar
          activePage={activePage}
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={setTheme}
          onOpenCommandPalette={() => setCommandOpen(true)}
        />

        {/* Main Content Container with Fluid Page Transition */}
        <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {activePage !== 'beranda' && (
                <div className="pt-7 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleNavigate('beranda')}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#11131C] hover:border-[#3B82F6] dark:hover:border-[#06B6D4] text-xs font-mono text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 text-[#3B82F6] dark:text-[#06B6D4]" />
                    <span>Kembali ke Beranda</span>
                  </button>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    workspace://raden-alberto/{activePage}
                  </span>
                </div>
              )}

              {activePage === 'beranda' && (
                <HomeHighlights
                  copied={copied}
                  onCopyEmail={handleCopyEmail}
                  onNavigate={handleNavigate}
                  theme={theme}
                />
              )}
              {activePage === 'tentang' && <AboutSection theme={theme} />}
              {activePage === 'fokus' && <FocusSection />}
              {activePage === 'proyek' && (
                <ProjectsSection
                  requestedProjectId={requestedProjectId}
                  onClearRequestedProject={() => setRequestedProjectId(null)}
                />
              )}
              {activePage === 'sertifikat' && <SkillsCertsSection />}
              {activePage === 'off-the-clock' && <OffTheClockSection />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer Minimalis + Floating ↑ TOP */}
        <Footer onCopyEmail={handleCopyEmail} />

        {/* Command Palette Modal */}
        <CommandPalette
          isOpen={commandOpen}
          theme={theme}
          onClose={() => setCommandOpen(false)}
          onNavigate={handleNavigate}
          onSelectProject={handleSelectProject}
          onCopyEmail={handleCopyEmail}
          onToggleTheme={setTheme}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-500/30 bg-white dark:bg-[#11131C] text-slate-900 dark:text-white text-sm font-medium shadow-xl"
          >
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </MotionConfig>
  );
}
