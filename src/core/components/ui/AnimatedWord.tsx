import { useState, useEffect } from 'react';
import { cn } from "../../lib/utils";

interface AnimatedWordProps {
  words: string[];
  className?: string;
}

export function AnimatedWord({ words, className }: AnimatedWordProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // The pause is 2.5s and the transition is 750ms. Total interval = 3250ms.
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Let the CSS transition finish (750ms), then instantly snap state back for the next cycle
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, 750);
      
    }, 3250);

    return () => clearInterval(interval);
  }, [words.length, prefersReducedMotion]);

  if (prefersReducedMotion || words.length === 0) {
    return <span className={cn("inline-block", className)}>{words[0]}.</span>;
  }

  // To prevent layout shift, find the longest word to act as an invisible placeholder
  const longestWord = [...words].sort((a, b) => b.length - a.length)[0];
  const nextIndex = (currentIndex + 1) % words.length;

  return (
    <>
      {/* Accessible static representation for screen readers */}
      <span className="sr-only">{words[0]}.</span>
      
      {/* Visual animated slot, hidden from screen readers to prevent reading chaos */}
      <span 
        aria-hidden="true" 
        className={cn("inline-grid relative -my-[0.1em]", className)}
      >
        {/* Invisible placeholder dictates the exact width, height, and perfect baseline! */}
        <span className="invisible opacity-0 pointer-events-none whitespace-nowrap col-start-1 row-start-1 py-[0.1em]">
          {longestWord}.
        </span>
        
        {/* The overflow clipping wrapper exactly matching the grid cell */}
        <span className="col-start-1 row-start-1 relative overflow-hidden">
          {/* The sliding track */}
          <span 
            className={cn(
              "absolute left-0 top-0 flex flex-col w-full",
              isTransitioning ? "transition-transform duration-[750ms]" : ""
            )}
            style={{
              transform: isTransitioning ? 'translateY(-50%)' : 'translateY(0)',
              transitionTimingFunction: isTransitioning ? 'cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
            }}
          >
            {/* Current Word */}
            <span 
              className={cn(
                "w-full text-left whitespace-nowrap py-[0.1em]",
                isTransitioning ? "opacity-0 transition-opacity duration-[400ms] ease-out" : "opacity-100"
              )}
            >
              {words[currentIndex]}.
            </span>
            {/* Next Word */}
            <span className="w-full text-left whitespace-nowrap py-[0.1em]">
              {words[nextIndex]}.
            </span>
          </span>
        </span>
      </span>
    </>
  );
}
