import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WriteReview from '../components/WriteReview';
import PortfolioModal from '../components/PortfolioModal';
import {
  mockCreators,
  mockMessages,
  mockReviews,
  mockWorkedWith,
  isCreatorVerified,
} from '../mockData';

export default function CreatorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [creator, setCreator] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [verified, setVerified] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openPortfolio, setOpenPortfolio] = useState(null);

  const loadReviews = (found) => {
    const stored = localStorage.getItem('lumen_reviews');
    const allReviews = stored ? JSON.parse(stored) : mockReviews;
    const key = `creator_${found.id}`;
    setReviews(allReviews[key] || []);
    const verifiedCount = (allReviews[key] || []).filter(r => r.verified).length;
    setVerified(verifiedCount >= 2);
  };

  useEffect(() => {
    const found = mockCreators.find(c => String(c.id) === String(id));
    setCreator(found || null);
    if (found) {
      loadReviews(found);
      const savedList = JSON.parse(localStorage.getItem('lumen_saved') || '[]');
      setSaved(savedList.includes(`creator_${found.id}`));
    }
    // eslint-disable-next-line
  }, [id]);

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

  const workedWith = mockWorkedWith[creator.id] || [];
  const isBrandViewing = user && user.role === 'brand' && user.id !== creator.id;

  const handleSave = () => {
    const key = `creator_${creator.id}`;
    const list = JSON.parse(localStorage.getItem('lumen_saved') || '[]');
    let updated;
    if (list.includes(key)) {
      updated = list.filter(k => k !== key);
      setSaved(false);
    } else {
      updated = [...list, key];
      setSaved(true);
    }
    localStorage.setItem('lumen_saved', JSON.stringify(updated));
  };

  const handleMessage = () => {
    const creatorUserId = `u_${creator.id}`;
    const stored = JSON.parse(localStorage.getItem('lumen_conversations') || '[]');
    const existing = stored.find(c =>
      c.participants.includes(user.id) && c.participants.includes(creatorUserId)
    );
    if (existing) return navigate(`/inbox/${existing.conversationId}`);

    const newConv = {
      conversationId: `conv_${Date.now()}`,
      participants: [user.id, creatorUserId],
      messages: [{
        id: `m_${Date.now()}`,
        from: user.id,
        text: `Hi ${creator.name.split(' ')[0]}! I loved your work — can we talk?`,
        at: new Date().toISOString(),
      }],
    };
    localStorage.setItem('lumen_conversations', JSON.stringify([...stored, newConv]));
    navigate(`/inbox/${newConv.conversationId}`);
  };

  const handleSubmitReview = async ({ rating, text, verify }) => {
    const stored = localStorage.getItem('lumen_reviews');
    const allReviews = stored ? JSON.parse(stored) : { ...mockReviews };
    const key = `creator_${creator.id}`;
    if (!allReviews[key]) allReviews[key] = [];

    const newReview = {
      id: `r_${Date.now()}`,
      author: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar_url,
      rating,
      text,
      at: new Date().toISOString(),
      verified: verify,
    };

    allReviews[key] = [...allReviews[key], newReview];
    localStorage.setItem('lumen_reviews', JSON.stringify(allReviews));
    loadReviews(creator);
  };

  return (
    <div className="min-h-screen bg-nude-100 pt-12 pb-20 px-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-3xl border border-nude-200 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img src={creator.avatar_url} alt={creator.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-nude-100" />

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h1 className="font-serif-display text-4xl text-nude-900">{creator.name}</h1>
                {verified && <span className="w-3 h-3 rounded-full bg-blue-500 inline-block self-center md:self-auto" />}
              </div>

              <p className="text-nude-500 mb-3">@{creator.handle}</p>
              <p className="text-nude-800 leading-relaxed max-w-xl mb-4">{creator.bio}</p>
              <p className="text-sm text-nude-600 mb-6">📍 {creator.location}</p>

              <div className="flex justify-center md:justify-start gap-8 mb-6">
                <Stat label="Posts" value={creator.portfolio.length} />
                <Stat label="Rating" value={`${creator.rating} ★`} />
                <Stat label="Clients" value={workedWith.length} />
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

          {/* VERIFICATION BADGES */}
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

        {/* SKILLS + TOOLS */}
        <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {creator.skills.map((s, i) => (
                <span key={i} className="text-sm bg-nude-100 text-nude-700 px-3 py-1.5 rounded-full border border-nude-200">{s}</span>
              ))}
            </div>
          </Section>
          <Section title="Specializations">
            <div className="flex flex-wrap gap-2">
              {creator.specialization.map((s, i) => (
                <span key={i} className="text-sm bg-nude-200 text-nude-800 px-3 py-1.5 rounded-full">{s}</span>
              ))}
            </div>
          </Section>
          {creator.styles && creator.styles.length > 0 && (
            <Section title="Visual Styles">
              <div className="flex flex-wrap gap-2">
                {creator.styles.map((s, i) => (
                  <span key={i} className="text-sm bg-nude-100 text-nude-700 px-3 py-1.5 rounded-full border border-nude-200">{s}</span>
                ))}
              </div>
            </Section>
          )}
          <Section title="Tool Stack" last>
            <div className="flex flex-wrap gap-2">
              {creator.tools.map((t, i) => (
                <span key={i} className="text-sm bg-white text-nude-700 px-3 py-1.5 rounded-full border border-nude-200">{t}</span>
              ))}
            </div>
          </Section>
        </div>

        {/* PORTFOLIO */}
        {creator.portfolio.length > 0 && (
          <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
            <h3 className="font-serif-display text-2xl text-nude-900 mb-2">Portfolio</h3>
            <p className="text-xs text-nude-500 mb-6">Click any piece to see full AI provenance and workflow.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creator.portfolio.map(item => (
                <button key={item.id} onClick={() => setOpenPortfolio(item)} className="group text-left">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-nude-200 bg-nude-100">
                    <img src={item.media_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs px-2 py-1 rounded-full text-nude-700">
                      {item.aspect_ratio}
                    </div>
                    <div className="absolute inset-0 bg-nude-900/0 group-hover:bg-nude-900/40 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium bg-nude-900/70 px-3 py-1.5 rounded-full transition-opacity">
                        View provenance
                      </span>
                    </div>
                  </div>
                  <h4 className="font-medium text-nude-900 mt-3">{item.title}</h4>
                  <p className="text-xs text-nude-500 mt-1 line-clamp-2">{item.workflow_description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* WORKED WITH */}
        {workedWith.length > 0 && (
          <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
            <h3 className="font-serif-display text-2xl text-nude-900 mb-6">Worked with</h3>
            <div className="flex flex-wrap gap-3">
              {workedWith.map((brand, i) => (
                <div key={i} className="flex items-center gap-2 bg-nude-50 border border-nude-200 px-4 py-2.5 rounded-full">
                  <div className="w-5 h-5 rounded-full bg-nude-400 flex items-center justify-center text-[10px] text-white font-serif">
                    {brand.name.charAt(0)}
                  </div>
                  <span className="text-sm text-nude-800">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REVIEWS */}
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
                  <div className="flex items-center gap-3 mb-2">
                    <img src={r.authorAvatar} alt={r.author} className="w-9 h-9 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-nude-900 text-sm flex items-center gap-2">
                        {r.author}
                        {r.verified && <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />}
                      </p>
                      <p className="text-xs text-nude-400 capitalize">{r.authorRole}</p>
                    </div>
                    <p className="text-xs text-nude-400">
                      {new Date(r.at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
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
          onSubmit={handleSubmitReview}
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