import { useEffect, useState } from 'react';

interface DanmakuItemProps {
  id: string;
  text: string;
  track: number;
  duration: number;
  onComplete: (id: string) => void;
}

const colorVariants = [
  'hsl(270, 80%, 75%)',
  'hsl(280, 75%, 70%)',
  'hsl(260, 70%, 65%)',
  'hsl(290, 65%, 80%)',
  'hsl(275, 85%, 85%)',
];

export const DanmakuItem = ({ id, text, track, duration, onComplete }: DanmakuItemProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const color = colorVariants[Math.floor(Math.random() * colorVariants.length)];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete(id);
    }, duration * 1000);

    return () => clearTimeout(timer);
  }, [id, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="absolute whitespace-nowrap danmaku-text animate-danmaku pointer-events-none"
      style={{
        top: `${track * 48 + 80}px`,
        '--duration': `${duration}s`,
        color,
      } as React.CSSProperties}
    >
      {text}
    </div>
  );
};
