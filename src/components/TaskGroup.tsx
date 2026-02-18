import React from 'react';
import { Check, Flame, Trophy } from 'lucide-react';
import { TaskAssignment, TaskDefinition } from '../types/types';
import { availableIcons } from '../data/taskTemplates';
import { TaskType, getTaskTypeDisplayName } from '../constants/taskTypes';

interface TaskGroupProps {
  // Wrapper mode (ChildWeekView, ParentListView, ParentWeekView)
  type?: TaskType;
  className?: string;
  children?: React.ReactNode;
  // Full rendering mode (ChildDayView)
  title?: string;
  tasks?: (TaskAssignment & { definition: TaskDefinition })[];
  selectedDay?: number;
  onTaskComplete?: (childId: string, taskId: string, day: number) => void;
  colors?: {
    bg: string;
    muted: string;
  };
  getCompletionDateKey?: (dayIndex: number) => string;
}

export function TaskGroup({ 
  type,
  className,
  children,
  title, 
  tasks, 
  selectedDay, 
  onTaskComplete, 
  colors, 
  getCompletionDateKey 
}: TaskGroupProps) {
  // Wrapper mode: render a section header + children
  if (children !== undefined) {
    const heading = type ? getTaskTypeDisplayName(type) : title;
    return (
      <div className={className}>
        {heading && (
          <h2 className="text-xl font-semibold text-farmhouse-navy mb-2">
            {heading}
          </h2>
        )}
        {children}
      </div>
    );
  }

  // Full rendering mode: render task cards internally
  if (!tasks || selectedDay === undefined || !onTaskComplete || !colors || !getCompletionDateKey) {
    return null;
  }

  const heading = title ?? (type ? getTaskTypeDisplayName(type) : '');

  // Filter tasks for the selected day
  const tasksForDay = tasks.filter(task => task.days.includes(selectedDay));

  if (tasksForDay.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-farmhouse-navy">
        {heading}
      </h2>
      <div className="space-y-2">
        {tasksForDay.map((assignment) => {
          const Icon = availableIcons[assignment.definition.icon];
          return (
            <div
              key={assignment.id}
              className="task-card"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onTaskComplete(assignment.childId, assignment.id, selectedDay)}
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
    </div>
  );
} 
