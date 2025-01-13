import { IconName, TaskDefinition } from '../types/types';
import type { LucideIcon } from 'lucide-react';
import { 
  Sun, Moon, Book, Pencil, Calculator, Globe,
  Music, Palette, Dumbbell, ShowerHead, Bed,
  Shirt, Smile, UtensilsCrossed, Dog, Flower2,
  Brush, Trophy, GraduationCap, Brain, Star,
  Footprints, ShoppingBag, BookOpen
} from 'lucide-react';

export interface TaskTemplateDefinition extends Omit<TaskDefinition, 'id'> {
  title: string;
  type: TaskDefinition['type'];
  icon: IconName;
  defaultPoints: number;
  defaultDays: number[];
}

interface TaskTemplatesByType {
  morning_routine: TaskTemplateDefinition[];
  evening_routine: TaskTemplateDefinition[];
  learning_task: TaskTemplateDefinition[];
  extra_task: TaskTemplateDefinition[];
}

export const availableIcons = {
  Sun,
  Moon,
  Book,
  Pencil,
  Calculator,
  Globe,
  Music,
  Palette,
  Dumbbell,
  ShowerHead,
  Bed,
  Shirt,
  Smile,
  UtensilsCrossed,
  Dog,
  Flower2,
  Brush,
  Trophy,
  GraduationCap,
  Brain,
  Star,
  Footprints,
  ShoppingBag,
  BookOpen
} as const;

export const taskTemplates: TaskTemplatesByType = {
  morning_routine: [
    {
      title: "Brush teeth",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'morning_routine',
      icon: "Smile"
    },
    {
      title: "Make bed",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'morning_routine',
      icon: "Bed"
    },
    {
      title: "Get dressed",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'morning_routine',
      icon: "Shirt"
    }
  ],
  evening_routine: [
    {
      title: "Brush teeth",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'evening_routine',
      icon: "Smile"
    },
    {
      title: "Take shower",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'evening_routine',
      icon: "ShowerHead"
    },
    {
      title: "Pick out clothes",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'evening_routine',
      icon: "Star"
    },
    {
      title: "Put on pajamas",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'evening_routine',
      icon: "Shirt"
    }
  ],
  learning_task: [
    {
      title: "Math practice",
      defaultPoints: 2,
      defaultDays: [1, 2, 3, 4, 5],
      type: 'learning_task',
      icon: "Calculator"
    },
    {
      title: "Reading time",
      defaultPoints: 2,
      defaultDays: [1, 2, 3, 4, 5],
      type: 'learning_task',
      icon: "BookOpen"
    }
  ],
  extra_task: [
    {
      title: "Art project",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: "Palette"
    },
    {
      title: "Music practice",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: "Music"
    },
    {
      title: "Geography study",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: "Globe"
    }
  ]
}; 