import React, { useState, useEffect } from 'react';
import { getConversations, sendMessage } from '../../services/api';
import { subscribeToMessages, sendSocketMessage } from '../../services/socket';
import { Send, Sparkles, CheckCircle2, MessageSquare, Phone, Video } from 'lucide-react';

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState('conv_rahul');
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    async function loadConversations() {
      const data = await getConversations();
      setConversations(data);
    }
    loadConversations();

    // Subscribe to incoming real-time Socket.IO messages
    const unsubscribe = subscribeToMessages((data) => {
      setConversations((prevConvs) =>
        prevConvs.map((conv) => {
          if (conv.id === 'conv_rahul') {
            return {
              ...conv,
              messages: [
                ...conv.messages,
                { id: Date.now(), sender: data.senderName || 'Rahul S.', text: data.text, time: 'Just now', isOwn: false },
              ],
              lastMessage: data.text,
              timestamp: 'Just now',
            };
          }
          return conv;
        })
      );
    });

    return () => unsubscribe();
  }, []);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConv) return;

    const text = inputMsg.trim();
    setInputMsg('');

    // Emit live Socket.IO message event
    sendSocketMessage({
      senderName: 'Vivek Kumar',
      receiverName: activeConv.athlete?.name || 'Rahul S.',
      sport: 'Badminton',
      text,
    });

    // Save message via REST API
    const newMsg = await sendMessage(activeConv.id, text);
    if (newMsg) {
      setConversations([...conversations]);
    }
  };

  const handleQuickChip = (chipText) => {
    setInputMsg(chipText);
  };

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 h-[calc(100vh-140px)] min-h-[500px] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-300">
      
      {/* Left Conversations Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0 bg-[#080a0f]/60">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-lg text-white">Direct Messages</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
            SOCKET CONNECTED
          </span>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => {
            const isActive = conv.id === activeConvId;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.athlete.avatar}
                    alt={conv.athlete.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                  />
                  {conv.athlete.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">{conv.athlete.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{conv.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{conv.lastMessage}</div>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Active Chat Window */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950/40">
          
          {/* Active Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeConv.athlete.avatar}
                alt={activeConv.athlete.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-bold text-sm text-white">{activeConv.athlete.fullName || activeConv.athlete.name}</h3>
                  {activeConv.athlete.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono">
                  {activeConv.athlete.sports?.[0]?.sport || 'Badminton'} • {activeConv.athlete.isOnline ? 'Online Now' : 'Offline'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Thread Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeConv.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs space-y-1 ${
                    msg.isOwn
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-medium rounded-br-none shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <div className={`text-[10px] font-mono text-right ${msg.isOwn ? 'text-slate-900 opacity-80' : 'text-slate-400'}`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reply Chips */}
          <div className="px-4 py-2 border-t border-slate-800/60 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono text-slate-400 shrink-0">QUICK REPLIES:</span>
            {['I am free today at 6 PM!', 'Which court are we playing at?', 'Count me in for doubles! 🏸', 'Can we reschedule to Saturday?'].map((chip) => (
              <button
                key={chip}
                onClick={() => handleQuickChip(chip)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 whitespace-nowrap cursor-pointer transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-800 flex items-center gap-3">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={`Message ${activeConv.athlete.name}...`}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-extrabold text-xs hover:opacity-95 shadow-md shadow-emerald-500/20 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4 fill-slate-950" />
              <span>Send</span>
            </button>
          </form>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-xs">
          Select a conversation from the left sidebar to start messaging.
        </div>
      )}

    </div>
  );
}
