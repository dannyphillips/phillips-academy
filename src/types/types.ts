import { ReactElement } from 'react';
import { LucideIcon } from 'lucide-react';

export interface TaskDetail {
  pages?: string;
  chapter?: string;
  notes?: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  streak: number;
  points: number;
  days: number[];
}

export interface Child {
  id: number;
  name: string;
  totalPoints: number;
  tasks: Task[];
  color?: string;
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
}

export interface FirestoreChild extends Omit<Child, 'id' | 'tasks'> {
  id: string;        // Firestore IDs are strings
} 