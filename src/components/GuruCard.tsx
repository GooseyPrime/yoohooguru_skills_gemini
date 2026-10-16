import React from 'react';
import { Guru } from '../types/index.ts';
import { Star, MapPin, Video, ShieldCheck } from 'lucide-react';
import { calculateDistanceMiles } from '../utils/escrow.ts';

interface GuruCardProps {
  guru: Guru;
  userCoords: { lat: number; lng: number };
  onSelect: (guru: Guru) => void;
  onQuickBook: (guru: Guru) => void;
  isSelected?: boolean;
}

export const GuruCard: React.FC<GuruCardProps> = ({
  guru,
  userCoords,
  onSelect,
  onQuickBook,
  isSelected = false,
}) => {
  const distance = calculateDistanceMiles(
    userCoords.lat,
    userCoords.lng,
    guru.location.lat,
    guru.location.lng
  );

  const primarySkill = guru.skills[0];

  return (
    <div
      onClick={() => onSelect(guru)}
      className={`group relative rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer border flex flex-col justify-between ${
        isSelected
          ? 'bg-[#141b2a] border-amber-400 shadow-2xl ring-2 ring-amber-400/30 -translate-y-1'
          : 'bg-[#131927] border-slate-800/90 hover:border-amber-400/60 hover:shadow-2xl hover:shadow-amber-500/5 hover:-translate-y-1'
      }`}
    >
      <div>
        {/* High-Resolution Ambient Studio Cover Image */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
          <img
            src={guru.coverImage || 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=85'}
            alt={`${guru.name} Studio Workshop`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-100"
          />

          {/* Contrast gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#131927] via-black/30 to-transparent" />

          {/* Floating Category & Format Tags */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/20">
              {primarySkill?.category || 'Expert Mentor'}
            </span>

            {guru.sessionModes !== 'in-person' && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-400 border border-emerald-400/30 flex items-center gap-1">
                <Video className="w-3 h-3 text-emerald-400" />
                Google Meet
              </span>
            )}
          </div>

          {/* Price badge floating in cover bottom-right */}
          <div className="absolute bottom-3 right-3 text-right bg-[#0b0f17]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 shadow-md">
            <span className="font-mono text-base font-extrabold text-white tabular-nums">
              ${guru.hourlyRate}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">/hr</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 pt-3 space-y-3">
          {/* Avatar and Name */}
          <div className="flex items-start gap-3.5">
            <div className="relative -mt-9 shrink-0">
              <img
                src={guru.avatar}
                alt={guru.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
                }}
                className="w-14 h-14 rounded-2xl object-cover border-3 border-[#131927] shadow-xl bg-slate-800 group-hover:border-amber-400 transition-colors"
              />
              {guru.verifiedGuru && (
                <div
                  title="Identity & Expertise Verified Guru"
                  className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-1 shadow-sm border border-[#131927]"
                >
                  <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="font-bold text-base text-white truncate group-hover:text-amber-400 transition-colors">
                {guru.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                {guru.title}
              </p>
            </div>
          </div>

          {/* Clean Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap pt-0.5">
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {guru.rating.toFixed(2)}
              <span className="font-normal text-slate-500">({guru.reviewCount})</span>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {distance} mi · {guru.location.city}
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-slate-400">
              {guru.completedSessionsCount} sessions
            </span>
          </div>

          {/* Primary Curriculum Spotlight */}
          {primarySkill && (
            <div className="p-3 rounded-2xl bg-[#0b0f17] border border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-slate-200 line-clamp-1">
                {primarySkill.title}
              </div>
              <p className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                {primarySkill.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer with Escrow Protection and CTA */}
      <div className="p-5 pt-0 mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2.5 py-1.5 rounded-xl border border-amber-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Escrow Protected</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickBook(guru);
          }}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/10 whitespace-nowrap active:scale-98"
        >
          Book Session
        </button>
      </div>
    </div>
  );
};
