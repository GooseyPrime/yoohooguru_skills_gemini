import React, { useState } from 'react';
import { ChatMessage, Guru, Gunu } from '../types/index.ts';
import {
  X,
  Send,
  MessageSquare,
  Video,
  CheckCheck,
} from 'lucide-react';

interface MessagingProps {
  messages: ChatMessage[];
  currentGunu: Gunu;
  gurus: Guru[];
  selectedRecipientId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (msg: { recipientId: string; text: string; meetingLink?: string }) => void;
}

export const MessagingDrawer: React.FC<MessagingProps> = ({
  messages,
  currentGunu,
  gurus,
  selectedRecipientId,
  isOpen,
  onClose,
  onSendMessage,
}) => {
  const [activeRecipientId, setActiveRecipientId] = useState<string>(
    selectedRecipientId || 'guru-jesse'
  );
  const [inputDraft, setInputDraft] = useState('');

  if (!isOpen) return null;

  const activeGuru = gurus.find((g) => g.id === activeRecipientId) || gurus[0];

  // Messages between current user and active recipient
  const activeConversation = messages.filter(
    (m) =>
      (m.senderId === currentGunu.id && m.recipientId === activeRecipientId) ||
      (m.senderId === activeRecipientId && m.recipientId === currentGunu.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDraft.trim()) return;

    onSendMessage({
      recipientId: activeRecipientId,
      text: inputDraft.trim(),
    });

    setInputDraft('');
  };

  const handleInsertMeet = () => {
    const meetUrl = `https://meet.google.com/yoo-${Math.random().toString(36).substring(2, 6)}-meet`;
    setInputDraft((prev) => (prev ? `${prev} Join our session: ${meetUrl}` : `Here is our Google Meet session link: ${meetUrl}`));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-lg h-full bg-[#0f1523] shadow-2xl flex flex-col border-l border-slate-800 text-slate-100">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#131927]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Secure Messages</h3>
              <p className="text-[11px] text-slate-400">Direct Gunus & Gurus communication</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close messages"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gurus Contact Strip */}
        <div className="px-4 py-2.5 border-b border-slate-800 bg-[#0b0f17] flex items-center gap-2 overflow-x-auto">
          {gurus.map((guru) => (
            <button
              key={guru.id}
              onClick={() => setActiveRecipientId(guru.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs shrink-0 transition-colors ${
                activeRecipientId === guru.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <img
                src={guru.avatar}
                alt={guru.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="truncate max-w-[100px]">{guru.name}</span>
            </button>
          ))}
        </div>

        {/* Active chat partner banner */}
        {activeGuru && (
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs bg-[#131927]">
            <div className="flex items-center gap-2.5">
              <img
                src={activeGuru.avatar}
                alt={activeGuru.name}
                className="w-9 h-9 rounded-xl object-cover border border-amber-400"
              />
              <div>
                <span className="font-bold text-white block">{activeGuru.name}</span>
                <span className="text-[11px] text-slate-400">{activeGuru.title}</span>
              </div>
            </div>
            <button
              onClick={handleInsertMeet}
              title="Add Google Meet link"
              className="px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 hover:bg-emerald-900/60 transition-colors"
            >
              <Video className="w-3.5 h-3.5 text-emerald-400" /> Share Meet Link
            </button>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#0b0f17]/60">
          {activeConversation.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <MessageSquare className="w-10 h-10 mx-auto stroke-1 mb-2 text-slate-600" />
              <p className="text-xs text-slate-400">No prior messages with {activeGuru?.name}.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Say hello, ask questions about skills or coordinate meeting locations!
              </p>
            </div>
          ) : (
            activeConversation.map((msg) => {
              const isMine = msg.senderId === currentGunu.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-md space-y-1.5 ${
                      isMine
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-br-xs'
                        : 'bg-[#131927] border border-slate-800 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    {!isMine && (
                      <span className="font-bold text-[11px] text-amber-400 block">
                        {msg.senderName}
                      </span>
                    )}

                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {msg.meetingLink && (
                      <a
                        href={msg.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className={`mt-2 flex items-center gap-2 p-2 rounded-xl text-xs font-semibold ${
                          isMine
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60'
                        }`}
                      >
                        <Video className="w-4 h-4 text-emerald-400" />
                        Join Google Meet Session
                      </a>
                    )}

                    <div
                      className={`flex items-center gap-1 text-[10px] ${
                        isMine ? 'text-slate-800 justify-end' : 'text-slate-500 justify-start'
                      }`}
                    >
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMine && <CheckCheck className="w-3 h-3 text-slate-900" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input Footer */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-[#131927] flex items-center gap-2">
          <input
            type="text"
            value={inputDraft}
            onChange={(e) => setInputDraft(e.target.value)}
            placeholder={`Message ${activeGuru?.name || 'Guru'}...`}
            className="flex-1 text-xs p-2.5 rounded-xl border border-slate-700 bg-[#0b0f17] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={!inputDraft.trim()}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
