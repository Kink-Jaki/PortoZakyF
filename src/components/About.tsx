import React, { type ReactNode } from 'react';
import { Award, MapPin, Server, Database, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';

// --- Komponen Reveal Lokal ---
// Diimplementasikan secara langsung untuk menghindari masalah impor eksternal './motion'
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

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-24 bg-[var(--bg-primary)] transition-colors duration-300" aria-label="About">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          
          {/* Left Column - Biography */}
          <div className="max-w-2xl">
            <Reveal delayMs={120}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-2 shadow-sm transition-colors duration-300">
                <span className="h-2 w-2 rounded-full bg-[#6366F1] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span className="text-sm font-medium text-[var(--text-secondary)]">Tentang Saya</span>
              </div>
            </Reveal>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl transition-colors duration-300">
              Arsitektur sistem yang andal untuk performa maksimal.
            </h2>

            <p className="mt-4 text-base leading-relaxed text-[var(--text-secondary)] transition-colors duration-300">
              Saya adalah seorang Backend Developer yang berdedikasi membangun fondasi digital yang kuat. Fokus utama saya terletak pada perancangan <strong>REST API</strong> yang efisien, manajemen <strong>Database Relasional (PostgreSQL)</strong>, serta implementasi sistem <strong>Autentikasi & Otorisasi</strong> yang aman. Saya memastikan setiap baris kode backend tidak hanya berfungsi, tetapi juga <em>scalable</em> dan mudah dipelihara.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-md transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[#6366F1]" strokeWidth={2} />
                  <div>
                    <div className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300">Pengalaman</div>
                    <div className="text-xl font-semibold text-[var(--text-primary)] transition-colors duration-300">3+ Tahun</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-md transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#8B5CF6]" strokeWidth={2} />
                  <div>
                    <div className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300">Lokasi</div>
                    <div className="text-xl font-semibold text-[var(--text-primary)] transition-colors duration-300">Indonesia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Snapshot Card (Kini Adaptif Sempurna terhadap Light Theme) */}
          <div className="w-full md:max-w-md">
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-lg transition-all duration-300">
              <div className="text-xs font-medium text-[var(--text-secondary)] opacity-80 uppercase tracking-wider">Profile Snapshot</div>
              <div className="mt-2 text-xl font-semibold text-[var(--text-primary)] transition-colors duration-300">Backend Developer</div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] transition-colors duration-300">
                Fokus pada keandalan server, struktur data, dan arsitektur deployment modern.
              </p>

              {/* Rows List */}
              <div className="mt-6 grid gap-3">
                <div className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-3 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <Server className="h-4 w-4 text-[#6366F1]" />
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)] transition-colors duration-300">API Development</div>
                      <div className="text-xs text-[var(--text-secondary)] transition-colors duration-300">Hono.js, Node, REST</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[#6366F1]">Kuat</div>
                </div>
                
                <div className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-3 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-[#8B5CF6]" />
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)] transition-colors duration-300">Database Design</div>
                      <div className="text-xs text-[var(--text-secondary)] transition-colors duration-300">PostgreSQL, Prisma ORM</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[#8B5CF6]">Kuat</div>
                </div>
                
                <div className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--system-badge-bg)] px-4 py-3 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <Cloud className="h-4 w-4 text-[#06B6D4]" />
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)] transition-colors duration-300">Deployment</div>
                      <div className="text-xs text-[var(--text-secondary)] transition-colors duration-300">Docker, VPS, CI/CD</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[#06B6D4]">Solid</div>
                </div>
              </div>

              {/* Call to Action Button */}
              <div className="mt-6">
                <a
                  href="#projects"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-6 py-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                >
                  Jelajahi Arsitektur API Saya
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