import { ReactElement } from 'react';
import { LucideIcon } from 'lucide-react';
import { TaskType } from '../constants/taskTypes';

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
  icon: LucideIcon;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  color: string;
  totalPoints: number;
  tasks: Task[];
}

export interface TaskEditor {
  isOpen: boolean;
  isNew: boolean;
  task?: Task;
}

export interface EditingTask extends Partial<Task> {
  days?: number[];
}

export interface UniqueTask {
  category: TaskType;
  subject: string;
  title: string;
  key: string;
  icon: LucideIcon;
}

// New types for Firestore
export interface FirestoreTask extends Omit<Task, 'id' | 'icon'> {
  id: string;        // Firestore IDs are strings
  childId: string;   // Add this to link tasks to children
  type: TaskType;
}

export interface FirestoreChild {
  name: string;
  age: number;
  color: string;
  totalPoints: number;
} 