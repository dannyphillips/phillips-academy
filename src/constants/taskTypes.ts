export const TASK_TYPES = ['morning_routine', 'evening_routine', 'learning_task', 'extra_task'] as const;
export type TaskType = typeof TASK_TYPES[number];

export const TASK_TYPE_CATEGORIES = {
  morning_routine: 'Morning Routine',
  evening_routine: 'Evening Routine',
  learning_task: 'Learning Tasks',
  extra_task: 'Extra Tasks'
} as const;

export function getTaskTypeDisplayName(type: TaskType): string {
  return TASK_TYPE_CATEGORIES[type];
} 