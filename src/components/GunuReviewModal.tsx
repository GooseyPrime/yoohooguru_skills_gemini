import React, { useState } from 'react';
import { Booking, GunuReview } from '../types/index.ts';
import { X, Star, Award, CheckCircle, Sparkles } from 'lucide-react';

interface GunuReviewModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (bookingId: string, review: GunuReview) => void;
}

const LEARNER_TAGS = [
  'Super Prepared',
  'Fast Learner',
  'Punctual & Reliable',
  'Asks Great Questions',
  'Receptive to Feedback',
  'Respectful & Kind',
  'Strong Muscle Memory',
  'Practiced Materials',
];

export const GunuReviewModal: React.FC<GunuReviewModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Super Prepared', 'Fast Learner']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const review: GunuReview = {
      id: `grev-${Date.now()}`,
      bookingId: booking.id,
      guruId: booking.guruId,
      guruName: booking.guruName,
      guruAvatar: booking.guruAvatar,
      rating,
      comment: comment.trim() || `${booking.gunuName} was an outstanding learner during our ${booking.skillTitle} session.`,
      date: new Date().toISOString().split('T')[0],
      skillTaught: booking.skillTitle,
      tags: selectedTags,
    };

    setTimeout(() => {
      onSubmitReview(booking.id, review);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5:
        return 'Outstanding Gunu (5.0)';
      case 4:
        return 'Great Learner (4.0)';
      case 3:
        return 'Good Session (3.0)';
      case 2:
        return 'Needs Improvement (2.0)';
      default:
        return 'Challenging (1.0)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="bg-[#0f1523] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={booking.gunuAvatar}
            alt={booking.gunuName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-500/10 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                Verified Session Completed
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">Rate & Review {booking.gunuName}</h3>
            <p className="text-xs text-slate-400">
              {booking.skillTitle} · {booking.scheduledDate}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating Section */}
          <div className="p-4 rounded-2xl bg-[#131927] border border-slate-800 space-y-2 text-center">
            <span className="text-xs font-semibold text-slate-400 block">
              Overall Learner Rating
            </span>

            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-600 hover:scale-115 transition-transform"
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

            <p className="text-xs font-bold text-amber-400">
              {getRatingLabel(hoverRating || rating)}
            </p>
          </div>

          {/* Learner Endorsement Badges */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Endorse Learner Strengths (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {LEARNER_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs'
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

          {/* Written Feedback Textarea */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Written Endorsement & Session Feedback
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe how the learner performed, their preparation, attentiveness, and what other Gurus should know about teaching them..."
              className="w-full text-xs p-3 rounded-2xl border border-slate-800 bg-[#0b0f17] text-slate-200 focus:outline-hidden focus:border-amber-500 leading-relaxed placeholder:text-slate-600"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1">
              This review will be published to {booking.gunuName}'s verified Gunu profile as an endorsement from a master Guru.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Submitting Endorsement...'
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  Publish Verified Endorsement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
