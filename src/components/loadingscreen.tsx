import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [telemetry, setTelemetry] = useState({
    lat: 12,
    fps: 60,
    node: 'NXS-01'
  });

  // Fase pemuatan dengan bahasa yang natural dan modern
  const phases = [
    'Membangun lingkungan kerja...',
    'Menghubungkan ke jaringan inti...',
    'Mengambil aset beresolusi tinggi...',
    'Memproses efek visual...',
    'Selesai.'
  ];

  const handleComplete = useCallback(() => {
    if (onComplete) onComplete();
  }, [onComplete]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        // Peningkatan organik
        const increment = Math.random() * 3 + 0.5;
        const next = Math.min(prev + increment, 100);

        const phaseIndex = Math.min(
          Math.floor((next / 100) * phases.length),
          phases.length - 1
        );
        setCurrentPhase(phaseIndex);

        // Update data telemetri secara acak agar terasa hidup
        setTelemetry({
          lat: Math.floor(Math.random() * 5) + 10,
          fps: Math.random() > 0.5 ? 60 : 59,
          node: `NXS-0${Math.floor(next / 25) + 1}`
        });

        if (next >= 100) {
          window.clearInterval(interval);
          window.setTimeout(handleComplete, 1200); // Sedikit ditambah jedanya agar animasi glitch keluar terlihat penuh
        }

        return next;
      });
    }, 60);

    return () => window.clearInterval(interval);
  }, [handleComplete, phases.length]);

  // Varian animasi glitch keluar untuk kontainer utama
  const containerGlitchVariants = {
    initial: {
      opacity: 1,
      scale: 1,
      filter: 'none',
    },
    exit: {
      // Efek glitch acak pada posisi, skala, opacity, dan filter
      x: [0, -15, 10, -5, 15, -2, 0],
      y: [0, 5, -8, 2, -4, 3, 0],
      scale: [1, 1.05, 0.95, 1.1, 0.9, 1],
      opacity: [1, 0.85, 0.4, 0.9, 0.15, 0.7, 0],
      filter: [
        'none',
        'hue-rotate(90deg) contrast(1.2) blur(1px)',
        'hue-rotate(-45deg) contrast(1.5) blur(3px)',
        'hue-rotate(180deg) saturate(2) blur(1px)',
        'none'
      ],
      transition: {
        duration: 0.65,
        ease: 'easeInOut' as const,
      }
    }
  };

  // Varian glitch khusus untuk elemen teks/konten tengah agar terasa terpisah/rusak saat keluar
  const contentGlitchVariants = {
    initial: { opacity: 1, y: 0 },
    exit: {
      x: [0, 25, -20, 15, -10, 0],
      skewX: [0, 15, -10, 20, -15, 0],
      clipPath: [
        'inset(0% 0% 0% 0%)',
        'inset(20% 0% 40% 0%)',
        'inset(60% 0% 10% 0%)',
        'inset(5% 0% 85% 0%)',
        'inset(0% 0% 0% 0%)'
      ],
      transition: {
        duration: 0.5,
        ease: 'linear' as const
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black select-none font-sans"
      variants={containerGlitchVariants}
      initial="initial"
      exit="exit"
    >
      {/* Latar Belakang: Efek Aurora / Cahaya Bias Modern */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-60">
        <motion.div
          className="absolute w-[55vw] h-[55vw] rounded-full mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 229, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(70px)'
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.7, 0.5],
            y: ['-4%', '4%', '-4%']
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[45vw] h-[45vw] rounded-full mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle, rgba(0, 119, 255, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(70px)'
          }}
          animate={{
            scale: [1.15, 1, 1.15],
            opacity: [0.3, 0.5, 0.3],
            x: ['4%', '-4%', '4%']
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Lapisan Noise Tipis untuk tekstur premium */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
        }}
      />

      {/* Telemetri Aktif di Sudut Layar */}
      <motion.div
        className="absolute top-8 left-8 z-10 hidden md:flex flex-col gap-1 font-mono text-[10px] tracking-[0.15em] text-neutral-500"
        exit={{ x: -50, opacity: 0, transition: { duration: 0.3 } }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#00E5FF] animate-pulse" />
          <span>SYS_STATUS: ACTIVE</span>
        </div>
        <div>CORE_TEMP: 38°C</div>
      </motion.div>

      <motion.div
        className="absolute top-8 right-8 z-10 hidden md:flex flex-col gap-1 font-mono text-[10px] tracking-[0.15em] text-neutral-500 text-right"
        exit={{ x: 50, opacity: 0, transition: { duration: 0.3 } }}
      >
        <div>NODE: {telemetry.node}</div>
        <div>
          PING: {telemetry.lat}MS // FPS: {telemetry.fps}
        </div>
      </motion.div>

      {/* Konten Utama dengan Pembungkus Animasi Glitch */}
      <motion.div
        className="relative z-10 flex flex-col items-center w-full max-w-md px-8"
        variants={contentGlitchVariants}
      >
      {/* Angka Persentase + Lingkaran Orbit Tipis */}
      <div className="relative mb-10 flex items-center justify-center w-64 h-64">
        {/* Lingkaran Orbit Pelacak */}
        <svg className="absolute w-full h-full opacity-20" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#FFFFFF" strokeWidth="0.25" strokeDasharray="3 3" />
        </svg>

        {/* Titik Orbit Berputar */}
        <motion.div
          className="absolute w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00E5FF]"
            style={{ boxShadow: '0 0 8px #00E5FF' }}
          />
        </motion.div>

        {/* Angka Persentase */}
        <motion.h1
          className="text-8xl font-semibold tracking-tighter text-transparent bg-clip-text select-none"
          style={{
            backgroundImage:
              'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.4) 100%)'
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {Math.floor(progress)}
        </motion.h1>
      </div>

          {/* Progress Bar Premium */}
          <div className="w-full relative h-[1px] bg-white/10 rounded-full mb-6">
            <motion.div
              className="absolute top-0 left-0 h-full bg-[#00E5FF] rounded-full"
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 20px 2px rgba(0, 229, 255, 0.4)'
              }}
              layout
              transition={{ ease: 'linear', duration: 0.1 }}
            />
            {/* Titik kilau (flare) di ujung bar progres */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-[1px] bg-white blur-[1.5px]"
              style={{ left: `calc(${progress}% - 24px)` }}
              layout
              transition={{ ease: 'linear', duration: 0.1 }}
            />
          </div>

          {/* Indikator Titik Langkah Fase (Phase Step Nodes) */}
          <div className="flex gap-2 mb-6">
            {phases.map((_, i) => {
              const isActive = i <= currentPhase;
              return (
                <motion.div
                  key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === currentPhase ? '16px' : '6px',
                    backgroundColor: isActive ? '#00E5FF' : 'rgba(255, 255, 255, 0.15)',
                    boxShadow: i === currentPhase ? '0 0 8px #00E5FF' : 'none',
                  }}
                />
              );
            })}
          </div>

          {/* Teks Status */}
          <div className="h-6 relative w-full flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase}
                className="text-xs tracking-wider text-neutral-400 font-medium"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {phases[currentPhase]}
              </motion.div>
            </AnimatePresence>
          </div>

        </motion.div>
      </motion.div>
  );
};


export default LoadingScreen;