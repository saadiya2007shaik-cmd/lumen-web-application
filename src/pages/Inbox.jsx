import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockMessages, mockCreators } from '../mockData';

export default function Inbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    // 🔁 LATER: replace with real API call
    const stored = localStorage.getItem('lumen_conversations');
    if (stored) {
      setConversations(JSON.parse(stored));
    } else {
      localStorage.setItem('lumen_conversations', JSON.stringify(mockMessages));
      setConversations(mockMessages);
    }
  }, []);

  const getOtherParticipant = (conv) => {
    const otherId = conv.participants.find(p => p !== user.id) || conv.participants[0];
    // Try to resolve to a creator or fallback
    const creator = mockCreators.find(c => `u_${c.id}` === otherId || c.handle === otherId);
    if (creator) return { name: creator.name, avatar_url: creator.avatar_url, handle: creator.handle };
    if (otherId === 'brand_demo') return { name: 'Nova Sports', avatar_url: 'https://i.pravatar.cc/200?img=68', handle: 'novasports' };
    return { name: 'Unknown', avatar_url: 'https://i.pravatar.cc/200?u=unknown', handle: otherId };
  };

  const lastMessage = (conv) => conv.messages[conv.messages.length - 1];

  return (
    <div className="min-h-screen bg-nude-100 pt-12 pb-20 px-8">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-nude-500 mb-2">Inbox</p>
        <h1 className="font-serif-display text-5xl text-nude-900 leading-tight mb-10">Messages</h1>

        {conversations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-nude-200">
            <h3 className="font-serif-display text-2xl text-nude-900 mb-2">No messages yet</h3>
            <p className="text-nude-600 mb-6">Start a conversation with a creator.</p>
            <button
              onClick={() => navigate('/discover')}
              className="px-6 py-2.5 bg-nude-700 text-white rounded-full text-sm hover:bg-nude-800 transition-colors"
            >
              Discover creators
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-nude-200 overflow-hidden">
            {conversations.map((conv, idx) => {
              const other = getOtherParticipant(conv);
              const last = lastMessage(conv);
              return (
                <button
                  key={conv.conversationId}
                  onClick={() => navigate(`/inbox/${conv.conversationId}`)}
                  className={`w-full text-left px-6 py-5 flex items-center gap-4 hover:bg-nude-50 transition-colors ${
                    idx !== 0 ? 'border-t border-nude-100' : ''
                  }`}
                >
                  <img
                    src={other.avatar_url}
                    alt={other.name}
                    className="w-12 h-12 rounded-full object-cover border border-nude-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-nude-900 truncate">{other.name}</h3>
                      <span className="text-xs text-nude-400 ml-2 shrink-0">
                        {new Date(last.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-nude-600 truncate">{last.text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}