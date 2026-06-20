import React, { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ExternalLink, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

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
  links: { label: string; href: string }[];
};

// Menggunakan cara aman untuk mengakses variabel lingkungan agar tidak memicu kegagalan kompilasi pada target ES2015
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
  return import.meta.env.VITE_API_URL ?? 'https://zakyportoapi-production.up.railway.app';
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

  // If backend stores full URL, use as-is.
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;

  // If it's a relative path like /uploads/xxx.png, prefix with API base.
  if (imageUrl.startsWith('/')) return `${apiBase}${imageUrl}`;

  // Fallback for other relative values.
  return `${apiBase}/${imageUrl}`;
};

const stackToTags = (stack: string): string[] => {
  return stack
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
};

const Projects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectCardData[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${apiBase}/project`);
        if (!res.ok) throw new Error(`Gagal mengambil data projects (${res.status})`);

        const data = (await res.json()) as ProjectApiRow[];

        const mapped: ProjectCardData[] = data.map((p) => {
          const year = p.createdAt ? new Date(p.createdAt).getFullYear().toString() : '—';
          const tags = stackToTags(p.stack);
          const imageUrl = normalizeImageUrl(p.imageUrl);

          const links: { label: string; href: string }[] = [];
          if (p.githubUrl) links.push({ label: 'Source', href: p.githubUrl });
          if (!links.length) links.push({ label: 'Info', href: '#' });

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
        setError(e instanceof Error ? e.message : 'Gagal memuat projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const cardList = useMemo(() => projects, [projects]);

  return (
    <section id="projects" className="py-20 md:py-24 bg-[var(--bg-primary)] transition-colors duration-300" aria-label="Projects">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal delayMs={100}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-2 transition-colors duration-300">
                <span className="h-2 w-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">Proyek</span>
              </div>
            </Reveal>
            <Reveal delayMs={200}>
              <h2 className="mt-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl transition-colors duration-300">
                Portofolio Saya
              </h2>
            </Reveal>
          </div>
          <Reveal delayMs={300}>
            <p className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)] md:text-right transition-colors duration-300">
              Kumpulan sistem backend, arsitektur API, dan aplikasi yang telah saya kembangkan untuk berbagai kebutuhan bisnis.
            </p>
          </Reveal>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200 text-sm">
            {error}
          </div>
        )}

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
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#06B6D4]/20 bg-[#06B6D4]/10 px-3 py-1 text-xs font-medium text-[#06B6D4]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Link Buttons */}
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target={l.href.startsWith('#') ? undefined : '_blank'}
                      rel={l.href.startsWith('#') ? undefined : 'noreferrer'}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all duration-300 hover:bg-[var(--text-primary)]/[0.08] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]/30 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]"
                    >
                      {l.label === 'Source' ? (
                        <GitBranch className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <ExternalLink className="h-4 w-4" strokeWidth={2} />
                      )}
                      {l.label}
                    </a>
                  ))}
                </div>

                {/* Bottom line accent effect */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#06B6D4]/0 via-[#06B6D4]/60 to-[#8B5CF6]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;