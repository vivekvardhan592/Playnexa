import React, { useState, useEffect, useRef } from 'react';
import { getConversations, getMessageHistory } from '../../services/api';
import {
  subscribeToMessages,
  sendSocketMessage,
  joinConversation,
  leaveConversation,
  emitTyping,
  subscribeToTyping,
} from '../../services/socket';
import { useAuth } from '../../contexts/AuthContext';
import { Send, Sparkles, CheckCircle2, MessageSquare, Phone, Video } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [typingInfo, setTypingInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load conversation list
  useEffect(() => {
    async function loadConversations() {
      const data = await getConversations();
      setConversations(data);
      // Auto-select first conversation
      if (data.length > 0 && !activeConvId) {
        setActiveConvId(data[0].conversation_id || data[0].id);
      }
    }
    loadConversations();
  }, []);

  // Join/leave Socket.IO rooms when active conversation changes
  useEffect(() => {
    if (!activeConvId) return;

    joinConversation(activeConvId);

    // Load message history from backend
    async function loadMessages() {
      const msgs = await getMessageHistory(activeConvId);
      setMessages(
        msgs.map((m) => ({
          id: m.id,
          sender: m.sender_name || m.senderName,
          text: m.content,
          time: new Date(m.created_at || m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: m.sender_id === user?.id || m.senderId === user?.id || m.sender_id === user?.athleteId,
        }))
      );
    }
    loadMessages();

    return () => {
      leaveConversation(activeConvId);
    };
  }, [activeConvId, user]);

  // Subscribe to real-time incoming messages
  useEffect(() => {
    const unsub = subscribeToMessages((data) => {
      if (data.conversationId === activeConvId) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            sender: data.senderName,
            text: data.content,
            time: new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: data.senderId === user?.id || data.senderId === user?.athleteId,
          },
        ]);
      }

      // Update conversation list last message
      setConversations((prev) =>
        prev.map((conv) => {
          const convId = conv.conversation_id || conv.id;
          if (convId === data.conversationId) {
            return {
              ...conv,
              last_message: data.content,
              lastMessage: data.content,
              last_message_at: data.createdAt,
              timestamp: 'Just now',
              unread_count: convId === activeConvId ? 0 : (parseInt(conv.unread_count || 0) + 1),
            };
          }
          return conv;
        })
      );
    });

    return () => unsub();
  }, [activeConvId, user]);

  // Subscribe to typing indicators
  useEffect(() => {
    const unsub = subscribeToTyping((data) => {
      if (data.conversationId === activeConvId && data.isTyping) {
        setTypingInfo(data.name);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setTypingInfo(null), 3000);
      } else {
        setTypingInfo(null);
      }
    });
    return () => unsub();
  }, [activeConvId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConv = conversations.find(
    (c) => (c.conversation_id || c.id) === activeConvId
  ) || conversations[0];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConvId) return;

    const text = inputMsg.trim();
    setInputMsg('');

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        id: `temp_${Date.now()}`,
        sender: user?.name || 'You',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      },
    ]);

    // Send via Socket.IO (persisted by backend)
    sendSocketMessage(activeConvId, text);

    // Stop typing indicator
    emitTyping(activeConvId, false);
  };

  const handleInputChange = (e) => {
    setInputMsg(e.target.value);
    if (activeConvId) emitTyping(activeConvId, true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (activeConvId) emitTyping(activeConvId, false);
    }, 2000);
  };

  const handleQuickChip = (chipText) => {
    setInputMsg(chipText);
  };

  // Helper to get display info from conversation (supports both mock and real backend shapes)
  const getConvDisplay = (conv) => {
    if (conv.athlete) {
      return {
        name: conv.athlete.name,
        avatar: conv.athlete.avatar,
        isOnline: conv.athlete.isOnline,
        verified: conv.athlete.verified,
        sport: conv.athlete.sports?.[0]?.sport || 'Badminton',
      };
    }
    return {
      name: conv.other_name || 'Athlete',
      avatar: conv.other_avatar || '/athlete_rahul.jpg',
      isOnline: false,
      verified: false,
      sport: 'Badminton',
    };
  };

  return (
    <div className="glass-panel rounded-3xl border border-slate-800 h-[calc(100vh-140px)] min-h-[500px] flex flex-col md:flex-row overflow-hidden animate-in fade-in duration-300">
      
      {/* Left Conversations Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0 bg-[#080a0f]/60">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-lg text-white">Direct Messages</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
            LIVE
          </span>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => {
            const convId = conv.conversation_id || conv.id;
            const isActive = convId === activeConvId;
            const display = getConvDisplay(conv);
            const unread = parseInt(conv.unread_count || conv.unreadCount || 0);

            return (
              <div
                key={convId}
                onClick={() => setActiveConvId(convId)}
                className={`p-3 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/10 border border-emerald-500/30'
                    : 'hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={display.avatar}
                    alt={display.name}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                  />
                  {display.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white truncate">{display.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {conv.timestamp || (conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {conv.last_message || conv.lastMessage || 'No messages yet'}
                  </div>
                </div>

                {unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {unread}
                  </span>
                )}
              </div>
            );
          })}

          {conversations.length === 0 && (
            <div className="p-6 text-center text-slate-500 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              No conversations yet. Discover athletes and start chatting!
            </div>
          )}
        </div>
      </div>

      {/* Right Active Chat Window */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950/40">
          
          {/* Active Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={getConvDisplay(activeConv).avatar}
                alt={getConvDisplay(activeConv).name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading font-bold text-sm text-white">
                    {getConvDisplay(activeConv).name}
                  </h3>
                  {getConvDisplay(activeConv).verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono">
                  {getConvDisplay(activeConv).sport} • {typingInfo ? `${typingInfo} is typing...` : (getConvDisplay(activeConv).isOnline ? 'Online Now' : 'Offline')}
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
            {messages.map((msg) => (
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

            {typingInfo && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs rounded-bl-none animate-pulse">
                  {typingInfo} is typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
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
              onChange={handleInputChange}
              placeholder={`Message ${getConvDisplay(activeConv).name}...`}
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
