import React from 'react';
import { MascotBadge } from './MascotBadge.tsx';
import { YoohooLogo } from './YoohooLogo.tsx';
import {
  Search,
  MapPin,
  Compass,
  Video,
  ShieldCheck,
  Star,
  Users,
  Award,
  Lock,
} from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  radiusMiles: number;
  onChangeRadius: (miles: number) => void;
  formatFilter: 'all' | 'in-person' | 'video';
  onChangeFormat: (fmt: 'all' | 'in-person' | 'video') => void;
  userCity: string;
  onUseCurrentLocation: () => void;
  totalGurusCount: number;
}

const CATEGORIES = [
  'All Skills',
  'Music',
  'Trades & DIY',
  'Culinary',
  'Tech & Code',
  'Art & Crafts',
  'Fitness',
  'Languages',
];

export const HeroBanner: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  radiusMiles,
  onChangeRadius,
  formatFilter,
  onChangeFormat,
  userCity,
  onUseCurrentLocation,
  totalGurusCount,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#131926] via-[#0e1320] to-[#0b0f17] pt-12 pb-10 px-4 sm:px-6 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Hero Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Value Proposition & Typography */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Yoohoo Escrow Protection · Guaranteed Hands-On Mastery</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08] text-balance">
              Master real skills from verified Gurus.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              Book private sessions with master luthiers, sourdough bakers, fine carpenters, and software architects. Meet locally in studio workshops or via Google Meet — your payment is locked in <strong className="text-amber-400">Yoohoo Escrow</strong> until you're completely satisfied.
            </p>

            {/* Trust Metric Strip */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white text-sm">$240K+</span>
                <span className="text-slate-400">Escrow Protected</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white">4.96/5.0</span>
                <span className="text-slate-400">(1,400+ reviews)</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">Stripe Escrow Verified</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual High-Res Cards Showcase with Bigfoot Mascot */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl p-5 bg-[#131927]/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-4">
              {/* Mascot & Brand Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <MascotBadge size={48} className="drop-shadow-md" />
                  <div>
                    <h2 className="font-extrabold text-sm text-white">Yoohoo.Guru</h2>
                    <p className="text-[11px] text-slate-400">Skating, strumming & building since day one</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Platform
                </span>
              </div>

              {/* High-Resolution Workshop Visual Previews */}
              <div className="grid grid-cols-2 gap-3">
                <div className="group relative rounded-2xl overflow-hidden h-32 bg-slate-900 shadow-md border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80"
                    alt="Acoustic Guitar Workshop"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                    <span className="text-[11px] font-bold leading-tight">Luthier Workshop</span>
                    <span className="text-[9px] text-amber-300">Fingerpicking & Strumming</span>
                  </div>
                </div>

                <div className="group relative rounded-2xl overflow-hidden h-32 bg-slate-900 shadow-md border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
                    alt="Artisan Sourdough"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                    <span className="text-[11px] font-bold leading-tight">Country Sourdough</span>
                    <span className="text-[9px] text-amber-300">80% Hydration & Steam</span>
                  </div>
                </div>
              </div>

              {/* Escrow Guarantee quote */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-medium leading-snug">
                    Zero risk: Escrow released only after you say the session was a success.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Search & Location Filter Control Bar */}
        <div className="bg-[#131927]/95 rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-800 space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search input */}
            <div className="md:col-span-5 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search skills, e.g., fingerpicking guitar, sourdough, dovetails, React..."
                className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 rounded-2xl bg-[#0b0f17] border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Distance Radius dropdown */}
            <div className="md:col-span-3 flex items-center gap-2 bg-[#0b0f17] border border-slate-700/80 rounded-2xl px-3.5 py-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase leading-none">
                  Search Radius
                </span>
                <select
                  value={radiusMiles}
                  onChange={(e) => onChangeRadius(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer mt-0.5"
                >
                  <option value={5} className="bg-[#0b0f17] text-white">Within 5 miles</option>
                  <option value={10} className="bg-[#0b0f17] text-white">Within 10 miles</option>
                  <option value={25} className="bg-[#0b0f17] text-white">Within 25 miles</option>
                  <option value={50} className="bg-[#0b0f17] text-white">Within 50 miles</option>
                  <option value={100} className="bg-[#0b0f17] text-white">Within 100 miles</option>
                  <option value={9999} className="bg-[#0b0f17] text-white">Nationwide (Remote)</option>
                </select>
              </div>
            </div>

            {/* In-Person vs Video format buttons */}
            <div className="md:col-span-4 flex items-center p-1 bg-[#0b0f17] rounded-2xl gap-1 border border-slate-800">
              <button
                type="button"
                onClick={() => onChangeFormat('all')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  formatFilter === 'all'
                    ? 'bg-[#1c2333] text-amber-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Formats
              </button>
              <button
                type="button"
                onClick={() => onChangeFormat('in-person')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  formatFilter === 'in-person'
                    ? 'bg-[#1c2333] text-amber-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> In-Person
              </button>
              <button
                type="button"
                onClick={() => onChangeFormat('video')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  formatFilter === 'video'
                    ? 'bg-[#1c2333] text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-emerald-400" /> Google Meet
              </button>
            </div>
          </div>

          {/* Location indicator & Category filter bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
            {/* Category horizontal scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat === 'All Skills' ? 'All' : cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    (selectedCategory === 'All' && cat === 'All Skills') || selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-[#1c2333] text-slate-300 hover:bg-[#252e42] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Geolocation trigger */}
            <button
              onClick={onUseCurrentLocation}
              className="text-slate-400 hover:text-amber-400 flex items-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0 self-end sm:self-center transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Near: <strong className="text-slate-200 underline decoration-amber-400">{userCity}</strong> (Click to geolocate)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
