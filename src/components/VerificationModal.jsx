import React, { useState, useEffect } from 'react';

const STEPS = [
  'Analyzing portfolio provenance…',
  'Cross-checking prompt strings…',
  'Validating tool signatures…',
  'Reviewing workflow logs…',
  'Computing trust score…',
];

export default function VerificationModal({ user, onClose, onVerified }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (step < STEPS.length) {
      const t = setTimeout(() => setStep(s => s + 1), 700);
      return () => clearTimeout(t);
    }
    const score = computeScore(user);
    const verified = score.total >= 70;
    setResult({ score, verified });
    setDone(true);
    if (verified) onVerified();
    // eslint-disable-next-line
  }, [step]);

  return (
    <div className="fixed inset-0 bg-nude-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={done ? onClose : undefined}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl max-w-md w-full p-8 scale-in border border-nude-200 shadow-2xl">
        {!done ? (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-nude-300 to-nude-500 flex items-center justify-center mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h2 className="font-serif-display text-2xl text-nude-900 mb-2">AI Verification</h2>
              <p className="text-sm text-nude-500">Scanning your profile</p>
            </div>
            <div className="space-y-3 mb-6">
              {STEPS.map((label, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    i < step ? 'bg-emerald-500 text-white' :
                    i === step ? 'bg-nude-400 text-white animate-pulse' :
                    'bg-nude-100 text-nude-400'
                  }`}>
                    {i < step ? '✓' : i === step ? '⟳' : '○'}
                  </span>
                  <span className={i <= step ? 'text-nude-800' : 'text-nude-400'}>{label}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-1.5 bg-nude-100 rounded-full overflow-hidden">
              <div className="h-full bg-nude-700 transition-all duration-500" style={{ width: `${(step / STEPS.length) * 100}%` }} />
            </div>
          </>
        ) : result.verified ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <span className="text-3xl text-emerald-600">✓</span>
              </div>
              <h2 className="font-serif-display text-2xl text-nude-900 mb-2">Verified!</h2>
              <p className="text-sm text-nude-500">AI confidence: {result.score.total}%</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
              <p className="text-xs uppercase tracking-widest text-emerald-700 mb-2">Checks Passed</p>
              <ul className="space-y-1.5 text-sm text-emerald-800">
                {result.score.passed.map((p, i) => (
                  <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{p}</li>
                ))}
              </ul>
            </div>
            <div className="text-center text-sm text-nude-700 mb-6">
              Your <span className="font-medium">Identity Verified</span> badge is now live.
            </div>
            <button onClick={onClose} className="w-full py-3 bg-nude-800 text-white rounded-full font-medium hover:bg-nude-900 transition-colors">Done</button>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <span className="text-3xl text-yellow-600">⚠</span>
              </div>
              <h2 className="font-serif-display text-2xl text-nude-900 mb-2">Incomplete</h2>
              <p className="text-sm text-nude-500">AI confidence: {result.score.total}% (need 70%)</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
              <p className="text-xs uppercase tracking-widest text-yellow-700 mb-2">To get verified</p>
              <ul className="space-y-1.5 text-sm text-yellow-800">
                {result.score.missing.map((m, i) => (
                  <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />{m}</li>
                ))}
              </ul>
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-3 bg-white border border-nude-300 text-nude-800 rounded-full font-medium">Close</button>
              <button onClick={() => { setStep(0); setDone(false); setResult(null); }} className="flex-1 py-3 bg-nude-800 text-white rounded-full font-medium hover:bg-nude-900">Retry</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function computeScore(user) {
  let total = 0;
  const passed = [];
  const missing = [];
  const portfolio = user.portfolio || [];

  if (portfolio.length >= 2) { total += 30; passed.push(`Portfolio: ${portfolio.length} pieces`); }
  else if (portfolio.length === 1) { total += 15; missing.push('Add 1 more portfolio piece'); }
  else { missing.push('Add at least 2 portfolio pieces'); }

  const hasBaseModels = portfolio.some(p => p.base_models?.length > 0);
  if (hasBaseModels) { total += 20; passed.push('Base models present'); }
  else { missing.push('Include base model names (e.g., Flux.1)'); }

  const hasPrompts = portfolio.some(p => p.prompt_string);
  if (hasPrompts) { total += 20; passed.push('Prompt strings present'); }
  else { missing.push('Include prompt strings for your work'); }

  const hasSteps = portfolio.some(p => p.node_steps?.length > 0);
  if (hasSteps) { total += 20; passed.push('Workflow logs detailed'); }
  else { missing.push('Describe node-by-node workflow'); }

  if ((user.bio || '').length >= 50) { total += 10; passed.push('Bio complete'); }
  else { missing.push('Write a bio (50+ chars)'); }

  return { total, passed, missing };
}