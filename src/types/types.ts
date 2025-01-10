import { ReactElement } from 'react';
import { LucideIcon } from 'lucide-react';

export interface TaskDetail {
  pages?: string;
  chapter?: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  streak: number;
  points: number;
  days: number[];
  type: 'morning_routine' | 'evening_routine' | 'learning_task' | 'extra_task';
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
  category: string;
  subject: string;
  title: string;
  key: string;
  icon: LucideIcon;
}

// New types for Firestore
export interface FirestoreTask extends Omit<Task, 'id'> {
  id: string;        // Firestore IDs are strings
  childId: string;   // Add this to link tasks to children
  type: 'morning_routine' | 'evening_routine' | 'learning_task' | 'extra_task';
}

export interface FirestoreChild {
  name: string;
  age: number;
  color: string;
  totalPoints: number;
} 