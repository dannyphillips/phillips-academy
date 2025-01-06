import { Child } from '../types/types';

export function getAllUniqueTasks(children: Child[]) {
  const uniqueTasks = new Map();

  children.forEach((child) => {
    child.tasks.forEach((task) => {
      const key = `${task.subject}-${task.title}`;
      if (!uniqueTasks.has(key)) {
        uniqueTasks.set(key, {
          category: task.category,
          subject: task.subject,
          title: task.title,
          key,
          icon: task.icon,
        });
      }
    });
  });

  return Array.from(uniqueTasks.values());
}

export function getColorClasses(color: string) {
  switch (color) {
    case 'sage':
      return {
        bg: 'bg-farmhouse-sage',
        text: 'text-white',
        border: 'border-farmhouse-sage',
        completed: 'bg-farmhouse-sage/20',
        muted: 'bg-farmhouse-sage/10 text-farmhouse-sage border-farmhouse-sage/20',
      };
    case 'terracotta':
      return {
        bg: 'bg-farmhouse-terracotta',
        text: 'text-white',
        border: 'border-farmhouse-terracotta',
        completed: 'bg-farmhouse-terracotta/20',
        muted: 'bg-farmhouse-terracotta/10 text-farmhouse-terracotta border-farmhouse-terracotta/20',
      };
    case 'dustyblue':
      return {
        bg: 'bg-farmhouse-dustyblue',
        text: 'text-white',
        border: 'border-farmhouse-dustyblue',
        completed: 'bg-farmhouse-dustyblue/20',
        muted: 'bg-farmhouse-dustyblue/10 text-farmhouse-dustyblue border-farmhouse-dustyblue/20',
      };
    default:
      return {
        bg: 'bg-farmhouse-navy',
        text: 'text-white',
        border: 'border-farmhouse-navy',
        completed: 'bg-farmhouse-navy/20',
        muted: 'bg-farmhouse-navy/10 text-farmhouse-navy border-farmhouse-navy/20',
      };
  }
} 