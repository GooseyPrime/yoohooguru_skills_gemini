import React, { useState } from 'react';
import { Guru, Gunu, Booking, SkillOffering } from '../types/index.ts';
import { calculateEscrowFee, generateGoogleMeetLink } from '../utils/escrow.ts';
import {
  X,
  CreditCard,
  ShieldCheck,
  Video,
  MapPin,
  Calendar,
  Clock,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface BookingModalProps {
  guru: Guru;
  gunu: Gunu;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  guru,
  gunu,
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillOffering>(guru.skills[0]);
  const [sessionMode, setSessionMode] = useState<'in-person' | 'video'>(
    guru.sessionModes === 'video' ? 'video' : 'in-person'
  );
  const [durationHours, setDurationHours] = useState<number>(1);
  const [scheduledDate, setScheduledDate] = useState<string>('2026-10-19');
  const [scheduledTime, setScheduledTime] = useState<string>('14:00');
  const [learningGoals, setLearningGoals] = useState<string>('');
  const [selectedVenue, setSelectedVenue] = useState<string>(
    guru.meetupSuggestions?.[0] || `${guru.location.city} Studio / Workshop`
  );

  // Stripe Payment Form state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!isOpen) return null;

  const hourlyRate = selectedSkill?.hourlyRate || guru.hourlyRate;
  const escrowFee = calculateEscrowFee(hourlyRate, durationHours);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const bookingId = `book-${Date.now()}`;
      const googleMeetLink = sessionMode === 'video' ? generateGoogleMeetLink(bookingId) : undefined;

      const newBooking: Booking = {
        id: bookingId,
        guruId: guru.id,
        guruName: guru.name,
        guruAvatar: guru.avatar,
        guruRate: hourlyRate,
        gunuId: gunu.id,
        gunuName: gunu.name,
        gunuAvatar: gunu.avatar,
        skillId: selectedSkill.id,
        skillTitle: selectedSkill.title,
        sessionMode,
        scheduledDate,
        scheduledTime,
        durationHours,
        status: 'confirmed',
        guruSubtotal: escrowFee.guruSubtotal,
        platformFee: escrowFee.platformFee,
        totalAmount: escrowFee.totalAmount,
        escrowStatus: 'HELD_IN_ESCROW',
        stripePaymentIntentId: `pi_${Date.now()}_stripe_escrow`,
        meetupLocation: sessionMode === 'in-person' ? selectedVenue : undefined,
        googleMeetLink,
        learningGoals: learningGoals || 'Master fundamental techniques and ask questions.',
        reviewed: false,
        reminderSent: false,
        createdAt: new Date().toISOString(),
      };

      setIsProcessing(false);
      setBookingSuccess(true);

      setTimeout(() => {
        onConfirmBooking(newBooking);
        onClose();
        setBookingSuccess(false);
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f1523] rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden my-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-[#131927]">
          <div className="flex items-center gap-3.5">
            <img
              src={guru.avatar}
              alt={guru.name}
              className="w-11 h-11 rounded-xl object-cover border border-amber-400"
            />
            <div>
              <h2 className="text-lg font-bold text-white">
                Book Session with {guru.name}
              </h2>
              <p className="text-xs text-slate-400">
                {guru.title} · {guru.location.city}, {guru.location.state}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {bookingSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">Session Confirmed!</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your payment of <strong className="text-amber-400 font-mono">${escrowFee.totalAmount}</strong> is
              now safely locked in <strong className="text-white">Yoohoo Escrow</strong>. The Guru has received your booking
              request.
            </p>
            {sessionMode === 'video' && (
              <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 max-w-sm mx-auto">
                Google Meet link has been generated and added to your sessions!
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmitBooking} className="p-6 space-y-6">
            {/* Step 1: Skill & Mode Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Select Skill to Learn
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {guru.skills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => setSelectedSkill(skill)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      selectedSkill.id === skill.id
                        ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/30'
                        : 'border-slate-800 hover:border-slate-700 bg-[#0b0f17]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-xs text-white">{skill.title}</span>
                      <span className="font-mono text-xs font-bold text-amber-400">
                        ${skill.hourlyRate}/h
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1 line-clamp-1">
                      {skill.level} · {skill.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Format & Venue */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Session Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                {guru.sessionModes !== 'video' && (
                  <button
                    type="button"
                    onClick={() => setSessionMode('in-person')}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                      sessionMode === 'in-person'
                        ? 'border-amber-400 bg-amber-500/15 text-white font-semibold ring-2 ring-amber-400/30'
                        : 'border-slate-800 text-slate-300 hover:bg-slate-800/50 bg-[#0b0f17]'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <div className="text-left">
                      <div className="text-xs font-bold">In-Person Meetup</div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        At Guru's workshop or studio
                      </div>
                    </div>
                  </button>
                )}

                {guru.sessionModes !== 'in-person' && (
                  <button
                    type="button"
                    onClick={() => setSessionMode('video')}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                      sessionMode === 'video'
                        ? 'border-emerald-400 bg-emerald-950/40 text-emerald-300 font-semibold ring-2 ring-emerald-400/30'
                        : 'border-slate-800 text-slate-300 hover:bg-slate-800/50 bg-[#0b0f17]'
                    }`}
                  >
                    <Video className="w-4 h-4 text-emerald-400" />
                    <div className="text-left">
                      <div className="text-xs font-bold">Google Meet Video</div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        Live 1-on-1 screen share & video
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {sessionMode === 'in-person' && guru.meetupSuggestions && (
                <div className="pt-1">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Suggested Local Meetup Location:
                  </label>
                  <select
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-[#0b0f17] text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {guru.meetupSuggestions.map((venue, idx) => (
                      <option key={idx} value={venue} className="bg-[#0b0f17] text-white">
                        {venue}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Step 3: Date, Time & Duration */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Date & Time
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Date</span>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min="2026-10-17"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-[#0b0f17] text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Start Time</span>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-[#0b0f17] text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Duration</span>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-[#0b0f17] text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value={1} className="bg-[#0b0f17]">1 hour</option>
                    <option value={1.5} className="bg-[#0b0f17]">1.5 hours</option>
                    <option value={2} className="bg-[#0b0f17]">2 hours</option>
                    <option value={3} className="bg-[#0b0f17]">3 hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Learning Goals */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                4. What would you like to achieve?
              </label>
              <textarea
                rows={2}
                value={learningGoals}
                onChange={(e) => setLearningGoals(e.target.value)}
                placeholder="E.g., I'm struggling with Travis picking bass notes or want to master scoring bread..."
                className="w-full text-xs p-3 rounded-xl border border-slate-700 bg-[#0b0f17] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Step 5: Escrow Fee Breakdown & Stripe Payment */}
            <div className="rounded-2xl p-4 bg-[#131a29] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Yoohoo Escrow & Pricing Guarantee
                </span>
                <span className="text-[11px] text-amber-300">100% Refundable until session starts</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>
                    Guru Session Rate (${hourlyRate}/hr × {durationHours} hr{durationHours > 1 ? 's' : ''})
                  </span>
                  <span className="font-mono font-medium text-white">${escrowFee.sessionFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Gunu Platform Fee</span>
                  <span className="font-mono">$0.00 (Zero Surcharge for Gunus)</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800 text-sm">
                  <span>Total Held in Escrow:</span>
                  <span className="font-mono text-amber-400 text-base">${escrowFee.totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  You only pay the Guru's session fee. Funds are 100% secured in escrow until you confirm completion.
                </p>
              </div>

              {/* Stripe Payment Input simulation */}
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    Pay via Stripe
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" /> 256-bit encrypted
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="col-span-2 text-xs p-2.5 rounded-lg border border-slate-700 bg-[#0b0f17] text-white"
                    placeholder="Card Number"
                    required
                  />
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="text-xs p-2.5 rounded-lg border border-slate-700 bg-[#0b0f17] text-white text-center"
                    placeholder="MM/YY"
                    required
                  />
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="text-xs p-2.5 rounded-lg border border-slate-700 bg-[#0b0f17] text-white text-center"
                    placeholder="CVC"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-amber-500/10 flex items-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>Processing Stripe Escrow...</>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Confirm & Hold ${escrowFee.totalAmount.toFixed(2)} in Escrow
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
