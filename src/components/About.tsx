import React from 'react';
import { Award, MapPin, Server, Database, Cloud } from 'lucide-react';
import { Reveal } from './motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-24" aria-label="About">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          
          {/* Left Column - Biography */}
          <div className="max-w-2xl">
            {}
            <Reveal delayMs={120}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#6366F1] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                <span className="text-sm font-medium text-[#A0A0B0]">Tentang Saya</span>
              </div>
            </Reveal>
            
            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#F8F8FC] md:text-4xl">
              Arsitektur sistem yang andal untuk performa maksimal.
            </h2>
            
            {}
            <p className="mt-4 text-base leading-relaxed text-[#A0A0B0]">
              Saya adalah seorang Backend Developer yang berdedikasi membangun fondasi digital yang kuat. Fokus utama saya terletak pada perancangan <strong>REST API</strong> yang efisien, manajemen <strong>Database Relasional (PostgreSQL)</strong>, serta implementasi sistem <strong>Autentikasi & Otorisasi</strong> yang aman. Saya memastikan setiap baris kode backend tidak hanya berfungsi, tetapi juga <em>scalable</em> dan mudah dipelihara.
            </p>

            {}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#12121A]/70 p-5 shadow-md">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[#6366F1]" strokeWidth={2} />
                  <div>
                    <div className="text-sm font-medium text-[#A0A0B0]">Pengalaman</div>
                    <div className="text-xl font-semibold text-[#F8F8FC]">3+ Tahun</div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#12121A]/70 p-5 shadow-md">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#8B5CF6]" strokeWidth={2} />
                  <div>
                    <div className="text-sm font-medium text-[#A0A0B0]">Lokasi</div>
                    <div className="text-xl font-semibold text-[#F8F8FC]">Indonesia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Snapshot Card */}
          <div className="w-full md:max-w-md">
            {}
            <div className="rounded-2xl border border-white/10 bg-[#12121A]/70 p-6 shadow-lg">
              <div className="text-xs font-medium text-[#6B6B7B]">Profile Snapshot</div>
              <div className="mt-2 text-xl font-semibold text-[#F8F8FC]">Backend Developer</div>
              <p className="mt-2 text-sm leading-relaxed text-[#A0A0B0]">
                Fokus pada keandalan server, struktur data, dan arsitektur deployment modern.
              </p>

              {}
              <div className="mt-6 grid gap-3">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Server className="h-4 w-4 text-[#6366F1]" />
                    <div>
                      <div className="text-sm font-medium text-[#F8F8FC]">API Development</div>
                      <div className="text-xs text-[#6B6B7B]">Hono.js, Node, REST</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[#6366F1]">Kuat</div>
                </div>
                
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-[#8B5CF6]" />
                    <div>
                      <div className="text-sm font-medium text-[#F8F8FC]">Database Design</div>
                      <div className="text-xs text-[#6B6B7B]">PostgreSQL, Prisma ORM</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[#8B5CF6]">Kuat</div>
                </div>
                
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Cloud className="h-4 w-4 text-[#06B6D4]" />
                    <div>
                      <div className="text-sm font-medium text-[#F8F8FC]">Deployment</div>
                      <div className="text-xs text-[#6B6B7B]">Docker, VPS, CI/CD</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-[#06B6D4]">Solid</div>
                </div>
              </div>

              {}
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