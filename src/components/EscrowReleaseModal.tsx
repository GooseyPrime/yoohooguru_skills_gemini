import React, { useState } from 'react';
import { Booking, ReviewAspects } from '../types/index.ts';
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface EscrowReleaseModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRelease: (
    bookingId: string,
    reviewData?: {
      rating: number;
      comment: string;
      aspects?: ReviewAspects;
      tags?: string[];
    }
  ) => void;
}

const GURU_STRENGTH_TAGS = [
  'Crystal Clear Explanations',
  'Patient & Encouraging',
  'Heavy Hands-On Practice',
  'Custom Tailored Tips',
  'Master Technique',
  'Warm Atmosphere',
  'Actionable Next Steps',
];

export const EscrowReleaseModal: React.FC<EscrowReleaseModalProps> = ({
  booking,
  isOpen,
  onClose,
  onConfirmRelease,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Crystal Clear Explanations',
    'Heavy Hands-On Practice',
  ]);
  const [knowledgeScore, setKnowledgeScore] = useState<number>(5);
  const [commScore, setCommScore] = useState<number>(5);
  const [practicalScore, setPracticalScore] = useState<number>(5);

  const [confirmedCheck, setConfirmedCheck] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [releasedDone, setReleasedDone] = useState<boolean>(false);

  if (!isOpen || !booking) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedCheck) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setReleasedDone(true);

      setTimeout(() => {
        onConfirmRelease(booking.id, {
          rating,
          comment:
            comment.trim() ||
            `Outstanding session with ${booking.guruName} on ${booking.skillTitle}! Masterful hands-on instruction.`,
          aspects: {
            knowledge: knowledgeScore,
            communication: commScore,
            practicalSkills: practicalScore,
          },
          tags: selectedTags,
        });
        setReleasedDone(false);
        onClose();
      }, 1400);
    }, 700);
  };

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5:
        return '5.0 - Masterful Experience!';
      case 4:
        return '4.0 - Very Good Session';
      case 3:
        return '3.0 - Met Expectations';
      case 2:
        return '2.0 - Below Expectations';
      default:
        return '1.0 - Unsatisfactory';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0f1523] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden my-8 text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#131927]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">
              Complete Session & Release Escrow
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {releasedDone ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Funds Released & Review Published!</h4>
            <p className="text-xs text-slate-300">
              <strong className="text-white">${booking.guruSubtotal.toFixed(2)}</strong> has been transferred from Yoohoo Escrow to {booking.guruName}'s available payout balance.
            </p>
            <p className="text-xs text-amber-400 font-semibold pt-1">
              Your 5-star rating and written review are now verified and visible on {booking.guruName}'s profile!
            </p>
          </div>
        ) : (
          <form onSubmit={handleRelease} className="p-6 space-y-5">
            {/* Session info */}
            <div className="p-4 rounded-2xl bg-[#131927] border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between font-bold text-white">
                <span>{booking.skillTitle}</span>
                <span>{booking.sessionMode === 'video' ? 'Google Meet Video' : 'Local Meetup'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Guru: {booking.guruName}</span>
                <span>{booking.scheduledDate} · {booking.scheduledTime}</span>
              </div>

              {/* Escrow ledger breakdown */}
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Authorized in Escrow (Stripe):</span>
                  <span className="font-mono text-slate-200">${booking.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Yoohoo Platform Retention (15%):</span>
                  <span className="font-mono text-slate-200">-${booking.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400 text-sm pt-1 border-t border-dashed border-slate-700">
                  <span>Net Amount Released to Guru (85%):</span>
                  <span className="font-mono">${booking.guruSubtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Overall Rating */}
            <div className="p-4 rounded-2xl bg-[#131927] border border-slate-800 space-y-2 text-center">
              <span className="text-xs font-semibold text-slate-400 block">
                Overall Session Rating for {booking.guruName}
              </span>
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-115 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-400">
                {getRatingLabel(hoverRating || rating)}
              </span>
            </div>

            {/* Criteria mini sliders/toggles */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#131927] border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Instruction Clarity</span>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCommScore(s)}
                      className={`w-3.5 h-3.5 rounded-full ${
                        s <= commScore ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#131927] border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Knowledge Depth</span>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setKnowledgeScore(s)}
                      className={`w-3.5 h-3.5 rounded-full ${
                        s <= knowledgeScore ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#131927] border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Hands-On Practice</span>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPracticalScore(s)}
                      className={`w-3.5 h-3.5 rounded-full ${
                        s <= practicalScore ? 'bg-amber-400' : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                Highlight Guru Strengths
              </span>
              <div className="flex flex-wrap gap-1.5">
                {GURU_STRENGTH_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-[#131927] text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isSelected && <span className="mr-1 text-amber-400">✓</span>}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written review */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Written Review for Other Gunus (Published upon completion)
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you build or learn? How clear was the guidance? What advice would you give to future learners?"
                className="w-full text-xs p-3 rounded-xl border border-slate-800 bg-[#0b0f17] text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 leading-relaxed"
                required
              />
            </div>

            {/* Agreement check */}
            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={confirmedCheck}
                onChange={(e) => setConfirmedCheck(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-[#0b0f17] text-emerald-500 focus:ring-emerald-500"
                required
              />
              <span>
                I confirm the session is complete and authorize Yoohoo.Guru to release{' '}
                <strong className="text-white">${booking.guruSubtotal.toFixed(2)}</strong> from Escrow to the Guru.
              </span>
            </label>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Not Yet
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !confirmedCheck}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors shadow-md disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>Releasing Escrow...</>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    Release ${booking.guruSubtotal.toFixed(2)} & Post Review
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
