export interface ColorOption {
  name: string;
  value: string;
  class: string;
}

export const colors: ColorOption[] = [
  // Earthy & Muted Colors
  { name: 'Sage', value: 'sage', class: 'bg-[#87A878]' },        // Muted green
  { name: 'Clay', value: 'clay', class: 'bg-[#B47E5F]' },        // Warm terracotta
  { name: 'Teal', value: 'teal', class: 'bg-[#4A7B7C]' },        // Deep teal
  { name: 'Dusty Blue', value: 'dusty-blue', class: 'bg-[#8BA0B5]' }, // Muted blue
  { name: 'Moss', value: 'moss', class: 'bg-[#6B7F59]' },        // Deep sage
  { name: 'Stone', value: 'stone', class: 'bg-[#8F8B83]' },      // Warm gray
  { name: 'Rust', value: 'rust', class: 'bg-[#A65D57]' },        // Muted red
  { name: 'Slate', value: 'slate', class: 'bg-[#6E7C8C]' },      // Blue-gray
  { name: 'Olive', value: 'olive', class: 'bg-[#767E4E]' },      // Muted olive
  { name: 'Taupe', value: 'taupe', class: 'bg-[#8B7E74]' },      // Warm neutral
  { name: 'Plum', value: 'plum', class: 'bg-[#7D6B7D]' },        // Muted purple
  { name: 'Sienna', value: 'sienna', class: 'bg-[#9C6B4E]' }     // Warm brown
];

// Add these color utilities for consistent usage
export const getColorClasses = (color: string) => {
  const colorOption = colors.find(c => c.value === color);
  if (!colorOption) {
    return {
      bg: colors[0].class,
      muted: 'border-[#87A878]/20 text-[#87A878]',
      text: 'text-white'
    };
  }

  const baseColor = colorOption.class.replace('bg-[', '').replace(']', '');
  return {
    bg: colorOption.class,
    muted: `border-[${baseColor}]/20 text-[${baseColor}]`,
    text: 'text-white'
  };
}; 