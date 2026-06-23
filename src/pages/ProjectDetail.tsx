import { useEffect, useMemo, useState } from 'react';
import { 
  GitBranch, ArrowLeft, Image as ImageIcon, 
  FileText, Globe, Clock, User, Monitor, Zap, Code, Layout,
  Cpu, Database, Activity, Terminal, Shield, Star, CheckCircle, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
interface ProjectApiRow {
  id: number;
  title: string;
  description: string;
  content: string;
  stack: string;
  githubUrl: string | null;
  demoUrl: string | null;
  imageUrl: string | null;
  createdAt?: string | null;
}

// --- Global CSS Variables & Transitions ---
const globalStyles = `
  :root {
    --bg-primary: #030305;
    --bg-grid: rgba(6, 182, 212, 0.04);
    --text-primary: #F8F8FC;
    --text-secondary: #8A8A9B;
    --text-muted: #525266;
    --border-color: rgba(6, 182, 212, 0.15);
    --border-highlight: rgba(6, 182, 212, 0.4);
    --card-bg: rgba(10, 10, 15, 0.4);
    --card-bg-hover: rgba(15, 15, 25, 0.6);
    --card-backdrop: blur(16px);
    --system-badge-bg: rgba(6, 182, 212, 0.08);
    --accent: #06B6D4;
    --accent-glow: rgba(6, 182, 212, 0.5);
    --accent-hover: #0891b2;
    --gradient-overlay: linear-gradient(to top, #030305 0%, transparent 100%);
    --cyber-gradient: linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.1) 100%);
    --card-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    --card-shadow-hover: 0 10px 40px rgba(6, 182, 212, 0.15);
    --terminal-bg: #050505;
  }

  [data-theme='light'] {
    --bg-primary: #F9FAFB;
    --bg-grid: rgba(79, 70, 229, 0.015);
    --text-primary: #111827;
    --text-secondary: #4B5563;
    --text-muted: #9CA3AF;
    --border-color: rgba(229, 231, 235, 0.8);
    --border-highlight: rgba(99, 102, 241, 0.25);
    --card-bg: rgba(255, 255, 255, 0.8);
    --card-bg-hover: rgba(255, 255, 255, 1);
    --card-backdrop: blur(24px);
    --system-badge-bg: #F3F4F6;
    --accent: #4F46E5;
    --accent-glow: rgba(79, 70, 229, 0.15);
    --accent-hover: #4338CA;
    --gradient-overlay: linear-gradient(to top, #F9FAFB 0%, rgba(249, 250, 251, 0) 100%);
    --cyber-gradient: linear-gradient(135deg, rgba(79, 70, 229, 0.02) 0%, rgba(59, 130, 246, 0.02) 100%);
    --card-shadow: 0 4px 20px -2px rgba(17, 24, 39, 0.05), 0 2px 6px -1px rgba(17, 24, 39, 0.02);
    --card-shadow-hover: 0 20px 25px -5px rgba(17, 24, 39, 0.08), 0 10px 10px -5px rgba(17, 24, 39, 0.03);
    --terminal-bg: #0F172A;
  }

  body, section, div, span, p, h1, h2, h3, a, button {
    transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  }

  .bg-grid-pattern {
    background-image: linear-gradient(var(--bg-grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--bg-grid) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
  }

  .shadow-premium {
    box-shadow: var(--card-shadow);
  }
  .shadow-premium:hover {
    box-shadow: var(--card-shadow-hover);
  }

  .tech-border {
    position: relative;
  }
  .tech-border::before, .tech-border::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid transparent;
    transition: all 0.3s ease;
  }
  .tech-border::before {
    top: -2px;
    left: -2px;
    border-top-color: var(--accent);
    border-left-color: var(--accent);
  }
  .tech-border::after {
    bottom: -2px;
    right: -2px;
    border-bottom-color: var(--accent);
    border-right-color: var(--accent);
  }
  .tech-border:hover::before, .tech-border:hover::after {
    width: 100%;
    height: 100%;
    opacity: 0.2;
  }

  /* Custom Scrollbar for Pre tags */
  pre::-webkit-scrollbar {
    height: 6px;
  }
  pre::-webkit-scrollbar-track {
    background: var(--system-badge-bg);
    border-radius: 4px;
  }
  pre::-webkit-scrollbar-thumb {
    background: var(--accent);
    border-radius: 4px;
  }
`;

const getApiUrl = (): string => {
  try {
    // @ts-ignore
    const meta = import.meta;
    if (meta && meta.env && meta.env.VITE_API_URL) return meta.env.VITE_API_URL;
  } catch (e) {}
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) return process.env.VITE_API_URL;
  } catch (e) {}
  return 'https://zakyportoapi-production.up.railway.app';
};

const apiBase = getApiUrl();

function normalizeImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
  if (imageUrl.startsWith('/')) return `${apiBase}${imageUrl}`;
  return `${apiBase}/${imageUrl}`;
}

const stackToTags = (stack: string): string[] => stack.split(',').map((s: string) => s.trim()).filter(Boolean).slice(0, 12);

// Animasi framer-motion (menggunakan tipe any untuk menghindari error kompatibilitas tipe transisi internal framer-motion)
const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

const tabVariants: any = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.3 } }
};

export default function ProjectDetail() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectApiRow | null>(null);
  const [, setTheme] = useState<string>('dark');
  const [activeTab, setActiveTab] = useState<string>('overview');

  const id = useMemo(() => {
    const path = window.location.pathname || '';
    const parts = path.split('/').map((p) => p.trim()).filter(Boolean);
    const idx = parts.findIndex((p) => p === 'project');
    if (idx === -1) return null;
    const n = Number(parts[idx + 1]);
    return Number.isFinite(n) ? n : null;
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = localStorage.getItem('theme') || 'dark';
      setTheme(currentTheme);
      document.documentElement.setAttribute('data-theme', currentTheme);
    };
    updateTheme();
    window.addEventListener('storage', updateTheme);
    window.addEventListener('themeChange', updateTheme);
    return () => {
      window.removeEventListener('storage', updateTheme);
      window.removeEventListener('themeChange', updateTheme);
    };
  }, []);

  useEffect(() => {
    if (!id) {
      setError('Sistem tidak dapat mengidentifikasi ID proyek.');
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${apiBase}/project/${id}`);
        if (!res.ok) throw new Error(`Kegagalan koneksi data (Status: ${res.status})`);
        const data = await res.json() as ProjectApiRow;
        setProject(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Terjadi anomali saat memuat modul proyek.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const imageUrl = normalizeImageUrl(project?.imageUrl ?? null);
  const tags = project && typeof project.stack === 'string' ? stackToTags(project.stack) : [];

  const renderContent = () => {
    if (!project?.content) return null;
    if (project.content.includes('<') && project.content.includes('>')) {
      return (
        <div 
          className="prose prose-lg max-w-none 
            [&_p]:mb-6 [&_p]:leading-relaxed [&_p]:text-[var(--text-secondary)]
            [&_strong]:text-[var(--text-primary)] [&_strong]:font-semibold [&_strong]:text-[var(--accent)]
            [&_a]:text-[var(--accent)] hover:[&_a]:drop-shadow-[0_0_8px_var(--accent-glow)] [&_a]:transition-all
            [&_ul]:text-[var(--text-secondary)] [&_ol]:text-[var(--text-secondary)] [&_li]:mb-3
            [&_h1]:text-[var(--text-primary)] [&_h2]:text-[var(--text-primary)] [&_h3]:text-[var(--text-primary)]
            [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold
            [&_h1]:mt-12 [&_h2]:mt-10 [&_h3]:mt-8 [&_h1]:mb-6 [&_h2]:mb-4
            [&_code]:bg-[var(--system-badge-bg)] [&_code]:border [&_code]:border-[var(--border-color)] [&_code]:px-2 [&_code]:py-1 [&_code]:rounded-md [&_code]:text-sm [&_code]:text-[var(--accent)] [&_code]:font-mono
            [&_pre]:bg-[#09090b] [&_pre]:border [&_pre]:border-[var(--border-color)] [&_pre]:p-6 [&_pre]:rounded-2xl [&_pre]:overflow-x-auto [&_pre]:shadow-inner"
          dangerouslySetInnerHTML={{ __html: project.content }}
        />
      );
    }
    const lines = project.content.split('\n').filter((line: string) => line.trim() !== '');
    return (
      <div className="space-y-5">
        {lines.map((line: string, idx: number) => (
          <p key={idx} className="leading-relaxed text-[var(--text-secondary)] text-lg">
            {line}
          </p>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{globalStyles}</style>
      
      <section className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-x-hidden selection:bg-[var(--accent)] selection:text-white pb-24">
        
        {/* Futuristic Background Gradients & Grid */}
        <div className="fixed inset-0 bg-grid-pattern z-0 opacity-60" />
        <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[var(--accent)]/5 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8 pt-20">
          
          {/* Top Navigation Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-between mb-12"
          >
            <button
              type="button"
              onClick={() => window.history.back()}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--card-bg)] shadow-premium border border-[var(--border-color)] text-sm font-medium text-[var(--text-secondary)] transition-all hover:text-[var(--accent)] hover:border-[var(--accent)] hover:shadow-[0_0_20px_var(--accent-glow)] backdrop-blur-md"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Kembali ke Beranda</span>
            </button>
            <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-premium backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
              </span>
              <span className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-widest">Sistem Online</span>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Loading State */}
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                <div className="h-[55vh] w-full rounded-3xl bg-[var(--card-bg)] animate-pulse border border-[var(--border-color)] overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent)]/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-[var(--card-bg)] animate-pulse border border-[var(--border-color)]" />)}
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-red-500/30 bg-red-500/5 backdrop-blur-xl p-12 text-center max-w-xl mx-auto mt-20 shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                <Terminal className="h-16 w-16 text-red-500 mx-auto mb-6 opacity-80" />
                <h3 className="text-2xl font-bold text-red-400 mb-3 tracking-wide">FATAL ERROR</h3>
                <p className="text-[var(--text-secondary)] mb-8 font-mono text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="group relative inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-8 py-3 text-sm font-bold text-red-400 transition-all border border-red-500/30 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <Activity className="w-4 h-4 group-hover:animate-spin" />
                  REBOOT SEQUENCE
                </button>
              </motion.div>
            )}

            {/* Main Content */}
            {!loading && !error && project && (
              <motion.article key="content" variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
                
                {/* Hero / Cover Section */}
                <motion.div variants={itemVariants} className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-premium group">
                  <div className="absolute inset-0 bg-[var(--cyber-gradient)] z-10 opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
                  
                  <div className="relative flex flex-col justify-end min-h-[50vh] md:min-h-[65vh] bg-black/40 overflow-hidden">
                    {imageUrl ? (
                      <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                        src={imageUrl}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity group-hover:mix-blend-normal group-hover:scale-105 transition-all duration-1000"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-primary)]">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                           <div className="absolute inset-0 rounded-full border-t-2 border-[var(--accent)] animate-spin opacity-50" />
                           <ImageIcon className="h-12 w-12 text-[var(--border-highlight)]" />
                        </div>
                        <span className="mt-4 font-mono text-xs text-[var(--text-muted)] tracking-[0.3em]">VISUAL DATA OFFLINE</span>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 z-10" style={{ background: 'var(--gradient-overlay)' }} />
                    
                    {/* Hero Content */}
                    <div className="relative z-20 w-full p-8 md:p-14 lg:p-20">
                      <div className="max-w-4xl space-y-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="backdrop-blur-md bg-[var(--accent)]/10 border border-[var(--accent)]/30 px-3 py-1.5 text-xs font-mono text-[var(--accent)] rounded-lg uppercase tracking-wider shadow-[0_0_10px_var(--accent-glow)]">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                          {project.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300/90 max-w-2xl font-light leading-relaxed drop-shadow-md">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Project Meta Info Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { icon: User, label: "Akses Peran", value: "Sistem Admin", glow: "hover:shadow-blue-500/10" },
                    { icon: Clock, label: "Waktu Komputasi", value: "1.2 Bulan", glow: "hover:shadow-purple-500/10" },
                    { icon: Monitor, label: "Platform Target", value: "Web Node", glow: "hover:shadow-cyan-500/10" },
                    { icon: Code, label: "Tipe Arsitektur", value: "Monolith v2", glow: "hover:shadow-green-500/10" }
                  ].map((meta, i) => (
                    <div key={i} className={`tech-border flex flex-col gap-3 p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-[var(--card-backdrop)] transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--card-bg-hover)] shadow-premium ${meta.glow}`}>
                      <div className="flex items-center gap-3 text-[var(--accent)] mb-1">
                        <div className="p-2 rounded-lg bg-[var(--accent)]/10">
                          <meta.icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] md:text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest mb-1">{meta.label}</div>
                        <div className="text-base md:text-lg font-bold text-[var(--text-primary)]">{meta.value}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Main Content Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
                  
                  {/* Left Column: Deep Content (Span 8) */}
                  <motion.div variants={itemVariants} className="lg:col-span-8 space-y-8">
                    
                    {/* Custom Tabs */}
                    <div className="flex gap-2 p-1.5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-premium backdrop-blur-md w-max max-w-full overflow-x-auto">
                      {[
                        { id: 'overview', icon: Layout, label: 'Ikhtisar' },
                        { id: 'tech', icon: Cpu, label: 'Teknis' },
                        { id: 'metrics', icon: Activity, label: 'Metrik' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab.id 
                              ? 'bg-[var(--accent)] text-white shadow-[0_4px_12px_var(--accent-glow)]' 
                              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--system-badge-bg)]'
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content Container */}
                    <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-[var(--card-backdrop)] shadow-premium p-6 md:p-10 min-h-[400px]">
                      <AnimatePresence mode="wait">
                        
                        {/* Tab: Overview */}
                        {activeTab === 'overview' && (
                          <motion.div key="overview" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                            <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-6">
                              <div className="p-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20">
                                <FileText className="w-6 h-6 text-[var(--accent)]" />
                              </div>
                              <h2 className="text-2xl md:text-3xl font-black">Dokumentasi Inti</h2>
                            </div>
                            <div className="text-[var(--text-primary)]">
                              {project.content ? renderContent() : (
                                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[var(--border-color)] rounded-2xl">
                                  <Terminal className="h-12 w-12 text-[var(--text-muted)] mb-4" />
                                  <p className="font-mono text-sm text-[var(--text-muted)] uppercase tracking-widest">Awaiting Data Core...</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Tab: Technical (Placeholder) */}
                        {activeTab === 'tech' && (
                          <motion.div key="tech" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                             <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-6">
                              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <Layers className="w-6 h-6 text-purple-400" />
                              </div>
                              <h2 className="text-2xl md:text-3xl font-black">Topologi Arsitektur</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="p-6 rounded-2xl bg-black/5 dark:bg-black/20 border border-[var(--border-color)]">
                                <Database className="w-8 h-8 text-[var(--accent)] mb-4" />
                                <h3 className="text-lg font-bold mb-2">Penyimpanan Relasional</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Sistem menggunakan cluster database terdistribusi untuk menjamin integritas data (ACID compliance) dengan latensi sub-milidetik pada operasi baca.</p>
                              </div>
                              <div className="p-6 rounded-2xl bg-black/5 dark:bg-black/20 border border-[var(--border-color)]">
                                <Shield className="w-8 h-8 text-green-500 dark:text-green-400 mb-4" />
                                <h3 className="text-lg font-bold mb-2">Protokol Keamanan</h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">Diperkuat dengan enkripsi AES-256 pada level transport dan penyimpanan, serta lapisan WAF untuk memitigasi anomali trafik.</p>
                              </div>
                            </div>

                            {/* Fake Terminal */}
                            <div className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--terminal-bg)]">
                              <div className="flex items-center gap-2 px-4 py-2.5 bg-black/20 border-b border-white/5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-2 text-xs font-mono text-gray-400">system_init.sh</span>
                              </div>
                              <div className="p-5 font-mono text-xs md:text-sm text-green-400 space-y-2 opacity-90">
                                <p className="text-gray-400">// Mengaktifkan sekuens sistem...</p>
                                <p>&gt; Loading dependencies: [OK]</p>
                                <p>&gt; Connecting to remote cluster... [ESTABLISHED]</p>
                                <p className="text-cyan-400">&gt; System ready for execution.</p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Tab: Metrics (Placeholder) */}
                        {activeTab === 'metrics' && (
                          <motion.div key="metrics" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
                             <div className="flex items-center gap-4 border-b border-[var(--border-color)] pb-6">
                              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                <Activity className="w-6 h-6 text-green-500 dark:text-green-400" />
                              </div>
                              <h2 className="text-2xl md:text-3xl font-black">Performa Sistem</h2>
                            </div>
                            
                            <div className="space-y-6">
                              {[
                                { label: "Uptime Sistem", value: 99.9, color: "bg-green-500 dark:bg-green-400" },
                                { label: "Lighthouse Score", value: 96, color: "bg-[var(--accent)]" },
                                { label: "Efisiensi Kueri", value: 85, color: "bg-purple-500 dark:bg-purple-400" }
                              ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                  <div className="flex justify-between font-mono text-sm">
                                    <span className="text-[var(--text-secondary)] uppercase font-semibold">{stat.label}</span>
                                    <span className="font-bold text-[var(--text-primary)]">{stat.value}%</span>
                                  </div>
                                  <div className="h-2 w-full bg-black/5 dark:bg-[var(--system-badge-bg)] rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${stat.value}%` }}
                                      transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                                      className={`h-full rounded-full ${stat.color} shadow-[0_0_10px_currentColor] opacity-80`}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                               <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-green-600 dark:text-green-400">
                                 <CheckCircle className="w-5 h-5" />
                                 <span className="text-sm font-semibold">Lolos Audit Keamanan</span>
                               </div>
                               <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-600 dark:text-blue-400">
                                 <Star className="w-5 h-5" />
                                 <span className="text-sm font-semibold">Skalabilitas Tinggi</span>
                               </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Right Column: Sidebar (Span 4) */}
                  <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                    
                    {/* Action Panel */}
                    <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-[var(--card-backdrop)] shadow-premium p-6 md:p-8 flex flex-col gap-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-[50px] pointer-events-none" />
                      
                      <h3 className="text-sm uppercase tracking-widest font-bold text-[var(--text-secondary)] flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[var(--accent)]" /> Tautan Eksekusi
                      </h3>
                      
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noreferrer"
                          className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--text-primary)] text-[var(--bg-primary)] px-5 py-4 text-sm font-black transition-all hover:scale-[1.02] active:scale-95 overflow-hidden"
                        >
                          <div className="absolute inset-0 w-0 bg-gradient-to-r from-[var(--accent)] to-blue-500 transition-all duration-300 ease-out group-hover:w-full" />
                          <Globe className="h-5 w-5 relative z-10 text-[var(--bg-primary)] group-hover:text-white transition-colors" />
                          <span className="relative z-10 group-hover:text-white transition-colors">Akses Situs Live</span>
                        </a>
                      )}

                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer"
                          className="tech-border group w-full flex items-center justify-center gap-3 rounded-xl border border-[var(--border-color)] bg-transparent px-5 py-4 text-sm font-bold text-[var(--text-primary)] transition-all hover:bg-[var(--accent)]/5 hover:border-[var(--accent)]"
                        >
                          <GitBranch className="h-5 w-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                          <span className="group-hover:text-[var(--accent)] transition-colors">Tinjau Kode Sumber</span>
                        </a>
                      )}

                      {!project.githubUrl && !project.demoUrl && (
                        <div className="w-full flex flex-col items-center justify-center rounded-xl border border-[var(--border-color)] border-dashed px-5 py-6 bg-black/5 dark:bg-black/10">
                          <Shield className="w-8 h-8 text-[var(--text-muted)] mb-2" />
                          <span className="text-sm font-mono text-[var(--text-secondary)] text-center uppercase">Akses Terenkripsi / Privat</span>
                        </div>
                      )}
                    </div>

                    {/* Stack Panel */}
                    <div className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-[var(--card-backdrop)] shadow-premium p-6 md:p-8">
                      <h3 className="text-sm uppercase tracking-widest font-bold text-[var(--text-secondary)] mb-6 flex items-center gap-2">
                        <Code className="w-4 h-4 text-[var(--accent)]" /> Tumpukan Teknologi
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {tags.map((tag: string) => (
                          <span key={tag} className="group relative overflow-hidden rounded-lg bg-[var(--system-badge-bg)] border border-[var(--border-color)] px-4 py-2 text-sm font-mono text-[var(--text-primary)] transition-all hover:border-[var(--accent)] hover:shadow-[0_4px_12px_var(--accent-glow)] cursor-default">
                            <span className="relative z-10">{tag}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent)]/0 via-[var(--accent)]/10 to-[var(--accent)]/0 -translate-x-full group-hover:animate-[shimmer_1s_forwards]" />
                          </span>
                        ))}
                        {tags.length === 0 && (
                          <p className="text-sm font-mono text-[var(--text-muted)]">Data tumpukan tidak ditemukan.</p>
                        )}
                      </div>
                    </div>

                  </motion.div>

                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </div>
        
        {/* Shimmer Animation Keyframes */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shimmer {
            100% { transform: translateX(100%); }
          }
        `}} />
      </section>
    </>
  );
}