import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-4 h-4' }) => {
  // @ts-expect-error dynamic lookup from lucide-react
  const IconComponent = Icons[name] || Icons.Wrench;
  return <IconComponent className={className} />;
};
