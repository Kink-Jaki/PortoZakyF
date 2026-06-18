import React from 'react';
import { GitBranch, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="py-20 md:py-24 relative overflow-hidden" aria-label="Contact">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#6366F1]/5 to-transparent" />
      
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
            <span className="text-sm font-medium text-[#A0A0B0]">Kontak</span>
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-[#F8F8FC] md:text-5xl">
            Mari Berkolaborasi.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#A0A0B0]">
            Punya ide proyek, pertanyaan tentang arsitektur sistem, atau sekadar ingin berdiskusi teknologi? Jangan ragu untuk menghubungi saya melalui platform di bawah ini.
          </p>

          <div className="mt-10 grid gap-4 w-full max-w-lg sm:grid-cols-3">
            {/* Email */}
            <a
              href="mailto:fzaky@gmail.com" // Ganti dengan email asli Anda
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#12121A]/70 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#06B6D4]/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06B6D4]/10 text-[#06B6D4] group-hover:bg-[#06B6D4] group-hover:text-white transition-colors duration-300">
                <Mail className="h-5 w-5" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-[#F8F8FC]">Email</span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/Kink-Jaki" // Ganti dengan username GitHub Anda
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#12121A]/70 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#F8F8FC]/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#F8F8FC] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-[#F8F8FC] group-hover:bg-[#F8F8FC] group-hover:text-[#12121A] transition-colors duration-300">
                <GitBranch className="h-5 w-5" strokeWidth={2} />
              </div>
              <span className="text-sm font-medium text-[#F8F8FC]">GitHub</span>
            </a>

            {/* Instagram */}
            {}
            <a
              href="https://instagram.com/fzaky.13" // Ganti dengan username IG Anda
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#12121A]/70 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#EC4899]/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#EC4899] focus:ring-offset-2 focus:ring-offset-[#0A0A0F]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EC4899]/10 text-[#EC4899] group-hover:bg-gradient-to-tr group-hover:from-[#F59E0B] group-hover:via-[#EC4899] group-hover:to-[#8B5CF6] group-hover:text-white transition-colors duration-300">
                {/* Custom Inline SVG for Instagram */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[#F8F8FC]">Instagram</span>
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 rounded-full border border-white/5 bg-[#12121A] px-5 py-2 shadow-sm">
            <MapPin className="h-4 w-4 text-[#8B5CF6]" />
            <span className="text-sm text-[#A0A0B0]">Blitar, Jawa Timur, Indonesia</span>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-20 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="text-sm text-[#6B6B7B] text-center md:text-left">
              © {new Date().getFullYear()} Zaky. Dibangun dengan React & Tailwind CSS.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-[#A0A0B0]">
              <a className="transition-colors hover:text-[#F8F8FC]" href="#home">Beranda</a>
              <a className="transition-colors hover:text-[#F8F8FC]" href="#about">Tentang</a>
              <a className="transition-colors hover:text-[#F8F8FC]" href="#experience">Pengalaman</a>
              <a className="transition-colors hover:text-[#F8F8FC]" href="#projects">Proyek</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;