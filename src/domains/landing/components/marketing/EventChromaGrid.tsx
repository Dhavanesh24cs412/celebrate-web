import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './EventChromaGrid.css';

export interface EventCategory {
  image: string;
  title: string;
  subtitle: string;
}

interface EventChromaGridProps {
  categories: EventCategory[];
}

export function EventChromaGrid({ categories }: EventChromaGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Skip GSAP animation on touch devices (graceful degradation)
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      cardsRef.current.forEach((card) => {
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        // Calculate relative X/Y coordinates inside each card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Use GSAP for buttery smooth interpolation of the CSS variables
        gsap.to(card, {
          '--x': `${x}px`,
          '--y': `${y}px`,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
    };

    // Attach listener to the grid to handle smooth tracking across boundaries
    grid.addEventListener('mousemove', handleMouseMove);

    return () => {
      grid.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={gridRef}
      className="chroma-grid mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 w-full max-w-5xl mx-auto"
    >
      {categories.map((cat, i) => (
        <div 
          key={i}
          ref={(el) => { cardsRef.current[i] = el; }}
          className="chroma-card relative rounded-2xl bg-[#0A2947] overflow-hidden aspect-[4.2/5] w-full shadow-lg group cursor-pointer"
        >
          {/* Image Container */}
          <div className="absolute inset-0">
            <img 
              src={cat.image} 
              alt={cat.title} 
              className="chroma-image w-full h-full object-cover"
              loading="lazy"
            />
            {/* Dark gradient overlay ensures text readability while preserving image beauty */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2947]/95 via-[#0A2947]/30 to-transparent"></div>
          </div>
          
          {/* Content Area */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
            <h4 className="font-display text-2xl text-[#F3E4C9] mb-2 group-hover:text-white transition-colors duration-500">
              {cat.title}
            </h4>
            <p className="text-[#F3E4C9]/80 text-sm leading-relaxed group-hover:text-[#F3E4C9] transition-colors duration-500 font-sans">
              {cat.subtitle}
            </p>
          </div>
          
          {/* Subtle Border Glow */}
          <div className="chroma-border-glow rounded-2xl"></div>
        </div>
      ))}
    </div>
  );
}
