import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { LogIn, Sparkles, User, Lock, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    setError(null);
    try {
      await login(username, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'student' | 'faculty' | 'moderator' | 'admin') => {
    await switchDemoRole(role);
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-2xl">
            🏛️
          </div>
          <h1 className="text-2xl font-black text-white">SETHU HUB</h1>
          <p className="text-xs text-gray-400">Where Sethu Connects • Sethu Institute of Technology</p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-[#111827] border border-[#1F2937] p-6 sm:p-8 space-y-5 shadow-2xl">
          {error && (
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Username or Institutional Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. karthik_csd or karthik.csd@sethu.ac.in"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl bg-[#0B0F19] border border-[#1F2937] py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <LogIn className="h-4 w-4" />
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Instant 1-Click Demo Login */}
          <div className="pt-4 border-t border-[#1F2937] space-y-2">
            <div className="text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Or instant 1-click test as:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="rounded-xl bg-[#182234] hover:bg-indigo-600/20 border border-[#2D3748] p-2 text-left transition-colors"
              >
                <div className="text-xs font-bold text-white">Student</div>
                <div className="text-[10px] text-gray-400">Karthik (CSD)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('faculty')}
                className="rounded-xl bg-[#182234] hover:bg-emerald-600/20 border border-[#2D3748] p-2 text-left transition-colors"
              >
                <div className="text-xs font-bold text-white">Faculty</div>
                <div className="text-[10px] text-gray-400">Dr. Ramanathan</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('moderator')}
                className="rounded-xl bg-[#182234] hover:bg-amber-600/20 border border-[#2D3748] p-2 text-left transition-colors"
              >
                <div className="text-xs font-bold text-white">Moderator</div>
                <div className="text-[10px] text-gray-400">Priya M. (ECE)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="rounded-xl bg-[#182234] hover:bg-purple-600/20 border border-[#2D3748] p-2 text-left transition-colors"
              >
                <div className="text-xs font-bold text-white">Admin</div>
                <div className="text-[10px] text-gray-400">SIT Admin Ops</div>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

