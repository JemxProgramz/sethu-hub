import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-[#050505] text-[#EDEDED] font-sans selection:bg-[#333] selection:text-white flex flex-col">
      <header className="w-full p-6 border-b border-[#1A1A1A]">
        <Link to="/" className="font-semibold text-white tracking-tight flex items-center gap-2 text-sm w-fit">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
          Sethu Hub
        </Link>
      </header>

      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Sign in</h1>
            <p className="text-sm text-[#888]">Welcome back to Sethu Hub.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5">
                Username or email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#888] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#EDEDED] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#EDEDED] hover:bg-white text-black rounded-sm py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo Login */}
          <div className="mt-8 pt-6 border-t border-[#111]">
            <div className="text-xs text-[#666] mb-3">
              Quick demo access
            </div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { role: 'student' as const, name: 'Student', desc: 'Karthik (CSD)' },
                { role: 'faculty' as const, name: 'Faculty', desc: 'Dr. Ramanathan' },
                { role: 'moderator' as const, name: 'Moderator', desc: 'Priya M. (ECE)' },
                { role: 'admin' as const, name: 'Admin', desc: 'SIT Admin' }
              ]).map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => handleQuickDemo(d.role)}
                  className="rounded-sm bg-[#0A0A0A] hover:bg-[#111] border border-[#222] hover:border-[#444] p-2.5 text-left transition-colors"
                >
                  <div className="text-xs font-medium text-[#EDEDED]">{d.name}</div>
                  <div className="text-xs text-[#666] mt-0.5">{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-sm text-[#888]">
            Don't have an account?{' '}
            <Link to="/register" className="text-white hover:underline transition-all">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
