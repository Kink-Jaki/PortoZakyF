import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SYSTEM_LOGS = [
  ">_ Inisialisasi protokol inti...",
  ">_ Membuka jalur komunikasi aman...",
  ">_ Mengambil aset visual UI...",
  ">_ Sinkronisasi node server...",
  ">_ Menerapkan filter keamanan...",
  ">_ Mengkompilasi modul akhir...",
  ">_ Sistem siap diluncurkan."
];

interface ModernTerminalProps {
  onComplete?: () => void;
}

const LoadingScreen: React.FC<ModernTerminalProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let currentLog = 0;

    const interval = setInterval(() => {
      // 1. Munculkan log secara bertahap
      if (currentLog < SYSTEM_LOGS.length && Math.random() > 0.4) {
        setLogs((prev) => {
          const newLogs = [...prev, SYSTEM_LOGS[currentLog]];
          // Batasi hanya menampilkan 4 log terakhir agar tetap bersih/minimalis
          return newLogs.slice(-4); 
        });
        currentLog++;
      }

      // 2. Naikkan progress dengan kecepatan acak tapi mulus
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 2;
        if (next >= 100) {
          clearInterval(interval);
          setLogs((prev) => [...prev.slice(-3), ">_ EXECUTE: start_session()"]);
          
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 1000); // Jeda sejenak sebelum selesai
          return 100;
        }
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070B14] font-mono select-none p-6"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Ambient Glow di Background (agar tidak kaku/mati) */}
        <motion.div
          className="absolute w-[60vw] h-[60vw] rounded-full mix-blend-screen pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0, 229, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
            filter: 'blur(50px)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Kontainer Terminal */}
        <div className="relative z-10 w-full max-w-lg flex flex-col">
          
          {/* Header Terminal */}
          <div className="flex items-center justify-between mb-8 border-b border-[#00E5FF]/20 pb-4">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#00E5FF]/20" />
              <span className="w-3 h-3 rounded-full bg-[#00E5FF]/40" />
              <span className="w-3 h-3 rounded-full bg-[#00E5FF]" />
            </div>
            <span className="text-[#00E5FF]/50 text-xs tracking-widest uppercase">
              Terminal.exe
            </span>
          </div>

          {/* Area Log */}
          <div className="h-32 flex flex-col justify-end overflow-hidden mb-8 mask-image-b">
            <AnimatePresence initial={false}>
              {logs.map((log, i) => (
                <motion.div
                  key={log + i} // Key unik untuk animasi
                  layout // Ini yang membuat pergantian baris jadi "sliding" mulus
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: i === logs.length - 1 ? 1 : 0.5, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`text-sm mb-2 ${
                    i === logs.length - 1 ? 'text-[#00E5FF]' : 'text-[#00E5FF]/50'
                  }`}
                  style={{ textShadow: i === logs.length - 1 ? '0 0 10px rgba(0,229,255,0.4)' : 'none' }}
                >
                  {log}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Area Progress Bar */}
          <div className="flex items-end justify-between mb-3">
            <span className="text-[#00E5FF] text-xs tracking-widest animate-pulse">
              {progress < 100 ? 'PROCESSING...' : 'DONE.'}
            </span>
            <motion.span 
              className="text-4xl font-light text-[#00E5FF]"
              style={{ textShadow: '0 0 15px rgba(0,229,255,0.5)' }}
            >
              {progress}%
            </motion.span>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full h-[2px] bg-[#00E5FF]/10 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute top-0 left-0 h-full bg-[#00E5FF]"
              style={{ width: `${progress}%`, boxShadow: '0 0 10px #00E5FF' }}
              layout
              transition={{ ease: "linear", duration: 0.15 }}
            />
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;