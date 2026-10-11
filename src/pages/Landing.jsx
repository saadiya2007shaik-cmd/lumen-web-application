import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-nude-100 flex flex-col">
      {/* Nav */}
      <nav className="w-full px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-nude-600 flex items-center justify-center">
            <span className="text-white font-serif text-lg">L</span>
          </div>
          <span className="font-serif-display text-2xl text-nude-900">Lumen</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-sm text-nude-700 hover:text-nude-900 transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2 bg-nude-700 text-white text-sm rounded-full hover:bg-nude-800 transition-colors"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-8 pb-24">
        <div className="max-w-3xl text-center">
          <div className="inline-block px-4 py-1.5 bg-white border border-nude-200 rounded-full text-xs text-nude-600 mb-8">
            ✦ A marketplace for the AI creative era
          </div>

          <h1 className="font-serif-display text-6xl md:text-7xl text-nude-900 leading-[1.05] mb-6">
            Where brands meet<br />
            <span className="italic">AI-native</span> creators.
          </h1>

          <p className="text-nude-600 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Discover verified creators using Midjourney, Runway, and Sora. Post briefs,
            review portfolios with full provenance, and ship campaigns in days — not weeks.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/signup?role=brand')}
              className="px-8 py-4 bg-nude-800 text-white rounded-full font-medium hover:bg-nude-900 transition-colors"
            >
              I'm a Brand
            </button>
            <button
              onClick={() => navigate('/signup?role=creator')}
              className="px-8 py-4 bg-white text-nude-800 border border-nude-300 rounded-full font-medium hover:border-nude-500 transition-colors"
            >
              I'm a Creator
            </button>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="border-t border-nude-200 py-6 px-8 text-center text-xs text-nude-500">
        Verified tool stacks · Provenance-backed portfolios · AI-assisted briefs
      </div>
    </div>
  );
}