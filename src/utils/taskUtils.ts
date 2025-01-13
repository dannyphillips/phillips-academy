import { Child, Task, UniqueTask } from '../types/types';
import { 
  Sun, Moon, Book, 
  Pencil, Calculator, Globe,
  Music, Palette, Dumbbell,
  LucideIcon
} from 'lucide-react';

// Map task titles to icons and categories
const taskMappings: Record<string, { icon: LucideIcon; category: string }> = {
  'Brush Teeth': { icon: Sun, category: 'Morning Routine' },
  'Make Bed': { icon: Sun, category: 'Morning Routine' },
  'Get Dressed': { icon: Sun, category: 'Morning Routine' },
  'Shower': { icon: Moon, category: 'Evening Routine' },
  'Math Practice': { icon: Calculator, category: 'academic' },
  'Reading': { icon: Book, category: 'academic' },
  'Writing': { icon: Pencil, category: 'academic' },
  'Geography': { icon: Globe, category: 'academic' },
  'Music Practice': { icon: Music, category: 'academic' },
  'Art': { icon: Palette, category: 'academic' },
  'Exercise': { icon: Dumbbell, category: 'academic' }
};

export function getTaskMapping(title: string) {
  return taskMappings[title] || { icon: Book, category: 'academic' };
}

export function getAllUniqueTasks(children: Child[]): UniqueTask[] {
  const uniqueTasks = new Map<string, UniqueTask>();

  children.forEach(child => {
    child.tasks.forEach(task => {
      const mapping = getTaskMapping(task.title);
      const key = task.title;

      if (!uniqueTasks.has(key)) {
        uniqueTasks.set(key, {
          title: task.title,
          key,
          category: mapping.category,
          subject: mapping.category === 'academic' ? task.title : mapping.category,
          icon: mapping.icon
        });
      }
    });
  });

  return Array.from(uniqueTasks.values());
}

// Color utility functions
const colorClasses: Record<string, { bg: string; muted: string }> = {
  sage: { bg: 'bg-farmhouse-sage', muted: 'border-farmhouse-sage/30 text-farmhouse-sage' },
  clay: { bg: 'bg-farmhouse-clay', muted: 'border-farmhouse-clay/30 text-farmhouse-clay' },
  navy: { bg: 'bg-farmhouse-navy', muted: 'border-farmhouse-navy/30 text-farmhouse-navy' },
  moss: { bg: 'bg-farmhouse-moss', muted: 'border-farmhouse-moss/30 text-farmhouse-moss' },
  rust: { bg: 'bg-farmhouse-rust', muted: 'border-farmhouse-rust/30 text-farmhouse-rust' },
  olive: { bg: 'bg-farmhouse-olive', muted: 'border-farmhouse-olive/30 text-farmhouse-olive' },
  plum: { bg: 'bg-farmhouse-plum', muted: 'border-farmhouse-plum/30 text-farmhouse-plum' },
  sienna: { bg: 'bg-farmhouse-sienna', muted: 'border-farmhouse-sienna/30 text-farmhouse-sienna' },
};

export function getColorClasses(color: string) {
  return colorClasses[color] || colorClasses.clay;
} 