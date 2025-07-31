import React from 'react';
import * as LucideIcons from 'lucide-react';

export function getIcon(iconName: string, size: number = 24): React.ReactElement {
  const IconComponent = (LucideIcons as any)[iconName];
  if (IconComponent) {
    return React.createElement(IconComponent, { size });
  }
  // Fallback to a default icon if the requested icon doesn't exist
  return React.createElement(LucideIcons.Star, { size });
} 
