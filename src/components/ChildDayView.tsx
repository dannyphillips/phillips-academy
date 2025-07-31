import React from 'react';
import { Check, Flame, Trophy } from 'lucide-react';
import { Child } from '../types/types';
import { getColorClasses } from '../utils/taskUtils';
import { TASK_TYPES, getTaskTypeDisplayName, TaskType } from '../constants/taskTypes';
import { ChildToggle } from './ChildToggle';
import { TaskGroup } from './TaskGroup';
import { availableIcons } from '../data/taskTemplates';
import { SortSelect } from './SortSelect';
import { sortTaskAssignments, TaskSortOption, SortDirection } from '../utils/sortUtils';

// Helper function to get the completion date key for a given day index
function getCompletionDateKey(dayIndex: number): string {
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay()); // Get start of week (Sunday)
  const completionDate = new Date(currentWeekStart);
  completionDate.setDate(currentWeekStart.getDate() + dayIndex);
  return completionDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

interface ChildDayViewProps {
  children: Child[];
  activeChild: number;
  setActiveChild: (index: number) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  daysOfWeek: string[];
  handleTaskComplete: (childId: string, taskId: string, day: number) => void;
}

export function ChildDayView({
  children,
  activeChild,
  setActiveChild,
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {children.map((child, index) => (
          <ChildToggle
            key={child.id}
            child={child}
            isVisible={index === activeChild}
            onToggleVisibility={() => setActiveChild(index)}
            showStats={true}
            selectedDay={selectedDay}
          />
        ))}
      </div>

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
          placeholder="Sort tasks by..."
        />
      </div>

      <div className="space-y-4">
        {TASK_TYPES.map(type => {
          const tasksOfType = currentChild.taskAssignments.filter(
            assignment => assignment.definition.type === type && assignment.days.includes(selectedDay)
          );

          // Sort the tasks
          const sortedTasks = sortTaskAssignments(tasksOfType, sortField, sortDirection);

          return (
            <TaskGroup key={type} type={type}>
              <div className="space-y-2">
                {sortedTasks.map((assignment) => {
                  const Icon = availableIcons[assignment.definition.icon];
                  return (
                    <div
                      key={assignment.id}
                      className="task-card"
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleTaskComplete(currentChild.id, assignment.id, selectedDay)}
                          className={`task-button ${
                            assignment.completions?.[getCompletionDateKey(selectedDay)] ? `${colors.bg} text-white` : 'task-button-incomplete'
                          }`}
                        >
                          {assignment.completions?.[getCompletionDateKey(selectedDay)] && <Check className="w-4 h-4" />}
                        </button>
                        <div className="flex-grow flex items-center gap-3">
                          <div className="text-farmhouse-brown">
                            {React.createElement(Icon, {
                              className: "w-5 h-5"
                            })}
                          </div>
                          <div>
                            <h3 className="font-medium text-farmhouse-navy">
                              {assignment.definition.title}
                            </h3>
                            <p className="text-sm text-farmhouse-brown">
                              {getTaskTypeDisplayName(assignment.definition.type)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-farmhouse-brown">
                          <div className="flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm font-medium">{assignment.points}</span>
                          </div>
                          {assignment.streak > 0 && (
                            <div className="flex items-center gap-1">
                              <Flame className="w-4 h-4" />
                              <span className="text-sm font-medium">{assignment.streak}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TaskGroup>
          );
        })}
      </div>
    </div>
  );
} 
