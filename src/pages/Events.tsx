import React, { useState } from 'react';
import { EVENTS } from '../data';
import { ClubEvent } from '../types';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { TextScramble } from '../components/TextScramble';
import { Reveal } from '../components/Reveal';
import { useRevealProps, staggerDelay } from '../hooks/useReveal';
import {
  MEETING_LOCATION,
  MEETING_DAY,
  MEETING_TIME
} from '../data';

export const Events: React.FC = () => {
  const heroReveal = useRevealProps();
  const upcomingHeaderReveal = useRevealProps();
  const pastHeaderReveal = useRevealProps();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [rsvpStatus, setRsvpStatus] = useState<{ [key: string]: boolean }>({});

  const filters = ['All', 'Workshop', 'Speaker', 'HackAI', 'Social'];

  // "HackAI" is a proper noun, so it can't just take a naive trailing "s".
  const filterLabels: Record<string, string> = {
    All: 'All Events',
    Workshop: 'Workshops',
    Speaker: 'Speakers',
    HackAI: 'HackAI',
    Social: 'Socials',
  };

  const upcomingEvents = EVENTS.filter((e) => !e.isPast);
  const pastEvents = EVENTS.filter((e) => e.isPast);

  // Client-side filtering
  const filteredUpcoming = activeFilter === 'All'
    ? upcomingEvents
    : upcomingEvents.filter((e) => e.category.toLowerCase() === activeFilter.toLowerCase());

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'workshop': return 'bg-accent-primary';
      case 'speaker': return 'bg-accent-secondary';
      case 'hackai': return 'bg-gradient-to-r from-accent-primary to-accent-secondary';
      case 'social': return 'bg-accent-tertiary';
      default: return 'bg-text-muted';
    }
  };

  const handleRsvp = (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setRsvpStatus(prev => ({ ...prev, [eventId]: true }));
  };

  return (
    <div id="events-page-root" className="pt-[72px] min-h-screen">
      
      {/* 1. EVENTS HERO & FILTER BAR */}
      <section
        id="events-hero-header"
        className="py-16 md:py-24 border-b border-border-subtle relative flex flex-col items-center justify-center text-center overflow-hidden"
      >
        {/* Green, not blue: the page mesh already puts a blue lobe at this exact
            corner, so a blue glow here just doubled up. See docs/styling.md. */}
        <div className="absolute right-0 top-0 w-[40%] h-full bg-[radial-gradient(circle_at_80%_20%,var(--ui-accent-secondary-dim)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-6 relative z-10 flex flex-col items-center" {...heroReveal}>
          <span className="font-sans text-[12px] font-bold text-accent-secondary uppercase tracking-[0.25em] block mb-4">
            Get Involved
          </span>
          <h1 className="font-display text-[44px] md:text-[64px] font-extrabold text-text-primary leading-none tracking-tight mb-5 animate-fade-in">
            <TextScramble id="events-title-scramble" text="Club Events" />
          </h1>
          <p className="font-sans text-[15px] md:text-[17px] text-text-secondary leading-relaxed max-w-xl mb-8">
            Workshops, speaker sessions, regional hackathons, and social mixers — explore our academic calendar and rsvp below.
          </p>

          {/* Weekly Meetings Highlight Text */}
          <p className="font-sans text-[13.5px] text-text-secondary flex items-center justify-center gap-1.5 flex-wrap mb-12 select-none">
            <Clock className="w-4 h-4 text-accent-primary shrink-0" />
            <span>General Meetings every</span>
            <span className="font-bold text-text-primary whitespace-nowrap">{MEETING_DAY} at {MEETING_TIME}</span>
            <span>in</span>
            <span className="font-semibold text-text-primary whitespace-nowrap">{MEETING_LOCATION}</span>
          </p>

          {/* Filter Row */}
          <div id="events-filter-row" className="flex flex-wrap items-center justify-center gap-2.5 max-w-full">
            {filters.map((filter) => {
              const isActive = activeFilter.toLowerCase() === filter.toLowerCase();
              return (
                <button
                  key={filter}
                  id={`events-filter-${filter}`}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-full font-sans text-xs font-bold tracking-wide transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-accent-primary text-on-accent border-accent-primary shadow-[0_4px_12px_var(--ui-accent-glow)]'
                      : 'bg-bg-elevated text-text-secondary hover:text-accent-primary border-border-subtle shadow-sm hover:scale-[1.01]'
                  }`}
                >
                  {filterLabels[filter] ?? filter}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. UPCOMING EVENTS GRID */}
      <section id="upcoming-events-grid-section" className="py-20 max-w-7xl mx-auto px-6 md:px-16">
        
        <div className="flex items-center space-x-3 mb-10 select-none" {...upcomingHeaderReveal}>
          <span className="font-sans text-[12px] font-bold text-accent-secondary uppercase tracking-[0.2em]">
            Upcoming Calendar
          </span>
          <div className="flex-1 h-[1px] bg-border-subtle" />
        </div>

        {filteredUpcoming.length === 0 ? (
          <div id="no-events-fallback" className="py-20 text-center bg-bg-secondary/40 rounded-3xl border border-dashed border-border-medium/60 max-w-lg mx-auto p-8 flex flex-col items-center">
            <span className="text-3xl mb-3">📅</span>
            <h3 className="font-sans font-bold text-text-primary text-[15px] uppercase tracking-wide">No Scheduled Events</h3>
            <p className="font-sans text-xs text-text-secondary leading-relaxed mt-2 text-center max-w-xs">
              There are no upcoming {(filterLabels[activeFilter] ?? activeFilter).toLowerCase()} on the calendar. Try toggling back to general event categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUpcoming.map((item, idx) => {
              const isRsvped = rsvpStatus[item.id];
              return (
                <Reveal key={item.id} delay={staggerDelay(idx)}>
                <div
                  id={`event-card-item-${item.id}`}
                  className="bg-bg-secondary hover:bg-bg-elevated border border-border-subtle hover:border-accent-primary/20 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-card group"
                >
                  <div>
                    {/* Elevated categorical color bar at top */}
                    <div className={`h-1.5 w-full ${getCategoryColor(item.category)}`} />

                    <div className="p-6 relative">
                      {/* Floating Date Badge */}
                      <div className="absolute top-6 right-6 w-12 h-14 bg-bg-elevated group-hover:bg-bg-secondary border border-border-subtle flex flex-col items-center justify-center rounded-xl p-1 shadow-sm transition-colors select-none">
                        <span className="font-sans text-[9px] font-extrabold text-text-muted leading-none uppercase tracking-wide">
                          {item.month}
                        </span>
                        <span className="font-mono text-[22px] font-black text-text-primary leading-none mt-1">
                          {item.day}
                        </span>
                      </div>

                      {/* Category Badge tag */}
                      <span className={`inline-block px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-wider rounded-md border ${
                        item.category === 'Workshop'
                          ? 'bg-accent-primary-dim text-accent-primary border-accent-primary/10'
                          : 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/15'
                      }`}>
                        {item.category}
                      </span>

                      {/* Event Title */}
                      <h3 className="font-sans text-[18px] font-bold text-text-primary leading-tight mt-5 mb-3 group-hover:text-accent-primary transition-colors max-w-[80%]">
                        {item.title}
                      </h3>

                      {/* Description body context */}
                      <p className="font-sans text-[13px] text-text-secondary leading-relaxed mb-6">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Card metadata footer row */}
                  <div className="p-6 pt-0 mt-auto">
                    <div className="h-[1px] w-full bg-border-subtle/50 my-4" />
                    
                    <div className="flex flex-col space-y-2 text-xs font-sans text-text-muted mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-text-muted" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-text-muted hover:text-accent-primary transition-colors" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {isRsvped ? (
                      <div id={`rsvp-success-${item.id}`} className="mt-2 py-2 w-full bg-accent-secondary/15 border border-accent-secondary/20 text-accent-secondary text-xs rounded-xl font-bold flex items-center justify-center space-x-1.5 select-none animate-fade-in">
                        <CheckCircle className="w-4 h-4" />
                        <span>RSVP SECURED</span>
                      </div>
                    ) : (
                      <button
                        id={`rsvp-action-btn-${item.id}`}
                        onClick={(e) => handleRsvp(item.id, e)}
                        className="w-full mt-2 py-3 bg-accent-primary-dim hover:bg-accent-primary text-accent-primary hover:text-on-accent text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <span>Confirm Attendance RSVP</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. PAST EVENTS STRIP */}
      <section id="past-events-stripe-section" className="py-20 bg-veil-band border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          
          <div className="flex items-center space-x-3 mb-10 select-none" {...pastHeaderReveal}>
            <span className="font-sans text-[12px] font-bold text-text-muted uppercase tracking-[0.2em]">
              Past Events Highlights
            </span>
            <div className="flex-1 h-[1px] bg-border-subtle" />
          </div>

          {/* Horizontal drag stripe list */}
          <div
            id="past-events-strip-track"
            className="flex space-x-6 overflow-x-auto pb-4 snap-x pr-4 scrollbar-thin"
            style={{ scrollbarWidth: 'none' }}
          >
            {pastEvents.map((item, idx) => (
              <Reveal key={item.id} delay={staggerDelay(idx)} className="flex-shrink-0">
              <div
                id={`past-event-stip-card-${item.id}`}
                className="w-[280px] bg-bg-secondary border border-border-subtle rounded-xl p-5 flex-shrink-0 snap-start flex flex-col justify-between h-[230px] opacity-72 hover:opacity-100 transition-opacity"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-bg-primary border border-border-subtle text-[8.5px] text-text-muted uppercase font-bold rounded">
                      {item.category}
                    </span>
                    <span className="font-mono text-xs text-text-muted font-semibold">
                      {item.dateString}
                    </span>
                  </div>

                  <h4 className="font-sans text-[14px] font-bold text-text-primary leading-tight mt-4 line-clamp-2">
                    {item.title}
                  </h4>
                  
                  <p className="font-sans text-[12px] text-text-secondary leading-relaxed mt-2 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-auto border-t border-border-subtle/50 flex justify-end">
                  <a
                    href={item.recapUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent-primary text-xs font-bold hover:underline inline-flex items-center space-x-1"
                  >
                    <span>View Recap</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
