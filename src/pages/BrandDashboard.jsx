import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockIncomingBriefs, mockPastCollaborations, mockCreators, mockBrands, isBrandVerified } from '../mockData';

export default function BrandDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const verified = isBrandVerified('b_1');
  const [savedCreators, setSavedCreators] = useState([]);
  const [savedBrands, setSavedBrands] = useState([]);
  const [myBriefs, setMyBriefs] = useState([]);

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('lumen_saved') || '[]');
    const creators = savedList
      .filter(k => k.startsWith('creator_'))
      .map(k => mockCreators.find(c => String(c.id) === k.replace('creator_', '')))
      .filter(Boolean);
    const brands = savedList
      .filter(k => k.startsWith('brand_'))
      .map(k => mockBrands.find(b => b.id === k.replace('brand_', '')))
      .filter(Boolean);
    setSavedCreators(creators);
    setSavedBrands(brands);

    // Load briefs posted by this user (stored in localStorage)
    const briefs = JSON.parse(localStorage.getItem('lumen_briefs') || '[]');
    setMyBriefs(briefs);
  }, []);

  return (
    <div className="min-h-screen bg-nude-100 pt-12 pb-20 px-8">
      <div className="max-w-6xl mx-auto">

        <div className="bg-white rounded-3xl border border-nude-200 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img src={user.avatar_url} alt={user.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-nude-100" />
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <h1 className="font-serif-display text-4xl text-nude-900">{user.company || user.name}</h1>
                {verified && <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />}
              </div>
              <p className="text-nude-500 mb-3">@{user.handle}</p>
              {user.bio && <p className="text-nude-800 leading-relaxed max-w-xl mb-4">{user.bio}</p>}
              {user.location && <p className="text-sm text-nude-600 mb-6">📍 {user.location}</p>}
              <div className="flex justify-center md:justify-start gap-8 mb-6">
                <Stat label="Campaigns" value={12} />
                <Stat label="Creators" value={8} />
                <Stat label="Rating" value="4.8 ★" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ActionCard title="Post a brief" description="Describe your campaign — AI drafts the details." cta="Create brief →" onClick={() => navigate('/brief')} />
          <ActionCard title="Browse creators" description="Filter by tool stack, specialization, format." cta="Discover →" onClick={() => navigate('/discover')} />
          <ActionCard title="Messages" description="Chat with creators you're interested in." cta="Open inbox →" onClick={() => navigate('/inbox')} />
        </div>

        {/* MY BRIEFS (from localStorage) */}
        {myBriefs.length > 0 && (
          <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
            <h3 className="font-serif-display text-2xl text-nude-900 mb-6">Your posted briefs</h3>
            <div className="space-y-4">
              {myBriefs.map(b => (
                <div key={b.id} className="border border-nude-200 rounded-2xl p-5 hover:border-nude-400 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-nude-900">{b.title || 'Untitled brief'}</h4>
                      <p className="text-xs text-nude-500 mt-1">
                        Posted {new Date(b.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  {b.goals && <p className="text-sm text-nude-700 mb-3">{b.goals}</p>}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {b.content_type && <span className="bg-nude-50 text-nude-600 px-2.5 py-1 rounded-full">{b.content_type}</span>}
                    {b.aspect_ratio && <span className="bg-nude-50 text-nude-600 px-2.5 py-1 rounded-full">{b.aspect_ratio}</span>}
                    {b.style && <span className="bg-nude-50 text-nude-600 px-2.5 py-1 rounded-full">{b.style}</span>}
                    {b.license_type && <span className="bg-nude-50 text-nude-600 px-2.5 py-1 rounded-full">{b.license_type}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {savedCreators.length > 0 && (
          <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
            <h3 className="font-serif-display text-2xl text-nude-900 mb-6">Saved creators</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedCreators.map(c => (
                <button key={c.id} onClick={() => navigate(`/creator/${c.id}`)} className="text-left bg-nude-50 border border-nude-200 hover:border-nude-500 rounded-2xl p-4 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={c.avatar_url} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-nude-200" />
                    <div className="min-w-0">
                      <p className="font-medium text-nude-900 truncate">{c.name}</p>
                      <p className="text-xs text-nude-500 truncate">@{c.handle}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.skills.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[10px] bg-white text-nude-700 px-2 py-0.5 rounded-full border border-nude-200">{s}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {savedBrands.length > 0 && (
          <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
            <h3 className="font-serif-display text-2xl text-nude-900 mb-6">Saved brands</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savedBrands.map(b => (
                <button key={b.id} onClick={() => navigate(`/brand/${b.id}`)} className="text-left bg-nude-50 border border-nude-200 hover:border-nude-500 rounded-2xl p-4 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={b.avatar_url} alt={b.name} className="w-12 h-12 rounded-full object-cover border border-nude-200" />
                    <div className="min-w-0">
                      <p className="font-medium text-nude-900 truncate">{b.name}</p>
                      <p className="text-xs text-nude-500 truncate">@{b.handle}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {b.industry.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-[10px] bg-white text-nude-700 px-2 py-0.5 rounded-full border border-nude-200">{s}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
          <h3 className="font-serif-display text-2xl text-nude-900 mb-6">Active briefs</h3>
          <div className="space-y-4">
            {mockIncomingBriefs.map(b => (
              <div key={b.id} className="border border-nude-200 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-nude-900">{b.title}</h4>
                  <p className="text-sm text-nude-500 mt-1">{b.content_type} · {b.aspect_ratio} · Deadline {b.deadline}</p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">{b.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-nude-200 p-8">
          <h3 className="font-serif-display text-2xl text-nude-900 mb-6">Creators you've worked with</h3>
          <div className="space-y-4">
            {mockPastCollaborations.map(c => (
              <div key={c.creatorId} className="border border-nude-200 rounded-2xl p-5 flex items-center gap-4">
                <img src={c.avatar_url} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-nude-200" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-nude-900">{c.name}</h4>
                  <p className="text-xs text-nude-500">@{c.handle} · {c.project}</p>
                </div>
                <button onClick={() => navigate(`/creator/${c.creatorId}`)} className="px-4 py-2 bg-nude-100 hover:bg-nude-200 text-nude-800 rounded-full text-xs transition-colors">View</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center md:text-left">
      <p className="font-serif-display text-2xl text-nude-900">{value}</p>
      <p className="text-xs text-nude-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function ActionCard({ title, description, cta, onClick }) {
  return (
    <button onClick={onClick} className="text-left bg-white rounded-3xl border border-nude-200 p-6 hover:border-nude-500 transition-all">
      <h3 className="font-serif-display text-xl text-nude-900 mb-2">{title}</h3>
      <p className="text-sm text-nude-600 mb-4 leading-relaxed">{description}</p>
      <span className="text-sm text-nude-800 font-medium">{cta}</span>
    </button>
  );
}