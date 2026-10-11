import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState('creator');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password required.');
      return;
    }
    setLoading(true);
    try {
      await login({ ...form, role });
      navigate(role === 'creator' ? '/creator' : '/brand');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nude-100 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 mb-10 text-nude-900"
        >
          <div className="w-9 h-9 rounded-full bg-nude-600 flex items-center justify-center">
            <span className="text-white font-serif text-lg">L</span>
          </div>
          <span className="font-serif-display text-2xl">Lumen</span>
        </button>

        <h1 className="font-serif-display text-4xl text-nude-900 mb-2">Welcome back</h1>
        <p className="text-nude-600 mb-8">Sign in to your account.</p>

        {/* Role toggle */}
        <div className="flex gap-2 p-1 bg-white rounded-full border border-nude-200 mb-6">
          <button
            onClick={() => setRole('creator')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              role === 'creator' ? 'bg-nude-600 text-white' : 'text-nude-700'
            }`}
          >
            Creator
          </button>
          <button
            onClick={() => setRole('brand')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
              role === 'brand' ? 'bg-nude-600 text-white' : 'text-nude-700'
            }`}
          >
            Brand
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
            placeholder="Email"
            className="input-nude"
          />
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
            placeholder="Password"
            className="input-nude"
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-nude-800 text-white rounded-full font-medium hover:bg-nude-900 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-nude-600 mt-6">
          New here?{' '}
          <button onClick={() => navigate('/signup')} className="text-nude-900 underline">
            Create an account
          </button>
        </p>
      </div>

      <style>{`
        .input-nude {
          width: 100%;
          padding: 0.85rem 1rem;
          background: #ffffff;
          border: 1px solid #e8e0d5;
          border-radius: 0.75rem;
          font-size: 0.9rem;
          color: #3d342c;
          transition: all 0.2s;
        }
        .input-nude:focus {
          outline: none;
          border-color: #a89078;
          box-shadow: 0 0 0 3px rgba(168,144,120,0.12);
        }
        .input-nude::placeholder { color: #b8a897; }
      `}</style>
    </div>
  );
}