import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface LoginPageProps {
  onSignIn: () => void; // Google OAuth
}

export function LoginPage({ onSignIn }: LoginPageProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setError('');
    setMessage('');
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Account created — check your email for a confirmation link, then sign in.');
        setMode('signin');
        setPassword('');
      }
    }

    setLoading(false);
  };

  const switchMode = () => {
    setMode(m => m === 'signin' ? 'signup' : 'signin');
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-2 text-4xl">📋</div>
          <h1 className="text-2xl font-bold text-[#1C1B18] mb-1">Client Manager</h1>
          <p className="text-[#6B6860] text-sm">Your marketing agency, organized.</p>
        </div>

        {/* Email / password form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
            className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-gray-200 rounded-xl text-[#1C1B18] placeholder-[#6B6860] focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] focus:border-transparent transition-shadow"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            required
            className="w-full px-3 py-2.5 text-sm bg-[#F7F6F3] border border-gray-200 rounded-xl text-[#1C1B18] placeholder-[#6B6860] focus:outline-none focus:ring-2 focus:ring-[#4F7BF7] focus:border-transparent transition-shadow"
          />

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 text-center">{error}</p>
          )}
          {message && (
            <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 text-center">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full bg-[#4F7BF7] text-white font-medium text-sm py-2.5 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#6B6860] mt-3">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={switchMode} className="text-[#4F7BF7] hover:underline font-medium">
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-[#6B6860]">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          onClick={onSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-xl px-6 py-3 text-[#1C1B18] font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
