import React, { useEffect, useMemo, useState } from 'react';
import { Monitor, Server, Smartphone, Database, Wrench, Gamepad2 } from 'lucide-react';
import { Reveal } from './motion';

interface SkillRow {
  id: number;
  name: string;
  category: string;
}

const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

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
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#12121A]/70 p-6 shadow-md transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <div
        className="absolute -inset-1 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/10">
            {icon}
          </div>
          <div>
            <Reveal delayMs={80}>
              <div className="text-sm font-medium text-[#A0A0B0]">Kategori</div>
              <div className="text-xl font-semibold text-[#F8F8FC]">{title}</div>
            </Reveal>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill}
              className="inline-flex items-center rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-sm font-medium text-[#D1D1DF] transition-colors duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
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

    // preserve order based on meta list
    const order = Object.keys(CATEGORY_META);
    const categories = Array.from(map.keys()).sort((a, b) => order.indexOf(a) - order.indexOf(b));

    return categories.map((cat) => ({
      category: cat,
      skills: map.get(cat) ?? [],
    }));
  }, [rows]);

  return (
    <section id="skills" className="py-20 md:py-24" aria-label="Skills">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.5)] animate-pulse" />
              <span className="text-sm font-medium text-[#A0A0B0]">Keahlian</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#F8F8FC] md:text-4xl">Teknologi & Ekosistem</h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-[#A0A0B0] md:text-right">
            Kumpulan teknologi, bahasa pemrograman, dan alat yang saya gunakan untuk merancang dan membangun sistem digital yang andal.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-12 text-[#A0A0B0] text-sm">Memuat...</div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {grouped.map(({ category, skills }) => {
              const meta = CATEGORY_META[category];
              const title = meta?.title ?? category;
              const accentColor = meta?.accentColor ?? '#06B6D4';
              const icon = meta?.icon ?? <span />;

              return (
                <SkillCard
                  key={category}
                  title={title}
                  accentColor={accentColor}
                  icon={icon}
                  skills={skills}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;

