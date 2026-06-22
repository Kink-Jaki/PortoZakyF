import React, { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ExternalLink, GitBranch, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ProjectApiRow = {
  id: number;
  title: string;
  description: string;
  stack: string;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  createdAt?: string | null;
};

type ProjectCardData = {
  title: string;
  description: string;
  year: string;
  tags: string[];
  imageUrl: string | null;
  links: { labelKey: 'source' | 'info'; href: string }[];
};

// Menggunakan cara aman untuk mengakses variabel lingkungan
const getApiUrl = (): string => {
  try {
    // @ts-ignore
    const meta = import.meta;
    if (meta && meta.env && meta.env.VITE_API_URL) {
      return meta.env.VITE_API_URL;
    }
  } catch (e) {
    // Abaikan jika tidak didukung
  }
  


  return 'https://zakyportoapi-production.up.railway.app';
};

const apiBase = getApiUrl();

// --- Komponen Reveal Lokal ---
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

const normalizeImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  if (imageUrl.startsWith('/')) return `${apiBase}${imageUrl}`;
  return `${apiBase}/${imageUrl}`;
};

const stackToTags = (stack: string): string[] => {
  return stack
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
};

// --- Multi-Language Dictionary ---
type Lang = 'id' | 'en';

const translations = {
  id: {
    badge: 'Proyek',
    headline: 'Portofolio Saya',
    description: 'Kumpulan sistem backend, arsitektur API, dan aplikasi yang telah saya kembangkan untuk berbagai kebutuhan bisnis.',
    fetchError: 'Gagal mengambil data projects',
    loadError: 'Gagal memuat projects',
    sourceLabel: 'Kode Sumber',
    infoLabel: 'Info Lengkap',
    comingSoon: 'Fitur Live Demo akan segera hadir!',
  },
  en: {
    badge: 'Projects',
    headline: 'My Portfolio',
    description: 'A collection of backend systems, API architectures, and applications I have developed for various business needs.',
    fetchError: 'Failed to fetch projects data',
    loadError: 'Failed to load projects',
    sourceLabel: 'Source Code',
    infoLabel: 'More Info',
    comingSoon: 'Live Demo feature is coming soon!',
  },
};

const Projects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectCardData[]>([]);

  // State Bahasa
  const [lang, setLang] = useState<Lang>('id');
  
  // State Notifikasi Kustom
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load awal & listener untuk mendeteksi perubahan bahasa
  useEffect(() => {
    const loadLang = () => {
      const savedLang = (localStorage.getItem('lang') as Lang) || 'id';
      setLang(savedLang);
    };

    loadLang();

    window.addEventListener('languageChange', loadLang);
    window.addEventListener('storage', (e) => {
      if (e.key === 'lang') loadLang();
    });

    return () => {
      window.removeEventListener('languageChange', loadLang);
      window.removeEventListener('storage', loadLang);
    };
  }, []);

  // Timer untuk menghilangkan notifikasi secara otomatis
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const t = translations[lang];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${apiBase}/project`);
        if (!res.ok) throw new Error(`${t.fetchError} (${res.status})`);

        const data = (await res.json()) as ProjectApiRow[];

        const mapped: ProjectCardData[] = data.map((p) => {
          const year = p.createdAt ? new Date(p.createdAt).getFullYear().toString() : '—';
          const tags = stackToTags(p.stack);
          const imageUrl = normalizeImageUrl(p.imageUrl);

          const links: { labelKey: 'source' | 'info'; href: string }[] = [];
          if (p.githubUrl) links.push({ labelKey: 'source', href: p.githubUrl });
          if (!links.length) links.push({ labelKey: 'info', href: '#' });

          return {
            title: p.title,
            description: p.description,
            year,
            tags,
            imageUrl,
            links,
          };
        });

        setProjects(mapped);
      } catch (e) {
        setError(e instanceof Error ? e.message : t.loadError);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [t.fetchError, t.loadError]); // Menambahkan dependencies yang diperlukan

  const cardList = useMemo(() => projects, [projects]);

  const handleLiveDemoClick = () => {
    setToastMessage(t.comingSoon);
  };

  return (
    <section id="projects" className="py-20 md:py-24 bg-[var(--bg-primary)] transition-colors duration-300 relative" aria-label="Projects">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal delayMs={100}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-2 transition-colors duration-300">
                <span className="h-2 w-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">{t.badge}</span>
              </div>
            </Reveal>
            <Reveal delayMs={200}>
              <h2 className="mt-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl transition-colors duration-300">
                {t.headline}
              </h2>
            </Reveal>
          </div>
          <Reveal delayMs={300}>
            <p className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)] md:text-right transition-colors duration-300">
              {t.description}
            </p>
          </Reveal>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        {}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(loading ? cardList : projects).map((p, idx) => (
            <Reveal key={p.title} delayMs={150 * (idx % 3 + 1)}>
              <article
                className="group relative rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-md transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-[var(--text-secondary)]/30 hover:shadow-lg flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] transition-colors duration-300">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      loading="lazy"
                      className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center">
                      <span className="text-sm font-semibold text-[var(--text-primary)] opacity-80 transition-colors duration-300">ZakyPorto</span>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/50 via-transparent to-transparent transition-colors duration-300" />
                  <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)]/40 px-3 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors duration-300">
                    {p.year}
                  </div>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-[var(--text-primary)] transition-colors duration-300">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] flex-grow transition-colors duration-300">{p.description}</p>

                {/* Tags Stack */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#06B6D4]/20 bg-[#06B6D4]/10 px-3 py-1 text-xs font-medium text-[#06B6D4]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link Buttons */}
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  {p.links.map((l) => (
                    <a
                      key={l.labelKey}
                      href={l.href}
                      target={l.href.startsWith('#') ? undefined : '_blank'}
                      rel={l.href.startsWith('#') ? undefined : 'noreferrer'}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all duration-300 hover:bg-[var(--text-primary)]/[0.08] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
                    >
                      {l.labelKey === 'source' ? (
                        <GitBranch className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <ExternalLink className="h-4 w-4" strokeWidth={2} />
                      )}
                      {l.labelKey === 'source' ? t.sourceLabel : t.infoLabel}
                    </a>
                  ))}

                  {/* Live Demo Button with Custom Notification */}
                  <button
                    type="button"
                    onClick={handleLiveDemoClick}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all duration-300 hover:bg-[var(--text-primary)]/[0.08] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
                  >
                    <ExternalLink className="h-4 w-4" strokeWidth={2} />
                    Live Demo
                  </button>
                </div>

                {/* Bottom line accent effect */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#06B6D4]/0 via-[#06B6D4]/60 to-[#8B5CF6]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-5 py-4 shadow-2xl backdrop-blur-xl transition-colors duration-300"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06B6D4]/10">
              <Info className="h-5 w-5 text-[#06B6D4]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)] pr-2">
              {toastMessage}
            </p>
            <button 
              onClick={() => setToastMessage(null)}
              className="ml-auto rounded-full p-1 text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/10 hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close notification"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;