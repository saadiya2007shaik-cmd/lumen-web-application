import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import VerificationModal from '../components/VerificationModal';
import { mockIncomingBriefs, mockBrands, mockCreators, isCreatorVerified } from '../mockData';

export default function CreatorDashboard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user);
  const [uploading, setUploading] = useState(false);
  const [savedBrands, setSavedBrands] = useState([]);
  const [savedCreators, setSavedCreators] = useState([]);
  const [showVerify, setShowVerify] = useState(false);
  const fileRef = useRef(null);
  const verified = isCreatorVerified(1);

  useEffect(() => {
    const load = () => {
      const savedList = JSON.parse(localStorage.getItem('lumen_saved') || '[]');
      const brands = savedList
        .filter(k => k.startsWith('brand_'))
        .map(k => mockBrands.find(b => b.id === k.replace('brand_', '')))
        .filter(Boolean);
      const creators = savedList
        .filter(k => k.startsWith('creator_'))
        .map(k => {
          const id = k.replace('creator_', '');
          return mockCreators.find(c => String(c.id) === id);
        })
        .filter(Boolean);
      setSavedBrands(brands);
      setSavedCreators(creators);
    };
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, []);

  const startEdit = () => { setDraft(user); setEditing(true); };
  const saveEdit = () => { updateUser(draft); setEditing(false); };
  const update = (k, v) => setDraft(p => ({ ...p, [k]: v }));

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const newItem = {
        id: Date.now(),
        title: file.name.replace(/\.[^.]+$/, '') || 'Untitled',
        media_url: reader.result,
        aspect_ratio: '1:1',
        base_models: [],
        loras_used: [],
        workflow_description: 'Add workflow details later.',
      };
      updateUser({ portfolio: [...(user.portfolio || []), newItem] });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const removePortfolioItem = (id) => {
    updateUser({ portfolio: (user.portfolio || []).filter(p => p.id !== id) });
  };

  const handleMessageBrand = (brandName) => {
    const brand = mockBrands.find(b => b.name === brandName);
    if (!brand) return;
    const stored = JSON.parse(localStorage.getItem('lumen_conversations') || '[]');
    const existing = stored.find(c =>
      c.participants.includes(user.id) && c.participants.includes(brand.id)
    );
    if (existing) return navigate(`/inbox/${existing.conversationId}`);

    const newConv = {
      conversationId: `conv_${Date.now()}`,
      participants: [user.id, brand.id],
      messages: [{
        id: `m_${Date.now()}`,
        from: user.id,
        text: `Hi ${brand.name}! I saw your brief and would love to work on it.`,
        at: new Date().toISOString(),
      }],
    };
    localStorage.setItem('lumen_conversations', JSON.stringify([...stored, newConv]));
    navigate(`/inbox/${newConv.conversationId}`);
  };

  return (
    <div className="min-h-screen bg-nude-100 pt-12 pb-20 px-8">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-3xl border border-nude-200 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img src={editing ? draft.avatar_url : user.avatar_url} alt={user.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-nude-100" />

            <div className="flex-1 text-center md:text-left">
              {editing ? (
                <div className="space-y-4 text-left">
                  <Input label="Name" value={draft.name} onChange={(v) => update('name', v)} />
                  <Input label="Handle" value={draft.handle} onChange={(v) => update('handle', v)} />
                  <Input label="Avatar URL" value={draft.avatar_url} onChange={(v) => update('avatar_url', v)} />
                  <Input label="Location" value={draft.location} onChange={(v) => update('location', v)} />
                  <Textarea label="Bio" value={draft.bio} onChange={(v) => update('bio', v)} />
                  <TagInput label="Skills" values={draft.skills || []} onChange={(v) => update('skills', v)} placeholder="e.g., Prompt Engineering" />
                  <TagInput label="Tools" values={draft.tools || []} onChange={(v) => update('tools', v)} placeholder="e.g., Midjourney" />
                  <TagInput label="Specializations" values={draft.specialization || []} onChange={(v) => update('specialization', v)} placeholder="e.g., Commercials" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    <h1 className="font-serif-display text-4xl text-nude-900">{user.name}</h1>
                    {verified && <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />}
                  </div>
                  <p className="text-nude-500 mb-3">@{user.handle}</p>
                  {user.bio && <p className="text-nude-800 leading-relaxed max-w-xl mb-4">{user.bio}</p>}
                  {user.location && <p className="text-sm text-nude-600 mb-6">📍 {user.location}</p>}

                  <div className="flex justify-center md:justify-start gap-8 mb-6">
                    <Stat label="Posts" value={(user.portfolio || []).length} />
                    <Stat label="Clients" value={3} />
                    <Stat label="Rating" value="4.9 ★" />
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {(user.skills || []).map((s, i) => (
                      <span key={i} className="text-xs bg-nude-100 text-nude-700 px-3 py-1.5 rounded-full border border-nude-200">{s}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-nude-100 flex justify-end gap-2 flex-wrap">
            {!editing ? (
              <>
                {!user.identity_verified && (
                  <button onClick={() => setShowVerify(true)} className="px-5 py-2.5 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700 transition-colors">
                    ✨ Get Verified
                  </button>
                )}
                <button onClick={startEdit} className="px-5 py-2.5 bg-nude-700 text-white rounded-full text-sm hover:bg-nude-800 transition-colors">
                  Edit profile
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(false)} className="px-5 py-2.5 bg-white border border-nude-300 text-nude-800 rounded-full text-sm hover:border-nude-500 transition-colors">
                  Cancel
                </button>
                <button onClick={saveEdit} className="px-5 py-2.5 bg-nude-800 text-white rounded-full text-sm hover:bg-nude-900 transition-colors">
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* PORTFOLIO */}
        <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif-display text-2xl text-nude-900">Portfolio</h3>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="px-4 py-2 bg-nude-100 hover:bg-nude-200 text-nude-800 rounded-full text-sm transition-colors disabled:opacity-50">
              {uploading ? 'Uploading…' : '+ Add piece'}
            </button>
          </div>

          {(!user.portfolio || user.portfolio.length === 0) ? (
            <div className="text-center py-12 text-nude-500 text-sm">
              No portfolio pieces yet. Click <span className="text-nude-800">"+ Add piece"</span> to upload.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {user.portfolio.map(item => (
                <div key={item.id} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-2xl border border-nude-200 bg-nude-100">
                    <img src={item.media_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-sm text-nude-800 truncate">{item.title}</p>
                    <button onClick={() => removePortfolioItem(item.id)} className="text-xs text-red-500 hover:underline shrink-0 ml-2">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SAVED CREATORS */}
        <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
          <h3 className="font-serif-display text-2xl text-nude-900 mb-6">Saved creators</h3>
          {savedCreators.length === 0 ? (
            <div className="text-center py-8 text-nude-500 text-sm">
              No saved creators yet. Browse <button onClick={() => navigate('/discover')} className="text-nude-800 underline">Discover → Creators</button> and tap Save.
            </div>
          ) : (
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
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SAVED BRANDS */}
        <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
          <h3 className="font-serif-display text-2xl text-nude-900 mb-6">Saved brands</h3>
          {savedBrands.length === 0 ? (
            <div className="text-center py-8 text-nude-500 text-sm">
              No saved brands yet. Browse <button onClick={() => navigate('/discover')} className="text-nude-800 underline">Discover → Brands</button> and tap Save.
            </div>
          ) : (
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
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INCOMING BRIEFS */}
        <div className="bg-white rounded-3xl border border-nude-200 p-8">
          <h3 className="font-serif-display text-2xl text-nude-900 mb-6">Incoming briefs</h3>
          <div className="space-y-4">
            {mockIncomingBriefs.map(b => (
              <div key={b.id} className="border border-nude-200 rounded-2xl p-5 hover:border-nude-400 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-nude-900">{b.title}</h4>
                    <p className="text-sm text-nude-500">{b.brand}</p>
                  </div>
                  <span className="text-xs bg-nude-100 text-nude-700 px-2.5 py-1 rounded-full">{b.budget}</span>
                </div>
                <p className="text-sm text-nude-700 mb-3">{b.goals}</p>
                <button onClick={() => handleMessageBrand(b.brand)} className="px-4 py-2 bg-nude-800 text-white rounded-full text-xs hover:bg-nude-900 transition-colors">
                  Message brand
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showVerify && (
        <VerificationModal
          user={user}
          onClose={() => setShowVerify(false)}
          onVerified={() => updateUser({ identity_verified: true })}
        />
      )}
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

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-nude-500 mb-1.5">{label}</label>
      <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 bg-nude-50 border border-nude-200 rounded-xl text-sm text-nude-800 focus:outline-none focus:border-nude-500" />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-nude-500 mb-1.5">{label}</label>
      <textarea rows={3} value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 bg-nude-50 border border-nude-200 rounded-xl text-sm text-nude-800 focus:outline-none focus:border-nude-500 resize-none" />
    </div>
  );
}

function TagInput({ label, values, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) onChange([...values, trimmed]);
    setInput('');
  };
  const remove = (v) => onChange(values.filter(x => x !== v));

  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-nude-500 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {values.map((v, i) => (
          <span key={i} className="text-xs bg-nude-100 text-nude-700 px-3 py-1.5 rounded-full border border-nude-200 flex items-center gap-1.5">
            {v}
            <button onClick={() => remove(v)} className="text-nude-500 hover:text-red-500">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 px-4 py-2.5 bg-nude-50 border border-nude-200 rounded-xl text-sm text-nude-800 focus:outline-none focus:border-nude-500"
        />
        <button onClick={add} type="button" className="px-4 py-2.5 bg-nude-100 hover:bg-nude-200 text-nude-800 rounded-xl text-sm transition-colors">Add</button>
      </div>
    </div>
  );
}