import React from 'react';
import { Check, Flame, Trophy } from 'lucide-react';
import { TaskAssignment, TaskDefinition } from '../types/types';
import { availableIcons } from '../data/taskTemplates';

interface TaskGroupProps {
  title: string;
  tasks: (TaskAssignment & { definition: TaskDefinition })[];
  selectedDay: number;
  onTaskComplete: (childId: string, taskId: string, day: number) => void;
  colors: {
    bg: string;
    text: string;
    border: string;
  };
  getCompletionDateKey: (dayIndex: number) => string;
}

export function TaskGroup({ 
  title, 
  tasks, 
  selectedDay, 
  onTaskComplete, 
  colors, 
  getCompletionDateKey 
}: TaskGroupProps) {
  // Filter tasks for the selected day
  const tasksForDay = tasks.filter(task => task.days.includes(selectedDay));

  if (tasksForDay.length === 0) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-farmhouse-navy">
        {title}
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
                    <p className="text-sm text-farmhouse-brown">
                      {assignment.definition.description}
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
    </div>
  );
} 
