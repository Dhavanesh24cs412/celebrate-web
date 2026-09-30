import { useState, useEffect } from 'react';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';

export function ClientProposalCard() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  const images = [
    '/images/for-client1.webp',
    '/images/for-client2.webp'
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    // 1.5 seconds visible + 1.5 seconds crossfade = 3 seconds interval
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="bg-white rounded-[24px] shadow-xl border border-celebrate-sage/20 w-full max-w-[460px] overflow-hidden flex flex-col relative z-10 mx-auto">
      {/* Image Slider */}
      <div className="relative h-64 sm:h-72 w-full bg-celebrate-cream overflow-hidden">
        <img 
          src={images[0]} 
          alt="Riverside Garden Wedding Concept 1" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${currentImageIndex === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
        />
        <img 
          src={images[1]} 
          alt="Riverside Garden Wedding Concept 2" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${currentImageIndex === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
        />
        
        {/* Before / After Tags */}
        <div className={`absolute top-5 right-5 z-20 px-3 py-1.5 bg-celebrate-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-md backdrop-blur-sm bg-opacity-90 transition-opacity duration-[1500ms] ease-in-out ${currentImageIndex === 0 ? 'opacity-100' : 'opacity-0'}`}>
          Before
        </div>
        <div className={`absolute top-5 right-5 z-20 px-3 py-1.5 bg-celebrate-navy text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-md backdrop-blur-sm bg-opacity-90 transition-opacity duration-[1500ms] ease-in-out ${currentImageIndex === 1 ? 'opacity-100' : 'opacity-0'}`}>
          After
        </div>
        {/* Pagination Dots */}
        {!prefersReducedMotion && (
          <div className="absolute bottom-5 right-5 z-20 flex gap-2">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-[1500ms] ${currentImageIndex === 0 ? 'bg-white' : 'bg-transparent border border-white/60'}`} />
            <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-[1500ms] ${currentImageIndex === 1 ? 'bg-white' : 'bg-transparent border border-white/60'}`} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8">
        <h3 className="font-display text-3xl text-celebrate-navy mb-3">
          Enchanting Indoor Engagement
        </h3>
        <p className="text-celebrate-navy/70 mb-8 leading-relaxed">
          A breathtaking indoor celebration featuring rustic wooden charm, romantic floral arches, and warm ambient lighting.
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-y-6 sm:gap-y-0 border-b border-celebrate-sage/20 pb-8 mb-8">
          {/* Location */}
          <div className="flex items-center gap-3 w-[45%] sm:w-auto">
            <div className="w-10 h-10 rounded-lg bg-celebrate-cream flex items-center justify-center text-celebrate-terracotta shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-celebrate-navy/50 mb-0.5">Location</div>
              <div className="text-sm font-medium text-celebrate-navy">Riverside Gardens</div>
            </div>
          </div>
          
          <div className="w-px h-10 bg-celebrate-sage/30 hidden sm:block"></div>
          
          {/* Guests */}
          <div className="flex items-center gap-3 w-[45%] sm:w-auto">
            <div className="w-10 h-10 rounded-lg bg-celebrate-cream flex items-center justify-center text-celebrate-terracotta shrink-0">
              <Users size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-celebrate-navy/50 mb-0.5">Guests</div>
              <div className="text-sm font-medium text-celebrate-navy">150 Guests</div>
            </div>
          </div>

          <div className="w-px h-10 bg-celebrate-sage/30 hidden sm:block"></div>

          {/* Date */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-lg bg-celebrate-cream flex items-center justify-center text-celebrate-terracotta shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-celebrate-navy/50 mb-0.5">Event Date</div>
              <div className="text-sm font-medium text-celebrate-navy">December 22, 2026</div>
            </div>
          </div>
        </div>

        {/* Budget & CTA */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-celebrate-navy/50 mb-1">
              Proposed Budget
            </div>
            <div className="font-display text-4xl text-celebrate-navy">
              ₹ 14,500
            </div>
          </div>
          <button className="flex items-center justify-center bg-celebrate-navy text-white px-6 py-3.5 rounded-xl font-medium hover:bg-celebrate-navy/90 transition-colors group">
            View Details 
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
