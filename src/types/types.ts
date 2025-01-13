import type { LucideIcon } from 'lucide-react';
import { TaskType } from '../constants/taskTypes';
import { availableIcons } from '../data/taskTemplates';

export type IconName = keyof typeof availableIcons;

// New Data Model
export interface TaskDefinition {
  id: string;
  title: string;
  type: TaskType;
  icon: IconName;
  defaultPoints: number;
  defaultDays: number[];
}

export interface TaskAssignment {
  id: string;
  taskDefinitionId: string;
  childId: string;
  points: number;
  days: number[];
  streak: number;
  completions: Record<string, boolean>;
}

// Firestore types
export interface FirestoreTaskDefinition extends Omit<TaskDefinition, 'id'> {}
export interface FirestoreTaskAssignment extends Omit<TaskAssignment, 'id'> {}
export interface FirestoreChild {
  name: string;
  age: number;
  color: string;
  totalPoints: number;
}

// Application types
export interface Child {
  id: string;
  name: string;
  age: number;
  color: string;
  totalPoints: number;
  taskAssignments: (TaskAssignment & { definition: TaskDefinition })[];
}

export interface TaskDetail {
  pages?: string;
  chapter?: string;
  notes?: string;
}

// Types for the task editor
export interface TaskEditor {
  isOpen: boolean;
  isNew: boolean;
  taskDefinition?: TaskDefinition;
  taskAssignment?: TaskAssignment;
}

export interface EditingTask {
  definition?: Partial<Omit<TaskDefinition, 'id'>>;
  assignment?: Partial<Omit<TaskAssignment, 'id' | 'taskDefinitionId' | 'childId'>>;
}

// For the list view
export interface UniqueTaskDefinition {
  definition: TaskDefinition;
  assignedChildIds: string[];
} 