import React, { useState, useEffect } from 'react';
import CreatorCard from './CreatorCard';
import BrandCard from './components/BrandCard';
import { api } from './api';
import { mockBrands, FILTER_OPTIONS } from './mockData';

export default function DiscoveryDashboard() {
  const [tab, setTab] = useState('creators');
  const [creators, setCreators] = useState([]);
  const [brands, setBrands] = useState(mockBrands);
  const [loading, setLoading] = useState(true);

  const [creatorFilters, setCreatorFilters] = useState({
    tool_stack: '',
    specialization: '',
    content_type: '',
    format: '',
    style: '',
  });

  const [brandFilters, setBrandFilters] = useState({ industry: '' });

  useEffect(() => {
    if (tab !== 'creators') return;
    const fetch = async () => {
      setLoading(true);
      const res = await api.getCreators(creatorFilters);
      setCreators(res.data);
      setLoading(false);
    };
    fetch();
  }, [creatorFilters, tab]);

  const updateCreatorFilter = (k, v) => setCreatorFilters(p => ({ ...p, [k]: v }));
  const updateBrandFilter = (k, v) => setBrandFilters(p => ({ ...p, [k]: v }));

  const clearCreatorFilters = () => setCreatorFilters({ tool_stack: '', specialization: '', content_type: '', format: '', style: '' });
  const clearBrandFilters = () => setBrandFilters({ industry: '' });

  const activeCreatorFilters = Object.values(creatorFilters).filter(Boolean).length;
  const activeBrandFilters = Object.values(brandFilters).filter(Boolean).length;

  const filteredBrands = brands.filter(b => {
    if (brandFilters.industry && !b.industry.some(i => i.toLowerCase().includes(brandFilters.industry.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-nude-100">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="font-serif-display text-5xl md:text-6xl text-nude-900 leading-tight">Discover creative minds</h1>
          <p className="text-nude-600 mt-3 text-lg max-w-2xl">A curated network of AI-native creators and bold brands.</p>
        </div>

        <div className="inline-flex items-center gap-1 bg-white rounded-full p-1 border border-nude-200 mb-10">
          <button
            onClick={() => setTab('creators')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === 'creators' ? 'bg-nude-600 text-white shadow-sm' : 'text-nude-700 hover:text-nude-900'
            }`}
          >
            Creators ({creators.length})
          </button>
          <button
            onClick={() => setTab('brands')}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
              tab === 'brands' ? 'bg-nude-600 text-white shadow-sm' : 'text-nude-700 hover:text-nude-900'
            }`}
          >
            Brands ({brands.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white rounded-2xl p-6 border border-nude-200 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif-display text-2xl text-nude-900">Filters</h2>
                {tab === 'creators' && activeCreatorFilters > 0 && (
                  <button onClick={clearCreatorFilters} className="text-xs text-nude-500 hover:text-nude-800 underline">Clear ({activeCreatorFilters})</button>
                )}
                {tab === 'brands' && activeBrandFilters > 0 && (
                  <button onClick={clearBrandFilters} className="text-xs text-nude-500 hover:text-nude-800 underline">Clear ({activeBrandFilters})</button>
                )}
              </div>

              {tab === 'creators' && (
                <>
                  <FilterGroup label="Tool Stack">
                    <Select value={creatorFilters.tool_stack} onChange={(v) => updateCreatorFilter('tool_stack', v)} options={FILTER_OPTIONS.tool_stack} placeholder="All tools" />
                  </FilterGroup>
                  <FilterGroup label="Specialization">
                    <Select value={creatorFilters.specialization} onChange={(v) => updateCreatorFilter('specialization', v)} options={FILTER_OPTIONS.specialization} placeholder="All specializations" />
                  </FilterGroup>
                  <FilterGroup label="Content Type">
                    <Select value={creatorFilters.content_type} onChange={(v) => updateCreatorFilter('content_type', v)} options={FILTER_OPTIONS.content_type} placeholder="All content types" />
                  </FilterGroup>
                  <FilterGroup label="Format & Aspect Ratio">
                    <Select value={creatorFilters.format} onChange={(v) => updateCreatorFilter('format', v)} options={FILTER_OPTIONS.format} placeholder="All formats" />
                  </FilterGroup>
                  <FilterGroup label="Visual Style">
                    <Select value={creatorFilters.style} onChange={(v) => updateCreatorFilter('style', v)} options={FILTER_OPTIONS.style} placeholder="All styles" />
                  </FilterGroup>
                </>
              )}

              {tab === 'brands' && (
                <FilterGroup label="Industry">
                  <Select value={brandFilters.industry} onChange={(v) => updateBrandFilter('industry', v)} options={['Sportswear', 'Beauty', 'Skincare', 'Food Delivery', 'Entertainment', 'Film', 'Streaming', 'Consumer Tech', 'Athletics', 'Global Brand']} placeholder="All industries" />
                </FilterGroup>
              )}
            </div>
          </aside>

          <main>
            {tab === 'creators' && (
              loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-6 border border-nude-200 animate-pulse h-48" />
                  ))}
                </div>
              ) : creators.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-nude-200 fade-in">
                  <h3 className="font-serif-display text-2xl text-nude-900">No exact matches found for all filters.</h3>
                  <p className="text-nude-600 mt-2">Here are creators skilled in similar tools — try clearing one filter.</p>
                  <button onClick={clearCreatorFilters} className="mt-6 px-6 py-2.5 bg-nude-600 text-white rounded-full text-sm">Clear all filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {creators.map(c => <CreatorCard key={c.id} creator={c} />)}
                </div>
              )
            )}

            {tab === 'brands' && (
              filteredBrands.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-nude-200">
                  <h3 className="font-serif-display text-2xl text-nude-900">No brands match this filter.</h3>
                  <button onClick={clearBrandFilters} className="mt-6 px-6 py-2.5 bg-nude-600 text-white rounded-full text-sm">Clear filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredBrands.map(b => <BrandCard key={b.id} brand={b} />)}
                </div>
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div className="mb-5">
      <label className="text-xs uppercase tracking-widest text-nude-500 mb-2 block">{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 bg-nude-50 border border-nude-200 rounded-xl text-sm text-nude-800 focus:outline-none focus:border-nude-500">
      <option value="">{placeholder}</option>
      {options.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
    </select>
  );
}