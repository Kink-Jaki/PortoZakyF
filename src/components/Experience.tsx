import React, { useEffect, useState, type ReactNode } from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

type ExperienceApiRow = {
  id: number;
  title: string;
  organization: string;
  description: string | null;
  type?: 'work' | 'education' | null;
  skills?: string[] | null;
  startDate: string | null;
  endDate: string | null;
};

type TimelineItemViewModel = {
  title: string;
  company: string;
  period: string;
  description: string;
  type: 'work' | 'education';
  skills: string[];
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

const Experience: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<TimelineItemViewModel[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBase}/experiences`);
        if (!res.ok) throw new Error(`Gagal mengambil data experiences (${res.status})`);

        const data = (await res.json()) as ExperienceApiRow[];

        const mapped: TimelineItemViewModel[] = (Array.isArray(data) ? data : []).map((ex) => {
          const start = ex.startDate ? String(ex.startDate).slice(0, 10) : '';
          const end = ex.endDate ? String(ex.endDate).slice(0, 10) : '';
          const period = start && end ? `${start} - ${end}` : start ? `${start} - Present` : '—';

          const type: 'work' | 'education' = ex.type === 'education' ? 'education' : 'work';
          const skills: string[] = Array.isArray(ex.skills) ? ex.skills : [];

          return {
            title: ex.title,
            company: ex.organization,
            period,
            description: ex.description ?? '',
            type,
            skills,
          };
        });

        setItems(mapped);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Gagal memuat experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="py-20 md:py-24 bg-[var(--bg-primary)] transition-colors duration-300" aria-label="Experience">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div>
          <Reveal delayMs={100}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-2 transition-colors duration-300">
              <span className="h-2 w-2 rounded-full bg-[#6366F1] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              <span className="text-sm font-medium text-[var(--text-secondary)]">Experience</span>
            </div>
          </Reveal>
          
          <Reveal delayMs={200}>
            <h2 className="mt-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl transition-colors duration-300">
              Pengalaman & Pendidikan
            </h2>
          </Reveal>
          
          <Reveal delayMs={300}>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] transition-colors duration-300">
              Rekam jejak pendidikan dan pengalaman magang saya dalam dunia pengembangan perangkat lunak.
            </p>
          </Reveal>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 text-[var(--text-secondary)] text-sm transition-colors duration-300">Memuat...</div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {items.map((it, idx) => (
              <Reveal key={`${it.title}-${idx}`} delayMs={150 * (idx % 2 + 1)}>
                <div
                  className="relative rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--text-secondary)]/30"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] transition-colors duration-300">
                        {it.type === 'work' ? (
                          <Briefcase className="h-5 w-5 text-[#6366F1]" strokeWidth={2} />
                        ) : (
                          <GraduationCap className="h-5 w-5 text-[#8B5CF6]" strokeWidth={2} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300">{it.company}</div>
                        <div className="text-xl font-semibold text-[var(--text-primary)] transition-colors duration-300">{it.title}</div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-3 py-1 w-max text-xs font-medium text-[var(--text-secondary)] transition-colors duration-300">
                      {it.period}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] transition-colors duration-300">{it.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-3 py-1 text-xs font-medium text-[var(--text-primary)] transition-colors duration-300">
                      {it.type === 'work' ? 'Work' : 'Education'}
                    </span>
                    {it.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="rounded-full border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] transition-colors duration-300">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Efek garis gradasi bawah */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#6366F1]/0 via-[#6366F1]/60 to-[#8B5CF6]/0 opacity-50" />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;  