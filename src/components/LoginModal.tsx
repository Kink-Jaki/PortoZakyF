import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoggedIn: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoggedIn }) => {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username.trim(), password);
      onClose();
      onLoggedIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative h-full w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12121A]/95 shadow-[0_20px_70px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div>
              <div className="text-sm font-medium text-[#A0A0B0]">Login</div>
              <div className="text-lg font-semibold text-[#F8F8FC]">Dashboard Admin</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl text-[#A0A0B0] hover:text-[#F8F8FC] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              aria-label="Close login modal"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#A0A0B0]">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#F8F8FC] placeholder:text-[#6B6B7B] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  placeholder="Masukkan username"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A0A0B0]">Password</label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[#F8F8FC] placeholder:text-[#6B6B7B] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  placeholder="Masukkan password"
                  required
                  disabled={loading}
                />
              </div>

              {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

