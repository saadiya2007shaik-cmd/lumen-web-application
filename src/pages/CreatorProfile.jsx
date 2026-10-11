import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WriteReview from '../components/WriteReview';
import PortfolioModal from '../components/PortfolioModal';
import { api } from '../api';

export default function CreatorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [creator, setCreator] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [saved, setSaved] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [openPortfolio, setOpenPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getCreator(id);
        if (res?.creator) {
          setCreator(res.creator);
          setReviews(res.reviews || []);
        } else if (res?.data?.creator) {
          setCreator(res.data.creator);
          setReviews(res.data.reviews || []);
        }
      } catch (_) {}
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-nude-100 flex items-center justify-center text-nude-500 text-sm">
        Loading…
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-nude-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-nude-600 mb-4">Creator not found.</p>
          <button onClick={() => navigate('/discover')} className="px-6 py-2.5 bg-nude-700 text-white rounded-full text-sm">
            Back to discover
          </button>
        </div>
      </div>
    );
  }

  const portfolio = creator.portfolio || [];
  const isBrandViewing = user && user.role === 'brand';

  const handleSave = () => {
    setSaved(s => !s);
  };

  const handleMessage = async () => {
    try {
      const res = await api.startConversation(creator.id);
      const convId = res?.conversation?.id || res?.data?.id;
      if (convId) navigate(`/inbox/${convId}`);
    } catch (_) {
      navigate('/inbox');
    }
  };

  return (
    <div className="min-h-screen bg-nude-100 pt-12 pb-20 px-8">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-3xl border border-nude-200 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img src={creator.avatar_url || `https://i.pravatar.cc/200?u=${creator.id}`} alt={creator.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-nude-100" />

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h1 className="font-serif-display text-4xl text-nude-900">{creator.name}</h1>
                {creator.identity_verified && (
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block self-center md:self-auto" />
                )}
              </div>

              <p className="text-nude-500 mb-3">@{creator.handle || 'unknown'}</p>
              {creator.bio && <p className="text-nude-800 leading-relaxed max-w-xl mb-4">{creator.bio}</p>}
              {creator.location && <p className="text-sm text-nude-600 mb-6">📍 {creator.location}</p>}

              <div className="flex justify-center md:justify-start gap-8 mb-6">
                <Stat label="Posts" value={portfolio.length} />
                <Stat label="Rating" value={`${creator.rating || 0} ★`} />
                <Stat label="Clients" value={0} />
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {isBrandViewing && (
                  <button onClick={handleMessage} className="px-8 py-3 bg-nude-800 text-white rounded-full font-medium hover:bg-nude-900 transition-colors">
                    Message
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className={`px-8 py-3 rounded-full font-medium transition-all border ${
                    saved
                      ? 'bg-nude-800 border-nude-800 text-white'
                      : 'bg-white border-nude-300 text-nude-800 hover:border-nude-500'
                  }`}
                >
                  {saved ? 'Saved ✓' : 'Save'}
                </button>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-nude-100">
            {creator.identity_verified && (
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200">
                ✓ Identity Verified
              </span>
            )}
            {(creator.verified_tools_list || []).map((tool, i) => (
              <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">
                ✓ Verified {tool} Creator
              </span>
            ))}
            {creator.verified_workflow && (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">
                ✓ Verified Workflow Log
              </span>
            )}
          </div>
        </div>

        {(creator.skills?.length > 0 || creator.specialization?.length > 0 || creator.tools?.length > 0) && (
          <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
            {creator.skills?.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                  {creator.skills.map((s, i) => (
                    <span key={i} className="text-sm bg-nude-100 text-nude-700 px-3 py-1.5 rounded-full border border-nude-200">{s}</span>
                  ))}
                </div>
              </Section>
            )}
            {creator.specialization?.length > 0 && (
              <Section title="Specializations">
                <div className="flex flex-wrap gap-2">
                  {creator.specialization.map((s, i) => (
                    <span key={i} className="text-sm bg-nude-200 text-nude-800 px-3 py-1.5 rounded-full">{s}</span>
                  ))}
                </div>
              </Section>
            )}
            {creator.tools?.length > 0 && (
              <Section title="Tool Stack" last>
                <div className="flex flex-wrap gap-2">
                  {creator.tools.map((t, i) => (
                    <span key={i} className="text-sm bg-white text-nude-700 px-3 py-1.5 rounded-full border border-nude-200">{t}</span>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}

        {portfolio.length > 0 && (
          <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
            <h3 className="font-serif-display text-2xl text-nude-900 mb-2">Portfolio</h3>
            <p className="text-xs text-nude-500 mb-6">Click any piece to see full AI provenance and workflow.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.map(item => (
                <button key={item.id} onClick={() => setOpenPortfolio(item)} className="group text-left">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-nude-200 bg-nude-100">
                    <img src={item.media_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="font-medium text-nude-900 mt-3">{item.title}</h4>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-nude-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif-display text-2xl text-nude-900">Reviews</h3>
            <button
              onClick={() => setShowReview(true)}
              className="px-4 py-2 bg-nude-100 hover:bg-nude-200 text-nude-800 rounded-full text-sm transition-colors"
            >
              + Write a review
            </button>
          </div>

          {reviews.length === 0 ? (
            <p className="text-nude-500 text-sm text-center py-8">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-5">
              {reviews.map(r => (
                <div key={r.id} className="border-b border-nude-100 last:border-0 pb-5 last:pb-0">
                  <p className="font-medium text-nude-900 text-sm">{r.author || 'Anonymous'}</p>
                  {r.rating > 0 && (
                    <p className="text-sm text-yellow-600 mb-1">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
                  )}
                  <p className="text-nude-700 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {showReview && (
        <WriteReview
          target={creator}
          targetType="creator"
          onClose={() => setShowReview(false)}
          onSubmit={async ({ rating, text, verify }) => {
            await api.createReview({
              target_type: 'creator',
              target_id: creator.id,
              rating,
              text,
              verified: verify,
            });
            const res = await api.getCreator(creator.id);
            if (res?.reviews) setReviews(res.reviews);
          }}
        />
      )}

      {openPortfolio && (
        <PortfolioModal
          item={openPortfolio}
          onClose={() => setOpenPortfolio(null)}
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

function Section({ title, children, last }) {
  return (
    <div className={last ? '' : 'mb-6'}>
      <h4 className="text-xs uppercase tracking-widest text-nude-500 mb-3">{title}</h4>
      {children}
    </div>
  );
}