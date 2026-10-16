import React from 'react';
import { Booking } from '../types/index.ts';
import { getAppointmentReminderInfo } from '../utils/escrow.ts';
import {
  X,
  Bell,
  Calendar,
  Clock,
  Video,
  MapPin,
  Download,
  CheckCircle,
} from 'lucide-react';

interface RemindersProps {
  bookings: Booking[];
  isOpen: boolean;
  onClose: () => void;
  onOpenMeet: (url: string) => void;
  onCompleteSession: (booking: Booking) => void;
}

export const AppointmentRemindersDrawer: React.FC<RemindersProps> = ({
  bookings,
  isOpen,
  onClose,
  onOpenMeet,
  onCompleteSession,
}) => {
  if (!isOpen) return null;

  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed');

  const handleDownloadICS = (booking: Booking) => {
    const title = `Yoohoo.Guru Session: ${booking.skillTitle} with ${booking.guruName}`;
    const desc = booking.sessionMode === 'video'
      ? `Google Meet Session: ${booking.googleMeetLink}`
      : `In-Person Meetup at ${booking.meetupLocation}`;
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Yoohoo.Guru//Session Reminder//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${booking.sessionMode === 'video' ? booking.googleMeetLink : booking.meetupLocation}`,
      `DTSTART:${booking.scheduledDate.replace(/-/g, '')}T${booking.scheduledTime.replace(/:/g, '')}00Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `yoohoo-session-${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs">
      <div className="w-full max-w-md h-full bg-[#0f1523] shadow-2xl flex flex-col border-l border-slate-800 text-slate-100">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#131927]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
              <Bell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Appointment Reminders</h3>
              <p className="text-xs text-slate-400">Upcoming learning sessions & meetups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close reminders"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reminders List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="w-12 h-12 mx-auto stroke-1 mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">No upcoming appointments</p>
              <p className="text-xs text-slate-500 mt-1">Book a session with a Guru to get started!</p>
            </div>
          ) : (
            upcomingBookings.map((booking) => {
              const reminder = getAppointmentReminderInfo(booking);
              return (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-slate-800 p-4 bg-[#131927] hover:border-amber-400/50 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-sm text-white block">
                        {booking.skillTitle}
                      </span>
                      <span className="text-xs text-slate-400">
                        With {booking.guruName}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        reminder.isToday
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Clock className="w-3 h-3 text-amber-400" />
                      {reminder.countdownText}
                    </span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 bg-[#0b0f17] p-3 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-medium text-white">
                        {booking.scheduledDate} at {booking.scheduledTime} ({booking.durationHours} hr)
                      </span>
                    </div>

                    {booking.sessionMode === 'video' ? (
                      <div className="flex items-center gap-2 text-emerald-400 font-medium">
                        <Video className="w-3.5 h-3.5" />
                        <span>Google Meet Video Session</span>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{booking.meetupLocation}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions for this reminder */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {booking.sessionMode === 'video' && booking.googleMeetLink && (
                      <a
                        href={booking.googleMeetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Google Meet
                      </a>
                    )}

                    <button
                      onClick={() => handleDownloadICS(booking)}
                      title="Add to Google or Apple Calendar"
                      className="py-2 px-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      Add to Calendar (.ics)
                    </button>

                    <button
                      onClick={() => onCompleteSession(booking)}
                      className="py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors"
                    >
                      Release Escrow
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-[#131927] text-[11px] text-slate-400 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Automated SMS and email reminders sent 24h & 1h prior to sessions.</span>
        </div>
      </div>
    </div>
  );
};
