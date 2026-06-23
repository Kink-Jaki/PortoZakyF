import React, { useEffect, useState } from 'react';
import { Mail, MapPin, Globe, ArrowUpRight, Sparkles } from 'lucide-react';

type Lang = 'id' | 'en';

const translations = {
  id: {
    badge: 'Tersedia untuk Kolaborasi',
    title: "Mari Bangun Sesuatu yang Hebat.",
    description: 'Punya ide proyek, pertanyaan tentang arsitektur sistem, atau sekadar ingin berdiskusi teknologi? Jangan ragu untuk menghubungi saya melalui platform di bawah ini.',
    location: 'Blitar, Jawa Timur, Indonesia',
    builtWith: 'Dibangun dengan React & Tailwind CSS.',
    navHome: 'Beranda',
    navAbout: 'Tentang',
    navExperience: 'Pengalaman',
    navProjects: 'Proyek',
  },
  en: {
    badge: 'Available for Collaboration',
    title: "Let's Build Something Great.",
    description: 'Have a project idea, questions about system architecture, or just want to discuss tech? Feel free to reach out via the platforms below.',
    location: 'Blitar, East Java, Indonesia',
    builtWith: 'Built with React & Tailwind CSS.',
    navHome: 'Home',
    navAbout: 'About',
    navExperience: 'Experience',
    navProjects: 'Projects',
  },
};

type FooterProps = { lang?: Lang };

const Footer: React.FC<FooterProps> = () => {
  const [lang, setLang] = useState<Lang>('id');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const loadLang = () => {
      const savedLang = (localStorage.getItem('lang') as Lang) || 'id';
      setLang(savedLang);
    };

    // Deteksi dark mode dari class html atau media query
    const checkDark = () => {
      const htmlDark = document.documentElement.classList.contains('dark');
      const mediaDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      // Prioritaskan class html, fallback ke media query
      setIsDark(htmlDark || mediaDark);
    };

    loadLang();
    checkDark();

    window.addEventListener('languageChange', loadLang);
    window.addEventListener('storage', (e) => {
      if (e.key === 'lang') loadLang();
    });

    // Observer untuk perubahan class dark
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('languageChange', loadLang);
      window.removeEventListener('storage', loadLang);
      observer.disconnect();
    };
  }, []);

  const t = translations[lang];
  const currentYear = new Date().getFullYear();

  // Warna card berdasarkan theme
  const cardBg = isDark ? 'bg-neutral-900' : 'bg-white';
  const cardBorder = isDark ? 'border-neutral-800' : 'border-gray-200';
  const cardShadow = isDark ? 'shadow-[0_2px_12px_rgba(0,0,0,0.25)]' : 'shadow-[0_1px_3px_rgba(0,0,0,0.06)]';
  const badgeBg = isDark ? 'bg-emerald-950/25' : 'bg-emerald-50';
  const locationBg = isDark ? 'bg-neutral-900' : 'bg-white';
  const locationBorder = isDark ? 'border-neutral-800' : 'border-gray-200';
  const footerBorder = isDark ? 'border-neutral-800' : 'border-gray-200';

  const socialCards = [
    {
      href: "mailto:fzaky474@gmail.com",
      label: "Contact via",
      name: "Email",
      icon: Mail,
      iconBg: isDark ? 'bg-cyan-500/10' : 'bg-cyan-50',
      iconText: isDark ? 'text-cyan-400' : 'text-cyan-600',
      hoverBg: isDark ? 'dark:group-hover:bg-white/10' : 'group-hover:bg-cyan-500',
      hoverText: isDark ? 'dark:group-hover:text-white' : 'group-hover:text-white',
      hoverShadow: isDark ? 'dark:hover:shadow-[0_12px_40px_rgba(6,182,212,0.25)]' : 'hover:shadow-[0_12px_40px_rgba(6,182,212,0.18)]',
      hoverBorder: isDark ? 'dark:hover:border-cyan-400' : 'hover:border-cyan-400',
      external: false,
    },
    {
      href: "https://wa.me/89509570460",
      label: "Chat via",
      name: "WhatsApp",
      icon: null,
      customIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      iconBg: isDark ? 'bg-emerald-500/10' : 'bg-emerald-50',
      iconText: isDark ? 'text-emerald-400' : 'text-emerald-600',
      hoverBg: isDark ? 'dark:group-hover:bg-white/10' : 'group-hover:bg-emerald-500',
      hoverText: isDark ? 'dark:group-hover:text-white' : 'group-hover:text-white',
      hoverShadow: isDark ? 'dark:hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)]' : 'hover:shadow-[0_12px_40px_rgba(16,185,129,0.18)]',
      hoverBorder: isDark ? 'dark:hover:border-emerald-400' : 'hover:border-emerald-400',
      external: true,
    },
    {
      href: "https://github.com/Kink-Jaki",
      label: "Explore on",
      name: "GitHub",
      icon: null,
      customIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 11.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ),
      iconBg: isDark ? 'bg-slate-500/10' : 'bg-slate-100',
      iconText: isDark ? 'text-slate-300' : 'text-slate-700',
      hoverBg: isDark ? 'dark:group-hover:bg-white/10' : 'group-hover:bg-slate-800',
      hoverText: isDark ? 'dark:group-hover:text-white' : 'group-hover:text-white',
      hoverShadow: isDark ? 'dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.08)]' : 'hover:shadow-[0_12px_40px_rgba(71,85,105,0.18)]',
      hoverBorder: isDark ? 'dark:hover:border-slate-400' : 'hover:border-slate-400',
      external: true,
    },
    {
      href: "https://instagram.com/fzaky.13",
      label: "Follow on",
      name: "Instagram",
      icon: null,
      customIcon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
      iconBg: isDark ? 'bg-pink-500/10' : 'bg-pink-50',
      iconText: isDark ? 'text-pink-400' : 'text-pink-600',
      hoverBg: isDark ? 'dark:group-hover:bg-white/10' : 'group-hover:bg-gradient-to-tr group-hover:from-amber-500 group-hover:via-pink-500 group-hover:to-purple-600',
      hoverText: isDark ? 'dark:group-hover:text-white' : 'group-hover:text-white',
      hoverShadow: isDark ? 'dark:hover:shadow-[0_12px_40px_rgba(236,72,153,0.25)]' : 'hover:shadow-[0_12px_40px_rgba(236,72,153,0.18)]',
      hoverBorder: isDark ? 'dark:hover:border-pink-400' : 'hover:border-pink-400',
      external: true,
    },
  ];

  return (
    <footer
      id="contact"
      className="py-28 relative overflow-hidden bg-[var(--bg-primary)] border-t border-[var(--border-color)] transition-colors duration-500"
      aria-label="Contact"
    >
      {/* ===== BACKGROUND - HANYA GRID ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(100,116,139,0.6) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(100,116,139,0.6) 1px, transparent 1px)
            `,
            backgroundSize: '4rem 4rem',
          }}
        />

        {/* Orbs - dark mode only */}
        <div className="hidden dark:block absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-12 z-10">
        <div className="flex flex-col items-center justify-center text-center">

          {/* ===== BADGE ===== */}
          <div className={`group inline-flex items-center gap-3 rounded-full border border-emerald-500/25 ${badgeBg} px-5 py-2 transition-all duration-500 hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] cursor-default`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              {t.badge}
            </span>
            <Sparkles className="h-3.5 w-3.5 text-emerald-500/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* ===== HEADING ===== */}
          <h2 className="mt-8 text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-[var(--text-primary)] transition-all duration-300 max-w-5xl">
            <span className="block">{t.title.split('.')[0]}.</span>
            <span className="block mt-2 text-gray-400 dark:text-slate-400">
              {t.title.split('.')[1] || "Let's Build"}
            </span>
          </h2>

          {/* ===== DESCRIPTION ===== */}
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] transition-colors duration-300 font-light">
            {t.description}
          </p>

          {/* ===== SOCIAL CARDS ===== */}
          <div className="mt-16 grid gap-5 w-full max-w-4xl sm:grid-cols-2 lg:grid-cols-4">
            {socialCards.map((card, idx) => (
              <a
                key={idx}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className={`
                  group relative flex flex-col items-center justify-center gap-4 rounded-2xl 
                  border ${cardBorder}
                  ${cardBg}
                  p-7 
                  ${cardShadow}
                  transition-all duration-500 
                  hover:-translate-y-2 
                  ${card.hoverShadow}
                  ${card.hoverBorder}
                  overflow-hidden
                `}
              >
                {/* Corner arrow */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4">
                  <ArrowUpRight className="h-4 w-4 absolute bottom-2 left-2 text-gray-400 dark:text-neutral-500" />
                </div>

                {/* Icon Container */}
                <div className={`
                  flex h-14 w-14 items-center justify-center rounded-2xl 
                  ${card.iconBg}
                  ${card.iconText}
                  ${card.hoverBg} 
                  ${card.hoverText}
                  transition-all duration-500 
                  shadow-sm group-hover:shadow-md group-hover:scale-110
                  relative z-10
                `}>
                  {card.icon ? <card.icon className="h-6 w-6" strokeWidth={1.5} /> : card.customIcon}
                </div>

                {/* Text */}
                <div className="text-center relative z-10">
                  <span className="block text-[10px] text-gray-400 dark:text-neutral-500 font-bold uppercase tracking-[0.2em] mb-1">
                    {card.label}
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-[var(--text-primary)] group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                    {card.name}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* ===== LOCATION BADGE ===== */}
          <div className={`mt-14 group inline-flex items-center justify-center gap-2.5 rounded-full 
            border ${locationBorder}
            ${locationBg}
            px-5 py-2.5 
            shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none
            transition-all duration-500
            hover:border-gray-300 dark:hover:border-neutral-700
            hover:shadow-[0_4px_15px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)]
            cursor-default`}
          >
            <MapPin className="h-4 w-4 text-gray-500 dark:text-neutral-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300" />
            <span className="text-xs font-semibold text-gray-600 dark:text-[var(--text-secondary)] tracking-wide">
              {t.location}
            </span>
          </div>
        </div>

        {/* ===== FOOTER BOTTOM ===== */}
        <div className={`mt-24 border-t ${footerBorder} pt-10 transition-colors duration-300`}>
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">

            {/* Copyright & Stack */}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-[var(--text-secondary)] text-center md:text-left transition-colors duration-300 font-medium">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 dark:bg-neutral-800">
                <Globe className="h-3.5 w-3.5 text-gray-500 dark:text-neutral-400" />
              </div>
              <div>
                <span className="block">© {currentYear} Zaky</span>
                <span className="text-gray-400 dark:text-neutral-500">{t.builtWith}</span>
              </div>
            </div>

            {/* Quick Links Navigation */}
            <nav className="flex flex-wrap items-center justify-center gap-1 text-xs font-bold uppercase tracking-[0.15em] text-gray-500 dark:text-[var(--text-secondary)] transition-colors duration-300">
              {[
                { label: t.navHome, href: '#home' },
                { label: t.navAbout, href: '#about' },
                { label: t.navExperience, href: '#experience' },
                { label: t.navProjects, href: '#projects' },
              ].map((item, idx) => (
                <a 
                  key={idx}
                  className="group relative px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-800 dark:hover:text-white"
                  href={item.href}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gray-400 dark:bg-neutral-500 group-hover:w-1/2 transition-all duration-300 rounded-full" />
                </a>
              ))}
            </nav>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;