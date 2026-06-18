import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {

  Terminal,
} from 'lucide-react';

// ============================================================================
// AUDIO SYNTHESIZER (Web Audio API)
// Mensintesis efek suara digital fiksi ilmiah tanpa aset file eksternal!
// ============================================================================
const playSound = (
  type: 'beep' | 'glitch' | 'transition',
  volumeValue: number = 0.15
): void => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Pitch tinggi
      gain.gain.setValueAtTime(volumeValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'glitch') {
      // Suara statis digital tajam
      const bufferSize = ctx.sampleRate * 0.15; // 150ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volumeValue * 0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (type === 'transition') {
      // Suara sweep futuristik dalam saat loading selesai
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.6);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(120, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(volumeValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.5);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.8);
      osc2.stop(ctx.currentTime + 0.8);
    }
  } catch (e: any) {
    console.warn('Audio Context blocked or unsupported:', e);
  }
};

// Fase pemuatan dideklarasikan di luar komponen agar tidak memicu re-render / dependensi tak stabil
const PHASES = [
  'Membangun lingkungan kerja...',
  'Menghubungkan ke jaringan inti...',
  'Mengambil aset beresolusi tinggi...',
  'Memproses efek visual...',
  'Selesai.'
];

// ============================================================================
// COMPONENT: Enhanced Loading Screen
// ============================================================================
interface LoadingScreenProps {
  onComplete?: () => void;
  soundEnabled?: boolean;
  showScanlines?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  soundEnabled = true,
  showScanlines = true
}) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [telemetry, setTelemetry] = useState({
    lat: 12,
    fps: 60,
    node: 'NXS-01'
  });

  // State untuk efek paralaks mouse di latar belakang
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Deteksi gerakan mouse untuk interaksi aurora
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 35; // batas gerakan 35px
      const y = (e.clientY / window.innerHeight - 0.5) * 35;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleComplete = useCallback(() => {
    if (soundEnabled) playSound('transition', 0.25);
    if (onComplete) onComplete();
  }, [onComplete, soundEnabled]);

  useEffect(() => {
    let nextPhaseRef = 0;

    const interval = window.setInterval(() => {
      setProgress((prev) => {
        // Peningkatan organik
        const increment = Math.random() * 3.5 + 0.6;
        const next = Math.min(prev + increment, 100);

        const phaseIndex = Math.min(
          Math.floor((next / 100) * PHASES.length),
          PHASES.length - 1
        );

        // Mainkan bunyi 'beep' pelan saat fase berganti
        if (phaseIndex !== nextPhaseRef) {
          nextPhaseRef = phaseIndex;
          setCurrentPhase(phaseIndex);
          if (soundEnabled && next < 100) playSound('beep', 0.08);
        }

        // Acak telemetri agar terasa hidup
        setTelemetry({
          lat: Math.floor(Math.random() * 5) + 10,
          fps: Math.random() > 0.4 ? 60 : 59,
          node: `NXS-0${Math.floor(next / 25) + 1}`
        });

        if (next >= 100) {
          window.clearInterval(interval);
          // Berikan suara glitch kecil sebelum penutupan penuh
          if (soundEnabled) {
            window.setTimeout(() => playSound('glitch', 0.15), 600);
          }
          window.setTimeout(handleComplete, 1200);
        }

        return next;
      });
    }, 55); // Sedikit disesuaikan agar terasa responsif

    return () => window.clearInterval(interval);
  }, [handleComplete, soundEnabled]);

  // Handler bypass langsung ke selesai demi kenyamanan UX
  const handleBypass = () => {
    if (soundEnabled) playSound('transition', 0.2);
    setProgress(100);
    setCurrentPhase(PHASES.length - 1);
    setTimeout(handleComplete, 300);
  };

  // Varian animasi glitch keluar untuk kontainer utama
  const containerGlitchVariants: Variants = {
    initial: {
      opacity: 1,
      scale: 1,
      filter: 'none'
    },
    exit: {
      x: [0, -20, 15, -8, 20, -3, 0],
      y: [0, 8, -10, 4, -5, 3, 0],
      scale: [1, 1.08, 0.92, 1.15, 0.88, 1],
      opacity: [1, 0.8, 0.35, 0.95, 0.1, 0.7, 0],
      filter: [
        'none',
        'hue-rotate(90deg) contrast(1.3) blur(1px)',
        'hue-rotate(-45deg) contrast(1.6) blur(4px)',
        'hue-rotate(180deg) saturate(2.5) blur(2px)',
        'none'
      ],
      transition: {
        duration: 0.75,
        ease: 'easeInOut' as const
      }
    }
  };

  // Varian glitch khusus untuk elemen teks/konten tengah agar terpisah
  const contentGlitchVariants: Variants = {
    initial: { opacity: 1, y: 0 },
    exit: {
      x: [0, 30, -25, 20, -15, 0],
      skewX: [0, 20, -15, 25, -20, 0],
      clipPath: [
        'inset(0% 0% 0% 0%)',
        'inset(15% 0% 45% 0%)',
        'inset(55% 0% 15% 0%)',
        'inset(8% 0% 80% 0%)',
        'inset(0% 0% 0% 0%)'
      ],
      transition: {
        duration: 0.6,
        ease: 'linear' as const
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#050508] select-none font-sans"
      variants={containerGlitchVariants}
      initial="initial"
      exit="exit"
    >
      {/* Latar Belakang: Efek Aurora Interaktif + Parallax Gerakan Mouse */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-70">
        <motion.div
          className="absolute w-[60vw] h-[60vw] rounded-full mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(80px)'
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.5, 0.7, 0.5],
            x: mousePos.x,
            y: mousePos.y - 20
          }}
          transition={{
            scale: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
            x: { type: 'spring', stiffness: 50, damping: 15 },
            y: { type: 'spring', stiffness: 50, damping: 15 }
          }}
        />

        <motion.div
          className="absolute w-[50vw] h-[50vw] rounded-full mix-blend-screen"
          style={{
            background: 'radial-gradient(circle, rgba(0, 119, 255, 0.12) 0%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(80px)'
          }}
          animate={{
            scale: [1.15, 1, 1.15],
            opacity: [0.4, 0.6, 0.4],
            x: mousePos.x * -0.8 + 20,
            y: mousePos.y * -0.8
          }}
          transition={{
            scale: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
            x: { type: 'spring', stiffness: 50, damping: 15 },
            y: { type: 'spring', stiffness: 50, damping: 15 }
          }}
        />
      </div>

      {/* Grid Latar Belakang Digital */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center'
        }}
      />

      {/* CRT Scanline Overlay untuk tekstur retro-tech */}
      {showScanlines && (
        <div
          className="absolute inset-0 z-50 pointer-events-none opacity-[0.08] before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] before:bg-[length:100%_4px,_6px_100%]"
        />
      )}

      {/* Lapisan Noise Tipis untuk tekstur premium */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E")'
        }}
      />

      {/* Telemetri Kiri Atas */}
      <motion.div
        className="absolute top-8 left-8 z-10 hidden md:flex flex-col gap-1 font-mono text-[10px] tracking-[0.15em] text-neutral-500"
        exit={{ x: -50, opacity: 0, transition: { duration: 0.3 } }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
          <span className="text-[#00E5FF]">SYS_STATUS: DEPLOYING</span>
        </div>
        <div>TEMP: 34°C // HEAL: 100%</div>
      </motion.div>

      {/* Telemetri Kanan Atas */}
      <motion.div
        className="absolute top-8 right-8 z-10 hidden md:flex flex-col gap-1 font-mono text-[10px] tracking-[0.15em] text-neutral-500 text-right"
        exit={{ x: 50, opacity: 0, transition: { duration: 0.3 } }}
      >
        <div>NODE: {telemetry.node}</div>
        <div className="text-neutral-400">
          LAT: {telemetry.lat}MS // FPS: {telemetry.fps}
        </div>
      </motion.div>

      {/* Konten Utama */}
      <motion.div
        className="relative z-10 flex flex-col items-center w-full max-w-md px-8"
        variants={contentGlitchVariants}
      >
        {/* Angka Persentase + Lingkaran Orbit Tipis */}
        <div className="relative mb-10 flex items-center justify-center w-60 h-60">
          {/* Lingkaran Orbit Pelacak */}
          <svg className="absolute w-full h-full opacity-15" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.25"
              strokeDasharray="3 3"
            />
          </svg>

          {/* Halo Cahaya Cyan Lembut di Belakang Persentase */}
          <div className="absolute w-36 h-36 bg-[#00E5FF]/5 rounded-full filter blur-xl" />

          {/* Titik Orbit Berputar */}
          <motion.div
            className="absolute w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00E5FF]"
              style={{ boxShadow: '0 0 10px 2px #00E5FF' }}
            />
          </motion.div>

          {/* Angka Persentase dengan Glitch Drop-shadow halus */}
          <motion.h1
            className="text-8xl font-black tracking-tighter text-transparent bg-clip-text select-none font-mono"
            style={{
              backgroundImage: 'linear-gradient(180deg, #FFFFFF 30%, rgba(255, 255, 255, 0.4) 100%)',
              textShadow: '0 0 15px rgba(0,229,255,0.1)'
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
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
              boxShadow: '0 0 15px 1px rgba(0, 229, 255, 0.5)'
            }}
            layout
            transition={{ ease: 'linear', duration: 0.1 }}
          />
          {/* Titik kilau (flare) di ujung bar progres */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-[1.5px] bg-white blur-[1px]"
            style={{ left: `calc(${progress}% - 24px)` }}
            layout
            transition={{ ease: 'linear', duration: 0.1 }}
          />
        </div>

        {/* Indikator Titik Langkah Fase */}
        <div className="flex gap-2 mb-6 justify-center">
          {PHASES.map((_, i) => {
            const isActive = i <= currentPhase;
            return (
              <motion.div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === currentPhase ? '20px' : '6px',
                  backgroundColor: isActive ? '#00E5FF' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: i === currentPhase ? '0 0 8px #00E5FF' : 'none'
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
              className="text-xs tracking-wider text-neutral-400 font-medium font-mono text-center flex items-center gap-2 justify-center"
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Terminal className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
              <span>{PHASES[currentPhase]}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* UX: Tombol Bypass (Lewati) */}
        {progress > 25 && progress < 95 && (
          <motion.button
            onClick={handleBypass}
            className="mt-6 px-4 py-1.5 border border-[#00E5FF]/20 hover:border-[#00E5FF]/60 rounded text-[10px] tracking-widest text-[#00E5FF]/60 hover:text-[#00E5FF] font-mono uppercase bg-[#00E5FF]/5 transition-all duration-200"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Bypass Sequence_
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;

