import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isBrandVerified } from '../mockData';

export default function BrandCard({ brand }) {
  const navigate = useNavigate();
  const verified = isBrandVerified(brand.id);

  return (
    <div
      onClick={() => navigate(`/brand/${brand.id}`)}
      className="group bg-white rounded-2xl p-6 cursor-pointer border border-nude-200 hover:border-nude-400 hover:shadow-[0_8px_30px_rgba(139,111,92,0.08)] transition-all duration-300 fade-in"
    >
      <div className="flex items-start gap-4 mb-5">
        <img src={brand.avatar_url} alt={brand.name} className="w-14 h-14 rounded-full object-cover border-2 border-nude-200" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-serif-display text-xl text-nude-900 truncate">{brand.name}</h3>
            {verified && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />}
          </div>
          <p className="text-sm text-nude-500">@{brand.handle}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-nude-600">
            <span>★ {brand.rating}</span>
            <span className="text-nude-300">•</span>
            <span>{brand.location}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {brand.industry.slice(0, 3).map((tag, i) => (
          <span key={i} className="text-xs bg-nude-100 text-nude-700 px-2.5 py-1 rounded-full border border-nude-200">{tag}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-nude-100 text-xs text-nude-600">
        <span>{brand.campaigns_run} campaigns</span>
        <span className="text-nude-300">•</span>
        <span>{brand.creators_hired} creators</span>
      </div>
    </div>
  );
}