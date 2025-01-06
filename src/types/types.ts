import { ReactElement } from 'react';
import { IconProps } from 'lucide-react';

export interface TaskDetail {
  notes?: string;
  pages?: string;
  chapter?: string;
}

export interface Task {
  id: number;
  category: "academic" | "routine";
  subject: string;
  title: string;
  icon: ReactElement<IconProps>;
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
  task?: Task;
  isNew: boolean;
} 