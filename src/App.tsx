import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { MapListingView } from './components/MapListingView.tsx';
import { GuruCard } from './components/GuruCard.tsx';
import { GuruDetailModal } from './components/GuruDetailModal.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { EscrowReleaseModal } from './components/EscrowReleaseModal.tsx';
import { AppointmentRemindersDrawer } from './components/AppointmentRemindersDrawer.tsx';
import { MessagingDrawer } from './components/MessagingDrawer.tsx';
import { GuruPortalView } from './components/GuruPortalView.tsx';
import { GunuDashboardView } from './components/GunuDashboardView.tsx';
import { GunuReviewModal } from './components/GunuReviewModal.tsx';
import { GeminiChatbotDrawer } from './components/GeminiChatbotDrawer.tsx';
import { MascotBadge } from './components/MascotBadge.tsx';

import {
  INITIAL_GURUS,
  INITIAL_GUNU,
  INITIAL_BOOKINGS,
  INITIAL_MESSAGES,
  DEFAULT_USER_LOCATION,
} from './data/mockData.ts';
import {
  Guru,
  Gunu,
  Booking,
  ChatMessage,
  AvailabilitySlot,
  SkillOffering,
  GunuReview,
  ReviewAspects,
  Review,
} from './types/index.ts';
import { calculateDistanceMiles, releaseEscrowFunds } from './utils/escrow.ts';
import {
  ShieldCheck,
  MapPin,
  Video,
  Search,
} from 'lucide-react';

export default function App() {
  // Application State
  const [gurus, setGurus] = useState<Guru[]>(INITIAL_GURUS);
  const [currentGunu, setCurrentGunu] = useState<Gunu>(INITIAL_GUNU);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  // Active view navigation
  const [currentView, setCurrentView] = useState<'explore' | 'map' | 'my-bookings' | 'guru-portal'>('explore');
  const [activeRole, setActiveRole] = useState<'gunu' | 'guru'>('gunu');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [radiusMiles, setRadiusMiles] = useState<number>(25);
  const [formatFilter, setFormatFilter] = useState<'all' | 'in-person' | 'video'>('all');
  const [userLocation, setUserLocation] = useState(DEFAULT_USER_LOCATION);

  // Modal / Drawer states
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);
  const [bookingGuru, setBookingGuru] = useState<Guru | null>(null);
  const [escrowReleaseBooking, setEscrowReleaseBooking] = useState<Booking | null>(null);
  const [reviewingGunuBooking, setReviewingGunuBooking] = useState<Booking | null>(null);
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [messageRecipientId, setMessageRecipientId] = useState<string>('guru-jesse');

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  // Filtered Gurus computation
  const filteredGurus = useMemo(() => {
    return gurus.filter((guru) => {
      // 1. Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = guru.name.toLowerCase().includes(query);
        const matchesTitle = guru.title.toLowerCase().includes(query);
        const matchesSkill = guru.skills.some(
          (s) =>
            s.title.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query) ||
            s.category.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesTitle && !matchesSkill) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'All') {
        const hasCategory = guru.skills.some((s) => s.category === selectedCategory);
        if (!hasCategory) return false;
      }

      // 3. Format filter
      if (formatFilter === 'in-person') {
        if (guru.sessionModes === 'video') return false;
      } else if (formatFilter === 'video') {
        if (guru.sessionModes === 'in-person') return false;
      }

      // 4. Radius filter (applies only to in-person sessions)
      if (userLocation && radiusMiles < 1000) {
        const dist = calculateDistanceMiles(
          userLocation.lat,
          userLocation.lng,
          guru.location.lat,
          guru.location.lng
        );
        if (dist > radiusMiles && guru.sessionModes === 'in-person') {
          return false;
        }
      }

      return true;
    });
  }, [gurus, searchQuery, selectedCategory, formatFilter, radiusMiles, userLocation]);

  // Handlers
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            city: 'Current Location',
            state: '',
            address: 'Geolocated GPS Position',
          });
        },
        () => {
          setUserLocation(DEFAULT_USER_LOCATION);
        }
      );
    }
  };

  const handleToggleRole = () => {
    if (activeRole === 'gunu') {
      setActiveRole('guru');
      setCurrentView('guru-portal');
    } else {
      setActiveRole('gunu');
      setCurrentView('explore');
    }
  };

  const handleConfirmBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId: newBooking.id,
      senderId: newBooking.guruId,
      senderName: newBooking.guruName,
      senderRole: 'guru',
      recipientId: currentGunu.id,
      text: `Yoohoo ${currentGunu.name}! I received your booking for "${newBooking.skillTitle}" on ${newBooking.scheduledDate}. Your payment is secured in Yoohoo Escrow. Let me know if you have any questions before we meet!`,
      timestamp: new Date().toISOString(),
      meetingLink: newBooking.googleMeetLink,
    };

    setMessages((prev) => [...prev, welcomeMsg]);
  };

  const handleConfirmReleaseEscrow = (
    bookingId: string,
    reviewData?: {
      rating: number;
      comment: string;
      aspects?: ReviewAspects;
      tags?: string[];
    }
  ) => {
    const targetBooking = bookings.find((b) => b.id === bookingId);

    // 1. Release escrow funds & update booking
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const released = releaseEscrowFunds(b);
        if (reviewData) {
          const newReview: Review = {
            id: `rev-${Date.now()}`,
            bookingId: b.id,
            gunuId: currentGunu.id,
            gunuName: currentGunu.name,
            gunuAvatar: currentGunu.avatar,
            rating: reviewData.rating,
            comment: reviewData.comment || 'Wonderful hands-on learning experience!',
            date: new Date().toISOString().split('T')[0],
            skillLearned: b.skillTitle,
            sessionMode: b.sessionMode,
            verifiedLearner: true,
            aspects: reviewData.aspects,
            tags: reviewData.tags,
          };
          return {
            ...released,
            reviewed: true,
            reviewedByGunu: true,
            gunuReview: newReview,
          };
        }
        return released;
      })
    );

    // 2. Add verified review to Guru and recalculate average rating
    if (targetBooking && reviewData) {
      setGurus((prev) =>
        prev.map((g) => {
          if (g.id !== targetBooking.guruId) return g;
          const newReview: Review = {
            id: `rev-${Date.now()}`,
            bookingId: targetBooking.id,
            gunuId: currentGunu.id,
            gunuName: currentGunu.name,
            gunuAvatar: currentGunu.avatar,
            rating: reviewData.rating,
            comment: reviewData.comment || 'Wonderful hands-on learning experience!',
            date: new Date().toISOString().split('T')[0],
            skillLearned: targetBooking.skillTitle,
            sessionMode: targetBooking.sessionMode,
            verifiedLearner: true,
            aspects: reviewData.aspects,
            tags: reviewData.tags,
          };
          const updatedReviews = [newReview, ...g.reviews];
          const newRating =
            updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;

          return {
            ...g,
            rating: Math.round(newRating * 100) / 100,
            reviewCount: updatedReviews.length,
            completedSessionsCount: g.completedSessionsCount + 1,
            reviews: updatedReviews,
          };
        })
      );
    }
  };

  const handleConfirmGunuReview = (bookingId: string, review: GunuReview) => {
    // 1. Update booking
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, reviewedByGuru: true, guruReview: review } : b))
    );

    // 2. Add to Gunu's verified endorsements and recalculate rating
    setCurrentGunu((prev) => {
      const updatedReviews = [review, ...prev.reviewsReceived];
      const newRating =
        updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
      return {
        ...prev,
        rating: Math.round(newRating * 100) / 100,
        reviewCount: updatedReviews.length,
        reviewsReceived: updatedReviews,
      };
    });
  };

  const handleSendMessage = (msgData: { recipientId: string; text: string; meetingLink?: string }) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentGunu.id,
      senderName: currentGunu.name,
      senderRole: 'gunu',
      recipientId: msgData.recipientId,
      text: msgData.text,
      timestamp: new Date().toISOString(),
      meetingLink: msgData.meetingLink,
    };

    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      const targetGuru = gurus.find((g) => g.id === msgData.recipientId);
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: msgData.recipientId,
        senderName: targetGuru ? targetGuru.name : 'Guru',
        senderRole: 'guru',
        recipientId: currentGunu.id,
        text: `Got your note! I'm prepping materials for our session. See you soon!`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1200);
  };

  const handleUpdateAvailability = (newAvailability: AvailabilitySlot[]) => {
    setGurus((prev) =>
      prev.map((g) => (g.id === 'guru-jesse' ? { ...g, availability: newAvailability } : g))
    );
  };

  const handleAddSkill = (newSkill: SkillOffering) => {
    setGurus((prev) =>
      prev.map((g) =>
        g.id === 'guru-jesse' ? { ...g, skills: [newSkill, ...g.skills] } : g
      )
    );
  };

  const handleOpenGuruChat = (guru: Guru) => {
    setMessageRecipientId(guru.id);
    setIsMessagesOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Universal Top Bar */}
      <Header
        currentView={currentView}
        activeRole={activeRole}
        reminderCount={bookings.filter((b) => b.status === 'confirmed').length}
        unreadMessageCount={1}
        onChangeView={(view: 'explore' | 'map' | 'my-bookings' | 'guru-portal') => setCurrentView(view)}
        onToggleRole={handleToggleRole}
        onOpenReminders={() => setIsRemindersOpen(true)}
        onOpenMessages={() => setIsMessagesOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'explore' && (
          <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <HeroBanner
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              formatFilter={formatFilter}
              onChangeFormat={setFormatFilter}
              radiusMiles={radiusMiles}
              onChangeRadius={setRadiusMiles}
              userCity={userLocation.city}
              onUseCurrentLocation={handleUseCurrentLocation}
              totalGurusCount={gurus.length}
            />

            {/* Interactive Local Map Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    Nearby & Remote Gurus ({filteredGurus.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any marker on the map to view studio location, reviews, and book directly.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Escrow Guaranteed</span>
                </div>
              </div>

              {/* Map View */}
              <MapListingView
                gurus={filteredGurus}
                userLocation={userLocation}
                radiusMiles={radiusMiles}
                onSelectGuru={(guru: Guru) => setSelectedGuru(guru)}
                selectedGuruId={selectedGuru?.id}
              />
            </section>

            {/* Gurus Grid Section */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Verified Gurus Available for Booking
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hand-picked masters with verified student reviews and escrow backing.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                  Showing {filteredGurus.length} of {gurus.length} Gurus
                </span>
              </div>

              {filteredGurus.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-[#0f1523] border border-slate-800 text-slate-400 space-y-3">
                  <Search className="w-8 h-8 mx-auto text-slate-600" />
                  <h4 className="text-base font-bold text-white">No Gurus Found in this Radius</h4>
                  <p className="text-xs max-w-md mx-auto">
                    Try expanding your search radius to 50 miles or switch to "Google Meet" format for remote nationwide experts.
                  </p>
                  <button
                    onClick={() => {
                      setRadiusMiles(1000);
                      setFormatFilter('all');
                      setSelectedCategory('All');
                      setSearchQuery('');
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGurus.map((guru) => (
                    <GuruCard
                      key={guru.id}
                      guru={guru}
                      userCoords={userLocation}
                      onSelect={(g) => setSelectedGuru(g)}
                      onQuickBook={(g) => setBookingGuru(g)}
                      isSelected={selectedGuru?.id === guru.id}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Escrow Guarantee Banner */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-[#101726] to-[#0c121e] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">The Yoohoo.Guru Escrow Promise</h3>
                    <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                      When you book a session, you only pay the Guru's advertised price. Your payment is held safely in escrow. Gurus only receive payout once you confirm the session is complete and you're satisfied with what you learned. 100% money-back guarantee.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('my-bookings')}
                  className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-lg hover:shadow-amber-500/20 whitespace-nowrap"
                >
                  View Active Escrow Sessions
                </button>
              </div>
            </section>
          </div>
        )}

        {currentView === 'map' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-amber-400" />
                  Local Guru Map Discovery
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Discover master craftsmen, musicians, bakers, and coders within {radiusMiles === 1000 ? 'Any distance' : `${radiusMiles} miles`} of {userLocation.city}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={radiusMiles}
                  onChange={(e) => setRadiusMiles(Number(e.target.value))}
                  className="text-xs p-2.5 rounded-xl border border-slate-700 bg-[#0f1523] text-white"
                >
                  <option value={5}>Within 5 miles</option>
                  <option value={10}>Within 10 miles</option>
                  <option value={25}>Within 25 miles</option>
                  <option value={50}>Within 50 miles</option>
                  <option value={1000}>Nationwide / All</option>
                </select>
                <button
                  onClick={handleUseCurrentLocation}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs"
                >
                  Geolocate Me
                </button>
              </div>
            </div>

            <MapListingView
              gurus={filteredGurus}
              userLocation={userLocation}
              radiusMiles={radiusMiles}
              onSelectGuru={(guru: Guru) => setSelectedGuru(guru)}
              selectedGuruId={selectedGuru?.id}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {filteredGurus.map((guru) => (
                <GuruCard
                  key={guru.id}
                  guru={guru}
                  userCoords={userLocation}
                  onSelect={(g) => setSelectedGuru(g)}
                  onQuickBook={(g) => setBookingGuru(g)}
                  isSelected={selectedGuru?.id === guru.id}
                />
              ))}
            </div>
          </div>
        )}

        {currentView === 'my-bookings' && (
          <GunuDashboardView
            gunu={currentGunu}
            bookings={bookings}
            gurus={gurus}
            onOpenMeet={(url) => window.open(url, '_blank')}
            onCompleteAndRelease={(booking) => setEscrowReleaseBooking(booking)}
            onOpenMessage={(guruId) => {
              setMessageRecipientId(guruId);
              setIsMessagesOpen(true);
            }}
            onExploreMore={() => setCurrentView('explore')}
          />
        )}

        {currentView === 'guru-portal' && (
          <GuruPortalView
            guru={gurus.find((g) => g.id === 'guru-jesse') || gurus[0]}
            bookings={bookings}
            onUpdateAvailability={handleUpdateAvailability}
            onAddSkill={handleAddSkill}
            onOpenReviewGunu={(booking) => setReviewingGunuBooking(booking)}
            onOpenMeet={(url) => window.open(url, '_blank')}
            onOpenMessage={(gunuId) => {
              setMessageRecipientId('guru-jesse');
              setIsMessagesOpen(true);
            }}
          />
        )}
      </main>

      {/* Universal Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b12] py-8 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MascotBadge size={28} />
            <span className="font-extrabold text-white">Yoohoo.Guru</span>
            <span>· Hands-On Skill Sharing Marketplace & Escrow System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap justify-center">
            <span>15% Retained on Paid Sessions · $4.99 Guru Setup · 0% Extra Fee for Gunus</span>
            <span>·</span>
            <span>Stripe Payment Processing</span>
            <span>·</span>
            <span>Google Meet Verified</span>
            <span>·</span>
            <span>Mapbox Geolocation</span>
          </div>
        </div>
      </footer>

      {/* Guru Detail Modal */}
      <GuruDetailModal
        guru={selectedGuru}
        isOpen={!!selectedGuru}
        userCoords={userLocation}
        onClose={() => setSelectedGuru(null)}
        onBook={(guru) => {
          setSelectedGuru(null);
          setBookingGuru(guru);
        }}
        onOpenMessage={(guru) => {
          setSelectedGuru(null);
          handleOpenGuruChat(guru);
        }}
      />

      {/* Booking & Stripe Escrow Modal */}
      {bookingGuru && (
        <BookingModal
          guru={bookingGuru}
          gunu={currentGunu}
          isOpen={!!bookingGuru}
          onClose={() => setBookingGuru(null)}
          onConfirmBooking={handleConfirmBooking}
        />
      )}

      {/* Complete Session & Release Escrow Modal (Gunu rates Guru) */}
      <EscrowReleaseModal
        booking={escrowReleaseBooking}
        isOpen={!!escrowReleaseBooking}
        onClose={() => setEscrowReleaseBooking(null)}
        onConfirmRelease={handleConfirmReleaseEscrow}
      />

      {/* Guru Rates Gunu Modal (Guru reviews Learner) */}
      <GunuReviewModal
        booking={reviewingGunuBooking}
        isOpen={!!reviewingGunuBooking}
        onClose={() => setReviewingGunuBooking(null)}
        onSubmitReview={handleConfirmGunuReview}
      />

      {/* Appointment Reminders Drawer */}
      <AppointmentRemindersDrawer
        bookings={bookings}
        isOpen={isRemindersOpen}
        onClose={() => setIsRemindersOpen(false)}
        onOpenMeet={(url) => window.open(url, '_blank')}
        onCompleteSession={(b) => {
          setIsRemindersOpen(false);
          setEscrowReleaseBooking(b);
        }}
      />

      {/* In-App Messaging Drawer */}
      <MessagingDrawer
        messages={messages}
        currentGunu={currentGunu}
        gurus={gurus}
        selectedRecipientId={messageRecipientId}
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        onSendMessage={handleSendMessage}
      />

      {/* Gemini 3.8 Flash Chatbot Assistant */}
      <GeminiChatbotDrawer
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onOpen={() => setIsChatbotOpen(true)}
        gurus={gurus}
        onSelectGuru={(g) => {
          setSelectedGuru(g);
          setIsChatbotOpen(false);
        }}
        onNavigateView={(view) => {
          setCurrentView(view);
          setIsChatbotOpen(false);
        }}
      />
    </div>
  );
}
