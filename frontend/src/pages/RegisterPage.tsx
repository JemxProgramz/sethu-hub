import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const DEPARTMENTS = [
  'CSD', 'CSE', 'AI_DS', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'BT', 'MBA'
];

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !year) {
      setError('Please select your department and year.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await register({
        username,
        email,
        password,
        displayName,
        department,
        year: parseInt(year),
        role: 'student'
      });
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#EDEDED] font-sans selection:bg-[#333] selection:text-white flex flex-col">
      {/* Minimal Header */}
      <header className="w-full p-6 border-b border-[#1A1A1A]">
        <Link to="/" className="font-semibold text-white tracking-tight flex items-center gap-2 text-sm w-fit">
          <div className="w-4 h-4 bg-white rounded-sm"></div>
          Sethu Hub
        </Link>
      </header>

      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Join Sethu Hub</h1>
            <p className="text-sm text-[#888888]">Your campus. Your community.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444] transition-colors appearance-none"
                  >
                    <option value="" disabled>Select department</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#888] mb-1.5">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-[#444] transition-colors appearance-none"
                  >
                    <option value="" disabled>Select year</option>
                    {[1, 2, 3, 4].map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">
                  College email
                </label>
                <input
                  type="email"
                  placeholder="name@sethu.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0A0A0A] border border-[#222] rounded-sm px-3 py-2 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888] mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  pattern="^[a-zA-Z0-9_]+$"
                  title="Only letters, numbers, and underscores allowed"
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
                    minLength={6}
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#EDEDED] hover:bg-white text-black rounded-sm py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-sm text-[#888]">
            Already have an account?{' '}
            <Link to="/login" className="text-white hover:underline transition-all">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
