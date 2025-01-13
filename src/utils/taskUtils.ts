import { Child, Task, UniqueTask } from '../types/types';
import { 
  SunIcon, MoonIcon, BookIcon, 
  PencilIcon, CalculatorIcon, GlobeIcon,
  MusicIcon, PaletteIcon, DumbbellIcon,
  LucideIcon, CircleDotIcon
} from 'lucide-react';
import { TaskType } from '../constants/taskTypes';

// Map task titles to icons and categories
const taskMappings: Record<string, { icon: LucideIcon; category: TaskType }> = {
  'Brush Teeth': { icon: SunIcon, category: 'morning_routine' },
  'Make Bed': { icon: SunIcon, category: 'morning_routine' },
  'Get Dressed': { icon: SunIcon, category: 'morning_routine' },
  'Shower': { icon: MoonIcon, category: 'evening_routine' },
  'Math Practice': { icon: CalculatorIcon, category: 'learning_task' },
  'Reading': { icon: BookIcon, category: 'learning_task' },
  'Writing': { icon: PencilIcon, category: 'learning_task' },
  'Geography': { icon: GlobeIcon, category: 'learning_task' },
  'Music Practice': { icon: MusicIcon, category: 'learning_task' },
  'Art': { icon: PaletteIcon, category: 'learning_task' },
  'Exercise': { icon: DumbbellIcon, category: 'learning_task' }
};

export function getTaskMapping(title: string) {
  return taskMappings[title] || { icon: BookIcon, category: 'learning_task' };
}

export function getAllUniqueTasks(children: Child[]): UniqueTask[] {
  const uniqueTasks = new Map<string, UniqueTask>();

  // First, add all tasks that are assigned to children
  children.forEach(child => {
    child.tasks.forEach(task => {
      const key = task.title;
      if (!uniqueTasks.has(key)) {
        uniqueTasks.set(key, {
          title: task.title,
          key,
          category: task.type,
          subject: task.title,
          icon: task.icon || 'CircleDot',
          assignedToChildren: true
        });
      }
    });
  });

  // Then, add unassigned tasks from taskMappings that aren't already in uniqueTasks
  Object.entries(taskMappings).forEach(([title, mapping]) => {
    const key = title;
    if (!uniqueTasks.has(key)) {
      uniqueTasks.set(key, {
        title,
        key,
        category: mapping.category,
        subject: title,
        icon: 'CircleDot',
        assignedToChildren: false
      });
    }
  });

  return Array.from(uniqueTasks.values());
}

// Color utility functions
const colorClasses: Record<string, { bg: string; muted: string }> = {
  sage: { bg: 'bg-farmhouse-sage', muted: 'border-farmhouse-sage/30 text-farmhouse-sage' },
  clay: { bg: 'bg-farmhouse-clay', muted: 'border-farmhouse-clay/30 text-farmhouse-clay' },
  teal: { bg: 'bg-farmhouse-teal', muted: 'border-farmhouse-teal/30 text-farmhouse-teal' },
  'dusty-blue': { bg: 'bg-farmhouse-dusty-blue', muted: 'border-farmhouse-dusty-blue/30 text-farmhouse-dusty-blue' },
  moss: { bg: 'bg-farmhouse-moss', muted: 'border-farmhouse-moss/30 text-farmhouse-moss' },
  stone: { bg: 'bg-farmhouse-stone', muted: 'border-farmhouse-stone/30 text-farmhouse-stone' },
  rust: { bg: 'bg-farmhouse-rust', muted: 'border-farmhouse-rust/30 text-farmhouse-rust' },
  slate: { bg: 'bg-farmhouse-slate', muted: 'border-farmhouse-slate/30 text-farmhouse-slate' },
  olive: { bg: 'bg-farmhouse-olive', muted: 'border-farmhouse-olive/30 text-farmhouse-olive' },
  taupe: { bg: 'bg-farmhouse-taupe', muted: 'border-farmhouse-taupe/30 text-farmhouse-taupe' },
  plum: { bg: 'bg-farmhouse-plum', muted: 'border-farmhouse-plum/30 text-farmhouse-plum' },
  sienna: { bg: 'bg-farmhouse-sienna', muted: 'border-farmhouse-sienna/30 text-farmhouse-sienna' }
};

export function getColorClasses(color: string) {
  return colorClasses[color] || colorClasses.sage;
} 