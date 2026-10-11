import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WriteReview from '../components/WriteReview';
import { mockBrands, mockReviews } from '../mockData';

export default function BrandProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [brand, setBrand] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [verified, setVerified] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadReviews = (found) => {
    const stored = localStorage.getItem('lumen_reviews');
    const allReviews = stored ? JSON.parse(stored) : mockReviews;
    const key = `brand_${found.id}`;
    const list = allReviews[key] || [];
    setReviews(list);
    const verifiedCount = list.filter(r => r.verified).length;
    setVerified(verifiedCount >= 2);
  };

  useEffect(() => {
    const found = mockBrands.find(b => b.id === id);
    setBrand(found || null);
    if (found) {
      loadReviews(found);
      const savedList = JSON.parse(localStorage.getItem('lumen_saved') || '[]');
      setSaved(savedList.includes(`brand_${found.id}`));
    }
    // eslint-disable-next-line
  }, [id]);

  if (!brand) {
    return (
      <div className="min-h-screen bg-nude-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-nude-600 mb-4">Brand not found.</p>
          <button onClick={() => navigate('/discover')} className="px-6 py-2.5 bg-nude-700 text-white rounded-full text-sm">
            Back to discover
          </button>
        </div>
      </div>
    );
  }

  const isCreatorViewing = user && user.role === 'creator';

  const handleSave = () => {
    const key = `brand_${brand.id}`;
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
        text: `Hi ${brand.name}! I loved your work — can we talk?`,
        at: new Date().toISOString(),
      }],
    };
    localStorage.setItem('lumen_conversations', JSON.stringify([...stored, newConv]));
    navigate(`/inbox/${newConv.conversationId}`);
  };

  const handleSubmitReview = async ({ rating, text, verify }) => {
    const stored = localStorage.getItem('lumen_reviews');
    const allReviews = stored ? JSON.parse(stored) : { ...mockReviews };
    const key = `brand_${brand.id}`;
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
    loadReviews(brand);
  };

  return (
    <div className="min-h-screen bg-nude-100 pt-12 pb-20 px-8">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-3xl border border-nude-200 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img src={brand.avatar_url} alt={brand.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-nude-100" />

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <h1 className="font-serif-display text-4xl text-nude-900">{brand.name}</h1>
                {verified && <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />}
              </div>
              <p className="text-nude-500 mb-3">@{brand.handle}</p>
              <p className="text-nude-800 leading-relaxed max-w-xl mb-4">{brand.bio}</p>
              <p className="text-sm text-nude-600 mb-6">📍 {brand.location}</p>

              <div className="flex justify-center md:justify-start gap-8 mb-6">
                <Stat label="Campaigns" value={brand.campaigns_run} />
                <Stat label="Rating" value={`${brand.rating} ★`} />
                <Stat label="Creators" value={brand.creators_hired} />
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {isCreatorViewing && (
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
        </div>

        {/* INDUSTRY */}
        <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
          <h4 className="text-xs uppercase tracking-widest text-nude-500 mb-3">Industry</h4>
          <div className="flex flex-wrap gap-2">
            {brand.industry.map((s, i) => (
              <span key={i} className="text-sm bg-nude-100 text-nude-700 px-3 py-1.5 rounded-full border border-nude-200">{s}</span>
            ))}
          </div>
        </div>

        {/* PAST CAMPAIGNS */}
        {brand.past_campaigns.length > 0 && (
          <div className="bg-white rounded-3xl border border-nude-200 p-8 mb-8">
            <h3 className="font-serif-display text-2xl text-nude-900 mb-6">Past Campaigns</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {brand.past_campaigns.map(item => (
                <div key={item.id}>
                  <div className="aspect-square overflow-hidden rounded-2xl border border-nude-200 bg-nude-100">
                    <img src={item.media_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-medium text-nude-900 mt-3">{item.title}</h4>
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
          target={brand}
          targetType="brand"
          onClose={() => setShowReview(false)}
          onSubmit={handleSubmitReview}
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