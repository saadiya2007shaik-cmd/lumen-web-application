import React, { useState } from 'react';

export default function WriteReview({ target, targetType, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [verify, setVerify] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    await onSubmit({ rating, text: text.trim(), verify });
    setSubmitting(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-nude-900/40 backdrop-blur-sm flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-8 scale-in border border-nude-200 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif-display text-2xl text-nude-900">
              Write a review
            </h2>
            <p className="text-sm text-nude-500 mt-1">
              for <span className="text-nude-800 font-medium">{target.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-nude-100 hover:bg-nude-200 flex items-center justify-center text-nude-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Star rating */}
        <div className="mb-6">
          <label className="text-xs uppercase tracking-widest text-nude-500 mb-2 block">
            Your rating (optional)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setRating(rating === n ? 0 : n)}
                className={`text-3xl transition-colors ${
                  n <= rating ? 'text-yellow-500' : 'text-nude-300 hover:text-yellow-400'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Text */}
        <div className="mb-6">
          <label className="text-xs uppercase tracking-widest text-nude-500 mb-2 block">
            Your review
          </label>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Share your thoughts about ${target.name}…`}
            className="w-full px-4 py-3 bg-nude-50 border border-nude-200 rounded-xl text-sm text-nude-800 focus:outline-none focus:border-nude-500 resize-none"
          />
        </div>

        {/* Verify checkbox */}
        <div className="mb-6 p-4 bg-nude-50 border border-nude-200 rounded-xl">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={verify}
              onChange={(e) => setVerify(e.target.checked)}
              className="mt-1 w-4 h-4 accent-nude-700"
            />
            <div>
              <p className="text-sm font-medium text-nude-900 flex items-center gap-2">
                Verify this {targetType === 'creator' ? 'creator' : 'brand'}
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              </p>
              <p className="text-xs text-nude-500 mt-1">
                Checking this publicly verifies you've worked with them. Adds a blue badge after 2 verifications.
              </p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-nude-300 text-nude-800 rounded-full text-sm hover:border-nude-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
            className="px-6 py-2.5 bg-nude-800 text-white rounded-full text-sm font-medium hover:bg-nude-900 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Submitting…' : 'Submit review'}
          </button>
        </div>
      </div>
    </div>
  );
}