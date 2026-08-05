import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { useRevealProps } from '../hooks/useReveal';
import {
  HACKAI_NAME,
  HACKAI_DATE_FULL,
  HACKAI_LOCATION_FULL,
  HACKAI_DATE_SHORT
} from '../data';

interface HackAITeaserProps {
  onNavigate: (page: string) => void;
}

export const HackAITeaser: React.FC<HackAITeaserProps> = ({ onNavigate }) => {
  const headingReveal = useRevealProps();

  return (
    <section
      id="hackai-teaser-section"
      className="py-24 bg-bg-secondary relative border-b border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col items-start w-full">
        
        {/* Section Heading */}
        <div id="hackai-promo-headers" className="mb-10 text-left" {...headingReveal}>
          <span className="font-sans text-[12px] font-bold text-accent-secondary uppercase tracking-[0.2em] block mb-3">
            Flagship Event
          </span>
          <h2 className="font-display text-[32px] md:text-[48px] font-extrabold text-text-primary tracking-tight">
            Ohio State's Premier AI Hackathon
          </h2>
        </div>

        {/* Major Promo Event Card. Wrapped rather than revealed in place: the
            card has a `transform hover:scale`, which an in-place reveal would clobber. */}
        <Reveal delay={120} className="w-full">
        <div
          id="hackai-card-wrapper"
          className="w-full relative min-h-[460px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row bg-[linear-gradient(135deg,var(--ui-surface-inverse)_0%,var(--ui-surface-inverse-deep)_100%)] border border-border-inverse transform hover:scale-[1.005] transition-all duration-300"
        >
          {/* Decorative glowing backdrops */}
          <div className="absolute top-0 right-0 w-[50%] h-full bg-[radial-gradient(circle_at_70%_20%,var(--ui-accent-glow)_0%,transparent_60%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[70%] bg-[radial-gradient(circle_at_20%_80%,var(--ui-accent-secondary-dim)_0%,transparent_50%)] pointer-events-none" />

          {/* Left Block (60%) */}
          <div className="flex-1 p-8 md:p-14 flex flex-col justify-between items-start z-10 relative">
            <div className="w-full">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent-secondary/15 text-accent-secondary mb-5 border border-accent-secondary/20">
                Registration Now Open
              </span>
              
              <h3 className="font-display text-[44px] md:text-[68px] font-extrabold text-on-inverse leading-none tracking-tighter mb-4">
                {HACKAI_NAME}
              </h3>
              
              <p className="font-sans text-[15px] md:text-[17px] text-on-inverse-muted leading-relaxed max-w-lg mb-8">
                36 Hours. 300+ Builders. $12,000+ in Prizes. Combine prompt compilers, image diffusion, reinforcement learning, and LLM fine-tunes to build systems that reshape computing.
              </p>
            </div>

            {/* Date/Location Details row and CTA button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 w-full mt-auto">
              <button
                id="teaser-hack-cta-btn"
                onClick={() => {
                  onNavigate('hackai');
                }}
                className="px-8 py-3.5 bg-accent-primary hover:bg-accent-primary-hover text-on-accent text-[14px] font-bold rounded-full shadow-[0_4px_20px_var(--ui-accent-glow)] hover:shadow-[0_6px_28px_var(--ui-accent-glow)] transition-all duration-200 transform hover:-translate-y-0.5 flex items-center space-x-2 w-fit cursor-pointer"
              >
                <span>Explore & Register</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center space-x-5 text-[13px] md:text-[14px] text-on-inverse/70 font-mono">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-accent-secondary" />
                  <span>{HACKAI_DATE_FULL}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-accent-secondary" />
                  <span>{HACKAI_LOCATION_FULL}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visualizer Block (40%) */}
          <div className="md:w-[38%] h-[200px] md:h-full relative flex items-center justify-center border-t md:border-t-0 md:border-l border-border-inverse overflow-hidden bg-overlay/30 z-10 self-stretch">
            {/* Pure SVG Animated Concentric Hexagons */}
            <svg className="w-64 h-64 text-accent-primary-on-inverse opacity-60 relative z-10" viewBox="0 0 120 120">
              <g className="origin-center animate-spin" style={{ animationDuration: '40s' }}>
                <polygon points="60,10 103.3,35 103.3,85 60,110 16.7,85 16.7,35" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </g>
              <g className="origin-center animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
                <polygon points="60,20 94.6,40 94.6,80 60,100 25.4,80 25.4,40" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3"/>
              </g>
              <g className="origin-center animate-spin" style={{ animationDuration: '20s' }}>
                <polygon points="60,30 86,45 86,75 60,90 34,75 34,45" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              </g>
              <g className="origin-center animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}>
                <polygon points="60,45 73,52.5 73,67.5 60,75 47,67.5 47,52.5" className="text-accent-secondary-on-inverse" fill="none" stroke="currentColor" strokeWidth="2"/>
              </g>
              <circle cx="60" cy="60" r="4.5" fill="currentColor" className="text-accent-secondary-on-inverse animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="60" cy="60" r="3.5" fill="currentColor" className="text-accent-secondary-on-inverse" />
            </svg>
          </div>

          {/* Infinite Register Marquee ticker ribbon across bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-accent-secondary flex items-center overflow-hidden z-10 select-none pointer-events-none">
            <div className="animate-marquee whitespace-nowrap flex text-[10px] md:text-[11px] font-mono font-bold text-black/85">
              {Array(12).fill(`✦ REGISTER NOW FOR ${HACKAI_NAME} ✦ SHAPE THE GENERATIVE FUTURE ✦ ${HACKAI_DATE_SHORT} ✦ `).map((text, i) => (
                <span key={i} className="mr-6">{text}</span>
              ))}
            </div>
          </div>

        </div>
        </Reveal>

      </div>
    </section>
  );
};
