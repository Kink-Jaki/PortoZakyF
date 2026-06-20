import React, { type ReactNode, useEffect, useState } from 'react';
import { Award, MapPin, Server, Database, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

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

// --- Multi-Language Dictionary ---
type Lang = 'id' | 'en';

const translations = {
  id: {
    badge: 'Tentang Saya',
    headline: 'Arsitektur sistem yang andal untuk performa maksimal.',
    description: (
      <>
        Saya adalah seorang Backend Developer yang berdedikasi membangun fondasi digital yang kuat. Fokus utama saya terletak pada perancangan <strong>REST API</strong> yang efisien, manajemen <strong>Database Relasional (PostgreSQL)</strong>, serta implementasi sistem <strong>Autentikasi & Otorisasi</strong> yang aman. Saya memastikan setiap baris kode backend tidak hanya berfungsi, tetapi juga <em>scalable</em> dan mudah dipelihara.
      </>
    ),
    expLabel: 'Pengalaman',
    expValue: '3+ Tahun',
    locLabel: 'Lokasi',
    locValue: 'Indonesia',
    snapshotTitle: 'Profile Snapshot',
    snapshotRole: 'Backend Developer',
    snapshotDesc: 'Fokus pada keandalan server, struktur data, dan arsitektur deployment modern.',
    apiDev: 'API Development',
    dbDesign: 'Database Design',
    deployment: 'Deployment',
    strong: 'Kuat',
    solid: 'Solid',
    ctaBtn: 'Jelajahi Arsitektur API Saya',
  },
  en: {
    badge: 'About Me',
    headline: 'Reliable system architecture for maximum performance.',
    description: (
      <>
        I am a dedicated Backend Developer focused on building strong digital foundations. My primary focus lies in designing efficient <strong>REST APIs</strong>, managing <strong>Relational Databases (PostgreSQL)</strong>, and implementing secure <strong>Authentication & Authorization</strong> systems. I ensure every line of backend code is not only functional but also <em>scalable</em> and easy to maintain.
      </>
    ),
    expLabel: 'Experience',
    expValue: '3+ Years',
    locLabel: 'Location',
    locValue: 'Indonesia',
    snapshotTitle: 'Profile Snapshot',
    snapshotRole: 'Backend Developer',
    snapshotDesc: 'Focused on server reliability, data structures, and modern deployment architecture.',
    apiDev: 'API Development',
    dbDesign: 'Database Design',
    deployment: 'Deployment',
    strong: 'Strong',
    solid: 'Solid',
    ctaBtn: 'Explore My API Architecture',
  },
};

const About: React.FC = () => {
  // State Bahasa
  const [lang, setLang] = useState<Lang>('id');

  // Listener untuk mendeteksi perubahan bahasa
  useEffect(() => {
    const loadLang = () => {
      const savedLang = (localStorage.getItem('lang') as Lang) || 'id';
      setLang(savedLang);
    };

    loadLang(); // Mount awal

    window.addEventListener('languageChange', loadLang);
    window.addEventListener('storage', (e) => {
      if (e.key === 'lang') loadLang();
    });

    return () => {
      window.removeEventListener('languageChange', loadLang);
      window.removeEventListener('storage', loadLang);
    };
  }, []);

  const t = translations[lang];

  return (
    <section id="about" className="py-20 md:py-24 bg-[var(--bg-primary)] transition-colors duration-300" aria-label="About">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          
          {/* Left Column - Biography */}
          <div className="max-w-2xl">
            <Reveal delayMs={120}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-2 shadow-sm transition-colors duration-300">
                <span className="h-2 w-2 rounded-full bg-[#6366F1] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">{t.badge}</span>
              </div>
            </Reveal>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl transition-colors duration-300">
              {t.headline}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] transition-colors duration-300">
              {t.description}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-md transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[#6366F1]" strokeWidth={2} />
                  <div>
                    <div className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300">{t.expLabel}</div>
                    <div className="text-xl font-semibold text-[var(--text-primary)] transition-colors duration-300">{t.expValue}</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-md transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#8B5CF6]" strokeWidth={2} />
                  <div>
                    <div className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300">{t.locLabel}</div>
                    <div className="text-xl font-semibold text-[var(--text-primary)] transition-colors duration-300">{t.locValue}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Snapshot Card */}
          <div className="w-full md:max-w-md">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-lg transition-all duration-300">
              <div className="text-xs font-medium text-[var(--text-secondary)] opacity-80 uppercase tracking-wider">{t.snapshotTitle}</div>
              <div className="mt-2 text-xl font-semibold text-[var(--text-primary)] transition-colors duration-300">{t.snapshotRole}</div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] transition-colors duration-300">
                {t.snapshotDesc}
              </p>

              {/* Rows List */}
              <div className="mt-6 grid gap-3">
                <div className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-3 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <Server className="h-4 w-4 text-[#6366F1]" />
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)] transition-colors duration-300">{t.apiDev}</div>
                      <div className="text-xs text-[var(--text-secondary)] transition-colors duration-300">Hono.js, Node, REST</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[#6366F1]">{t.strong}</div>
                </div>
                
                <div className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-3 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-[#8B5CF6]" />
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)] transition-colors duration-300">{t.dbDesign}</div>
                      <div className="text-xs text-[var(--text-secondary)] transition-colors duration-300">PostgreSQL, Prisma ORM</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[#8B5CF6]">{t.strong}</div>
                </div>
                
                <div className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-3 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <Cloud className="h-4 w-4 text-[#06B6D4]" />
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)] transition-colors duration-300">{t.deployment}</div>
                      <div className="text-xs text-[var(--text-secondary)] transition-colors duration-300">Docker, VPS, CI/CD</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[#06B6D4]">{t.solid}</div>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="mt-6">
                <a
                  href="#projects"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-6 py-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                >
                  {t.ctaBtn}
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default About;