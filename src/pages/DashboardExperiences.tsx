import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, Edit3, Plus, Trash2, Save, X, AlertCircle, Loader2 } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../auth/AuthContext';
import { authHeaders, getToken } from '../auth/auth';

type Experience = {
  id: number;
  title: string;
  organization: string;
  description: string | null;
  type?: 'work' | 'education' | null;
  skills?: string[] | null;
  startDate: string | null;
  endDate: string | null;
  view_count?: number | null;
};


const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';


async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${apiBase}${path}`, { headers: { ...authHeaders() } });
    if (!res.ok) throw new Error(`Gagal mengambil data (${res.status})`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn('API Error (Mocking data for preview):', err instanceof Error ? err.message : err);
    return [] as unknown as T;
  }
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? `Gagal membuat data (${res.status})`);
  }
  return (await res.json()) as T;
}

async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? `Gagal update data (${res.status})`);
  }
  return (await res.json()) as T;
}

async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${apiBase}${path}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? `Gagal hapus data (${res.status})`);
  }
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</label>
    <input
      {...props}
      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 transition-all duration-300 focus:border-indigo-500/50 focus:bg-white/5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
    />
  </div>
);

const SectionShell: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
}> = ({ title, subtitle, icon: Icon, children }) => {
  return (
    <section className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#12121A]/80 backdrop-blur-xl p-6 shadow-2xl transition-all duration-500 hover:border-white/20">
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-[80px] transition-all duration-500 group-hover:bg-indigo-500/10" />
      <div className="relative z-10 flex items-center gap-4 mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-indigo-400">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-400/80 mb-0.5">{subtitle}</div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
};

export default function DashboardExperiences() {
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [experienceForm, setExperienceForm] = useState({
    id: 0,
    title: '',
    organization: '',
    description: '',
    type: 'work' as 'work' | 'education',
    skills: [] as string[],
    startDate: '',
    endDate: '',
  });

  const authToken = useMemo(() => getToken(), []);
  useEffect(() => {
    if (!authToken) window.location.pathname = '/';
  }, [authToken]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const e = await apiGet<Experience[]>('/experiences');
      setExperiences(e || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ensureLoggedInOrRedirect = () => {
    if (!isLoggedIn) window.location.pathname = '/';
  };

  const resetExperienceForm = () =>
    setExperienceForm({
      id: 0,
      title: '',
      organization: '',
      description: '',
      type: 'work',
      skills: [],
      startDate: '',
      endDate: '',
    });

  const handleExperienceSave = async () => {
    ensureLoggedInOrRedirect();
    try {
      const payload = {
        title: experienceForm.title,
        organization: experienceForm.organization,
        description: experienceForm.description || null,
        type: experienceForm.type,
        skills: experienceForm.skills,
        startDate: experienceForm.startDate || null,
        endDate: experienceForm.endDate || null,
      };

      if (experienceForm.id) await apiPut(`/experiences/${experienceForm.id}`, payload);
      else await apiPost('/experiences', payload);
      resetExperienceForm();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <DashboardLayout title="Experiences" subtitle="Manajemen data portfolio + view count">
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200 shadow-lg animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mb-6 flex items-center gap-3 text-indigo-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Sinkronisasi data...</span>
        </div>
      )}

      <SectionShell title="Experiences" subtitle="Manajemen Data" icon={Briefcase}>
        <div className="grid gap-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-inner">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Title" placeholder="Software Engineer..." value={experienceForm.title} onChange={(e) => setExperienceForm((v) => ({ ...v, title: e.target.value }))} />
              <Input label="Organization" placeholder="Perusahaan X..." value={experienceForm.organization} onChange={(e) => setExperienceForm((v) => ({ ...v, organization: e.target.value }))} />
              <div className="sm:col-span-2">
                <div className="space-y-1.5 w-full">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Description</label>
                  <textarea
                    value={experienceForm.description}
                    placeholder="Job deskripsi..."
                    onChange={(e) => setExperienceForm((v) => ({ ...v, description: e.target.value }))}
                    className="min-h-[120px] resize-y w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 transition-all duration-300 focus:border-indigo-500/50 focus:bg-white/5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>
              <Input label="Start Date" type="date" value={experienceForm.startDate} onChange={(e) => setExperienceForm((v) => ({ ...v, startDate: e.target.value }))} />
              <Input label="End Date" type="date" value={experienceForm.endDate} onChange={(e) => setExperienceForm((v) => ({ ...v, endDate: e.target.value }))} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
              <button
                onClick={handleExperienceSave}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]"
              >
                {experienceForm.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {experienceForm.id ? 'Simpan' : 'Tambah Exp'}
              </button>
              {experienceForm.id !== 0 && (
                <button
                  onClick={resetExperienceForm}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-[0.98]"
                >
                  <X className="h-4 w-4" /> Batal
                </button>
              )}
            </div>
          </div>

          <div className="relative space-y-4 border-l-2 border-white/10 ml-3 pl-5 py-2">
            {experiences.map((ex) => (
              <div
                key={ex.id}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                <div className="absolute -left-[27px] top-6 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-[#0A0A0F] transition-transform duration-300 group-hover:scale-150 group-hover:bg-purple-500" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-100">{ex.title}</h3>
                    <div className="text-sm font-medium text-indigo-400 mb-2">{ex.organization}</div>
                    <div className="text-xs text-gray-500 font-mono mb-2">
                      {ex.startDate || '?'} — {ex.endDate || 'Present'}
                    </div>
                    {ex.description && <p className="text-sm text-gray-400 line-clamp-2">{ex.description}</p>}
                    <div className="mt-2 text-[11px] text-gray-400">👁 {ex.view_count ?? 0} views</div>
                  </div>

                  <div className="flex items-center gap-2 sm:opacity-50 transition-opacity duration-300 group-hover:opacity-100 mt-2 sm:mt-0">
                    <button
                      onClick={() =>
                        setExperienceForm({
                          id: ex.id,
                          title: ex.title,
                          organization: ex.organization,
                          description: ex.description ?? '',
                          type: ex.type ?? 'work',
                          skills: Array.isArray(ex.skills) ? ex.skills : [],
                          startDate: ex.startDate ? String(ex.startDate).slice(0, 10) : '',
                          endDate: ex.endDate ? String(ex.endDate).slice(0, 10) : '',
                        })
                      }
                      className="p-2 rounded-xl border border-white/10 bg-black/20 text-gray-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/30"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={async () => {
                        ensureLoggedInOrRedirect();
                        await apiDelete(`/experiences/${ex.id}`);
                        if (experienceForm.id === ex.id) resetExperienceForm();
                        await refresh();
                      }}
                      className="p-2 rounded-xl border border-white/10 bg-black/20 text-gray-400 transition-all hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!experiences.length && !loading && (
              <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-gray-500 text-sm ml-[-1rem]">
                Belum ada data experience.
              </div>
            )}
          </div>
        </div>
      </SectionShell>
    </DashboardLayout>
  );
}

