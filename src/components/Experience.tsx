import React, { useEffect, useState } from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';

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

const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

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
    <section id="experience" className="py-20 md:py-24" aria-label="Experience">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#6366F1] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span className="text-sm font-medium text-[#A0A0B0]">Experience</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-[#F8F8FC] md:text-4xl">Pengalaman & Pendidikan</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#A0A0B0]">
            Rekam jejak pendidikan dan pengalaman magang saya dalam dunia pengembangan perangkat lunak.
          </p>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 text-[#A0A0B0] text-sm">Memuat...</div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {items.map((it, idx) => (
              <div
                key={`${it.title}-${idx}`}
                className="relative rounded-2xl border border-white/10 bg-[#12121A]/70 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      {it.type === 'work' ? (
                        <Briefcase className="h-5 w-5 text-[#6366F1]" strokeWidth={2} />
                      ) : (
                        <GraduationCap className="h-5 w-5 text-[#8B5CF6]" strokeWidth={2} />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#A0A0B0]">{it.company}</div>
                      <div className="text-xl font-semibold text-[#F8F8FC]">{it.title}</div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 w-max text-xs font-medium text-[#A0A0B0]">
                    {it.period}
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#A0A0B0]">{it.description}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-[#F8F8FC]">
                    {it.type === 'work' ? 'Work' : 'Education'}
                  </span>
                </div>


                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#6366F1]/0 via-[#6366F1]/60 to-[#8B5CF6]/0 opacity-50" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;

