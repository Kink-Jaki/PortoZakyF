import React, { useEffect, useState } from 'react';
import {
  Edit3,
  Plus,
  Trash2,
  LayoutDashboard,
  Save,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../auth/AuthContext';
import { authHeaders, getToken } from '../auth/auth';

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
  view_count?: number | null;
};




import { apiBase } from '../config/api';




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

// ============================================================================
// UI Components
// ============================================================================
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

export default function DashboardProjects() {
  // isLoggedIn tidak dipakai untuk guard redirect (menggunakan getToken sinkron)
  useAuth();


  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);

  const [projectForm, setProjectForm] = useState({
    id: 0,
    title: '',
    description: '',
    stack: '',
    githubUrl: '',
    demoUrl: '',
    imageUrl: '',
    imageFile: null as File | null,
  });




  useEffect(() => {
    if (!getToken()) window.location.pathname = '/';
  }, []);



  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await apiGet<Project[]>('/project');
      setProjects(p || []);
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
    // gunakan localStorage secara sinkron agar redirect tidak terjadi
    // saat state AuthProvider belum ter-boot
    if (!getToken()) window.location.pathname = '/';
  };

  const resetProjectForm = () =>
    setProjectForm({
      id: 0,
      title: '',
      description: '',
      stack: '',
      githubUrl: '',
      demoUrl: '',
      imageUrl: '',
      imageFile: null,
    });


  const handleProjectSave = async () => {
    ensureLoggedInOrRedirect();
    try {
      const formData = new FormData();
      formData.append('title', projectForm.title);
      formData.append('description', projectForm.description);
      formData.append('techStack', projectForm.stack);
      if (projectForm.githubUrl) formData.append('githubUrl', projectForm.githubUrl);
      if (projectForm.demoUrl) formData.append('demoUrl', projectForm.demoUrl);

      // Kirim file hanya jika user pilih file
      if (projectForm.imageFile) formData.append('image', projectForm.imageFile);

      if (projectForm.id) {
        await fetch(`${apiBase}/project/${projectForm.id}`, {

          method: 'PUT',
          headers: { ...authHeaders() },
          body: formData,
        }).then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.message ?? `Gagal update data (${res.status})`);
          }
        });
      } else {
        await fetch(`${apiBase}/project`, {
          method: 'POST',
          headers: { ...authHeaders(), },
          body: formData,
        }).then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.message ?? `Gagal membuat data (${res.status})`);
          }
        });
      }

      resetProjectForm();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };


  return (
    <DashboardLayout
      title="Projects"
      subtitle="Manajemen data portfolio + view count"
    >
      {/* Status Messages */}
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

      <SectionShell title="Projects" subtitle="Manajemen Data" icon={LayoutDashboard}>
        <div className="grid gap-6">
          {/* Form Input */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-inner">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Title" placeholder="Nama project..." value={projectForm.title} onChange={(e) => setProjectForm((v) => ({ ...v, title: e.target.value }))} />
              <Input label="Stack" placeholder="React, Node.js..." value={projectForm.stack} onChange={(e) => setProjectForm((v) => ({ ...v, stack: e.target.value }))} />
              <div className="sm:col-span-2">
                <Input label="Description" placeholder="Deskripsi singkat..." value={projectForm.description} onChange={(e) => setProjectForm((v) => ({ ...v, description: e.target.value }))} />
              </div>
              <Input label="GitHub URL" placeholder="https://github.com/..." value={projectForm.githubUrl} onChange={(e) => setProjectForm((v) => ({ ...v, githubUrl: e.target.value }))} />
              <div className="sm:col-span-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Upload Image (file)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-gray-200 transition-all duration-300 focus:border-indigo-500/50 focus:bg-white/5 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setProjectForm((v) => ({ ...v, imageFile: file }));
                    }}
                  />
                  <div className="text-xs text-gray-500">
                    {projectForm.imageUrl ? (
                      <span>Current: <span className="text-gray-300">{projectForm.imageUrl}</span></span>
                    ) : (
                      <span>Tidak ada gambar saat ini</span>
                    )}
                  </div>
                </div>
              </div>

            </div>


            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
              <button
                onClick={handleProjectSave}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]"
              >
                {projectForm.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {projectForm.id ? 'Simpan Perubahan' : 'Tambah Project'}
              </button>
              {projectForm.id !== 0 && (
                <button
                  onClick={resetProjectForm}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-[0.98]"
                >
                  <X className="h-4 w-4" /> Batal
                </button>
              )}
            </div>
          </div>

          {/* Data List */}
          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-mono text-gray-400 border border-white/10">#{p.id}</span>
                    {p.stack && (
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-300 border border-indigo-500/20">{p.stack}</span>
                    )}
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-gray-300 border border-white/10">👁 {p.view_count ?? 0}</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-100">{p.title}</h3>
                  <p className="line-clamp-2 text-sm text-gray-400">{p.description}</p>
                </div>

                <div className="flex items-center gap-2 sm:opacity-50 transition-opacity duration-300 group-hover:opacity-100 border-t border-white/5 sm:border-t-0 pt-3 sm:pt-0">
                  <button
                    onClick={() =>
                      setProjectForm({
                        id: p.id,
                        title: p.title,
                        description: p.description,
                        stack: p.stack,
                        githubUrl: p.githubUrl ?? '',
                        demoUrl: p.demoUrl ?? '',
                        imageUrl: p.imageUrl ?? '',
                        imageFile: null,
                      })
                    }
                    className="p-2 rounded-xl border border-white/10 bg-black/20 text-gray-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/30"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={async () => {
                      ensureLoggedInOrRedirect();
                      await apiDelete(`/project/${p.id}`);
                      if (projectForm.id === p.id) resetProjectForm();
                      await refresh();
                    }}
                    className="p-2 rounded-xl border border-white/10 bg-black/20 text-gray-400 transition-all hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30"
                  >
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
    </DashboardLayout>
  );
}

