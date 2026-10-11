import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from './api';
import { FILTER_OPTIONS } from './mockData';

export default function BriefForm() {
  const navigate = useNavigate();
  const [brief, setBrief] = useState({
    title: '',
    goals: '',
    content_type: FILTER_OPTIONS.content_type[0],
    style: '',
    aspect_ratio: FILTER_OPTIONS.format[0],
    license_type: 'Social Media Ads Only',
    license_duration: '',
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  const change = (k, v) => setBrief(p => ({ ...p, [k]: v }));

  const handleAI = async () => {
    if (!aiPrompt) return;
    setGenerating(true);
    const res = await api.generateBrief(aiPrompt);
    setBrief(prev => ({
      ...prev,
      title: res.title,
      goals: res.goals,
      content_type: res.content_type,
      style: res.style,
      aspect_ratio: res.aspect_ratio,
    }));
    setGenerating(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.createBrief(brief);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      navigate('/brand');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-nude-100 pt-12 pb-12 px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="font-serif-display text-5xl text-nude-900 leading-tight">Create a brief</h1>
          <p className="text-nude-600 mt-3 text-lg">Tell us what you need — or let AI draft it for you.</p>
        </div>

        <div className="bg-gradient-to-br from-nude-200 to-nude-100 rounded-3xl p-6 border border-nude-300 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✨</span>
            <label className="text-sm font-medium text-nude-800 tracking-wide">AI Magic Draft</label>
          </div>
          <div className="flex gap-2">
            <input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., I need a 9:16 futuristic shoe ad"
              className="flex-1 px-4 py-3 bg-white/80 border border-nude-300 rounded-xl text-sm text-nude-900 placeholder-nude-400 focus:outline-none focus:border-nude-500"
            />
            <button
              type="button"
              onClick={handleAI}
              disabled={generating}
              className="px-6 py-3 bg-nude-700 text-white rounded-xl text-sm font-medium hover:bg-nude-800 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {generating ? 'Drafting…' : 'Draft'}
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl p-8 border border-nude-200 space-y-6">
          <Field label="Campaign Title">
            <input value={brief.title} onChange={(e) => change('title', e.target.value)} placeholder="Give your campaign a name" className="input-nude" />
          </Field>

          <Field label="Core Goals">
            <textarea value={brief.goals} onChange={(e) => change('goals', e.target.value)} placeholder="What are you trying to achieve?" rows={3} className="input-nude resize-none" />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Content Type">
              <select value={brief.content_type} onChange={(e) => change('content_type', e.target.value)} className="input-nude">
                {FILTER_OPTIONS.content_type.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </Field>

            <Field label="Format & Aspect Ratio">
              <select value={brief.aspect_ratio} onChange={(e) => change('aspect_ratio', e.target.value)} className="input-nude">
                {FILTER_OPTIONS.format.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Style & Vibe">
            <input value={brief.style} onChange={(e) => change('style', e.target.value)} placeholder="e.g., Cyberpunk, Minimalist Organic" className="input-nude" />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="License Type">
              <select value={brief.license_type} onChange={(e) => change('license_type', e.target.value)} className="input-nude">
                <option>Social Media Ads Only</option>
                <option>Global TV Broadcast</option>
                <option>Full Commercial Buyout</option>
              </select>
            </Field>

            <Field label="License Duration">
              <input value={brief.license_duration} onChange={(e) => change('license_duration', e.target.value)} placeholder="e.g., 12 months" className="input-nude" />
            </Field>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <p className="text-xs text-nude-500">{saved ? '✓ Brief saved — redirecting…' : 'All fields can be edited later.'}</p>
            <button type="submit" className="px-8 py-3 bg-nude-800 text-white rounded-full font-medium hover:bg-nude-900 transition-colors">
              Save Brief
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input-nude {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #faf7f2;
          border: 1px solid #e8e0d5;
          border-radius: 0.75rem;
          font-size: 0.9rem;
          color: #3d342c;
          transition: all 0.2s;
        }
        .input-nude:focus {
          outline: none;
          border-color: #a89078;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(168,144,120,0.12);
        }
        .input-nude::placeholder { color: #b8a897; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-nude-500 mb-2">{label}</label>
      {children}
    </div>
  );
}