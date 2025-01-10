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
  red: { bg: 'bg-red-500', muted: 'border-red-200 text-red-500' },
  blue: { bg: 'bg-blue-500', muted: 'border-blue-200 text-blue-500' },
  green: { bg: 'bg-green-500', muted: 'border-green-200 text-green-500' },
  purple: { bg: 'bg-purple-500', muted: 'border-purple-200 text-purple-500' },
  yellow: { bg: 'bg-yellow-500', muted: 'border-yellow-200 text-yellow-500' },
};

export function getColorClasses(color: string) {
  return colorClasses[color] || colorClasses.blue;
} 