import { Child } from '../types/types';

export const initialChildren: Child[] = [
  {
    id: "1",
    name: "Ellie",
    age: 8,
    totalPoints: 0,
    color: 'blue',
    tasks: [
      {
        id: "1",
        title: "Brush Teeth",
        completed: false,
        streak: 0,
        points: 1,
        days: [0, 1, 2, 3, 4, 5, 6],  // Every day
        type: 'morning_routine'
      },
      {
        id: "2",
        title: "Make Bed",
        completed: false,
        streak: 0,
        points: 1,
        days: [0, 1, 2, 3, 4, 5, 6],  // Every day
        type: 'morning_routine'
      },
      {
        id: "3",
        title: "Math Practice",
        completed: false,
        streak: 0,
        points: 2,
        days: [1, 3, 5],  // MWF
        type: 'learning_task'
      }
    ]
  },
  {
    id: "2",
    name: "Addie",
    age: 6,
    totalPoints: 0,
    color: 'purple',
    tasks: [
      {
        id: "4",
        title: "Brush Teeth",
        completed: false,
        streak: 0,
        points: 1,
        days: [0, 1, 2, 3, 4, 5, 6],  // Every day
        type: 'morning_routine'
      },
      {
        id: "5",
        title: "Reading",
        completed: false,
        streak: 0,
        points: 2,
        days: [1, 2, 3, 4, 5],  // Weekdays
        type: 'learning_task'
      }
    ]
  }
]; 