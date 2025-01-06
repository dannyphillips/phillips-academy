import { ReactElement } from 'react';
import { LucideIcon } from 'lucide-react';

export interface TaskDetail {
  pages?: string;
  chapter?: string;
  notes?: string;
}

export interface Task {
  id: number;
  category: string;
  subject: string;
  title: string;
  icon: ReactElement<LucideIcon>;
  completed: boolean;
  frequency: number[];
  streak: number;
  points: number;
  details?: TaskDetail;
}

export interface Child {
  id: number;
  name: string;
  color: string;
  totalPoints: number;
  tasks: Task[];
}

export interface TaskEditor {
  isOpen: boolean;
  isNew: boolean;
  task?: Task;
}

export interface UniqueTask {
  category: string;
  subject: string;
  title: string;
  key: string;
  icon: ReactElement<LucideIcon>;
} 