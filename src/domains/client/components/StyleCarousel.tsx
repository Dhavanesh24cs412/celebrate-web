import React, { useMemo } from 'react';
// @ts-ignore
import CircularCarousel from '../../../core/components/react-bits/CircularCarousel';

interface StyleConfig {
  name: string;
  description: string;
}

interface StyleCarouselProps {
  eventType: string;
  styles: StyleConfig[];
  selectedStyle: string;
  onSelect: (styleName: string) => void;
}

const getImagePath = (eventType: string, styleName: string) => {
  let folder = eventType.toLowerCase().split(' ')[0]; // 'Private Parties' -> 'private'
  let file = styleName.toLowerCase();
  if (file === 'minimalist') file = 'minimal'; 
  return `/event-styles/${folder}/${file}.webp`;
};

export const StyleCarousel: React.FC<StyleCarouselProps> = ({ eventType, styles, selectedStyle, onSelect }) => {
  const carouselItems = useMemo(() => {
    return styles.map((styleObj) => ({
      src: getImagePath(eventType, styleObj.name),
      title: styleObj.name,
      subtitle: styleObj.description
    }));
  }, [eventType, styles]);

  if (!styles || styles.length === 0) return null;

  // If a style is selected, stop the spinning so it locks onto the choice
  const autoplayMode = selectedStyle ? 'off' : 'drift';

  return (
    <div className="relative w-full overflow-hidden flex items-center justify-center -mt-4">
      <div style={{ width: '100%', height: '420px', position: 'relative' }}>
        <CircularCarousel
          items={carouselItems}
          preset="cylinder"
          curve={0}
          intro="rise"
          cardWidth={480}
          aspectRatio={1.5}
          speed={14}
          captions={true}
          autoplay={autoplayMode}
          depthFade={0.2}
          innerShade={0.2}
          onItemClick={(item: any) => {
            if (item && item.title) {
              onSelect(item.title);
            }
          }}
        />
      </div>
    </div>
  );
};
