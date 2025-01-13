import type { LucideIcon } from 'lucide-react';
import { TaskType } from '../constants/taskTypes';
import { availableIcons } from '../data/taskTemplates';

export type IconName = keyof typeof availableIcons;

export interface TaskDetail {
  pages?: string;
  chapter?: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  completed?: boolean;
  completions?: Record<string, boolean>;
  streak: number;
  points: number;
  days: number[];
  type: TaskType;
  icon: IconName;
}

export interface TaskWithComponent extends Task {
  iconComponent: LucideIcon;
}

export interface TaskEditor {
  isOpen: boolean;
  isNew: boolean;
  task?: Task;
}

export interface EditingTask extends Partial<Omit<Task, 'id'>> {
  icon?: IconName;
  iconComponent?: LucideIcon;
}

export interface UniqueTask {
  category: TaskType;
  subject: string;
  title: string;
  key: string;
  icon: IconName;
  assignedToChildren: boolean;
}

// New types for Firestore
export interface FirestoreTask extends Omit<Task, 'id'> {
  id: string;        // Firestore IDs are strings
  childId: string;   // Add this to link tasks to children
}

export interface FirestoreChild {
  name: string;
  age: number;
  color: string;
  totalPoints: number;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  color: string;
  totalPoints: number;
  tasks: Task[];
} 