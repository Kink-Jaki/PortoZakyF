import React, { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Monitor, Server, Smartphone, Database, Wrench, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SkillRow {
  id: number;
  name: string;
  category: string;
}

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

const CATEGORY_META: Record<
  string,
  { title: string; accentColor: string; icon: React.ReactNode }
> = {
  'Backend Development': {
    title: 'Backend Development',
    accentColor: '#6366F1',
    icon: <Server className="h-6 w-6 text-[#6366F1]" strokeWidth={2} />,
  },
  Database: {
    title: 'Database',
    accentColor: '#8B5CF6',
    icon: <Database className="h-6 w-6 text-[#8B5CF6]" strokeWidth={2} />,
  },
  'Frontend Development': {
    title: 'Frontend Development',
    accentColor: '#06B6D4',
    icon: <Monitor className="h-6 w-6 text-[#06B6D4]" strokeWidth={2} />,
  },
  'Mobile Development': {
    title: 'Mobile Development',
    accentColor: '#10B981',
    icon: <Smartphone className="h-6 w-6 text-[#10B981]" strokeWidth={2} />,
  },
  'Tools & Workflow': {
    title: 'Tools & Workflow',
    accentColor: '#F59E0B',
    icon: <Wrench className="h-6 w-6 text-[#F59E0B]" strokeWidth={2} />,
  },
  'Game Development': {
    title: 'Game Development',
    accentColor: '#EC4899',
    icon: <Gamepad2 className="h-6 w-6 text-[#EC4899]" strokeWidth={2} />,
  },
};

type SkillCardProps = {
  title: string;
  icon: React.ReactNode;
  skills: string[];
  accentColor: string;
};

const SkillCard: React.FC<SkillCardProps> = ({ title, icon, skills, accentColor }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-md transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-[var(--text-secondary)]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div
        className="absolute -inset-1 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--text-primary)]/[0.04]">
            {icon}
          </div>
          <div>
            <Reveal delayMs={80}>
              <div className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300">Kategori</div>
              <div className="text-xl font-semibold text-[var(--text-primary)] transition-colors duration-300">{title}</div>
            </Reveal>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill}
              className="inline-flex items-center rounded-lg border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:border-[var(--text-primary)]/30 hover:bg-[var(--text-primary)]/[0.04] hover:text-[var(--text-primary)]"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<SkillRow[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBase}/skills`);
        if (!res.ok) throw new Error(`Gagal mengambil data skills (${res.status})`);
        const data = (await res.json()) as SkillRow[];
        setRows(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Gagal memuat skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const r of rows) {
      const cur = map.get(r.category) ?? [];
      map.set(r.category, [...cur, r.name]);
    }

    const order = Object.keys(CATEGORY_META);
    const categories = Array.from(map.keys()).sort((a, b) => order.indexOf(a) - order.indexOf(b));

    return categories.map((cat) => ({
      category: cat,
      skills: map.get(cat) ?? [],
    }));
  }, [rows]);

  return (
    <section id="skills" className="py-20 md:py-24 bg-[var(--bg-primary)] transition-colors duration-300" aria-label="Skills">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal delayMs={100}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-2 transition-colors duration-300">
                <span className="h-2 w-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.5)] animate-pulse" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">Keahlian</span>
              </div>
            </Reveal>
            <Reveal delayMs={200}>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl transition-colors duration-300">
                Teknologi & Ekosistem
              </h2>
            </Reveal>
          </div>
          <Reveal delayMs={300}>
            <p className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)] md:text-right transition-colors duration-300">
              Kumpulan teknologi, bahasa pemrograman, dan alat yang saya gunakan untuk merancang dan membangun sistem digital yang andal.
            </p>
          </Reveal>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-12 text-[var(--text-secondary)] text-sm transition-colors duration-300">Memuat...</div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {grouped.map(({ category, skills }, idx) => {
              const meta = CATEGORY_META[category];
              const title = meta?.title ?? category;
              const accentColor = meta?.accentColor ?? '#06B6D4';
              const icon = meta?.icon ?? <span />;

              return (
                <Reveal key={category} delayMs={150 * (idx % 3 + 1)}>
                  <SkillCard
                    title={title}
                    accentColor={accentColor}
                    icon={icon}
                    skills={skills}
                  />
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;