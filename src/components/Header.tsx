import React from 'react';
import { MascotBadge } from './MascotBadge.tsx';
import { YoohooLogo } from './YoohooLogo.tsx';
import { Bell, MessageSquare, ShieldCheck, User, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentView: 'explore' | 'map' | 'my-bookings' | 'guru-portal';
  onChangeView: (view: 'explore' | 'map' | 'my-bookings' | 'guru-portal') => void;
  onOpenReminders: () => void;
  onOpenMessages: () => void;
  onOpenChatbot?: () => void;
  reminderCount: number;
  unreadMessageCount: number;
  activeRole: 'gunu' | 'guru';
  onToggleRole: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onChangeView,
  onOpenReminders,
  onOpenMessages,
  onOpenChatbot,
  reminderCount,
  unreadMessageCount,
  activeRole,
  onToggleRole,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with Bigfoot Mascot */}
        <button
          onClick={() => onChangeView('explore')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus:outline-none"
        >
          <MascotBadge size={38} className="drop-shadow-md" />
          <YoohooLogo size="sm" />
        </button>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <button
            onClick={() => onChangeView('explore')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-400 ${
              currentView === 'explore' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Explore Gurus
          </button>
          <button
            onClick={() => onChangeView('map')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-400 ${
              currentView === 'map' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Local Map View
          </button>
          <button
            onClick={() => onChangeView('my-bookings')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-400 ${
              currentView === 'my-bookings' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            My Bookings & Escrow
          </button>
          <button
            onClick={() => onChangeView('guru-portal')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-amber-400 ${
              currentView === 'guru-portal' ? 'text-amber-400 font-bold border-b-2 border-amber-400 pb-0.5' : ''
            }`}
          >
            Guru Portal & Earnings
          </button>
        </nav>

        {/* Zone 3: Interactive Affordances & Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Gemini AI Concierge shortcut */}
          {onOpenChatbot && (
            <button
              onClick={onOpenChatbot}
              aria-label="Ask Yoohoo Gemini AI Concierge"
              className="px-2.5 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-amber-500/20"
              title="Ask Yoohoo Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          )}

          {/* Messages shortcut */}
          <button
            onClick={onOpenMessages}
            aria-label="Open messages"
            className="relative p-2 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadMessageCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0b0f17]" />
            )}
          </button>

          {/* Appointment Reminders indicator */}
          <button
            onClick={onOpenReminders}
            aria-label="Upcoming appointment reminders"
            className="relative p-2 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {reminderCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                {reminderCount}
              </span>
            )}
          </button>

          {/* Mode Switcher Button */}
          <button
            onClick={onToggleRole}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-2xs"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{activeRole === 'gunu' ? 'Switch to Guru Mode' : 'Switch to Learner'}</span>
            <span className="sm:hidden">{activeRole === 'gunu' ? 'Guru' : 'Learner'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
