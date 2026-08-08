import React from 'react';
import { Calendar, Clock, MapPin, ArrowDown, ArrowRight, X } from 'lucide-react';
import type { ClubEvent } from '../types';
import { type ISODate, formatFullDate } from '../utils/date';
import { ALL_FILTER, categoryDotClass, categoryLabel, isEventPast } from '../utils/events';
import { scrollToEventCard } from '../utils/scroll';
import { CLUB_DISCORD_URL, NEWSLETTER_URL } from '../data';

interface EventCalendarRailProps {
  /** null means nothing is selected — the rail falls back to "Next up". */
  selectedISO: ISODate | null;
  /** Events on the selected day, already filtered. */
  dayEvents: ClubEvent[];
  /** Shown when nothing is selected. */
  nextUp: ClubEvent | undefined;
  /** False when the club has no events at all, not merely none matching. */
  hasAnyEvents: boolean;
  activeFilter: string;
  today: ISODate;
  onClear: () => void;
}

/**
 * The panel beside the calendar grid.
 *
 * Purely presentational — all state lives in EventCalendar. It has three
 * states, and the *first* is the one that ships today: with `EVENTS` empty,
 * every visitor sees the "nothing scheduled" case, so it gets real CTAs rather
 * than an apology.
 */
export const EventCalendarRail: React.FC<EventCalendarRailProps> = ({
  selectedISO,
  dayEvents,
  nextUp,
  hasAnyEvents,
  activeFilter,
  today,
  onClear,
}) => {
  const heading = selectedISO
    ? formatFullDate(selectedISO)
    : nextUp
      ? formatFullDate(nextUp.date)
      : 'Nothing scheduled';

  const shown = selectedISO ? dayEvents : nextUp ? [nextUp] : [];

  return (
    <aside
      id="event-calendar-rail"
      aria-live="polite"
      className="bg-bg-elevated border border-border-subtle rounded-2xl shadow-card p-6 min-h-[320px] flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0">
          <span className="font-sans text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent-secondary block">
            {!hasAnyEvents ? 'No Events Yet' : selectedISO ? 'Selected Day' : 'Next Up'}
          </span>
          <h4 className="font-sans text-[15px] font-bold text-text-primary leading-tight mt-1.5">
            {heading}
          </h4>
        </div>

        {selectedISO && (
          <button
            type="button"
            id="event-calendar-clear-selection"
            onClick={onClear}
            aria-label="Clear the selected day"
            className="w-7 h-7 shrink-0 rounded-full bg-bg-primary border border-border-subtle flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary cursor-pointer transition-all active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {!hasAnyEvents ? (
        /* The state that actually ships. A visitor who finds nothing scheduled
           should still leave with a way to hear about the next thing. */
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-sans text-[12.5px] text-text-secondary leading-relaxed">
            There's nothing on the calendar right now. General meetings,
            workshops, speaker sessions and socials all get posted here first.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <a
              href={CLUB_DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 bg-accent-primary-dim hover:bg-accent-primary text-accent-primary hover:text-on-accent text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <span>Join the Discord</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href={NEWSLETTER_URL}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 text-center font-sans text-[11.5px] font-bold text-text-secondary hover:text-accent-primary transition-colors cursor-pointer"
            >
              Or get the newsletter →
            </a>
          </div>
        </div>
      ) : shown.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 animate-fade-in">
          <Calendar className="w-6 h-6 text-text-muted mb-3" />
          <p className="font-sans text-[12.5px] text-text-secondary leading-relaxed max-w-[26ch]">
            {activeFilter === ALL_FILTER
              ? 'Nothing scheduled on this day.'
              : `No ${categoryLabel(activeFilter).toLowerCase()} scheduled on this day.`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 animate-fade-in">
          {shown.map((event) => {
            const past = isEventPast(event, today);
            return (
              <div
                key={event.id}
                id={`event-calendar-rail-item-${event.id}`}
                className={`rounded-lg bg-bg-secondary border border-border-subtle p-4 flex items-start gap-3 ${
                  past ? 'opacity-70' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-1.5 shrink-0 w-2 h-2 rounded-full ${categoryDotClass(event.category)}`}
                />

                {/* min-w-0 or a long title blows out the flex row instead of wrapping. */}
                <div className="min-w-0 flex-1">
                  <span className="font-sans text-[9.5px] font-bold uppercase tracking-wider text-text-muted">
                    {event.category}
                  </span>
                  <h5 className="font-sans text-[14px] font-bold text-text-primary leading-tight mt-1">
                    {event.title}
                  </h5>

                  <div className="mt-2.5 flex flex-col gap-1.5 font-sans text-[11.5px] text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {event.location}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToEventCard(event, today)}
                    className="mt-3 inline-flex items-center gap-1 font-sans text-[11.5px] font-bold text-accent-primary hover:text-accent-primary-hover cursor-pointer transition-colors"
                  >
                    {past ? 'Recap' : 'Details'}
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
};
