import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Edit3,
  Plus,
  Trash2,
  LayoutDashboard,
  Save,
  X,
  AlertCircle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

import DashboardLayout from './DashboardLayout';
import { useAuth } from '../auth/AuthContext';
import { getToken, authHeaders } from '../auth/auth';
import { apiBase } from '../config/api';

// ============================================================================
// TYPES
// ============================================================================

type Project = {
  id: number;
  title: string;
  description: string;
  stack: string;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  content?: string | null;
  view_count?: number | null;
};

type ConfirmDialog = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant: 'danger' | 'primary';
  onConfirm: () => void;
};

// ============================================================================
// API Helpers
// ============================================================================

async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${apiBase}${path}`, { headers: { ...authHeaders() } });
    if (!res.ok) throw new Error(`Gagal mengambil data (${res.status})`);
    return (await res.json()) as T;
  } catch (err) {
    console.warn('API Error:', err instanceof Error ? err.message : err);
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
// Confirm Modal
// Menggunakan createPortal agar modal tidak terhalang (trapped) oleh parent
// yang mungkin menggunakan overflow-hidden, transform, atau backdrop-filter.
// ============================================================================

const ConfirmModal: React.FC<{
  dialog: ConfirmDialog;
  onClose: () => void;
}> = ({ dialog, onClose }) => {
  useEffect(() => {
    if (!dialog.open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dialog.open, onClose]);

  if (!dialog.open) return null;

  const isDanger = dialog.confirmVariant === 'danger';

  // Render modal langsung ke body DOM menggunakan createPortal
  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal card */}
      <div
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#16161f] shadow-2xl"
        style={{ animation: 'modalIn 0.18s ease' }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95) translateY(8px); }
            to   { opacity: 1; transform: scale(1)   translateY(0);    }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            isDanger
              ? 'border-red-500/20 bg-red-500/10'
              : 'border-indigo-500/20 bg-indigo-500/10'
          }`}>
            {isDanger
              ? <AlertTriangle className="h-5 w-5 text-red-400" />
              : <CheckCircle2 className="h-5 w-5 text-indigo-400" />
            }
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">{dialog.title}</h3>
            <p className="mt-1 text-sm text-gray-400 leading-relaxed">{dialog.message}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 text-gray-500 hover:bg-white/5 hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-white/5 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => { dialog.onConfirm(); onClose(); }}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] ${
              isDanger
                ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-500/25'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25'
            }`}
          >
            {isDanger ? <Trash2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {dialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ============================================================================
// Quill Editor
// ============================================================================

const quillStyles = `
  .quill-editor-wrapper .ql-toolbar {
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
    border-color: rgba(255,255,255,0.1) !important;
    background: rgba(0,0,0,0.2);
  }
  .quill-editor-wrapper .ql-container {
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    border-color: rgba(255,255,255,0.1) !important;
    background: rgba(0,0,0,0.2);
  }
  .quill-editor-wrapper .ql-editor {
    min-height: 200px;
    color: #e2e8f0;
    font-size: 0.875rem;
    line-height: 1.6;
  }
  .quill-editor-wrapper .ql-editor.ql-blank::before { color: #4b5563; font-style: normal; }
  .quill-editor-wrapper .ql-stroke { stroke: #9ca3af !important; }
  .quill-editor-wrapper .ql-fill   { fill:   #9ca3af !important; }
  .quill-editor-wrapper .ql-picker  { color:  #9ca3af !important; }
  .quill-editor-wrapper .ql-picker-options { background: #1a1a2e !important; border-color: rgba(255,255,255,0.1) !important; }
  .quill-editor-wrapper .ql-active .ql-stroke { stroke: #818cf8 !important; }
  .quill-editor-wrapper .ql-active .ql-fill   { fill:   #818cf8 !important; }
  .quill-editor-wrapper .ql-toolbar button:hover .ql-stroke { stroke: #e2e8f0 !important; }
  .quill-editor-wrapper .ql-toolbar button:hover .ql-fill   { fill:   #e2e8f0 !important; }

  [data-theme='light'] .quill-editor-wrapper .ql-toolbar,
  [data-theme='light'] .quill-editor-wrapper .ql-container { border-color: rgba(0,0,0,0.1) !important; background: #fff; }
  [data-theme='light'] .quill-editor-wrapper .ql-editor { color: #1e293b; }
  [data-theme='light'] .quill-editor-wrapper .ql-editor.ql-blank::before { color: #94a3b8; }
  [data-theme='light'] .quill-editor-wrapper .ql-stroke { stroke: #64748b !important; }
  [data-theme='light'] .quill-editor-wrapper .ql-fill   { fill:   #64748b !important; }
  [data-theme='light'] .quill-editor-wrapper .ql-picker  { color:  #64748b !important; }
  [data-theme='light'] .quill-editor-wrapper .ql-picker-options { background: #fff !important; border-color: rgba(0,0,0,0.1) !important; }
  [data-theme='light'] .quill-editor-wrapper .ql-active .ql-stroke { stroke: #4f46e5 !important; }
  [data-theme='light'] .quill-editor-wrapper .ql-active .ql-fill   { fill:   #4f46e5 !important; }
  [data-theme='light'] .quill-editor-wrapper .ql-toolbar button:hover .ql-stroke { stroke: #1e293b !important; }
  [data-theme='light'] .quill-editor-wrapper .ql-toolbar button:hover .ql-fill   { fill:   #1e293b !important; }

  .quill-editor-wrapper .ql-tooltip { background: #1a1a2e !important; border-color: rgba(255,255,255,0.1) !important; color: #e2e8f0 !important; box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important; }
  [data-theme='light'] .quill-editor-wrapper .ql-tooltip { background: #fff !important; border-color: rgba(0,0,0,0.1) !important; color: #1e293b !important; box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
  .quill-editor-wrapper .ql-tooltip input[type=text] { background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.1) !important; color: #e2e8f0 !important; }
  [data-theme='light'] .quill-editor-wrapper .ql-tooltip input[type=text] { background: #f1f5f9 !important; border-color: rgba(0,0,0,0.1) !important; color: #1e293b !important; }
`;

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Script Quill
  useEffect(() => {
    if ((window as any).Quill) { setIsLoaded(true); return; }

    const existingScript = document.querySelector('script[src*="quill@1.3.7"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true));
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js';
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Init Quill Component
  useEffect(() => {
    if (!isLoaded || !editorRef.current) return;
    const Quill = (window as any).Quill;
    if (!Quill) return;

    // Bersihkan inisialisasi sebelumnya (jika strict mode)
    const prev = editorRef.current.previousElementSibling;
    if (prev?.classList.contains('ql-toolbar')) prev.remove();
    editorRef.current.innerHTML = '';

    const editor = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder: placeholder || 'Tulis konten proyek di sini...',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ color: [] }, { background: [] }],
          ['link', 'image'],
          ['clean'],
        ],
      },
    });
    quillRef.current = editor;

    // Trigger on text-change
    editor.on('text-change', () => {
      const html = editor.root.innerHTML;
      onChange(html === '<p><br></p>' ? '' : html);
    });

    return () => {
      const toolbar = editorRef.current?.previousElementSibling;
      if (toolbar?.classList.contains('ql-toolbar')) toolbar.remove();
      quillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Sinkronisasi value saat klik edit (dari prop)
  useEffect(() => {
    if (quillRef.current && typeof value !== 'undefined') {
      const currentHtml = quillRef.current.root.innerHTML;
      const expectedHtml = value === '' ? '<p><br></p>' : value;
      
      // Cegah update jika value sama (agar cursor pengguna tidak kembali ke awal)
      if (expectedHtml !== currentHtml) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
      }
    }
  }, [value]);

  if (!isLoaded) {
    return (
      <div className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
        Memuat editor...
      </div>
    );
  }

  return (
    <div className="quill-editor-wrapper">
      <div ref={editorRef} />
    </div>
  );
};

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
}> = ({ title, subtitle, icon: Icon, children }) => (
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

// ============================================================================
// Main Component
// ============================================================================

const EMPTY_DIALOG: ConfirmDialog = {
  open: false,
  title: '',
  message: '',
  confirmLabel: '',
  confirmVariant: 'primary',
  onConfirm: () => {},
};

export default function DashboardProjects() {
  useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [dialog, setDialog] = useState<ConfirmDialog>(EMPTY_DIALOG);

  const [projectForm, setProjectForm] = useState({
    id: 0,
    title: '',
    description: '',
    stack: '',
    content: '',
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

  const ensureLoggedIn = () => {
    if (!getToken()) window.location.pathname = '/';
  };

  const closeDialog = useCallback(() => setDialog(EMPTY_DIALOG), []);

  const resetProjectForm = () => {
    setProjectForm({
      id: 0, title: '', description: '', stack: '',
      content: '', githubUrl: '', demoUrl: '', imageUrl: '', imageFile: null,
    });
  };

  // Eksekusi save (dipanggil setelah konfirmasi)
  const executeProjectSave = async () => {
    ensureLoggedIn();
    setError(null);
    try {
      const formData = new FormData();
      formData.append('title', projectForm.title);
      formData.append('description', projectForm.description);
      formData.append('techStack', projectForm.stack);
      if (projectForm.githubUrl) formData.append('githubUrl', projectForm.githubUrl);
      if (projectForm.demoUrl) formData.append('demoUrl', projectForm.demoUrl);
      formData.append('content', projectForm.content ?? '');
      if (projectForm.imageFile) formData.append('image', projectForm.imageFile);

      const { Authorization } = authHeaders() as { Authorization: string };

      if (projectForm.id) {
        const res = await fetch(`${apiBase}/project/${projectForm.id}`, {
          method: 'PUT',
          headers: { Authorization },
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message ?? `Gagal update data (${res.status})`);
        }
      } else {
        const res = await fetch(`${apiBase}/project`, {
          method: 'POST',
          headers: { Authorization },
          body: formData,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message ?? `Gagal membuat data (${res.status})`);
        }
      }

      resetProjectForm();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleProjectSave = () => {
    if (!projectForm.title.trim()) {
      setError('Judul project wajib diisi.');
      return;
    }
    setError(null);
    setDialog({
      open: true,
      title: projectForm.id ? 'Simpan Perubahan?' : 'Tambah Project Baru?',
      message: projectForm.id
        ? `Perubahan pada "${projectForm.title}" akan disimpan ke database.`
        : `Project "${projectForm.title}" akan ditambahkan ke portfolio.`,
      confirmLabel: projectForm.id ? 'Simpan Perubahan' : 'Tambah Project',
      confirmVariant: 'primary',
      onConfirm: executeProjectSave,
    });
  };

  const handleProjectDelete = (id: number, title: string) => {
    setDialog({
      open: true,
      title: 'Hapus Project?',
      message: `"${title}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`,
      confirmLabel: 'Ya, Hapus',
      confirmVariant: 'danger',
      onConfirm: async () => {
        ensureLoggedIn();
        setError(null);
        try {
          await apiDelete(`/project/${id}`);
          if (projectForm.id === id) resetProjectForm();
          await refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Gagal menghapus project');
        }
      },
    });
  };

  return (
    <DashboardLayout title="Projects" subtitle="Manajemen data portfolio + view count">
      <style>{quillStyles}</style>

      {/* Modal Render di body portal */}
      <ConfirmModal dialog={dialog} onClose={closeDialog} />

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200 shadow-lg">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <p className="flex-1 text-sm font-medium">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 rounded-lg p-1 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
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
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 shadow-inner">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Title"
                placeholder="Nama project..."
                value={projectForm.title}
                onChange={(e) => setProjectForm((v) => ({ ...v, title: e.target.value }))}
              />
              <Input
                label="Stack"
                placeholder="React, Node.js..."
                value={projectForm.stack}
                onChange={(e) => setProjectForm((v) => ({ ...v, stack: e.target.value }))}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Description"
                  placeholder="Deskripsi singkat..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm((v) => ({ ...v, description: e.target.value }))}
                />
              </div>
              <Input
                label="GitHub URL"
                placeholder="https://github.com/..."
                value={projectForm.githubUrl}
                onChange={(e) => setProjectForm((v) => ({ ...v, githubUrl: e.target.value }))}
              />
              <Input
                label="Demo URL"
                placeholder="https://..."
                value={projectForm.demoUrl}
                onChange={(e) => setProjectForm((v) => ({ ...v, demoUrl: e.target.value }))}
              />

              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Content (Rich Text Editor)
                </label>
                <QuillEditor
                  value={projectForm.content}
                  onChange={(html) => setProjectForm((v) => ({ ...v, content: html }))}
                  placeholder="Tulis konten detail proyek di sini..."
                />
                <p className="text-xs text-gray-500">
                  Mendukung formatting teks, list, link, dan gambar.
                </p>
              </div>

              <div className="sm:col-span-2 space-y-2">
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
                  {projectForm.imageUrl
                    ? <span>Current: <span className="text-gray-300">{projectForm.imageUrl}</span></span>
                    : <span>Tidak ada gambar saat ini</span>
                  }
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-5">
              <button
                type="button"
                onClick={handleProjectSave}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98]"
              >
                {projectForm.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {projectForm.id ? 'Simpan Perubahan' : 'Tambah Project'}
              </button>
              {projectForm.id !== 0 && (
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:bg-white/10 hover:text-white active:scale-[0.98]"
                >
                  <X className="h-4 w-4" /> Batal
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-mono text-gray-400 border border-white/10">
                      #{p.id}
                    </span>
                    {p.stack && (
                      <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-300 border border-indigo-500/20">
                        {p.stack}
                      </span>
                    )}
                    <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-gray-300 border border-white/10">
                      👁 {p.view_count ?? 0}
                    </span>
                    {p.content && (
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300 border border-emerald-500/20">
                        📝 Content
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-100">{p.title}</h3>
                  <p className="line-clamp-2 text-sm text-gray-400">{p.description}</p>
                </div>

                <div className="flex items-center gap-2 sm:opacity-50 transition-opacity duration-300 group-hover:opacity-100 border-t border-white/5 sm:border-t-0 pt-3 sm:pt-0">
                  <button
                    type="button"
                    title="Edit project"
                    onClick={() => {
                      setProjectForm({
                        id: p.id,
                        title: p.title,
                        description: p.description,
                        stack: p.stack,
                        githubUrl: p.githubUrl ?? '',
                        demoUrl: p.demoUrl ?? '',
                        imageUrl: p.imageUrl ?? '',
                        content: p.content ?? '',
                        imageFile: null,
                      });
                    }}
                    className="p-2 rounded-xl border border-white/10 bg-black/20 text-gray-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300 hover:border-indigo-500/30"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    title="Hapus project"
                    onClick={() => handleProjectDelete(p.id, p.title)}
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