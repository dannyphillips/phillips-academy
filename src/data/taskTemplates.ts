import { Task } from '../types/types';
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
  icon: LucideIcon;
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
};

export const taskTemplates: TaskTemplatesByType = {
  morning_routine: [
    {
      title: "Brush Teeth",
      points: 1,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'morning_routine',
      icon: Smile
    },
    {
      title: "Make Bed",
      points: 1,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'morning_routine',
      icon: Bed
    },
    {
      title: "Get Dressed",
      points: 1,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'morning_routine',
      icon: Shirt
    },
    {
      title: "Eat Breakfast",
      points: 1,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'morning_routine',
      icon: UtensilsCrossed
    },
    {
      title: "Pack School Bag",
      points: 1,
      days: [1, 2, 3, 4, 5],
      type: 'morning_routine',
      icon: ShoppingBag
    }
  ],
  evening_routine: [
    {
      title: "Brush Teeth",
      points: 1,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'evening_routine',
      icon: Smile
    },
    {
      title: "Take Bath/Shower",
      points: 2,
      days: [0, 2, 4, 6],
      type: 'evening_routine',
      icon: ShowerHead
    },
    {
      title: "Put Away Toys",
      points: 1,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'evening_routine',
      icon: Star
    },
    {
      title: "Put Clothes in Hamper",
      points: 1,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'evening_routine',
      icon: Shirt
    },
    {
      title: "Set Out Clothes for Tomorrow",
      points: 1,
      days: [1, 2, 3, 4, 5],
      type: 'evening_routine',
      icon: Shirt
    }
  ],
  learning_task: [
    {
      title: "Math Practice",
      points: 2,
      days: [1, 3, 5],
      type: 'learning_task',
      icon: Calculator
    },
    {
      title: "Reading Time",
      points: 2,
      days: [1, 2, 3, 4, 5],
      type: 'learning_task',
      icon: BookOpen
    },
    {
      title: "Writing Practice",
      points: 2,
      days: [2, 4],
      type: 'learning_task',
      icon: Pencil
    },
    {
      title: "Science Experiment",
      points: 3,
      days: [3],
      type: 'learning_task',
      icon: Brain
    },
    {
      title: "Art Project",
      points: 2,
      days: [2, 5],
      type: 'learning_task',
      icon: Palette
    },
    {
      title: "Music Practice",
      points: 2,
      days: [1, 3, 5],
      type: 'learning_task',
      icon: Music
    },
    {
      title: "Geography/Maps",
      points: 2,
      days: [2, 4],
      type: 'learning_task',
      icon: Globe
    },
    {
      title: "Spelling Practice",
      points: 2,
      days: [1, 3, 5],
      type: 'learning_task',
      icon: Book
    },
    {
      title: "History Reading",
      points: 2,
      days: [2, 4],
      type: 'learning_task',
      icon: BookOpen
    },
    {
      title: "Language Learning",
      points: 2,
      days: [1, 3, 5],
      type: 'learning_task',
      icon: GraduationCap
    }
  ],
  extra_task: [
    {
      title: "Help with Dishes",
      points: 2,
      days: [0, 3, 6],
      type: 'extra_task',
      icon: UtensilsCrossed
    },
    {
      title: "Feed Pet",
      points: 1,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: Dog
    },
    {
      title: "Water Plants",
      points: 1,
      days: [1, 4],
      type: 'extra_task',
      icon: Flower2
    },
    {
      title: "Clean Room",
      points: 3,
      days: [6],
      type: 'extra_task',
      icon: Brush
    },
    {
      title: "Help with Laundry",
      points: 2,
      days: [0, 3, 6],
      type: 'extra_task',
      icon: Shirt
    },
    {
      title: "Set Table",
      points: 1,
      days: [0, 1, 2, 3, 4, 5, 6],
      type: 'extra_task',
      icon: UtensilsCrossed
    },
    {
      title: "Exercise",
      points: 2,
      days: [1, 3, 5],
      type: 'extra_task',
      icon: Dumbbell
    },
    {
      title: "Practice Sports",
      points: 2,
      days: [2, 4, 6],
      type: 'extra_task',
      icon: Footprints
    },
    {
      title: "Help with Groceries",
      points: 2,
      days: [0],
      type: 'extra_task',
      icon: ShoppingBag
    },
    {
      title: "Organize Toys/Books",
      points: 2,
      days: [6],
      type: 'extra_task',
      icon: Star
    }
  ]
}; 