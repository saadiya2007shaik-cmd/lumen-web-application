import React from 'react';

export default function PortfolioModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-nude-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scale-in border border-nude-200 shadow-2xl"
      >
        <div className="relative bg-nude-100">
          <img src={item.media_url} alt={item.title} className="w-full max-h-[50vh] object-cover" />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs px-3 py-1.5 rounded-full text-nude-700">
            {item.aspect_ratio}
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-nude-600 hover:bg-white transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-8">
          <h2 className="font-serif-display text-3xl text-nude-900 mb-2">{item.title}</h2>
          <p className="text-xs uppercase tracking-widest text-nude-500 mb-6">AI Provenance & Workflow</p>

          <Section title="Base Models">
            <div className="flex flex-wrap gap-2">
              {item.base_models?.map((m, i) => (
                <span key={i} className="text-sm bg-nude-200 text-nude-800 px-3 py-1.5 rounded-full font-medium">{m}</span>
              ))}
            </div>
          </Section>

          {item.loras_used?.length > 0 && (
            <Section title="Custom LoRAs / Fine-Tunes">
              <div className="flex flex-wrap gap-2">
                {item.loras_used.map((l, i) => (
                  <span key={i} className="text-sm bg-nude-100 text-nude-700 px-3 py-1.5 rounded-full border border-nude-200">{l}</span>
                ))}
              </div>
            </Section>
          )}

          {item.prompt_string && (
            <Section title="Prompt String">
              <div className="bg-nude-900 text-nude-100 rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {item.prompt_string}
              </div>
            </Section>
          )}

          {item.node_steps?.length > 0 && (
            <Section title="Node-by-Node Workflow">
              <ol className="space-y-2">
                {item.node_steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-nude-800">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-nude-200 text-nude-800 flex items-center justify-center text-xs font-medium">{i + 1}</span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          <Section title="Pipeline Description" last>
            <p className="text-sm text-nude-700 leading-relaxed">{item.workflow_description}</p>
          </Section>
        </div>
      </div>
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