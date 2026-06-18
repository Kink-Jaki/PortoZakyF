import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, GitBranch } from 'lucide-react';

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

const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

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
    <section id="projects" className="py-20 md:py-24" aria-label="Projects">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#06B6D4] shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
              <span className="text-sm font-medium text-[#A0A0B0]">Proyek</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold text-[#F8F8FC] md:text-4xl">Portofolio Saya</h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-[#A0A0B0] md:text-right">
            Kumpulan sistem backend, arsitektur API, dan aplikasi yang telah saya kembangkan untuk berbagai kebutuhan bisnis.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(loading ? cardList : projects).map((p) => (
            <article
              key={p.title}
              className="group relative rounded-2xl border border-white/10 bg-[#12121A]/70 p-6 shadow-md transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-white/20 hover:shadow-lg flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
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
                    <span className="text-sm font-semibold text-[#F8F8FC] opacity-80">ZakyPorto</span>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0F]/50 via-transparent to-transparent" />
                <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0A0A0F]/40 px-3 py-1 text-xs font-medium text-[#A0A0B0]">
                  {p.year}
                </div>
              </div>

              <h3 className="mt-4 text-xl font-semibold text-[#F8F8FC]">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A0A0B0] flex-grow">{p.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-[#06B6D4]/10 px-3 py-1 text-xs font-medium text-[#06B6D4]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                {p.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.href.startsWith('#') ? undefined : '_blank'}
                    rel={l.href.startsWith('#') ? undefined : 'noreferrer'}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[#A0A0B0] transition-all duration-300 hover:bg-white/10 hover:text-[#F8F8FC] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]"
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

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#06B6D4]/0 via-[#06B6D4]/60 to-[#8B5CF6]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

