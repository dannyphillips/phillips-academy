import { Child, TaskDefinition, TaskAssignment } from '../types/types';

// Sort options for different contexts
export type TaskSortOption = 'name' | 'points' | 'assigned' | 'type' | 'completion';
export type ChildSortOption = 'name' | 'age' | 'points' | 'tasks';
export type SkillSortOption = 'name' | 'completion' | 'startDate' | 'category';

// Sort direction
export type SortDirection = 'asc' | 'desc';

// Sort configuration
export interface SortConfig {
  field: string;
  direction: SortDirection;
}

// Task sorting functions
export const sortTaskDefinitions = (
  taskDefinitions: TaskDefinition[],
  sortBy: TaskSortOption,
  direction: SortDirection = 'asc'
): TaskDefinition[] => {
  const sorted = [...taskDefinitions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'points':
        comparison = a.defaultPoints - b.defaultPoints;
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      default:
        comparison = 0;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

// Task assignments with definitions sorting
export const sortTaskAssignments = (
  assignments: (TaskAssignment & { definition: TaskDefinition })[],
  sortBy: TaskSortOption,
  direction: SortDirection = 'asc'
): (TaskAssignment & { definition: TaskDefinition })[] => {
  const sorted = [...assignments].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.definition.title.localeCompare(b.definition.title);
        break;
      case 'points':
        comparison = a.points - b.points;
        break;
      case 'type':
        comparison = a.definition.type.localeCompare(b.definition.type);
        break;
      case 'completion':
        // Sort by completion rate (completed tasks first)
        const aCompleted = Object.values(a.completions || {}).filter(Boolean).length;
        const bCompleted = Object.values(b.completions || {}).filter(Boolean).length;
        const aTotal = Object.keys(a.completions || {}).length;
        const bTotal = Object.keys(b.completions || {}).length;
        const aRate = aTotal > 0 ? aCompleted / aTotal : 0;
        const bRate = bTotal > 0 ? bCompleted / bTotal : 0;
        comparison = aRate - bRate;
        break;
      default:
        comparison = 0;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

// Children sorting
export const sortChildren = (
  children: Child[],
  sortBy: ChildSortOption,
  direction: SortDirection = 'asc'
): Child[] => {
  const sorted = [...children].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'age':
        comparison = a.age - b.age;
        break;
      case 'points':
        comparison = a.totalPoints - b.totalPoints;
        break;
      case 'tasks':
        comparison = a.taskAssignments.length - b.taskAssignments.length;
        break;
      default:
        comparison = 0;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

// Skills sorting
export const sortSkills = (
  skills: any[],
  sortBy: SkillSortOption,
  direction: SortDirection = 'asc'
): any[] => {
  const sorted = [...skills].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = (a.name || a.title || '').localeCompare(b.name || b.title || '');
        break;
      case 'completion':
        comparison = (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0);
        break;
      case 'startDate':
        const aDate = a.startedAt || a.startDate || new Date(0);
        const bDate = b.startedAt || b.startDate || new Date(0);
        comparison = new Date(aDate).getTime() - new Date(bDate).getTime();
        break;
      case 'category':
        comparison = (a.category || '').localeCompare(b.category || '');
        break;
      default:
        comparison = 0;
    }
    
    return direction === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
};

// Helper function to get next sort direction
export const getNextSortDirection = (currentDirection: SortDirection): SortDirection => {
  return currentDirection === 'asc' ? 'desc' : 'asc';
};

// Helper function to get sort icon
export const getSortIcon = (currentField: string, sortField: string, direction: SortDirection): string => {
  if (currentField !== sortField) return '↕️';
  return direction === 'asc' ? '↑' : '↓';
}; 
