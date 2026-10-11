import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [role, setRole] = useState(params.get('role') || 'creator');
  const [form, setForm] = useState({ name: '', handle: '', email: '', password: '', company: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }
    setLoading(true);
    try {
      await signup({ role, ...form });
      navigate(role === 'creator' ? '/creator' : '/brand');
    } catch (err) {
      setError(err.message || 'Something went wrong');
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

        <h1 className="font-serif-display text-4xl text-nude-900 mb-2">Create your account</h1>
        <p className="text-nude-600 mb-8">Join as a {role}.</p>

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
          {role === 'brand' && (
            <input
              value={form.company}
              onChange={(e) => change('company', e.target.value)}
              placeholder="Company name"
              className="input-nude"
            />
          )}

          <input
            value={form.name}
            onChange={(e) => change('name', e.target.value)}
            placeholder={role === 'brand' ? 'Contact person' : 'Your full name'}
            className="input-nude"
          />

          {role === 'creator' && (
            <input
              value={form.handle}
              onChange={(e) => change('handle', e.target.value.replace(/\s+/g, ''))}
              placeholder="Handle (e.g., aarav.ai)"
              className="input-nude"
            />
          )}

          <input
            type="email"
            value={form.email}
            onChange={(e) => change('email', e.target.value)}
            placeholder="Email"
            className="input-nude"
          />

          <input
            type="password"
            value={form.password}
            onChange={(e) => change('password', e.target.value)}
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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-nude-600 mt-6">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-nude-900 underline">
            Sign in
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