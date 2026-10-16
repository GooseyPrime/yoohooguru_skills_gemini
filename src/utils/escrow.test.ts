import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEscrowFee,
  releaseEscrowFunds,
  calculateGuruEarnings,
  generateGoogleMeetLink,
  calculateDistanceMiles,
  isWithinRadius,
  PLATFORM_FEE_PERCENTAGE,
  GURU_SETUP_FEE,
} from './escrow.ts';
import type { Booking } from '../types/index.ts';

test('Gunu only pays session fee charged by Guru, platform retains 15%', () => {
  const result = calculateEscrowFee(50, 2); // $50/hr * 2 hrs = $100 session fee
  assert.equal(result.sessionFee, 100);
  assert.equal(result.totalAmount, 100); // Gunu pays EXACTLY $100 (no added fee)
  assert.equal(result.platformFee, 15); // Platform retains 15% ($15)
  assert.equal(result.guruSubtotal, 85); // Guru receives net 85% ($85)
  assert.equal(result.platformFeePercentage, 15);
  assert.equal(GURU_SETUP_FEE, 4.99); // One-time setup fee for Gurus
});

test('calculateEscrowFee handles odd cents cleanly with 15% retention', () => {
  const result = calculateEscrowFee(45.5, 1.5); // 45.5 * 1.5 = 68.25
  assert.equal(result.totalAmount, 68.25);
  // 68.25 * 0.15 = 10.2375 -> rounded to 10.24
  assert.equal(result.platformFee, 10.24);
  // 68.25 - 10.24 = 58.01
  assert.equal(result.guruSubtotal, 58.01);
});

test('releaseEscrowFunds transitions status correctly', () => {
  const mockBooking: Booking = {
    id: 'book-1',
    guruId: 'guru-1',
    guruName: 'Jack Miller',
    guruAvatar: '',
    guruRate: 60,
    gunuId: 'gunu-1',
    gunuName: 'Alex Learner',
    gunuAvatar: '',
    skillId: 'skill-1',
    skillTitle: 'Guitar Basics',
    sessionMode: 'in-person',
    scheduledDate: '2026-10-20',
    scheduledTime: '14:00',
    durationHours: 1,
    status: 'confirmed',
    guruSubtotal: 51, // 85% of $60
    platformFee: 9, // 15% of $60
    totalAmount: 60, // Gunu paid $60
    escrowStatus: 'HELD_IN_ESCROW',
    stripePaymentIntentId: 'pi_test123',
    createdAt: '2026-10-16',
  };

  const updated = releaseEscrowFunds(mockBooking);
  assert.equal(updated.status, 'completed');
  assert.equal(updated.escrowStatus, 'RELEASED_TO_GURU');
  assert.ok(updated.escrowReleasedAt);
});

test('calculateGuruEarnings separates held in escrow vs available payout with 15% fee', () => {
  const bookings: Booking[] = [
    {
      id: 'b1',
      guruId: 'guru-1',
      guruName: 'Jack',
      guruAvatar: '',
      guruRate: 50,
      gunuId: 'g1',
      gunuName: 'Alex',
      gunuAvatar: '',
      skillId: 's1',
      skillTitle: 'Guitar',
      sessionMode: 'video',
      scheduledDate: '2026-10-18',
      scheduledTime: '10:00',
      durationHours: 1,
      status: 'confirmed',
      guruSubtotal: 42.5, // 85%
      platformFee: 7.5, // 15%
      totalAmount: 50,
      escrowStatus: 'HELD_IN_ESCROW',
      stripePaymentIntentId: 'pi_1',
      createdAt: '2026-10-16',
    },
    {
      id: 'b2',
      guruId: 'guru-1',
      guruName: 'Jack',
      guruAvatar: '',
      guruRate: 50,
      gunuId: 'g2',
      gunuName: 'Sam',
      gunuAvatar: '',
      skillId: 's1',
      skillTitle: 'Guitar',
      sessionMode: 'in-person',
      scheduledDate: '2026-10-15',
      scheduledTime: '15:00',
      durationHours: 2,
      status: 'completed',
      guruSubtotal: 85, // 85% of $100
      platformFee: 15, // 15% of $100
      totalAmount: 100,
      escrowStatus: 'RELEASED_TO_GURU',
      stripePaymentIntentId: 'pi_2',
      createdAt: '2026-10-15',
    },
  ];

  const earnings = calculateGuruEarnings(bookings, 'guru-1');
  assert.equal(earnings.grossEarnings, 150);
  assert.equal(earnings.platformFeesPaid, 22.5);
  assert.equal(earnings.heldInEscrow, 42.5);
  assert.equal(earnings.availablePayout, 85);
  assert.equal(earnings.completedSessions, 1);
  assert.equal(earnings.escrowReleaseEligibleCount, 1);
});

test('generateGoogleMeetLink produces valid meet url structure', () => {
  const url = generateGoogleMeetLink('book-98745');
  assert.ok(url.startsWith('https://meet.google.com/'));
  const code = url.replace('https://meet.google.com/', '');
  assert.match(code, /^[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{3}$/);
});

test('calculateDistanceMiles and isWithinRadius compute realistic geographic distances', () => {
  const sfLat = 37.7749;
  const sfLng = -122.4194;
  const oakLat = 37.8044;
  const oakLng = -122.2712;

  const distance = calculateDistanceMiles(sfLat, sfLng, oakLat, oakLng);
  assert.ok(distance > 7 && distance < 11, `Expected ~8-9 miles, got ${distance}`);

  assert.equal(isWithinRadius(sfLat, sfLng, oakLat, oakLng, 15), true);
  assert.equal(isWithinRadius(sfLat, sfLng, oakLat, oakLng, 5), false);
});
