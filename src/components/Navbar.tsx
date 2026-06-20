import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, X, Code2 } from 'lucide-react';

import { useAuth } from '../auth/AuthContext';
import LoginModal from './LoginModal';

// --- Local Style Injection ---
const navbarStyles = `
  :root {
    --navbar-bg: rgba(10, 10, 15, 0.6);
    --navbar-bg-scrolled: rgba(10, 10, 15, 0.85);
    --navbar-shadow: rgba(0, 0, 0, 0.35);
    --navbar-text-active: #06B6D4;
  }

  [data-theme='light'] {
    --navbar-bg: #ffffff !important; 
    --navbar-bg-scrolled: rgba(255, 255, 255, 0.95) !important; 
    --navbar-shadow: rgba(15, 23, 42, 0.06) !important; 
    --navbar-text-active: #06B6D4;
  }

  /* Animasi halus saat transisi tema */
  .theme-transition-nav {
    transition: background-color 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
  }
`;

const goToDashboard = () => {
  window.location.href = '/dashboard/projects';
};

// --- Multi-Language Dictionary ---
type Lang = 'id' | 'en';

const translations = {
  id: {
    home: 'Beranda',
    about: 'Tentang',
    skills: 'Keahlian',
    projects: 'Proyek',
    experience: 'Pengalaman',
    contact: 'Kontak',
    cta: 'Ayo Ngobrol',
  },
  en: {
    home: 'Home',
    about: 'About',
    skills: 'Skills',
    projects: 'Projects',
    experience: 'Experience',
    contact: 'Contact',
    cta: "Let's Talk",
  },
};

// Ubah label menjadi 'key' referensi dictionary
type NavItem = { key: keyof typeof translations.id; href: string };

const NAV_ITEMS: NavItem[] = [
  { key: 'home', href: '#home' },
  { key: 'about', href: '#about' },
  { key: 'skills', href: '#skills' },
  { key: 'projects', href: '#projects' },
  { key: 'experience', href: '#experience' },
  { key: 'contact', href: '#contact' },
];

const Navbar: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // State Bahasa
  const [lang, setLang] = useState<Lang>('id');

  // Load awal & listener untuk mendeteksi perubahan bahasa
  useEffect(() => {
    const loadLang = () => {
      const savedLang = (localStorage.getItem('lang') as Lang) || 'id';
      setLang(savedLang);
    };

    loadLang(); // Run sekali saat mount

    // Dengarkan event custom 'languageChange' (dari komponen lain di tab yang sama)
    window.addEventListener('languageChange', loadLang);
    
    // Dengarkan event 'storage' (jika bahasa diubah dari tab browser lain)
    window.addEventListener('storage', (e) => {
      if (e.key === 'lang') loadLang();
    });

    return () => {
      window.removeEventListener('languageChange', loadLang);
      window.removeEventListener('storage', loadLang);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = (entry.target as HTMLElement).id;
          if (id) setActiveSection(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    NAV_ITEMS.forEach((item) => {
      const section = document.querySelector(item.href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      closeMobileMenu();
    },
    [closeMobileMenu]
  );

  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (isLoggedIn) {
        goToDashboard();
        return;
      }
      setIsLoginModalOpen(true);
    },
    [isLoggedIn]
  );

  const navShadow = useMemo(() => {
    return isScrolled ? 'shadow-[0_4px_30px_var(--navbar-shadow)]' : '';
  }, [isScrolled]);

  const t = translations[lang];

  return (
    <header role="banner" className="fixed top-0 left-0 right-0 z-50 animate-fade-in" aria-label="Navbar">
      <style>{navbarStyles}</style>
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoggedIn={() => {
          setIsLoginModalOpen(false);
          window.location.href = '/dashboard/projects';
        }}
      />

      <nav 
        className={`h-20 md:h-24 border-b border-[var(--border-color)] backdrop-blur-xl ${navShadow} theme-transition-nav`}
        style={{
          backgroundColor: isScrolled ? 'var(--navbar-bg-scrolled)' : 'var(--navbar-bg)'
        }}
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8 h-full">
          <div className="flex h-full items-center justify-between">
            <a
              href="#home"
              onClick={handleLogoClick}
              className="flex items-center gap-3 group"
              aria-label="Go to dashboard"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#22D3EE] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] group-hover:scale-105">
                <Code2 className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <span className="text-lg font-semibold text-[var(--text-primary)] tracking-tight transition-colors duration-300 group-hover:text-[#06B6D4]">
                PortoZaky
              </span>
            </a>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.replace('#', '');
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      isActive
                        ? 'text-[var(--navbar-text-active)] font-semibold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/[0.04]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {t[item.key]}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] transition-all duration-300" />
                    )}
                  </a>
                );
              })}
            </div>

            {/* CTA */}
            <div className="hidden md:block">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-full bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
              >
                {t.cta}
              </a>
            </div>

            {/* Mobile button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/[0.04] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm transition-colors duration-300"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
        <div
          className={`absolute top-20 left-0 right-0 bg-[var(--bg-primary)]/95 backdrop-blur-xl border-b border-[var(--border-color)] shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transition-colors duration-300 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <nav className="px-4 py-6 space-y-1" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isActive
                      ? 'text-[#06B6D4] bg-[#06B6D4]/10'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/[0.04]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-[#06B6D4] shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                        : 'bg-[var(--text-secondary)]'
                    }`}
                  />
                  {t[item.key]}
                </a>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 text-base font-medium text-white rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.98]"
              >
                {t.cta}
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;