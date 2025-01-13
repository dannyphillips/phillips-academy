import { Task, IconName } from '../types/types';
import type { LucideIcon } from 'lucide-react';
import { 
  Sun, Moon, Book, Pencil, Calculator, Globe,
  Music, Palette, Dumbbell, ShowerHead, Bed,
  Shirt, Smile, UtensilsCrossed, Dog, Flower2,
  Brush, Trophy, GraduationCap, Brain, Star,
  Footprints, ShoppingBag, BookOpen
} from 'lucide-react';

export interface TaskTemplate extends Omit<Task, 'id' | 'completed' | 'streak'> {
  title: string;
  points: number;
  days: number[];
  type: Task['type'];
  icon: IconName;
}

interface TaskTemplatesByType {
  morning_routine: TaskTemplate[];
  evening_routine: TaskTemplate[];
  learning_task: TaskTemplate[];
  extra_task: TaskTemplate[];
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
      points: 10,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'morning_routine',
      icon: "Smile"
    },
    {
      title: "Make bed",
      points: 10,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'morning_routine',
      icon: "Bed"
    },
    {
      title: "Get dressed",
      points: 10,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'morning_routine',
      icon: "Shirt"
    }
  ],
  evening_routine: [
    {
      title: "Brush teeth",
      points: 10,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'evening_routine',
      icon: "Smile"
    },
    {
      title: "Take shower",
      points: 10,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'evening_routine',
      icon: "ShowerHead"
    },
    {
      title: "Pick out clothes",
      points: 10,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'evening_routine',
      icon: "Star"
    },
    {
      title: "Put on pajamas",
      points: 10,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'evening_routine',
      icon: "Shirt"
    }
  ],
  learning_task: [
    {
      title: "Math practice",
      points: 20,
      days: [1, 2, 3, 4, 5],
      type: 'learning_task',
      icon: "Calculator"
    },
    {
      title: "Reading time",
      points: 20,
      days: [1, 2, 3, 4, 5],
      type: 'learning_task',
      icon: "BookOpen"
    }
  ],
  extra_task: [
    {
      title: "Art project",
      points: 15,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: "Palette"
    },
    {
      title: "Music practice",
      points: 15,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: "Music"
    },
    {
      title: "Geography study",
      points: 15,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: "Globe"
    }
  ]
}; 