import { useState, useCallback, ReactNode } from "react";

interface Position {
  x: number;
  y: number;
}

interface MouseTooltipProps {
  children: ReactNode;
  className?: string;
  phrases?: string[];
  offset?: number;
}

const DEFAULT_PHRASES = [
  "Explore",
  "Discover", 
  "View",
  "See",
  "Look",
  "Enter",
  "Open",
  "Visit"
];

const DEFAULT_OFFSET = 20;

export default function MouseTooltip({ 
  children, 
  className = "",
  phrases = DEFAULT_PHRASES,
  offset = DEFAULT_OFFSET
}: MouseTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);

  const getRandomPhrase = useCallback(() => {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }, [phrases]);

  const calculatePosition = useCallback((clientX: number, clientY: number): Position => {
    const x = clientX + offset;
    const y = clientY + offset;
    
    // Basic boundary checking to prevent tooltip from going off screen
    const maxX = window.innerWidth - 100; // Approximate tooltip width
    const maxY = window.innerHeight - 30; // Approximate tooltip height
    
    return {
      x: Math.min(x, maxX),
      y: Math.min(y, maxY)
    };
  }, [offset]);

  const handleMouseEnter = useCallback(() => {
    setCurrentPhrase(getRandomPhrase());
    setIsVisible(true);
  }, [getRandomPhrase]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setPosition(calculatePosition(e.clientX, e.clientY));
  }, [calculatePosition]);

  return (
    <div 
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      
      {isVisible && (
        <div
          className="fixed bg-black text-white px-1.5 py-0.5 text-xs pointer-events-none z-50 select-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
          data-testid="mouse-tooltip"
          aria-hidden="true"
        >
          {currentPhrase}
        </div>
      )}
    </div>
  );
}