import React, { useState } from 'react';
import { Guru, Booking, SkillOffering, AvailabilitySlot } from '../types/index.ts';
import { calculateGuruEarnings } from '../utils/escrow.ts';
import {
  DollarSign,
  ShieldCheck,
  Calendar,
  Clock,
  Plus,
  Video,
  MapPin,
  TrendingUp,
  Wallet,
  Star,
  Award,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface GuruPortalProps {
  guru: Guru;
  bookings: Booking[];
  onUpdateAvailability: (availability: AvailabilitySlot[]) => void;
  onAddSkill: (newSkill: SkillOffering) => void;
  onOpenReviewGunu: (booking: Booking) => void;
  onOpenMeet: (url: string) => void;
  onOpenMessage: (gunuId: string) => void;
}

export const GuruPortalView: React.FC<GuruPortalProps> = ({
  guru,
  bookings,
  onUpdateAvailability,
  onAddSkill,
  onOpenReviewGunu,
  onOpenMeet,
  onOpenMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'earnings' | 'reviews' | 'availability' | 'skills'>('earnings');
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Availability state
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(guru.availability);

  // Add skill form state
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<SkillOffering['category']>('Music');
  const [newRate, setNewRate] = useState<number>(guru.hourlyRate);
  const [newDescription, setNewDescription] = useState('');

  // Filter bookings for this Guru
  const guruBookings = bookings.filter((b) => b.guruId === guru.id);
  const activeBookings = guruBookings.filter((b) => b.status === 'confirmed');
  const completedBookings = guruBookings.filter((b) => b.status === 'completed');

  // Compute live earnings
  const earnings = calculateGuruEarnings(guruBookings);

  const handlePayout = () => {
    if (earnings.availablePayout <= 0) return;
    setPayoutRequested(true);
    setTimeout(() => {
      setPayoutRequested(false);
      alert(`Stripe Payout initiated: $${earnings.availablePayout.toFixed(2)} is being deposited to your account.`);
    }, 1500);
  };

  const handleToggleDay = (index: number) => {
    const updated = [...availability];
    updated[index].active = !updated[index].active;
    setAvailability(updated);
    onUpdateAvailability(updated);
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
    onUpdateAvailability(updated);
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSkill: SkillOffering = {
      id: `skill-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      hourlyRate: Number(newRate),
      level: 'All Levels',
      description: newDescription.trim() || 'Hands-on mentorship session.',
    };

    onAddSkill(newSkill);
    setShowAddSkill(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-slate-100 animate-fade-in">
      {/* Header Profile Summary */}
      <div className="bg-[#131927] rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={guru.avatar}
              alt={guru.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Award className="w-3.5 h-3.5 fill-slate-950" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{guru.name}</h2>
              <span className="text-xs bg-amber-500/10 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                Verified Guru Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {guru.title} · Base rate ${guru.hourlyRate}/hr
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1 font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {guru.rating.toFixed(2)} Rating ({guru.reviewCount} reviews)
              </span>
              <span>·</span>
              <span>{completedBookings.length} completed sessions</span>
              <span>·</span>
              <span>{guru.responseRate}</span>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 p-1 bg-[#0b0f17] rounded-2xl border border-slate-800 flex-wrap">
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'earnings'
                ? 'bg-[#1c2333] text-amber-400 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Earnings & Escrow
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'reviews'
                ? 'bg-[#1c2333] text-amber-400 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ratings & Reviews ({guru.reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'availability'
                ? 'bg-[#1c2333] text-amber-400 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Availability
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-colors ${
              activeTab === 'skills'
                ? 'bg-[#1c2333] text-amber-400 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Skills ({guru.skills.length})
          </button>
        </div>
      </div>

      {/* Tab: Earnings & Escrow */}
      {activeTab === 'earnings' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Available Payout */}
            <div className="p-5 rounded-2xl bg-[#131927] border border-slate-800 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Available for Payout</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-mono text-2xl font-black text-emerald-400 tabular-nums">
                ${earnings.availablePayout.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-500">Released from completed sessions</p>
            </div>

            {/* Held in Escrow */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-amber-300 text-xs font-bold">
                <span>Held in Yoohoo Escrow</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="font-mono text-2xl font-black text-amber-400 tabular-nums">
                ${earnings.heldInEscrow.toFixed(2)}
              </div>
              <p className="text-[11px] text-amber-300/80">
                {earnings.escrowReleaseEligibleCount} active session(s) pending completion
              </p>
            </div>

            {/* Total Gross Volume */}
            <div className="p-5 rounded-2xl bg-[#131927] border border-slate-800 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Total Gross Bookings</span>
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>
              <div className="font-mono text-2xl font-black text-white tabular-nums">
                ${earnings.grossEarnings.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-500">Total client transaction volume</p>
            </div>

            {/* Platform Maintenance Fees */}
            <div className="p-5 rounded-2xl bg-[#131927] border border-slate-800 shadow-xl space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                <span>Platform Fees (15%)</span>
                <DollarSign className="w-4 h-4 text-slate-500" />
              </div>
              <div className="font-mono text-2xl font-black text-slate-400 tabular-nums">
                ${earnings.platformFeesPaid.toFixed(2)}
              </div>
              <p className="text-[11px] text-slate-500">15% retained on paid sessions (Gunus pay 0% extra)</p>
            </div>
          </div>

          {/* Stripe Connect & Setup Fee Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 to-amber-700 text-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-black text-base text-slate-950">Stripe Connect Payout Portal</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-950 text-amber-400">
                  $4.99 Setup Fee Paid
                </span>
              </div>
              <p className="text-xs text-amber-950/90 font-medium max-w-lg">
                Your Stripe merchant account (ending in ••4291) is active. The one-time $4.99 setup fee is verified. The platform retains 15% on paid sessions; your learners pay only your advertised session fee.
              </p>
            </div>

            <button
              onClick={handlePayout}
              disabled={earnings.availablePayout <= 0 || payoutRequested}
              className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs transition-colors shadow-md disabled:opacity-50 whitespace-nowrap"
            >
              {payoutRequested ? (
                'Payout of $' + earnings.availablePayout.toFixed(2) + ' Initiated!'
              ) : (
                'Withdraw $' + earnings.availablePayout.toFixed(2) + ' via Stripe'
              )}
            </button>
          </div>

          {/* Active Client Bookings & Held Escrow */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Upcoming Client Sessions ({activeBookings.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Payments are held securely in Yoohoo Escrow and released immediately upon session completion.
                </p>
              </div>
            </div>

            {activeBookings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#131927] border border-slate-800 text-center text-xs text-slate-400">
                No active client bookings right now. Share your profile link or adjust your availability below!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-[#131927] border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.gunuAvatar}
                          alt={b.gunuName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-white">{b.gunuName}</h4>
                          <span className="text-xs text-amber-400">{b.skillTitle}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                        ${b.guruSubtotal.toFixed(2)} in Escrow
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#0b0f17] text-xs space-y-1 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.scheduledDate} at {b.scheduledTime} ({b.durationHours} hr)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {b.sessionMode === 'video' ? (
                          <>
                            <Video className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Google Meet Video Session</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span className="truncate">{b.meetupLocation || 'Local Studio Meetup'}</span>
                          </>
                        )}
                      </div>
                      {b.learningGoals && (
                        <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                          Goals: "{b.learningGoals}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {b.googleMeetLink && (
                        <button
                          onClick={() => onOpenMeet(b.googleMeetLink!)}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" /> Join Google Meet
                        </button>
                      )}
                      <button
                        onClick={() => onOpenMessage(b.gunuId)}
                        className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Message Gunu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Sessions & Rate Learner Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Completed Sessions & Learner Ratings ({completedBookings.length})
              </h3>
              <p className="text-xs text-slate-400">
                Gurus and Gunus rate each other on a 5-star scale with written feedback to build verified reputation.
              </p>
            </div>

            {completedBookings.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#131927] border border-slate-800 text-center text-xs text-slate-400">
                Completed sessions will appear here with payout status and learner review options.
              </div>
            ) : (
              <div className="space-y-3">
                {completedBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-[#131927] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={b.gunuAvatar}
                        alt={b.gunuName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{b.gunuName}</h4>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                            Funds Released (${b.guruSubtotal.toFixed(2)})
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {b.skillTitle} · {b.scheduledDate}
                        </p>

                        {/* Gunu Review Received */}
                        {b.gunuReview && (
                          <div className="mt-2 text-xs bg-[#0b0f17] p-2.5 rounded-xl border border-slate-800">
                            <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px] mb-1">
                              {[...Array(b.gunuReview.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                              <span className="text-slate-300 ml-1">Learner Review:</span>
                            </div>
                            <p className="text-slate-300 italic text-[11px]">"{b.gunuReview.comment}"</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Guru Rate Gunu Action */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {b.reviewedByGuru ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                          <CheckCircle2 className="w-4 h-4" /> Endorsed Gunu
                        </div>
                      ) : (
                        <button
                          onClick={() => onOpenReviewGunu(b)}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                        >
                          <Star className="w-3.5 h-3.5 fill-slate-950" /> Rate & Endorse {b.gunuName}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Ratings & Reviews */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Prominent Rating Overview */}
          <div className="p-6 rounded-3xl bg-[#131927] border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Overall Guru Reputation
              </span>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                <span className="font-display text-5xl font-black text-amber-400">
                  {guru.rating.toFixed(2)}
                </span>
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {guru.reviewCount} verified ratings
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0b0f17] border border-slate-800 text-xs text-slate-300 max-w-md space-y-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Escrow Guarantee
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                All reviews on Yoohoo.Guru are strictly posted after a session has concluded and escrow funds are confirmed. No unverified reviews or rating tampering.
              </p>
            </div>
          </div>

          {/* List of Verified Reviews */}
          <div className="space-y-3">
            {guru.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-[#131927] border border-slate-800 shadow-md space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.gunuAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={rev.gunuName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{rev.gunuName}</h4>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-medium px-1.5 py-0.2 rounded border border-emerald-500/20">
                          Verified Learner
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.comment}"</p>

                {rev.tags && rev.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rev.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#0b0f17] text-[10px] text-amber-300 border border-slate-800 font-medium"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2 border-t border-slate-800/80">
                  <span>Skill: <strong>{rev.skillLearned}</strong></span>
                  <span>·</span>
                  <span className="capitalize">{rev.sessionMode} format</span>
                  <span>·</span>
                  <span className="text-emerald-400">100% Escrow Released</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Availability Schedule */}
      {activeTab === 'availability' && (
        <div className="bg-[#131927] rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
          <div>
            <h3 className="font-bold text-base text-white">Manage Weekly Availability</h3>
            <p className="text-xs text-slate-400">
              Gunus can only book times within your active slots. Buffer times are automatically maintained.
            </p>
          </div>

          <div className="space-y-3">
            {availability.map((slot, index) => (
              <div
                key={slot.dayOfWeek}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  slot.active
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-[#0b0f17] border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={slot.active}
                    onChange={() => handleToggleDay(index)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-700 bg-slate-900"
                  />
                  <span className="font-bold text-sm text-white w-16">{slot.dayName}</span>
                </div>

                {slot.active ? (
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-700 bg-[#0b0f17] text-white"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                      className="p-1.5 rounded-lg border border-slate-700 bg-[#0b0f17] text-white"
                    />
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">Unavailable</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Skills Offered */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Skill Listings</h3>
              <p className="text-xs text-slate-400">Showcase your expertise and adjust hourly teaching rates.</p>
            </div>
            <button
              onClick={() => setShowAddSkill(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> Add New Skill
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guru.skills.map((skill) => (
              <div
                key={skill.id}
                className="bg-[#131927] rounded-2xl p-5 border border-slate-800 shadow-xl space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-white">{skill.title}</h4>
                    <span className="text-xs text-amber-400 font-medium">
                      {skill.category} · {skill.level}
                    </span>
                  </div>
                  <span className="font-mono text-base font-bold text-white">
                    ${skill.hourlyRate}/hr
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{skill.description}</p>
              </div>
            ))}
          </div>

          {/* Add Skill Modal */}
          {showAddSkill && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-[#0f1523] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-800 space-y-4 text-slate-100">
                <h4 className="font-bold text-base text-white">Add New Teaching Skill</h4>
                <form onSubmit={handleCreateSkill} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Skill Title
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="E.g., Master Sourdough Starters or Blues Soloing"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-[#0b0f17] text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as any)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-[#0b0f17] text-white"
                      >
                        <option value="Music">Music</option>
                        <option value="Trades & DIY">Trades & DIY</option>
                        <option value="Culinary">Culinary</option>
                        <option value="Tech & Code">Tech & Code</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Art & Crafts">Art & Crafts</option>
                        <option value="Languages">Languages</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Hourly Rate ($)
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="300"
                        value={newRate}
                        onChange={(e) => setNewRate(Number(e.target.value))}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-[#0b0f17] text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Curriculum / Description
                    </label>
                    <textarea
                      rows={3}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Outline what learners will achieve and take home."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-[#0b0f17] text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddSkill(false)}
                      className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                    >
                      Publish Skill
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
