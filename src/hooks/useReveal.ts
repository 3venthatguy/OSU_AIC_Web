import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Scroll-triggered reveal.
 *
 * One IntersectionObserver is shared by every reveal target on the page (~80 of
 * them); per-element observers would be wasteful. Targets unobserve themselves on
 * first intersection, which is what makes reveals once-only and keeps the
 * callback map from growing.
 *
 * This works inside `SmoothScrollProvider`'s transformed container because
 * IntersectionObserver maps an element's box through ancestor transforms into
 * viewport space — the same reason the existing StatsBar counter fires.
 */

const REVEAL_OPTIONS: IntersectionObserverInit = {
  // Commit just after the element enters, rather than exactly at the edge.
  rootMargin: '0px 0px -8% 0px',
  threshold: 0,
};

/** Elements start at opacity 0, so any failure to observe must fail *open*. */
const supportsObserver =
  typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const callbacks = new Map<Element, () => void>();

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (!supportsObserver) return null;
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const fire = callbacks.get(entry.target);
        // Unobserve before firing: reveals are once-only, and dropping the entry
        // here keeps the shared map bounded as pages mount and unmount.
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
        fire?.();
      });
    }, REVEAL_OPTIONS);
  }
  return observer;
}

/**
 * Returns a ref to attach to the element that should reveal, plus whether it has
 * revealed yet. Consumers that only need the animation can ignore `isRevealed`
 * and let the `data-revealed` attribute drive CSS; consumers that need to kick
 * off their own work on entry (StatsBar's count-up) can read it.
 */
export function useReveal() {
  // Reduced motion and missing-API cases start revealed: no animation, no risk
  // of content stranded at opacity 0.
  const [isRevealed, setIsRevealed] = useState(
    () => !supportsObserver || prefersReducedMotion(),
  );

  const elementRef = useRef<Element | null>(null);
  const revealedRef = useRef(isRevealed);
  revealedRef.current = isRevealed;

  const cleanup = useCallback(() => {
    const el = elementRef.current;
    if (!el) return;
    callbacks.delete(el);
    getObserver()?.unobserve(el);
    elementRef.current = null;
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      if (elementRef.current && elementRef.current !== node) cleanup();
      if (!node || revealedRef.current) return;

      const io = getObserver();
      if (!io) {
        setIsRevealed(true);
        return;
      }

      elementRef.current = node;
      callbacks.set(node, () => setIsRevealed(true));
      io.observe(node);
    },
    [cleanup],
  );

  useEffect(() => cleanup, [cleanup]);

  return { ref, isRevealed };
}

/**
 * Props to spread onto an element that should reveal in place, for cases where
 * an extra wrapper would break layout — `divide-*` borders and `col-span-*`
 * both depend on the element staying a direct grid child. See `Reveal` for the
 * wrapper form used by plain card grids.
 */
export function useRevealProps(delay = 0) {
  const { ref, isRevealed } = useReveal();
  return {
    ref,
    'data-reveal': '',
    ...(isRevealed ? { 'data-revealed': '' } : {}),
    ...(delay ? { style: { transitionDelay: `${delay}ms` } } : {}),
  } as const;
}

/** Stagger helper: caps the delay so long grids don't trail badly. */
export function staggerDelay(index: number, step = 60, max = 8) {
  return Math.min(index, max) * step;
}
