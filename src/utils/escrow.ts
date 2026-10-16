import type { Booking, GuruEarningsSummary } from '../types/index.ts';

export const PLATFORM_FEE_PERCENTAGE = 0.15; // Site retains 15% on paid sessions
export const GURU_SETUP_FEE = 4.99; // $4.99 one-time setup fee for Gurus

export interface EscrowBreakdown {
  sessionFee: number;
  guruSubtotal: number; // 85% net released to Guru
  platformFee: number; // 15% retained by Yoohoo.Guru
  totalAmount: number; // Exactly what Gunu pays (no added buyer fees)
  platformFeePercentage: number;
}

/**
 * Calculates the price breakdown for an expert session.
 * The Gunu ONLY pays the session fee charged by the Guru.
 * The site retains 15% on paid sessions.
 * The total is held in escrow until session completion.
 */
export function calculateEscrowFee(
  hourlyRate: number,
  durationHours: number = 1,
  feePercentage: number = PLATFORM_FEE_PERCENTAGE
): EscrowBreakdown {
  if (hourlyRate < 0 || durationHours <= 0) {
    throw new Error('Invalid rate or duration');
  }

  // The Gunu ONLY pays the session fee charged by the Guru
  const totalAmount = Math.round(hourlyRate * durationHours * 100) / 100;
  // The site retains 15% on paid sessions
  const platformFee = Math.round(totalAmount * feePercentage * 100) / 100;
  // Guru receives net after 15% platform retention
  const guruSubtotal = Math.round((totalAmount - platformFee) * 100) / 100;

  return {
    sessionFee: totalAmount,
    guruSubtotal,
    platformFee,
    totalAmount,
    platformFeePercentage: feePercentage * 100,
  };
}

/**
 * Releases escrow funds once a session is marked complete.
 */
export function releaseEscrowFunds(booking: Booking): Booking {
  if (booking.escrowStatus !== 'HELD_IN_ESCROW') {
    throw new Error(`Cannot release escrow from status ${booking.escrowStatus}`);
  }

  return {
    ...booking,
    status: 'completed',
    escrowStatus: 'RELEASED_TO_GURU',
    escrowReleasedAt: new Date().toISOString(),
  };
}

/**
 * Calculates earnings summary for a Guru based on all their bookings.
 */
export function calculateGuruEarnings(bookings: Booking[], guruId?: string): GuruEarningsSummary {
  const guruBookings = guruId ? bookings.filter((b) => b.guruId === guruId) : bookings;

  let grossEarnings = 0;
  let platformFeesPaid = 0;
  let heldInEscrow = 0;
  let availablePayout = 0;
  let completedSessions = 0;
  let escrowReleaseEligibleCount = 0;

  for (const b of guruBookings) {
    if (b.status === 'cancelled') continue;

    grossEarnings += b.totalAmount;
    platformFeesPaid += b.platformFee;

    if (b.escrowStatus === 'HELD_IN_ESCROW') {
      heldInEscrow += b.guruSubtotal;
      escrowReleaseEligibleCount++;
    } else if (b.escrowStatus === 'RELEASED_TO_GURU') {
      availablePayout += b.guruSubtotal;
      completedSessions++;
    }
  }

  return {
    grossEarnings: Math.round(grossEarnings * 100) / 100,
    platformFeesPaid: Math.round(platformFeesPaid * 100) / 100,
    heldInEscrow: Math.round(heldInEscrow * 100) / 100,
    availablePayout: Math.round(availablePayout * 100) / 100,
    totalPaidOut: 0,
    completedSessions,
    escrowReleaseEligibleCount,
  };
}

/**
 * Generates a realistic Google Meet session link for long distance / video sessions.
 */
export function generateGoogleMeetLink(sessionId: string): string {
  const cleanId = sessionId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().padEnd(10, 'yoohooguru');
  const code = `${cleanId.slice(0, 3)}-${cleanId.slice(3, 7)}-${cleanId.slice(7, 10)}`;
  return `https://meet.google.com/${code}`;
}

/**
 * Computes great-circle distance between two GPS coordinates using the Haversine formula (in miles).
 */
export function calculateDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Checks if a location is within a given radius.
 */
export function isWithinRadius(
  userLat: number,
  userLng: number,
  targetLat: number,
  targetLng: number,
  radiusMiles: number
): boolean {
  return calculateDistanceMiles(userLat, userLng, targetLat, targetLng) <= radiusMiles;
}

/**
 * Computes countdown and appointment reminder details.
 */
export function getAppointmentReminderInfo(booking: Booking, now: Date = new Date('2026-10-16T15:42:18-07:00')): {
  timeUntilMs: number;
  isToday: boolean;
  isPast: boolean;
  countdownText: string;
  badgeColor: string;
} {
  const targetDateStr = `${booking.scheduledDate}T${booking.scheduledTime}:00`;
  const targetDate = new Date(targetDateStr);
  const diffMs = targetDate.getTime() - now.getTime();

  const isPast = diffMs < 0;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const isToday =
    targetDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);

  let countdownText = '';
  let badgeColor = 'bg-slate-700 text-slate-200';

  if (isPast) {
    countdownText = 'Session time arrived';
    badgeColor = 'bg-emerald-950 text-emerald-400 border border-emerald-500/30';
  } else if (diffHours < 1) {
    countdownText = 'Starts in < 1 hour';
    badgeColor = 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse';
  } else if (diffHours < 24) {
    countdownText = `Starts today in ${diffHours}h`;
    badgeColor = 'bg-amber-950 text-amber-300 border border-amber-500/30';
  } else if (diffDays === 1) {
    countdownText = 'Tomorrow';
    badgeColor = 'bg-blue-950 text-blue-300 border border-blue-500/30';
  } else {
    countdownText = `In ${diffDays} days`;
    badgeColor = 'bg-slate-800 text-slate-300';
  }

  return {
    timeUntilMs: diffMs,
    isToday,
    isPast,
    countdownText,
    badgeColor,
  };
}
