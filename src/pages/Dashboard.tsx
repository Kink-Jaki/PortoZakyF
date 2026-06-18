import React, { useEffect, useMemo, useState } from 'react';
import { 
  Edit3, 
  Plus, 
  Trash2, 
  LogOut, 
  LayoutDashboard, 
  Code2, 
  Briefcase, 
  Save, 
  X,
  AlertCircle,
  Loader2
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================
type Project = {
  id: number;
  title: string;
  description: string;
  stack: string;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
};

type Skill = {
  id: number;
  name: string;
  category: string;
};

type Experience = {
  id: number;
  title: string;
  organization: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
};

// ============================================================================
// MOCKS UNTUK PREVIEW (Ganti dengan import asli Anda di project sesungguhnya)
// import { authHeaders, getToken } from '../auth/auth';
// import { useAuth } from '../auth/AuthContext';
// ============================================================================
const getToken = (): string => "mock-token";
const authHeaders = (): Record<string, string> => ({ Authorization: `Bearer ${getToken()}` });
const useAuth = (): { logout: () => void; isLoggedIn: boolean } => ({ 
  logout: () => console.log('Logged out'), 
  isLoggedIn: true 
});
// ============================================================================

import { apiBase } from '../config/api';

// apiBase comes from src/config/api.ts


// API Helpers
async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${apiBase}${path}`, { headers: { ...authHeaders() } });
    if (!res.ok) throw new Error(`Gagal mengambil data (${res.status})`);
    return await res.json() as T;
  } catch (err) {
    console.warn("API Error (Mocking data for preview):", err instanceof Error ? err.message : err);
    return [] as unknown as T; // Return array kosong untuk preview jika API mati
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
  return await res.json() as T;
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
  return await res.json() as T;
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

// Komponen UI: Input Modern
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
      {label}
    </label>
    <input
      {...props}
      className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 transition-all duration-300 focus:border-indigo-500/50 focus:bg-white/5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
    />
  </div>
);

// Komponen UI: Card Section Modern
interface SectionShellProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const SectionShell: React.FC<SectionShellProps> = ({ title, subtitle, icon: Icon, children }) => {
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

export default function App() {
  const { logout, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Perbaikan tipe State menggunakan Generic TypeScript
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Forms State
  const [projectForm, setProjectForm] = useState({ id: 0, title: '', description: '', stack: '', githubUrl: '', demoUrl: '', imageUrl: '' });
  const [skillForm, setSkillForm] = useState({ id: 0, name: '', category: '' });
  const [experienceForm, setExperienceForm] = useState({ id: 0, title: '', organization: '', description: '', startDate: '', endDate: '' });

  const authToken = useMemo(() => getToken(), []);

  useEffect(() => {
    if (!authToken) window.location.pathname = '/';
  }, [authToken]);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, s, e] = await Promise.all([
        apiGet<Project[]>('/project'),
        apiGet<Skill[]>('/skills'),
        apiGet<Experience[]>('/experiences'),
      ]);
      setProjects(p || []);
      setSkills(s || []);
      setExperiences(e || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const ensureLoggedInOrRedirect = () => {
    if (!isLoggedIn) window.location.pathname = '/';
  };

  // Resets
  const resetProjectForm = () => setProjectForm({ id: 0, title: '', description: '', stack: '', githubUrl: '', demoUrl: '', imageUrl: '' });
  const resetSkillForm = () => setSkillForm({ id: 0, name: '', category: '' });
  const resetExperienceForm = () => setExperienceForm({ id: 0, title: '', organization: '', description: '', startDate: '', endDate: '' });

  // Handlers
  const handleProjectSave = async () => {
    ensureLoggedInOrRedirect();
    try {
      const payload = {
        title: projectForm.title,
        description: projectForm.description,
        imageUrl: projectForm.imageUrl || null,
        githubUrl: projectForm.githubUrl || null,
        demoUrl: projectForm.demoUrl || null,
        techStack: projectForm.stack,
      };
      if (projectForm.id) await apiPut(`/project/${projectForm.id}`, payload);
      else await apiPost('/project', payload);
      resetProjectForm();
      await refresh();
    } catch(err) { 
      setError(err instanceof Error ? err.message : String(err)); 
    }
  };

  const handleSkillSave = async () => {
    ensureLoggedInOrRedirect();
    try {
      const payload = { name: skillForm.name, category: skillForm.category };
      if (skillForm.id) await apiPut(`/skills/${skillForm.id}`, payload);
      else await apiPost('/skills', payload);
      resetSkillForm();
      await refresh();
    } catch(err) { 
      setError(err instanceof Error ? err.message : String(err)); 
    }
  };

  const handleExperienceSave = async () => {
    ensureLoggedInOrRedirect();
    try {
      const payload = {
        title: experienceForm.title,
        organization: experienceForm.organization,
        description: experienceForm.description || null,
        startDate: experienceForm.startDate || null,
        endDate: experienceForm.endDate || null,
      };
      if (experienceForm.id) await apiPut(`/experiences/${experienceForm.id}`, payload);
      else await apiPost('/experiences', payload);
      resetExperienceForm();
      await refresh();
    } catch(err) { 
      setError(err instanceof Error ? err.message : String(err)); 
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] text-gray-200 selection:bg-indigo-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-md shadow-lg">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-bold tracking-wide text-indigo-300 uppercase">Admin Dashboard</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Informasi & CRUD
            </h1>
            <p className="mt-2 text-gray-400 max-w-xl text-sm sm:text-base">
              Kelola data portfolio Anda termasuk Projects, Skills, dan Experiences dengan antarmuka yang cepat dan modern.
            </p>
          </div>

          <button
            type="button"
            onClick={() => { logout(); window.location.pathname = '/'; }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 focus:outline-none focus:ring-4 focus:ring-red-500/20 active:scale-95"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200 shadow-lg animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-8 flex items-center gap-3 text-indigo-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Sinkronisasi data...</span>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2 items-start">
          
          {/* ================= PROJECTS SECTION ================= */}
          <SectionShell title="Projects" subtitle="Manajemen Data" icon={LayoutDashboard}>
            <div className="grid gap-6">
              {/* Form Input */}
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-inner">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Title" placeholder="Nama project..." value={projectForm.title} onChange={e=>setProjectForm(v=>({...v,title:e.target.value}))} />
                  <Input label="Stack" placeholder="React, Node.js..." value={projectForm.stack} onChange={e=>setProjectForm(v=>({...v,stack:e.target.value}))} />
                  <div className="sm:col-span-2">
                    <Input label="Description" placeholder="Deskripsi singkat..." value={projectForm.description} onChange={e=>setProjectForm(v=>({...v,description:e.target.value}))} />
                  </div>
                  <Input label="GitHub URL" placeholder="https://github.com/..." value={projectForm.githubUrl} onChange={e=>setProjectForm(v=>({...v,githubUrl:e.target.value}))} />
                  <Input label="Demo URL" placeholder="https://demo.com/..." value={projectForm.demoUrl} onChange={e=>setProjectForm(v=>({...v,demoUrl:e.target.value}))} />
                  <div className="sm:col-span-2">
                    <Input label="Image URL" placeholder="https://image.url/..." value={projectForm.imageUrl} onChange={e=>setProjectForm(v=>({...v,imageUrl:e.target.value}))} />
                  </div>
                </div>
                
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
                  <button onClick={handleProjectSave} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]">
                    {projectForm.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {projectForm.id ? 'Simpan Perubahan' : 'Tambah Project'}
                  </button>
                  {projectForm.id !== 0 && (
                    <button onClick={resetProjectForm} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-[0.98]">
                      <X className="h-4 w-4" /> Batal
                    </button>
                  )}
                </div>
              </div>

              {/* Data List */}
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] hover:shadow-xl hover:shadow-indigo-500/10">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-mono text-gray-400 border border-white/10">#{p.id}</span>
                        {p.stack && <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-300 border border-indigo-500/20">{p.stack}</span>}
                      </div>
                      <h3 className="text-base font-bold text-gray-100">{p.title}</h3>
                      <p className="line-clamp-2 text-sm text-gray-400">{p.description}</p>
                    </div>
                    <div className="flex items-center gap-2 sm:opacity-50 transition-opacity duration-300 group-hover:opacity-100 border-t border-white/5 sm:border-t-0 pt-3 sm:pt-0">
                      <button onClick={() => setProjectForm({ id: p.id, title: p.title, description: p.description, stack: p.stack, githubUrl: p.githubUrl ?? '', demoUrl: p.demoUrl ?? '', imageUrl: p.imageUrl ?? '' })} className="p-2 rounded-xl border border-white/10 bg-black/20 text-gray-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/30">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button onClick={async () => { ensureLoggedInOrRedirect(); await apiDelete(`/project/${p.id}`); if (projectForm.id === p.id) resetProjectForm(); await refresh(); }} className="p-2 rounded-xl border border-white/10 bg-black/20 text-gray-400 transition-all hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {!projects.length && !loading && (
                  <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-gray-500 text-sm">
                    Belum ada data project.
                  </div>
                )}
              </div>
            </div>
          </SectionShell>

          <div className="space-y-8">
            {/* ================= SKILLS SECTION ================= */}
            <SectionShell title="Skills" subtitle="Manajemen Data" icon={Code2}>
              <div className="grid gap-6">
                {/* Form Input */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-inner">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Name" placeholder="React, Figma..." value={skillForm.name} onChange={e=>setSkillForm(v=>({...v,name:e.target.value}))} />
                    <Input label="Category" placeholder="Frontend, Design..." value={skillForm.category} onChange={e=>setSkillForm(v=>({...v,category:e.target.value}))} />
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
                    <button onClick={handleSkillSave} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]">
                      {skillForm.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {skillForm.id ? 'Simpan' : 'Tambah Skill'}
                    </button>
                    {skillForm.id !== 0 && (
                      <button onClick={resetSkillForm} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-[0.98]">
                        <X className="h-4 w-4" /> Batal
                      </button>
                    )}
                  </div>
                </div>

                {/* Data List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map((s) => (
                    <div key={s.id} className="group flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] hover:shadow-lg hover:shadow-indigo-500/10">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">{s.category}</div>
                        <div className="text-sm font-semibold text-gray-100">{s.name}</div>
                      </div>
                      <div className="flex flex-col gap-1 sm:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <button onClick={() => setSkillForm({ id: s.id, name: s.name, category: s.category })} className="p-1.5 rounded-lg border border-transparent text-gray-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/30">
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button onClick={async () => { ensureLoggedInOrRedirect(); await apiDelete(`/skills/${s.id}`); if (skillForm.id === s.id) resetSkillForm(); await refresh(); }} className="p-1.5 rounded-lg border border-transparent text-gray-400 transition-all hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {!skills.length && !loading && (
                    <div className="sm:col-span-2 rounded-2xl border border-dashed border-white/10 p-6 text-center text-gray-500 text-sm">
                      Belum ada data skill.
                    </div>
                  )}
                </div>
              </div>
            </SectionShell>

            {/* ================= EXPERIENCES SECTION ================= */}
            <SectionShell title="Experiences" subtitle="Manajemen Data" icon={Briefcase}>
              <div className="grid gap-6">
                {/* Form Input */}
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-inner">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Title" placeholder="Software Engineer..." value={experienceForm.title} onChange={e=>setExperienceForm(v=>({...v,title:e.target.value}))} />
                    <Input label="Organization" placeholder="Perusahaan X..." value={experienceForm.organization} onChange={e=>setExperienceForm(v=>({...v,organization:e.target.value}))} />
                    <div className="sm:col-span-2">
                      <Input label="Description" placeholder="Job deskripsi..." value={experienceForm.description} onChange={e=>setExperienceForm(v=>({...v,description:e.target.value}))} />
                    </div>
                    <Input label="Start Date" type="date" value={experienceForm.startDate} onChange={e=>setExperienceForm(v=>({...v,startDate:e.target.value}))} />
                    <Input label="End Date" type="date" value={experienceForm.endDate} onChange={e=>setExperienceForm(v=>({...v,endDate:e.target.value}))} />
                  </div>
                  
                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
                    <button onClick={handleExperienceSave} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]">
                      {experienceForm.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {experienceForm.id ? 'Simpan' : 'Tambah Exp'}
                    </button>
                    {experienceForm.id !== 0 && (
                      <button onClick={resetExperienceForm} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-[0.98]">
                        <X className="h-4 w-4" /> Batal
                      </button>
                    )}
                  </div>
                </div>

                {/* Data List */}
                <div className="relative space-y-4 border-l-2 border-white/10 ml-3 pl-5 py-2">
                  {experiences.map((ex) => (
                    <div key={ex.id} className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[27px] top-6 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-[#0A0A0F] transition-transform duration-300 group-hover:scale-150 group-hover:bg-purple-500" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-bold text-gray-100">{ex.title}</h3>
                          <div className="text-sm font-medium text-indigo-400 mb-2">{ex.organization}</div>
                          <div className="text-xs text-gray-500 font-mono mb-2">
                            {ex.startDate || '?'} — {ex.endDate || 'Present'}
                          </div>
                          {ex.description && <p className="text-sm text-gray-400 line-clamp-2">{ex.description}</p>}
                        </div>
                        <div className="flex items-center gap-2 sm:opacity-50 transition-opacity duration-300 group-hover:opacity-100 mt-2 sm:mt-0">
                          <button onClick={() => setExperienceForm({ id: ex.id, title: ex.title, organization: ex.organization, description: ex.description ?? '', startDate: ex.startDate ? String(ex.startDate).slice(0, 10) : '', endDate: ex.endDate ? String(ex.endDate).slice(0, 10) : '' })} className="p-2 rounded-xl border border-white/10 bg-black/20 text-gray-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/30">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={async () => { ensureLoggedInOrRedirect(); await apiDelete(`/experiences/${ex.id}`); if (experienceForm.id === ex.id) resetExperienceForm(); await refresh(); }} className="p-2 rounded-xl border border-white/10 bg-black/20 text-gray-400 transition-all hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30">
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
          </div>
        </div>
      </div>
    </div>
  );
}