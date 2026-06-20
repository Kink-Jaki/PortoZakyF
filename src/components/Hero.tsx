import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import { Server, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { apiBase } from '../config/api';

// --- Global CSS Variables & Transitions ---
const globalStyles = `
  :root {
    --bg-primary: #0A0A0F;
    --text-primary: #F8F8FC;
    --text-secondary: #A0A0B0;
    --border-color: rgba(255, 255, 255, 0.1);
    --card-bg: rgba(18, 18, 26, 0.7);
    --system-badge-bg: rgba(255, 255, 255, 0.05);

    /* Terminal Dark Colors (Default) */
    --terminal-bg: #0F111A;
    --terminal-header-bg: #1A1C23;
    --terminal-text: #E2E8F0;
    --terminal-text-muted: #A6ACCD;
    --terminal-header-text: #8F93A2;
    --terminal-prompt-dollar: #FFFFFF;
    --terminal-border: rgba(255, 255, 255, 0.1);
    --terminal-prompt-user: #27C93F;
    --terminal-prompt-env: #C792EA;
    --terminal-prompt-dir: #FFCB6B;
    --terminal-command: #89DDFF;
    --terminal-cursor: #A6ACCD;
  }

  [data-theme='light'] {
    --bg-primary: #f8fafc;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --border-color: rgba(0, 0, 0, 0.1);
    --card-bg: rgba(255, 255, 255, 0.8);
    --system-badge-bg: rgba(0, 0, 0, 0.05);

    /* Terminal Light Colors */
    --terminal-bg: #F1F5F9;
    --terminal-header-bg: #E2E8F0;
    --terminal-text: #1E293B;
    --terminal-text-muted: #475569;
    --terminal-header-text: #64748B;
    --terminal-prompt-dollar: #0F172A;
    --terminal-border: rgba(0, 0, 0, 0.1);
    --terminal-prompt-user: #16A34A;
    --terminal-prompt-env: #7C3AED;
    --terminal-prompt-dir: #D97706;
    --terminal-command: #0284C7;
    --terminal-cursor: #475569;
  }

  /* Smooth Transition Global */
  body, section, div, span, p, h1, a {
    transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
  }

  /* Hide Scrollbar for Terminal */
  .terminal-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .terminal-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .terminal-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
`;

// --- Komponen Pengetik Font Loop ---
const TypewriterLoop = () => {
  const role = 'Backend Developer';
  const fonts = ['font-mono', 'font-sans', 'font-serif'];

  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [fontIndex, setFontIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleType = () => {
      setText(
        isDeleting
          ? role.substring(0, text.length - 1)
          : role.substring(0, text.length + 1)
      );
      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === role) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setFontIndex((prev) => (prev + 1) % fonts.length);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, fontIndex]);

  return (
    <span
      className={`inline-block h-[1.2em] transition-all duration-500 text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] border-r-2 border-[#22D3EE] pr-1 ${fonts[fontIndex]}`}
    >
      {text}
    </span>
  );
};

interface RevealProps {
  children: ReactNode;
  delayMs?: number;
}

const Reveal = ({ children, delayMs = 0 }: RevealProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delayMs / 1000 }}
    >
      {children}
    </motion.div>
  );
};

// --- Terminal Logic & Components ---

interface HistoryItem {
  command: string;
  output: ReactNode | null;
}

const TerminalHistoryLine = ({ command, output }: HistoryItem) => (
  <div className="mb-5">
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-[var(--terminal-prompt-user)] font-semibold">zaky@dev</span>
      <span className="text-[var(--terminal-prompt-env)]">MINGW64</span>
      <span className="text-[var(--terminal-prompt-dir)]">~</span>
    </div>
    <div className="flex gap-2 mt-0.5">
      <span className="text-[var(--terminal-prompt-dollar)]">$</span>
      <span className="text-[var(--terminal-command)] break-all">{command}</span>
    </div>
    {output && <div className="mt-1 text-[var(--terminal-text-muted)]">{output}</div>}
  </div>
);

export default function App() {
  const [projectsCount, setProjectsCount] = useState<number | null>(null);
  
  // Theme & Language State
  const [, setTheme] = useState<string>('dark');
  const [lang, setLang] = useState<'id' | 'en'>('id');

  // Terminal State
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'whoami',
      output: 'Muhammad Fairuz Zaky'
    },
    {
      command: 'status',
      output: (
        <div className="flex flex-col space-y-1">
          <span>Portfolio system ready.</span>
          <span>Type "light" / "dark" to change theme.</span>
          <span>Type "id" / "en" to change language.</span>
        </div>
      )
    }
  ]);

  const outerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Theme and Language from LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedLang = (localStorage.getItem('lang') as 'id' | 'en') || 'id';
    
    setTheme(savedTheme);
    setLang(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Fetch Projects Mock
  useEffect(() => {
    let isMounted = true;
    async function fetchProjectsCount() {
      try {
        const res = await fetch(`${apiBase}/project`, { method: 'GET' });
        if (!res.ok) throw new Error(`Failed to fetch`);
        const data = await res.json();
        if (isMounted) setProjectsCount(Array.isArray(data) ? data.length : 0);
      } catch {
        if (isMounted) setProjectsCount(0);
      }
    }
    fetchProjectsCount();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const outerEl = outerRef.current;
    if (!outerEl) return;
    const handleScroll = () => {
      if (outerEl.scrollTop !== 0) outerEl.scrollTop = 0;
    };
    outerEl.addEventListener('scroll', handleScroll);
    return () => outerEl.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [history]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [inputValue]);

  // Terminal Commands Processing
  const handleCommandExecution = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();

    if (trimmed === '') return null;

    // Theme command
    if (trimmed === 'light' || trimmed === 'dark') {
      setTheme(trimmed);
      localStorage.setItem('theme', trimmed);
      document.documentElement.setAttribute('data-theme', trimmed);

      return (
        <div className="flex flex-col space-y-1 mt-1">
          <span>Switching theme...</span>
          <span className="text-[#27C93F] font-semibold">Theme changed successfully.</span>
          <span>Current theme: {trimmed.toUpperCase()}</span>
        </div>
      );
    }

    // Language command
    if (trimmed === 'id' || trimmed === 'en') {
      setLang(trimmed as 'id' | 'en');
      localStorage.setItem('lang', trimmed);

      // ↓↓ Tambahkan kode ini agar Navbar tahu ada perubahan bahasa
      window.dispatchEvent(new Event('languageChange'));

      return (
        <div className="flex flex-col space-y-1 mt-1">
          <span>Switching language...</span>
          <span className="text-[#27C93F] font-semibold">Language changed successfully.</span>
          <span>Current language: {trimmed.toUpperCase()}</span>
        </div>
      );
    }


    if (trimmed === 'clear') {
        setTimeout(() => setHistory([]), 10);
        return null;
    }

    // Invalid Command
    return (
      <div className="flex flex-col space-y-1 mt-1">
        <span className="text-[#FF5F56]">Command not found: {cmd}</span>
        <br />
        <span>Available commands:</span>
        <span className="text-[var(--terminal-command)] font-medium">light, dark, id, en, clear</span>
      </div>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const output = handleCommandExecution(inputValue);
      
      // Khusus perintah 'clear', tidak dimasukkan ke history
      if (inputValue.trim().toLowerCase() !== 'clear') {
        setHistory(prev => [...prev, { command: inputValue, output }]);
      }
      setInputValue('');
    }
  };

  // Content Dictionary (Berdasarkan state lang)
  const content = {
    id: {
      status: 'Sistem Aktif',
      greeting: 'Hi, aku Zaky.',
      descPart1: 'Muhammad Fairuz Zaky atau sebut saja Zaky. Mari Membangun API yang cepat, aman, dan scalable untuk aplikasi modern. Berfokus pada ekosistem',
      descPart2: 'serta performa tinggi menggunakan',
      descPart3: 'dan desain database',
      btn: 'Lihat API',
      stats: {
        projects: 'Proyek Dibuat',
        tech: 'Teknologi',
        internship: 'Pengalaman Magang'
      }
    },
    en: {
      status: 'System Online',
      greeting: "Hi, I'm Zaky.",
      descPart1: "Muhammad Fairuz Zaky or just Zaky. Let's build fast, secure, and scalable APIs for modern applications. Focusing on the",
      descPart2: "ecosystem, and high performance using",
      descPart3: "with",
      btn: 'View APIs',
      stats: {
        projects: 'Projects Built',
        tech: 'Technologies',
        internship: 'Internship Experience'
      }
    }
  };

  const t = content[lang]; // Shortcut untuk akses translasi

  return (
    <>
      <style>{globalStyles}</style>

      <section
        id="home"
        className="relative overflow-hidden min-h-screen bg-[var(--bg-primary)] transition-colors duration-300"
        aria-label="Hero"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#06B6D4]/25 blur-3xl" />
          <div className="absolute -top-10 left-[-4rem] h-[16rem] w-[16rem] rounded-full bg-[#22D3EE]/20 blur-2xl" />
          <div className="absolute top-[20rem] right-[-5rem] h-[18rem] w-[18rem] rounded-full bg-[#06B6D4]/10 blur-2xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-28 relative z-10">
          <div className="grid items-center gap-10 md:grid-cols-2">
            
            {/* Left Content */}
            <div className="space-y-6">
              <Reveal delayMs={0}>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-2 shadow-[0_0_20px_rgba(6,182,212,0.08)]">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#06B6D4] to-[#22D3EE]">
                    <Server className="h-4 w-4 text-white" strokeWidth={2} />
                  </span>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">{t.status} • 2026</span>
                </div>
              </Reveal>

              <Reveal delayMs={120}>
                <h1 className="text-5xl font-bold leading-tight tracking-tight text-[var(--text-primary)] md:text-6xl">
                  {t.greeting}
                  <br/>
                  <TypewriterLoop />
                </h1>
              </Reveal>

              <Reveal delayMs={240}>
                <p className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
                  {t.descPart1}{' '}
                  <strong className="text-[var(--text-primary)] font-medium">Node.js</strong> &{' '}
                  <strong className="text-[var(--text-primary)] font-medium">TypeScript</strong>,
                  {' '}{t.descPart2}{' '} <strong className="text-[var(--text-primary)] font-medium">Hono.js</strong> {t.descPart3}{' '}
                  <strong className="text-[var(--text-primary)] font-medium">PostgreSQL</strong>.
                </p>
              </Reveal>

              <Reveal delayMs={360}>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] px-6 py-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02]"
                >
                  {t.btn}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Reveal>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-md">
                  <div className="text-2xl font-bold text-[var(--text-primary)]">{projectsCount === null ? '...' : `${projectsCount}+`}</div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">{t.stats.projects}</div>
                </div>
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-md">
                  <div className="text-2xl font-bold text-[var(--text-primary)]">5+</div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">{t.stats.tech}</div>
                </div>
                <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-md">
                  <div className="text-2xl font-bold text-[var(--text-primary)]">1</div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">{t.stats.internship}</div>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Terminal */}
            <div className="relative">
              <div className="absolute -inset-2 rounded-[1.2rem] bg-gradient-to-r from-[#06B6D4]/20 to-[#22D3EE]/20 blur-xl" />

              <div 
                ref={outerRef}
                className="relative rounded-xl border border-[var(--terminal-border)] bg-[var(--terminal-bg)] shadow-2xl overflow-hidden font-mono text-sm z-10 h-[520px] flex flex-col cursor-text"
                onClick={() => inputRef.current?.focus()}
              >
                {/* Terminal Header */}
                <div className="flex items-center gap-2 bg-[var(--terminal-header-bg)] px-4 py-3 border-b border-[var(--terminal-border)] shrink-0 select-none">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                    <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                    <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="ml-2 text-xs text-[var(--terminal-header-text)] font-sans">MINGW64:/c/Users/Zaky</div>
                </div>

                {/* Terminal Body */}
                <div 
                  ref={terminalRef}
                  className="p-5 pb-2 text-[var(--terminal-text)] text-xs sm:text-sm flex-grow overflow-y-auto terminal-scroll"
                >
                  {/* Render History */}
                  {history.map((item, idx) => (
                    <TerminalHistoryLine key={idx} command={item.command} output={item.output} />
                  ))}

                  {/* Active Prompt */}
                  <div className="mb-2 relative">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[var(--terminal-prompt-user)] font-semibold">zaky@dev</span>
                      <span className="text-[var(--terminal-prompt-env)]">MINGW64</span>
                      <span className="text-[var(--terminal-prompt-dir)]">~</span>
                    </div>
                    <div className="flex gap-2 items-center mt-0.5">
                      <span className="text-[var(--terminal-prompt-dollar)]">$</span>
                      <span className="text-[var(--terminal-command)] break-all">{inputValue}</span>
                      {isFocused && (
                        <motion.div
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          className="w-2.5 h-4 bg-[var(--terminal-cursor)]"
                        />
                      )}
                    </div>

                    {/* Hidden Input Layer */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '1px',
                        height: '1px',
                        opacity: 0,
                        padding: 0,
                        margin: 0,
                        border: 'none',
                        pointerEvents: 'none',
                      }}
                      autoFocus
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </div>

                  <div className="h-8 shrink-0" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}