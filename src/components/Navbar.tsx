import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, X, Code2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { isAuthenticated } from '../auth/auth';
import LoginModal from './LoginModal';

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

const Navbar: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

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

      // If already logged in, go to dashboard.
      if (isLoggedIn || isAuthenticated()) {
        window.location.pathname = '/dashboard';
        return;
      }

      setIsLoginModalOpen(true);
    },
    [isLoggedIn]
  );

  const navClass = useMemo(() => {
    return isScrolled
      ? 'bg-[#12121A]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.35)]'
      : 'bg-[#0A0A0F]/60 backdrop-blur-xl border-b border-white/5';
  }, [isScrolled]);

  return (
    <header role="banner" className="fixed top-0 left-0 right-0 z-50" aria-label="Navbar">
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoggedIn={() => {
          setIsLoginModalOpen(false);
          window.location.pathname = '/dashboard';
        }}
      />

      <nav className={`h-20 md:h-24 ${navClass}`}>
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
              <span className="text-lg font-semibold text-[#F8F8FC] tracking-tight transition-colors duration-300 group-hover:text-[#06B6D4]">
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
                        ? 'text-[#06B6D4]'
                        : 'text-[#A0A0B0] hover:text-[#F8F8FC] hover:bg-white/[0.05]'
                    }`}

                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
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
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-full bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]"
              >
                Let&apos;s Talk
              </a>

            </div>

            {/* Mobile button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg text-[#A0A0B0] hover:text-[#F8F8FC] hover:bg-white/[0.05] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]"

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
          className="absolute inset-0 bg-[#0A0A0F]/80 backdrop-blur-sm"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
        <div
          className={`absolute top-20 left-0 right-0 bg-[#12121A]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                      : 'text-[#A0A0B0] hover:text-[#F8F8FC] hover:bg-white/[0.05]'
                  }`}

                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-[#06B6D4] shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                        : 'bg-[#6B6B7B]'
                    }`}
                  />
                  {item.label}
                </a>
              );
            })}

            <div className="pt-4 mt-4 border-t border-white/[0.08]">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 text-base font-medium text-white rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] active:scale-[0.98]"
              >
                Let&apos;s Talk
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

