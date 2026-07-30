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

  const count = type === 'confetti' ? 30 : 25;

  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.floor(Math.random() * 90) + 5;
      const size = Math.floor(Math.random() * 18) + 10; // 10–28px
      const delay = Math.random() * 7;
      const durationMult = speed === 'slow' ? 2 : speed === 'fast' ? 0.7 : 1;
      const duration = (Math.random() * 5 + 6) * durationMult;

      let symbol = '♥';
      if (type === 'stars') symbol = '★';
      else if (type === 'confetti') {
        const confettis = ['🎉', '✨', '🌟', '🎊', '🎈', '⭐', '💫'];
        symbol = confettis[i % confettis.length];
      } else if (type === 'sparkles') symbol = '✨';
      else if (type === 'leaves') {
        const leaves = ['🍃', '🌿', '🌱', '☘️'];
        symbol = leaves[i % leaves.length];
      }

      return { id: i, left, size, delay, duration, symbol };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, count, speed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute select-none"
          style={{
            left: `${item.left}%`,
            bottom: '-20px',
            fontSize: `${item.size}px`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            animation: `waveFloat ${item.duration}s ${item.delay}s linear infinite`,
            color: color,
            filter: `drop-shadow(0 0 6px ${color}88)`,
            opacity: 0,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
};
