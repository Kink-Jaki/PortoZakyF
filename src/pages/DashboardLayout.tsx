import React from 'react';

import { useAuth } from '../auth/AuthContext';

type Tab = {
  href: string;
  label: string;
};

const TABS: Tab[] = [
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/skills', label: 'Skills' },
  { href: '/dashboard/experiences', label: 'Experiences' },
];

export default function DashboardLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const { logout } = useAuth();

  const path = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <div className="min-h-screen bg-[#05050A] text-gray-200 selection:bg-indigo-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-md shadow-lg">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              <span className="text-xs font-bold tracking-wide text-indigo-300 uppercase">Admin Dashboard</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h1>
            <p className="mt-2 text-gray-400 max-w-xl text-sm sm:text-base">{subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              window.location.pathname = '/';
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 focus:outline-none focus:ring-4 focus:ring-red-500/20 active:scale-95"
          >
            <span className="text-base leading-none">Logout</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => {
              const active = path === t.href;
              return (
                <a
                  key={t.href}
                  href={t.href}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-200'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20'
                  }`}
                >
                  {t.label}
                </a>
              );
            })}
          </div>
          <div className="text-xs text-gray-500">Tip: view count bertambah saat section public dimuat.</div>
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

