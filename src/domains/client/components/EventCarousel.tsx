import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EventCarouselProps {
  eventTypes: string[];
  selectedType: string;
  onSelect: (type: string) => void;
}

const getImageName = (type: string) => {
  if (type === 'Private Parties') return 'private';
  return type.toLowerCase();
};

export const EventCarousel: React.FC<EventCarouselProps> = ({ eventTypes, selectedType, onSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync activeIndex with selectedType
  useEffect(() => {
    const idx = eventTypes.indexOf(selectedType);
    if (idx !== -1 && idx !== activeIndex) {
      setActiveIndex(idx);
    }
  }, [selectedType, eventTypes]);

  const handleNext = () => {
    const newIdx = (activeIndex + 1) % eventTypes.length;
    setActiveIndex(newIdx);
    onSelect(eventTypes[newIdx]);
  };

  const handlePrev = () => {
    const newIdx = (activeIndex - 1 + eventTypes.length) % eventTypes.length;
    setActiveIndex(newIdx);
    onSelect(eventTypes[newIdx]);
  };

  const handleCardClick = (idx: number) => {
    setActiveIndex(idx);
    onSelect(eventTypes[idx]);
  };

  return (
    <div className="relative w-full overflow-hidden pb-10 pt-2 flex flex-col items-center justify-center">
      
      {/* Title */}
      <div className="w-full max-w-[600px] mb-6 flex justify-center px-4 sm:px-0">
        <label className="block text-sm font-medium text-celebrate-navy text-center">Choose your event</label>
      </div>

      {/* Viewport for 3D Cards */}
      <div className="relative w-full max-w-[600px] h-[280px] sm:h-[300px] flex items-center justify-center perspective-[1000px]">
        {eventTypes.map((type, index) => {
          
          // Calculate distance from active index (handling wrap-around visually)
          const length = eventTypes.length;
          let offset = index - activeIndex;
          
          // Handle shortest path wrap-around
          if (offset > length / 2) offset -= length;
          if (offset < -length / 2) offset += length;

          const isCenter = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          // Tailwind classes based on offset
          let transformClasses = 'opacity-0 scale-50 z-0 pointer-events-none translate-x-0';
          if (isVisible) {
            if (offset === 0) {
              transformClasses = 'opacity-100 scale-100 z-30 translate-x-0 border-2 border-celebrate-terracotta ring-4 ring-celebrate-terracotta/20';
            } else if (offset === -1) {
              transformClasses = 'opacity-60 scale-90 z-20 -translate-x-24 sm:-translate-x-32 cursor-pointer hover:opacity-90 border border-transparent';
            } else if (offset === 1) {
              transformClasses = 'opacity-60 scale-90 z-20 translate-x-24 sm:translate-x-32 cursor-pointer hover:opacity-90 border border-transparent';
            } else if (offset === -2) {
              transformClasses = 'opacity-20 scale-75 z-10 -translate-x-36 sm:-translate-x-56 cursor-pointer hover:opacity-50 hidden sm:block border border-transparent';
            } else if (offset === 2) {
              transformClasses = 'opacity-20 scale-75 z-10 translate-x-36 sm:translate-x-56 cursor-pointer hover:opacity-50 hidden sm:block border border-transparent';
            }
          }

          return (
            <div 
              key={type}
              onClick={() => isVisible && !isCenter ? handleCardClick(index) : undefined}
              className={`absolute top-0 w-[180px] sm:w-[210px] h-[240px] sm:h-[280px] rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] flex-shrink-0 origin-center ${transformClasses}`}
              style={{
                boxShadow: isCenter ? '0 15px 30px rgba(0,0,0,0.25)' : '0 10px 20px rgba(0,0,0,0.1)'
              }}
            >
              <img 
                src={`/client-form/${getImageName(type)}.webp`}
                alt={type}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-0 w-full text-center px-4 pointer-events-none">
                <h3 className="font-serif text-xl sm:text-2xl text-white tracking-wide leading-tight">{type}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6 mt-6 z-40">
        <button 
          onClick={handlePrev}
          type="button"
          className="w-12 h-12 rounded-full bg-white hover:bg-celebrate-navy text-celebrate-navy hover:text-white border border-celebrate-navy/10 shadow-sm flex items-center justify-center transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 -ml-1" />
        </button>
        
        {/* Helper dots */}
        <div className="flex space-x-2">
          {eventTypes.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-celebrate-terracotta w-6' : 'bg-celebrate-navy/20'}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          type="button"
          className="w-12 h-12 rounded-full bg-white hover:bg-celebrate-navy text-celebrate-navy hover:text-white border border-celebrate-navy/10 shadow-sm flex items-center justify-center transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6 -mr-1" />
        </button>
      </div>
    </div>
  );
};
