import React from 'react';
import { Guru } from '../types/index.ts';
import {
  X,
  Star,
  MapPin,
  Video,
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  Check,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { calculateDistanceMiles } from '../utils/escrow.ts';

interface GuruDetailModalProps {
  guru: Guru | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (guru: Guru) => void;
  onOpenMessage: (guru: Guru) => void;
  userCoords?: { lat: number; lng: number };
}

export const GuruDetailModal: React.FC<GuruDetailModalProps> = ({
  guru,
  isOpen,
  onClose,
  onBook,
  onOpenMessage,
  userCoords,
}) => {
  if (!isOpen || !guru) return null;

  const distance = userCoords
    ? calculateDistanceMiles(userCoords.lat, userCoords.lng, guru.location.lat, guru.location.lng)
    : null;

  // Star breakdown calculation
  const totalReviews = guru.reviews.length;
  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: guru.reviews.filter((r) => r.rating === s).length,
    pct: totalReviews > 0 ? (guru.reviews.filter((r) => r.rating === s).length / totalReviews) * 100 : 0,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0f1523] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col text-slate-100">
        {/* Cover / Header */}
        <div className="relative h-48 w-full bg-slate-900 shrink-0">
          <img
            src={guru.coverImage || 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80'}
            alt={guru.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1523] via-[#0f1523]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors backdrop-blur-xs"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Avatar and main title */}
          <div className="absolute -bottom-6 left-6 flex items-end gap-4">
            <div className="relative">
              <img
                src={guru.avatar}
                alt={guru.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-[#0f1523] shadow-xl"
              />
              {guru.verifiedGuru && (
                <div
                  title="Verified Guru"
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shadow-md font-bold"
                >
                  <Award className="w-4 h-4 fill-slate-950" />
                </div>
              )}
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{guru.name}</h3>
                {guru.badge && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {guru.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{guru.title}</p>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="p-6 pt-10 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Quick stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-[#131927] border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Verified Rating</span>
              <div className="flex items-center gap-1 font-bold text-white mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{guru.rating.toFixed(2)}</span>
                <span className="text-slate-400 font-normal">({guru.reviewCount})</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Experience</span>
              <span className="font-bold text-white mt-0.5 block">{guru.yearsExperience}+ years</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Completed</span>
              <span className="font-bold text-emerald-400 mt-0.5 block">
                {guru.completedSessionsCount} sessions
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Location</span>
              <span className="font-bold text-white mt-0.5 block truncate">
                {distance !== null ? `${distance} mi · ` : ''}
                {guru.location.city}
              </span>
            </div>
          </div>

          {/* Escrow protection callout */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Yoohoo Escrow Protection:</strong> Payments are held safely by Stripe and only released after you confirm the session was completed.
            </span>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About Master Guru</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{guru.bio}</p>
          </div>

          {/* Skills Offered */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Skills & Hands-On Workshops
            </h4>
            <div className="space-y-3">
              {guru.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-2xl border border-slate-800 bg-[#131927] space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-white">{skill.title}</h5>
                      <span className="text-xs text-amber-400 font-medium">
                        {skill.category} · {skill.level}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-base font-bold text-white">
                        ${skill.hourlyRate}
                      </span>
                      <span className="text-xs text-slate-400">/hr</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{skill.description}</p>

                  {skill.materialsProvided && skill.materialsProvided.length > 0 && (
                    <div className="pt-2 text-xs">
                      <span className="text-slate-400 font-medium">Included Materials:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {skill.materialsProvided.map((mat, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-[#0b0f17] text-[11px] text-slate-300 border border-slate-800 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 text-emerald-400" /> {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Meeting Formats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-800 bg-[#131927]">
              <h5 className="font-bold text-xs text-white flex items-center gap-1.5 mb-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                Local Meetup Hubs
              </h5>
              <ul className="text-xs text-slate-400 space-y-1.5">
                {guru.meetupSuggestions?.map((venue, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{venue}</span>
                  </li>
                )) || <li>Local studio / workshop in {guru.location.city}</li>}
              </ul>
            </div>

            <div className="p-4 rounded-2xl border border-slate-800 bg-[#131927]">
              <h5 className="font-bold text-xs text-white flex items-center gap-1.5 mb-2">
                <Video className="w-4 h-4 text-emerald-400" />
                Long Distance & Remote
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Google Meet video link automatically generated upon booking. High-def screen sharing, multiple camera angles, and calendar reminders included.
              </p>
            </div>
          </div>

          {/* Prominent Rating & Verified Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Verified Ratings & Reviews
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Only visible after a session is marked complete and funds released.
                </p>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Escrow Verified
              </span>
            </div>

            {/* Prominent Rating Summary Card */}
            <div className="p-5 rounded-2xl bg-[#131927] border border-slate-800 mb-4 flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center sm:text-left sm:border-r sm:border-slate-800 sm:pr-6 shrink-0">
                <div className="font-display text-4xl font-black text-amber-400 flex items-center justify-center sm:justify-start gap-1">
                  <span>{guru.rating.toFixed(2)}</span>
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Based on <strong>{guru.reviewCount}</strong> verified ratings
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                  99% would learn again
                </div>
              </div>

              {/* Star breakdown bars */}
              <div className="flex-1 w-full space-y-1.5">
                {starCounts.map((s) => (
                  <div key={s.stars} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-slate-400 font-mono text-[11px]">{s.stars}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                    <span className="w-7 text-right text-[11px] text-slate-500 font-mono">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-3">
              {guru.reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl border border-slate-800 bg-[#0b0f17] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.gunuAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={rev.gunuName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{rev.gunuName}</span>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-medium px-1.5 py-0.2 rounded border border-emerald-500/20">
                            Verified Gunu
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.comment}"</p>

                  {/* Tags & Aspects */}
                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#131927] text-[10px] font-medium text-amber-300 border border-slate-800"
                        >
                          ★ {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-2 border-t border-slate-800/80">
                    <span>Skill: <strong>{rev.skillLearned}</strong></span>
                    <span>·</span>
                    <span className="capitalize">{rev.sessionMode} Session</span>
                    <span>·</span>
                    <span className="text-emerald-400">Escrow Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 bg-[#131927] flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="font-mono text-lg font-bold text-white">${guru.hourlyRate}</span>
            <span className="text-xs text-slate-400">/hr (Escrow guaranteed)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenMessage(guru)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Message Guru
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(guru);
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
            >
              Book Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
