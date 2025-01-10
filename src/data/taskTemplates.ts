import { Task } from '../types/types';

export interface TaskTemplate extends Omit<Task, 'id' | 'completed' | 'streak'> {
  title: string;
  points: number;
  days: number[];
  type: Task['type'];
}

export const taskTemplates: TaskTemplate[] = [
  // Morning Routine Tasks
  {
    title: "Brush Teeth",
    points: 1,
    days: [0, 1, 2, 3, 4, 5, 6],
    type: 'morning_routine'
  },
  {
    title: "Make Bed",
    points: 1,
    days: [0, 1, 2, 3, 4, 5, 6],
    type: 'morning_routine'
  },
  {
    title: "Get Dressed",
    points: 1,
    days: [0, 1, 2, 3, 4, 5, 6],
    type: 'morning_routine'
  },
  {
    title: "Eat Breakfast",
    points: 1,
    days: [0, 1, 2, 3, 4, 5, 6],
    type: 'morning_routine'
  },
  {
    title: "Pack School Bag",
    points: 1,
    days: [1, 2, 3, 4, 5],
    type: 'morning_routine'
  },

  // Evening Routine Tasks
  {
    title: "Brush Teeth",
    points: 1,
    days: [0, 1, 2, 3, 4, 5, 6],
    type: 'evening_routine'
  },
  {
    title: "Take Bath/Shower",
    points: 2,
    days: [0, 2, 4, 6],
    type: 'evening_routine'
  },
  {
    title: "Put Away Toys",
    points: 1,
    days: [0, 1, 2, 3, 4, 5, 6],
    type: 'evening_routine'
  },
  {
    title: "Put Clothes in Hamper",
    points: 1,
    days: [0, 1, 2, 3, 4, 5, 6],
    type: 'evening_routine'
  },
  {
    title: "Set Out Clothes for Tomorrow",
    points: 1,
    days: [1, 2, 3, 4, 5],
    type: 'evening_routine'
  },

  // Learning Tasks
  {
    title: "Math Practice",
    points: 2,
    days: [1, 3, 5],
    type: 'learning_task'
  },
  {
    title: "Reading Time",
    points: 2,
    days: [1, 2, 3, 4, 5],
    type: 'learning_task'
  },
  {
    title: "Writing Practice",
    points: 2,
    days: [2, 4],
    type: 'learning_task'
  },
  {
    title: "Science Experiment",
    points: 3,
    days: [3],
    type: 'learning_task'
  },
  {
    title: "Art Project",
    points: 2,
    days: [2, 5],
    type: 'learning_task'
  },
  {
    title: "Music Practice",
    points: 2,
    days: [1, 3, 5],
    type: 'learning_task'
  },
  {
    title: "Geography/Maps",
    points: 2,
    days: [2, 4],
    type: 'learning_task'
  },
  {
    title: "Spelling Practice",
    points: 2,
    days: [1, 3, 5],
    type: 'learning_task'
  },
  {
    title: "History Reading",
    points: 2,
    days: [2, 4],
    type: 'learning_task'
  },
  {
    title: "Language Learning",
    points: 2,
    days: [1, 3, 5],
    type: 'learning_task'
  },

  // Extra Tasks
  {
    title: "Help with Dishes",
    points: 2,
    days: [0, 3, 6],
    type: 'extra_task'
  },
  {
    title: "Feed Pet",
    points: 1,
    days: [0, 1, 2, 3, 4, 5, 6],
    type: 'extra_task'
  },
  {
    title: "Water Plants",
    points: 1,
    days: [1, 4],
    type: 'extra_task'
  },
  {
    title: "Clean Room",
    points: 3,
    days: [6],
    type: 'extra_task'
  },
  {
    title: "Help with Laundry",
    points: 2,
    days: [0, 3, 6],
    type: 'extra_task'
  },
  {
    title: "Set Table",
    points: 1,
    days: [0, 1, 2, 3, 4, 5, 6],
    type: 'extra_task'
  },
  {
    title: "Exercise",
    points: 2,
    days: [1, 3, 5],
    type: 'extra_task'
  },
  {
    title: "Practice Sports",
    points: 2,
    days: [2, 4, 6],
    type: 'extra_task'
  },
  {
    title: "Help with Groceries",
    points: 2,
    days: [0],
    type: 'extra_task'
  },
  {
    title: "Organize Toys/Books",
    points: 2,
    days: [6],
    type: 'extra_task'
  }
]; 