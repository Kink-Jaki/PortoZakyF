import React from 'react';
import { Server, ArrowRight, Database, Shield } from 'lucide-react';
import { Reveal } from './motion';
import { motion } from 'framer-motion'; // <-- Tambahkan import ini

const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative overflow-hidden"
      aria-label="Hero"
    >
      {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#06B6D4]/25 blur-3xl" />
        <div className="absolute -top-10 left-[-4rem] h-[16rem] w-[16rem] rounded-full bg-[#22D3EE]/20 blur-2xl" />
        <div className="absolute top-[20rem] right-[-5rem] h-[18rem] w-[18rem] rounded-full bg-[#06B6D4]/10 blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-28">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <Reveal delayMs={0}>
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 shadow-[0_0_20px_rgba(6,182,212,0.08)]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#06B6D4] to-[#22D3EE]">
                  <Server className="h-4 w-4 text-white" strokeWidth={2} />
                </span>
                <span className="text-sm font-medium text-[#A0A0B0]">System Online • 2026</span>
              </div>
            </Reveal>

            {/* Headline */}
            <Reveal delayMs={120}>
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#F8F8FC] md:text-6xl">
                Hi, aku Zaky.
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#06B6D4] to-[#22D3EE]">
                  Backend Developer
                </span>
              </h1>
            </Reveal>

            {/* Description */}
            <Reveal delayMs={240}>
              <p className="max-w-xl text-base leading-relaxed text-[#A0A0B0]">
                Muhammad Fairuz Zaky atau sebut saja Zaky. Mari Membangun API yang cepat, aman, dan scalable untuk aplikasi modern. 
                Berfokus pada ekosistem <strong className="text-[#F8F8FC] font-medium">Node.js</strong> & <strong className="text-[#F8F8FC] font-medium">TypeScript</strong>, 
                serta performa tinggi menggunakan <strong className="text-[#F8F8FC] font-medium">Hono.js</strong> dan desain database <strong className="text-[#F8F8FC] font-medium">PostgreSQL</strong>.
              </p>
            </Reveal>

            {/* Call to Actions */}
            <Reveal delayMs={360}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] px-6 py-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]"
                >
                  View APIs & Projects
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-[#A0A0B0] shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/10 hover:text-[#F8F8FC] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]"
                >
                  Let’s Talk Architecture
                </a>
              </div>
            </Reveal>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#12121A]/70 p-5 shadow-md">
                <div className="text-2xl font-bold text-[#F8F8FC]">99.9%</div>
                <div className="mt-1 text-sm text-[#A0A0B0]">System Uptime</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#12121A]/70 p-5 shadow-md">
                <div className="text-2xl font-bold text-[#F8F8FC]">&lt; 50ms</div>
                <div className="mt-1 text-sm text-[#A0A0B0]">Avg API Latency</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#12121A]/70 p-5 shadow-md">
                <div className="text-2xl font-bold text-[#F8F8FC]">100%</div>
                <div className="mt-1 text-sm text-[#A0A0B0]">Type Safe</div>
              </div>
            </div>
          </div>

          {/* Right side glass card */}
          <div className="relative">
            <div className="absolute -inset-2 rounded-[1.2rem] bg-gradient-to-r from-[#06B6D4]/20 to-[#22D3EE]/20 blur-xl" />
            <div className="relative rounded-[1.2rem] border border-white/10 bg-[#12121A]/70 p-6 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-[#A0A0B0]">Current Focus</div>
                  <div className="mt-1 text-xl font-semibold text-[#F8F8FC]">Scalable Backend Architecture</div>
                </div>
                <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
                  <div className="text-xs font-medium text-[#6B6B7B]">Status</div>
                  <div className="text-sm font-semibold text-[#06B6D4]">Available</div>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {/* Progress Bar 1 */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-[#06B6D4]" />
                      <div className="text-sm font-medium text-[#F8F8FC]">API Performance (Hono.js)</div>
                    </div>
                    <div className="text-xs text-[#6B6B7B]">Optimized</div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/5">
                    {/* Menggunakan motion.div untuk animasi lebar */}
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "95%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                      className="h-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" 
                    />
                  </div>
                </div>

                {/* Progress Bar 2 */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-[#8B5CF6]" />
                      <div className="text-sm font-medium text-[#F8F8FC]">Database Design (PostgreSQL)</div>
                    </div>
                    <div className="text-xs text-[#6B6B7B]">Structured</div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/5">
                    {/* Menggunakan motion.div untuk animasi lebar */}
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "90%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                      className="h-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" 
                    />
                  </div>
                </div>

                {/* Progress Bar 3 */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#06B6D4]" />
                      <div className="text-sm font-medium text-[#F8F8FC]">Auth & Security</div>
                    </div>
                    <div className="text-xs text-[#6B6B7B]">Secured</div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/5">
                    {/* Menggunakan motion.div untuk animasi lebar */}
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "88%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.6 }}
                      className="h-2 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6]" 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-[#0A0A0F]/30 p-4">
                <div className="text-xs font-medium text-[#6B6B7B]">Tech Stack Preview</div>
                <div className="mt-2 font-mono text-sm text-[#A0A0B0] leading-relaxed">
                  <div className="text-[#6366F1]">//</div> Runtime: Node.js & Bun
                  <br />
                  <div className="text-[#6366F1]">//</div> Framework: Hono.js (TypeScript)
                  <br />
                  <div className="text-[#6366F1]">//</div> Database: PostgreSQL + Prisma ORM
                  <br />
                  <div className="text-[#6366F1]">//</div> Focus: REST API, Auth & Deployment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;