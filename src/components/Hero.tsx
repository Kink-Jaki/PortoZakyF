import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Server, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

import { apiBase } from '../config/api';


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

interface TerminalBlockProps {
  command: string;
  output: ReactNode;
  promptDelay: number;
  typeDelay: number;
  outputDelay: number;
}

const TerminalBlock = ({ command, output, promptDelay, typeDelay, outputDelay }: TerminalBlockProps) => {
  const [typedText, setTypedText] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        setTypedText(command.slice(0, currentIndex + 1));
        currentIndex++;
        if (currentIndex >= command.length) {
          clearInterval(interval);
        }
      }, 40);

      return () => clearInterval(interval);
    }, typeDelay);

    return () => clearTimeout(timeout);
  }, [isInView, command, typeDelay]);

  return (
    <div ref={ref} className="mb-5">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.2, delay: promptDelay / 1000 }}
      >
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[#27C93F] font-semibold">zaky@dev</span>
          <span className="text-[#C792EA]">MINGW64</span>
          <span className="text-[#FFCB6B]">~</span>
        </div>
        <div className="flex gap-2 mt-0.5">
          <span className="text-white">$</span>
          <span className="text-[#89DDFF]">{typedText}</span>
        </div>
      </motion.div>

      {output && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: outputDelay / 1000 }}
          className="mt-1"
        >
          {output}
        </motion.div>
      )}
    </div>
  );
};

export default function App() {
  const [projectsCount, setProjectsCount] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjectsCount() {
      try {
        const res = await fetch(`${apiBase}/project`, {
          method: 'GET',
        });

        if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
        const data = (await res.json()) as unknown[];

        if (isMounted) {
          setProjectsCount(Array.isArray(data) ? data.length : 0);
        }
      } catch {
        if (isMounted) setProjectsCount(0);
      }
    }

    fetchProjectsCount();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section

      id="home"
      className="relative overflow-hidden min-h-screen bg-[#0A0A0F]"
      aria-label="Hero"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#06B6D4]/25 blur-3xl" />
        <div className="absolute -top-10 left-[-4rem] h-[16rem] w-[16rem] rounded-full bg-[#22D3EE]/20 blur-2xl" />
        <div className="absolute top-[20rem] right-[-5rem] h-[18rem] w-[18rem] rounded-full bg-[#06B6D4]/10 blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <Reveal delayMs={0}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-[0_0_20px_rgba(6,182,212,0.08)]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#06B6D4] to-[#22D3EE]">
                  <Server className="h-4 w-4 text-white" strokeWidth={2} />
                </span>
                <span className="text-sm font-medium text-[#A0A0B0]">System Online • 2026</span>
              </div>
            </Reveal>

            <Reveal delayMs={120}>
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#F8F8FC] md:text-6xl">
                Hi, aku Zaky.
                <TypewriterLoop />
              </h1>
            </Reveal>

            <Reveal delayMs={240}>
              <p className="max-w-xl text-base leading-relaxed text-[#A0A0B0]">
                Muhammad Fairuz Zaky atau sebut saja Zaky. Mari Membangun API yang cepat, aman, dan scalable untuk aplikasi modern.
                Berfokus pada ekosistem{' '}
                <strong className="text-[#F8F8FC] font-medium">Node.js</strong> &{' '}
                <strong className="text-[#F8F8FC] font-medium">TypeScript</strong>,
                serta performa tinggi menggunakan <strong className="text-[#F8F8FC] font-medium">Hono.js</strong> dan desain database{' '}
                <strong className="text-[#F8F8FC] font-medium">PostgreSQL</strong>.
              </p>
            </Reveal>

            <Reveal delayMs={360}>
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] px-6 py-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.02]"
              >
                View APIs
                <ArrowRight className="h-4 w-4" />
              </a>
            </Reveal>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#12121A]/70 p-5 shadow-md">
                <div className="text-2xl font-bold text-[#F8F8FC]">{projectsCount === null ? '...' : `${projectsCount}+`}</div>
                <div className="mt-1 text-sm text-[#A0A0B0]">Projects Built</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#12121A]/70 p-5 shadow-md">
                <div className="text-2xl font-bold text-[#F8F8FC]">5+</div>
                <div className="mt-1 text-sm text-[#A0A0B0]">Technologies</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#12121A]/70 p-5 shadow-md">
                <div className="text-2xl font-bold text-[#F8F8FC]">1</div>
                <div className="mt-1 text-sm text-[#A0A0B0]">Internship Experience</div>
              </div>
            </div>
          </div>


          <div className="relative">
            <div className="absolute -inset-2 rounded-[1.2rem] bg-gradient-to-r from-[#06B6D4]/20 to-[#22D3EE]/20 blur-xl" />

            <div className="relative rounded-xl border border-white/10 bg-[#0F111A] shadow-2xl overflow-hidden font-mono text-sm z-10 min-h-[520px]">
              <div className="flex items-center gap-2 bg-[#1A1C23] px-4 py-3 border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
                </div>
                <div className="ml-2 text-xs text-[#8F93A2] font-sans">MINGW64:/c/Users/Zaky</div>
              </div>

              <div className="p-5 text-[#E2E8F0] text-xs sm:text-sm h-full">
                <TerminalBlock
                  command="whoami"
                  output={<span className="text-[#A6ACCD]">Muhammad Fairuz Zaky</span>}
                  promptDelay={300}
                  typeDelay={600}
                  outputDelay={1100}
                />

                <TerminalBlock
                  command="cat current_focus.txt"
                  output={
                    <div className="text-[#A6ACCD] flex flex-col space-y-1">
                      <span>Building scalable REST APIs</span>
                      <span>Designing PostgreSQL databases</span>
                      <span>Learning system architecture</span>
                    </div>
                  }
                  promptDelay={1600}
                  typeDelay={1900}
                  outputDelay={2800}
                />

                <TerminalBlock
                  command="ls tech_stack/"
                  output={
                    <div className="text-[#A6ACCD] flex flex-col space-y-1">
                      <span>Hono.js</span>
                      <span>TypeScript</span>
                      <span>PostgreSQL</span>
                      <span>Railway</span>
                      <span>Docker</span>
                    </div>
                  }
                  promptDelay={3300}
                  typeDelay={3600}
                  outputDelay={4300}
                />

                <TerminalBlock
                  command="git log --oneline -1"
                  output={
                    <div className="text-[#A6ACCD]">
                      <span className="text-[#E5C07B]">a1b2c3d</span> feat: deploy portfolio API to production
                    </div>
                  }
                  promptDelay={4800}
                  typeDelay={5100}
                  outputDelay={6000}
                />

                <TerminalBlock
                  command="echo $STATUS"
                  output={<span className="text-[#06B6D4] font-semibold">AVAILABLE_FOR_INTERNSHIP</span>}
                  promptDelay={6500}
                  typeDelay={6800}
                  outputDelay={7400}
                />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: 7900 / 1000 }}
                >
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[#27C93F] font-semibold">zaky@dev</span>
                    <span className="text-[#C792EA]">MINGW64</span>
                    <span className="text-[#FFCB6B]">~</span>
                  </div>
                  <div className="flex gap-2 items-center mt-0.5">
                    <span className="text-white">$</span>
                    <motion.div
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      className="w-2.5 h-4 bg-[#A6ACCD]"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

