import React, { useEffect, useState } from 'react';
import {
  Code2,
  Edit3,
  Plus,
  Trash2,
  Save,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import DashboardLayout from './DashboardLayout';
import { getToken, authHeaders } from '../auth/auth';
import { apiBase } from '../config/api';
import { useAuth } from '../auth/AuthContext';

type Skill = {
  id: number;
  name: string;
  category: string;
  view_count?: number | null;
};

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, { headers: { ...authHeaders() } });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? `Gagal mengambil data (${res.status})`);
  }
  return (await res.json()) as T;
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

export default function DashboardSkills() {
  useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillForm, setSkillForm] = useState({ id: 0, name: '', category: '' });

  useEffect(() => {
    if (!getToken()) window.location.pathname = '/';
  }, []);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await apiGet<Skill[]>('/skills');
      setSkills(s || []);
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
    if (!getToken()) window.location.pathname = '/';
  };

  const resetSkillForm = () => setSkillForm({ id: 0, name: '', category: '' });

  const handleSkillSave = async () => {
    ensureLoggedInOrRedirect();
    try {
      const payload = { name: skillForm.name, category: skillForm.category };
      if (skillForm.id) await apiPut(`/skills/${skillForm.id}`, payload);
      else await apiPost('/skills', payload);
      resetSkillForm();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <DashboardLayout title="Skills" subtitle="Manajemen data portfolio + view count">
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

      <SectionShell title="Skills" subtitle="Manajemen Data" icon={Code2}>
        <div className="grid gap-6">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-inner">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Name"
                placeholder="React, Figma..."
                value={skillForm.name}
                onChange={(e) => setSkillForm((v) => ({ ...v, name: e.target.value }))}
              />
              <Input
                label="Category"
                placeholder="Frontend, Design..."
                value={skillForm.category}
                onChange={(e) => setSkillForm((v) => ({ ...v, category: e.target.value }))}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
              <button
                onClick={handleSkillSave}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]"
              >
                {skillForm.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {skillForm.id ? 'Simpan' : 'Tambah Skill'}
              </button>

              {skillForm.id !== 0 && (
                <button
                  onClick={resetSkillForm}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-[0.98]"
                >
                  <X className="h-4 w-4" /> Batal
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.map((s) => (
              <div
                key={s.id}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">{s.category}</div>
                  <div className="text-sm font-semibold text-gray-100">{s.name}</div>
                  <div className="mt-1 text-[11px] text-gray-400">👁 {s.view_count ?? 0} views</div>
                </div>

                <div className="flex flex-col gap-1 sm:opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    onClick={() => setSkillForm({ id: s.id, name: s.name, category: s.category })}
                    className="p-1.5 rounded-lg border border-transparent text-gray-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/30"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>

                  <button
                    onClick={async () => {
                      ensureLoggedInOrRedirect();
                      await apiDelete(`/skills/${s.id}`);
                      if (skillForm.id === s.id) resetSkillForm();
                      await refresh();
                    }}
                    className="p-1.5 rounded-lg border border-transparent text-gray-400 transition-all hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30"
                  >
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
    </DashboardLayout>
  );
}

