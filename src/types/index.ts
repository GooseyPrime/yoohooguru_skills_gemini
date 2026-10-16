export type SessionMode = 'in-person' | 'video' | 'both';

export type EscrowStatus = 'HELD_IN_ESCROW' | 'RELEASED_TO_GURU' | 'REFUNDED_TO_GUNU' | 'DISPUTED';

export type BookingStatus = 'confirmed' | 'in-progress' | 'completed' | 'cancelled';

export interface LocationCoords {
  lat: number;
  lng: number;
  city: string;
  state: string;
  address?: string;
}

export interface ReviewAspects {
  knowledge?: number; // 1-5
  communication?: number; // 1-5
  practicalSkills?: number; // 1-5
}

export interface Review {
  id: string;
  bookingId?: string;
  gunuId: string;
  gunuName: string;
  gunuAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  skillLearned: string;
  sessionMode: 'in-person' | 'video';
  verifiedLearner: boolean;
  aspects?: ReviewAspects;
  tags?: string[];
}

export interface GunuReview {
  id: string;
  bookingId: string;
  guruId: string;
  guruName: string;
  guruAvatar?: string;
  guruTitle?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  skillTaught: string;
  tags?: string[]; // e.g. ['Prepared', 'Fast Learner', 'Punctual', 'Great Questions']
}

export interface SkillOffering {
  id: string;
  title: string;
  category: 'Music' | 'Trades & DIY' | 'Culinary' | 'Tech & Code' | 'Fitness' | 'Art & Crafts' | 'Languages' | 'Business';
  description: string;
  hourlyRate: number; // in USD
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  materialsProvided?: string[];
  equipmentNeeded?: string[];
}

export interface AvailabilitySlot {
  dayOfWeek: number; // 0=Sun, 1=Mon, ..., 6=Sat
  dayName: string;
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
  active: boolean;
}

export interface Guru {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  badge?: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  verifiedGuru: boolean;
  yearsExperience: number;
  location: LocationCoords;
  sessionModes: SessionMode;
  skills: SkillOffering[];
  reviews: Review[];
  availability: AvailabilitySlot[];
  completedSessionsCount: number;
  responseRate: string;
  meetupSuggestions?: string[];
}

export interface Gunu {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  interests: string[];
  location: LocationCoords;
  paymentMethodAttached: boolean;
  rating: number; // 1-5 learner rating
  reviewCount: number;
  reviewsReceived: GunuReview[];
}

export interface Booking {
  id: string;
  guruId: string;
  guruName: string;
  guruAvatar: string;
  guruRate: number;
  gunuId: string;
  gunuName: string;
  gunuAvatar: string;
  skillId: string;
  skillTitle: string;
  sessionMode: 'in-person' | 'video';
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  durationHours: number;
  status: BookingStatus;
  
  // Escrow & Payment Details
  guruSubtotal: number;
  platformFee: number; // 15% platform fee retained on paid sessions
  totalAmount: number;
  escrowStatus: EscrowStatus;
  stripePaymentIntentId: string;
  escrowReleasedAt?: string;
  
  // Location / Video details
  meetupLocation?: string;
  googleMeetLink?: string;
  learningGoals?: string;
  
  // Reviews & Feedback
  reviewed?: boolean;
  reviewedByGunu?: boolean;
  gunuReview?: Review;
  reviewedByGuru?: boolean;
  guruReview?: GunuReview;
  
  reminderSent?: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  bookingId?: string;
  senderId: string;
  senderName: string;
  senderRole: 'guru' | 'gunu';
  recipientId: string;
  text: string;
  timestamp: string;
  meetingLink?: string;
  systemNotice?: boolean;
}

export interface GuruEarningsSummary {
  grossEarnings: number;
  platformFeesPaid: number;
  heldInEscrow: number;
  availablePayout: number;
  totalPaidOut: number;
  completedSessions: number;
  escrowReleaseEligibleCount: number;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: Array<{
    type: 'view-guru' | 'filter-category' | 'view-map' | 'view-bookings';
    label: string;
    payload?: string;
  }>;
}
