import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockCreators } from '../mockData';

export default function ChatView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    // 🔁 LATER: replace with real API call
    const stored = localStorage.getItem('lumen_conversations');
    const convs = stored ? JSON.parse(stored) : [];
    const found = convs.find(c => c.conversationId === id);
    setConversation(found || null);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  if (!conversation) {
    return (
      <div className="min-h-screen bg-nude-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-nude-600 mb-4">Conversation not found.</p>
          <button onClick={() => navigate('/inbox')} className="px-6 py-2.5 bg-nude-700 text-white rounded-full text-sm">
            Back to inbox
          </button>
        </div>
      </div>
    );
  }

  const getOtherParticipant = () => {
    const otherId = conversation.participants.find(p => p !== user.id) || conversation.participants[0];
    const creator = mockCreators.find(c => `u_${c.id}` === otherId);
    if (creator) return { name: creator.name, avatar_url: creator.avatar_url, handle: creator.handle };
    if (otherId === 'brand_demo') return { name: 'Nova Sports', avatar_url: 'https://i.pravatar.cc/200?img=68', handle: 'novasports' };
    return { name: 'Unknown', avatar_url: 'https://i.pravatar.cc/200?u=x', handle: otherId };
  };

  const other = getOtherParticipant();

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      from: user.id,
      text: trimmed,
      at: new Date().toISOString(),
    };

    const updated = {
      ...conversation,
      messages: [...conversation.messages, newMsg],
    };
    setConversation(updated);

    // Persist to localStorage
    const stored = JSON.parse(localStorage.getItem('lumen_conversations') || '[]');
    const idx = stored.findIndex(c => c.conversationId === id);
    if (idx >= 0) stored[idx] = updated;
    else stored.push(updated);
    localStorage.setItem('lumen_conversations', JSON.stringify(stored));

    setText('');

    // Mock auto-reply after 1.5s
    setTimeout(() => {
      const reply = {
        id: `m_${Date.now()}_r`,
        from: other.handle,
        text: 'Got it — let me check and get back to you shortly!',
        at: new Date().toISOString(),
      };
      const withReply = { ...updated, messages: [...updated.messages, reply] };
      setConversation(withReply);

      const stored2 = JSON.parse(localStorage.getItem('lumen_conversations') || '[]');
      const idx2 = stored2.findIndex(c => c.conversationId === id);
      if (idx2 >= 0) stored2[idx2] = withReply;
      localStorage.setItem('lumen_conversations', JSON.stringify(stored2));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-nude-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-nude-200 px-8 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/inbox')}
          className="w-9 h-9 rounded-full bg-nude-100 hover:bg-nude-200 flex items-center justify-center text-nude-700 transition-colors"
        >
          ←
        </button>
        <img src={other.avatar_url} alt={other.name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <h2 className="font-medium text-nude-900">{other.name}</h2>
          <p className="text-xs text-nude-500">@{other.handle}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {conversation.messages.map((m) => {
            const mine = m.from === user.id;
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    mine
                      ? 'bg-nude-700 text-white rounded-br-sm'
                      : 'bg-white text-nude-800 border border-nude-200 rounded-bl-sm'
                  }`}
                >
                  <p>{m.text}</p>
                  <p className={`text-[10px] mt-1.5 ${mine ? 'text-nude-200' : 'text-nude-400'}`}>
                    {new Date(m.at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="bg-white border-t border-nude-200 px-8 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Write a message…"
            className="flex-1 px-4 py-3 bg-nude-50 border border-nude-200 rounded-full text-sm text-nude-800 focus:outline-none focus:border-nude-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-nude-800 text-white rounded-full text-sm font-medium hover:bg-nude-900 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}