import React, { useMemo } from 'react';
import { ParticleType } from '@recuerdos-qr/shared';

interface DynamicParticlesProps {
  type: ParticleType;
  speed?: 'slow' | 'medium' | 'fast';
  color?: string;
}

export const DynamicParticles: React.FC<DynamicParticlesProps> = ({
  type = 'hearts',
  speed = 'medium',
  color = '#ec4899',
}) => {
  if (type === 'none') return null;

  const count = type === 'confetti' ? 24 : 14;

  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.floor(Math.random() * 92) + 4;
      const size = Math.floor(Math.random() * 16) + 12;
      const delay = Math.random() * 5;
      const durationMult = speed === 'slow' ? 1.8 : speed === 'fast' ? 0.7 : 1;
      const duration = (Math.random() * 4 + 4) * durationMult;
      const rotation = Math.floor(Math.random() * 360);

      let symbol = '❤️';
      if (type === 'stars') symbol = '⭐';
      else if (type === 'confetti') {
        const confettis = ['🎉', '✨', '🌟', '🎊', '🎈', '⭐'];
        symbol = confettis[i % confettis.length];
      } else if (type === 'sparkles') symbol = '✨';
      else if (type === 'leaves') {
        const leaves = ['🍃', '🌿', '🌱', '☘️'];
        symbol = leaves[i % leaves.length];
      }

      return { id: i, left, size, delay, duration, rotation, symbol };
    });
  }, [type, count, speed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute animate-float opacity-75 select-none"
          style={{
            left: `${item.left}%`,
            bottom: '-20px',
            fontSize: `${item.size}px`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            transform: `rotate(${item.rotation}deg)`,
            color: color,
            textShadow: '0 0 10px rgba(255,255,255,0.4)',
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
};
