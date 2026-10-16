import React, { useState, useRef, useEffect } from 'react';
import { AIChatMessage, Guru } from '../types/index.ts';
import { MascotBadge } from './MascotBadge.tsx';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  RotateCcw,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  gurus: Guru[];
  onSelectGuru: (guru: Guru) => void;
  onNavigateView: (view: 'explore' | 'map' | 'my-bookings' | 'guru-portal') => void;
}

const INITIAL_MESSAGES: AIChatMessage[] = [
  {
    id: 'ai-init-1',
    role: 'assistant',
    content:
      "👋 Yoohoo! I'm your AI concierge powered by **Gemini 3.8 Flash**.\n\nI can help you find verified Gurus in your neighborhood, explain our **100% Escrow Guarantee**, help you prepare for sessions, or walk you through our rating system. How can I help you learn today?",
    timestamp: 'Just now',
  },
];

const SUGGESTIONS = [
  '🎸 Find guitar teachers near SF',
  '🥖 Sourdough baking for beginners',
  '🔒 How does Yoohoo Escrow work?',
  '⭐ How do verified ratings work?',
  '💻 In-Person vs Google Meet video',
];

export const GeminiChatbotDrawer: React.FC<GeminiChatbotProps> = ({
  isOpen,
  onClose,
  onOpen,
  gurus,
  onSelectGuru,
  onNavigateView,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({
            role: m.role,
            text: m.content,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const replyContent = data.reply || "I'm here to assist with any questions on Yoohoo.Guru!";

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: AIChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content:
          "I'm here to assist! Every session on Yoohoo.Guru includes **100% Escrow Protection** held via Stripe until you confirm completion. You can explore local Gurus on our interactive map or book a 1-on-1 Google Meet session.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  // Helper to render simple markdown-like formatting (bold, bullet lines)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Process bold tags
          const parts = line.split(/(\*\*.*?\*\*)/g);

          const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-amber-300">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          });

          if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
            return (
              <div key={idx} className="flex items-start gap-1.5 text-xs pl-1">
                <span className="text-amber-400 font-bold">•</span>
                <span>{formattedLine.slice(1)}</span>
              </div>
            );
          }

          return (
            <p key={idx} className="text-xs">
              {formattedLine}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label="Open Yoohoo AI Concierge"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#131927] hover:bg-[#1c2333] border-2 border-amber-400/80 shadow-[0_8px_30px_rgb(0,0,0,0.5)] text-white font-bold transition-all hover:scale-105 group"
        >
          <div className="relative">
            <MascotBadge size={32} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1 text-xs text-amber-400 font-black">
              <Sparkles className="w-3 h-3 fill-amber-400" />
              <span>Ask Yoohoo AI</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-normal">
              Gemini 3.8 Flash Assistant
            </span>
          </div>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0b0f17] border-l border-slate-800 shadow-2xl flex flex-col animate-slide-left text-slate-100">
          {/* Header */}
          <div className="p-4 px-5 border-b border-slate-800 bg-[#131927] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MascotBadge size={36} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#131927]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">Yoohoo AI Concierge</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Guru recommendations · Escrow info · Session prep
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                aria-label="Close assistant"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Suggestions Strip */}
          <div className="px-4 py-2.5 bg-[#0e1420] border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 shrink-0 no-scrollbar">
            {SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSend(sug)}
                className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-full bg-[#131927] hover:bg-[#1a2235] text-slate-300 hover:text-amber-300 border border-slate-800 transition-colors shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Messages scroll area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                      isAssistant
                        ? 'bg-[#131927] border border-slate-800 text-slate-200'
                        : 'bg-amber-500 text-slate-950 font-medium'
                    }`}
                  >
                    {isAssistant ? renderFormattedText(msg.content) : <p className="text-xs leading-relaxed">{msg.content}</p>}
                    <span
                      className={`text-[9px] block mt-1.5 ${
                        isAssistant ? 'text-slate-500' : 'text-amber-950/70 font-mono'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start items-center text-xs text-slate-400">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-[#131927] border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span>Yoohoo is consulting master knowledge...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick shortcuts to app features */}
          <div className="px-4 py-2 border-t border-slate-800/80 bg-[#0e1420] flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <span>Explore shortcuts:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onNavigateView('map');
                  onClose();
                }}
                className="hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3 h-3 text-amber-400" /> Local Map
              </button>
              <span>·</span>
              <button
                onClick={() => {
                  onNavigateView('my-bookings');
                  onClose();
                }}
                className="hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Escrow Status
              </button>
            </div>
          </div>

          {/* Input bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#131927] border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about Gurus, Escrow, or skills..."
              disabled={isLoading}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#0b0f17] text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all shadow-md disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
