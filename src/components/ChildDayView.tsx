import React from 'react';
import { Child } from '../types/types';
import { getColorClasses } from '../utils/taskUtils';
import { TASK_TYPES, getTaskTypeDisplayName } from '../constants/taskTypes';
import { TaskGroup } from './TaskGroup';
import { SortSelect } from './SortSelect';
import { sortTaskAssignments, TaskSortOption, SortDirection } from '../utils/sortUtils';
import { getCompletionDateKey } from '../utils/dateUtils';

interface ChildDayViewProps {
  children: Child[];
  activeChild: number;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  daysOfWeek: string[];
  handleTaskComplete: (childId: string, taskId: string, day: number) => void;
}

export function ChildDayView({
  children,
  activeChild,
  selectedDay,
  setSelectedDay,
  daysOfWeek,
  handleTaskComplete
}: ChildDayViewProps) {
  // Sort state
  const [sortField, setSortField] = React.useState<TaskSortOption>('name');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('asc');

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'points', label: 'Points' },
    { value: 'type', label: 'Type' },
    { value: 'completion', label: 'Completion' },
  ];

  const handleSortChange = (field: string, direction: SortDirection) => {
    setSortField(field as TaskSortOption);
    setSortDirection(direction);
  };

  if (children.length === 0) {
    return <div>No children found</div>;
  }

  const currentChild = children[activeChild];
  if (!currentChild) {
    return <div>Invalid child selected</div>;
  }

  const colors = getColorClasses(currentChild.color || 'blue');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {daysOfWeek.map((day, index) => (
            <button
              key={day}
              onClick={() => setSelectedDay(index)}
              className={`day-button ${
                index === selectedDay ? `${colors.bg} text-white` : 'day-button-inactive'
              }`}
            >
              {day[0]}
            </button>
          ))}
        </div>
        <SortSelect
          options={sortOptions}
          value={sortField}
          direction={sortDirection}
          onSortChange={handleSortChange}
        />
      </div>

      <div className="space-y-4">
        {TASK_TYPES.map((taskType) => {
          const tasksForType = currentChild.taskAssignments
            .filter((assignment) => assignment.definition.type === taskType);
          
          // Sort the tasks using the sortTaskAssignments function
          const sortedTasks = sortTaskAssignments(tasksForType, sortField, sortDirection);

          if (sortedTasks.length === 0) return null;

          return (
            <TaskGroup
              key={taskType}
              title={getTaskTypeDisplayName(taskType)}
              tasks={sortedTasks}
              selectedDay={selectedDay}
              onTaskComplete={handleTaskComplete}
              colors={colors}
              getCompletionDateKey={getCompletionDateKey}
            />
          );
        })}
      </div>
    </div>
  );
} 
