import { IconName, TaskDefinition } from '../types/types';
import type { LucideIcon } from 'lucide-react';
import { 
  Sun, Moon, Book, Pencil, Calculator, Globe,
  Music, Palette, Dumbbell, ShowerHead, Bed,
  Shirt, Smile, UtensilsCrossed, Dog, Flower2,
  Brush, Trophy, GraduationCap, Brain, Star,
  Footprints, ShoppingBag, BookOpen, Trash2
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
  BookOpen,
  Trash2
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
      icon: "Shirt"
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
    },
    {
      title: "Geography study",
      defaultPoints: 2,
      defaultDays: [1, 2, 3, 4, 5],
      type: 'learning_task',
      icon: "Globe"
    },
    {
      title: "Music practice",
      defaultPoints: 2,
      defaultDays: [3],
      type: 'learning_task',
      icon: "Music"
    },
    {
      title: "Art project",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: "Palette"
    }
  ],
  extra_task: [
    {
      title: "Take out trash",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: "Trash2"
    },
    {
      title: "Put away clothes",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: "Shirt"
    },
    {
      title: "Pick up toys",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: "Star"
    },
    {
      title: "Feed the dog",
      defaultPoints: 1,
      defaultDays: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: "Dog"
    }
  ]
}; 