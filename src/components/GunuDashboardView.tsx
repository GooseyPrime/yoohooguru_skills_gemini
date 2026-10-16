import React from 'react';
import { Booking, Gunu, Guru } from '../types/index.ts';
import { getAppointmentReminderInfo } from '../utils/escrow.ts';
import {
  Calendar,
  Clock,
  ShieldCheck,
  Video,
  MapPin,
  CheckCircle2,
  Star,
  MessageSquare,
  Award,
  Sparkles,
} from 'lucide-react';

interface GunuDashboardProps {
  gunu: Gunu;
  bookings: Booking[];
  gurus: Guru[];
  onOpenMeet: (url: string) => void;
  onCompleteAndRelease: (booking: Booking) => void;
  onOpenMessage: (guruId: string) => void;
  onExploreMore: () => void;
}

export const GunuDashboardView: React.FC<GunuDashboardProps> = ({
  gunu,
  bookings,
  gurus,
  onOpenMeet,
  onCompleteAndRelease,
  onOpenMessage,
  onExploreMore,
}) => {
  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-slate-100 animate-fade-in">
      {/* Learner Profile Strip with Prominent Rating */}
      <div className="bg-[#131927] rounded-3xl p-6 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={gunu.avatar}
              alt={gunu.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Award className="w-3.5 h-3.5 fill-slate-950" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{gunu.name}</h2>
              <span className="text-xs bg-amber-500/10 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                Verified Gunu Learner
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">{gunu.bio}</p>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1 font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {gunu.rating.toFixed(2)} Learner Rating ({gunu.reviewCount} endorsements)
              </span>
              <span>·</span>
              <span>{gunu.location.city}, {gunu.location.state}</span>
              <span>·</span>
              <span className="text-emerald-400">Stripe Payment Active</span>
            </div>
          </div>
        </div>

        <button
          onClick={onExploreMore}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shrink-0 self-end sm:self-center"
        >
          Explore More Gurus
        </button>
      </div>

      {/* Active Sessions & Escrow status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white">Upcoming Sessions & Escrow</h3>
            <p className="text-xs text-slate-400">
              Payments are protected in Yoohoo Escrow and only released when you confirm your session is done.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
            {activeBookings.length} Active Bookings
          </span>
        </div>

        {activeBookings.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#131927] border border-slate-800 text-center text-xs text-slate-400">
            No active sessions. Explore gurus to book a 1-on-1 session!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => {
              const reminder = getAppointmentReminderInfo(b);

              return (
                <div
                  key={b.id}
                  className="bg-[#131927] rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={b.guruAvatar}
                          alt={b.guruName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-white">{b.skillTitle}</h4>
                          <p className="text-xs text-slate-400">With {b.guruName}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          reminder.isToday
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {reminder.countdownText}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#0b0f17] text-xs space-y-1.5 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {b.scheduledDate} at {b.scheduledTime} ({b.durationHours} hr)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {b.sessionMode === 'video' ? (
                          <>
                            <Video className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Google Meet Video Session</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span className="truncate">{b.meetupLocation}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between text-amber-300">
                      <span className="flex items-center gap-1.5 font-bold">
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        Escrow: ${b.totalAmount.toFixed(2)} Secured
                      </span>
                      <span className="text-[11px] text-amber-300/80 font-mono">
                        Held until completion
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    {b.sessionMode === 'video' && b.googleMeetLink && (
                      <button
                        onClick={() => onOpenMeet(b.googleMeetLink!)}
                        className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" /> Join Meet
                      </button>
                    )}

                    <button
                      onClick={() => onOpenMessage(b.guruId)}
                      className="p-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Message Guru"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onCompleteAndRelease(b)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-md flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" /> Complete & Release Escrow
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Endorsements Received from Master Gurus */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Verified Endorsements from Master Gurus ({gunu.reviewsReceived.length})
            </h3>
            <p className="text-xs text-slate-400">
              Gurus review Gunus on punctuality, preparation, and skill retention after completed sessions.
            </p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
            {gunu.rating.toFixed(2)} ★ Average
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gunu.reviewsReceived.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#131927] rounded-2xl p-5 border border-slate-800 shadow-md space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.guruAvatar}
                    alt={rev.guruName}
                    className="w-10 h-10 rounded-xl object-cover border border-amber-400/60"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{rev.guruName}</h4>
                    <span className="text-[11px] text-amber-400 font-medium">{rev.guruTitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
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

              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800/80">
                <span>Course: <strong>{rev.skillTaught}</strong></span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Sessions History */}
      {pastBookings.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="font-bold text-lg text-white">Completed Sessions & Escrow History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastBookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#131927] rounded-2xl p-4 border border-slate-800 shadow-md flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={b.guruAvatar}
                    alt={b.guruName}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-white">{b.skillTitle}</h4>
                    <p className="text-[11px] text-slate-400">
                      With {b.guruName} · Completed on {b.scheduledDate}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium mt-0.5">
                      <ShieldCheck className="w-3 h-3" /> Escrow Released (${b.guruSubtotal.toFixed(2)})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-400 justify-end">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-xs font-bold text-white">5.0</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold">Verified Review</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
