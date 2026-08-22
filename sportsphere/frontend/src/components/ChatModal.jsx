import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, Phone, Video, MapPin } from 'lucide-react';

export default function ChatModal({ isOpen, athlete, onClose }) {
  if (!isOpen || !athlete) return null;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'them',
      text: `Hey Vivek! Saw your match radar ping for ${athlete.sport || 'Badminton'}. Are you free for a session today around 6 PM?`,
      time: '10:14 AM',
    },
    {
      id: 2,
      sender: 'them',
      text: `We have court reserved at Madhapur Sports Complex. Let me know if you want to join! 🏸`,
      time: '10:15 AM',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend) => {
    const msg = textToSend || inputText;
    if (!msg || msg.trim() === '') return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: msg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate fast athlete reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'them',
          text: `Awesome! Confirmed for 6 PM. I'll bring extra equipment. See you on court! 🔥`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-emerald-500/40 shadow-2xl overflow-hidden text-left flex flex-col h-[580px]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={athlete.avatar || '/athlete_rahul.jpg'}
                alt={athlete.name}
                className="w-11 h-11 rounded-xl object-cover border border-slate-700"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950"></div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-heading font-extrabold text-base text-white">
                  {athlete.name}
                </h4>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span className="text-emerald-400 font-semibold">{athlete.sport || 'Athlete'}</span>
                <span>•</span>
                <span>Active 1.2 km away</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-950/50">
          
          <div className="text-center">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
              Matched via SportSphere Match Radar (94% Compatibility)
            </span>
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'me'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-medium rounded-tr-none shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div>{m.text}</div>
                <div
                  className={`text-[10px] mt-1 font-mono ${
                    m.sender === 'me' ? 'text-slate-900/70 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 text-xs text-slate-400 px-4 py-2 rounded-2xl flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                <span>{athlete.name} is typing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => handleSendMessage("Count me in! What court number?")}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium whitespace-nowrap cursor-pointer"
          >
            "Count me in! What court?"
          </button>
          <button
            onClick={() => handleSendMessage("Free today at 6 PM! 🏸")}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium whitespace-nowrap cursor-pointer"
          >
            "Free today at 6 PM! 🏸"
          </button>
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Message ${athlete.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
