import React from 'react';
import {
  Heart,
  Star,
  Cake,
  Home,
  Trophy,
  Smile,
  Ribbon,
  Sparkles,
  Feather,
  Sun,
  Flower2,
} from 'lucide-react';
import { IconType } from '@recuerdos-qr/shared';

interface DynamicIconProps {
  icon: IconType;
  className?: string;
  style?: React.CSSProperties;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ icon, className = 'w-12 h-12', style }) => {
  switch (icon) {
    case 'cake':
      return <Cake className={className} style={style} />;
    case 'star':
      return <Star className={className} style={style} />;
    case 'home':
      return <Home className={className} style={style} />;
    case 'trophy':
      return <Trophy className={className} style={style} />;
    case 'smile':
      return <Smile className={className} style={style} />;
    case 'ribbon':
      return <Ribbon className={className} style={style} />;
    case 'sparkles':
      return <Sparkles className={className} style={style} />;
    case 'feather':
      return <Feather className={className} style={style} />;
    case 'sun':
      return <Sun className={className} style={style} />;
    case 'flower':
      return <Flower2 className={className} style={style} />;
    case 'heart':
    default:
      return <Heart className={className} style={style} />;
  }
};
