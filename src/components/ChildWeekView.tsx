import React from 'react';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Child } from '../types/types';
import { getColorClasses } from '../utils/taskUtils';
import { TASK_TYPES } from '../constants/taskTypes';
import { ChildToggle } from './ChildToggle';
import { TaskGroup } from './TaskGroup';
import { availableIcons } from '../data/taskTemplates';

interface ChildWeekViewProps {
  children: Child[];
  handleTaskComplete: (childId: string, taskId: string, day: number) => void;
  daysOfWeek: string[];
  currentDay: number;
}

export function ChildWeekView({ children, handleTaskComplete, daysOfWeek, currentDay }: ChildWeekViewProps) {
  const [visibleChildren, setVisibleChildren] = useState<string[]>(
    children.map((child) => child.id)
  );

  const toggleChildVisibility = (childId: string) => {
    setVisibleChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-farmhouse-navy">Family Weekly Schedule</h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.map((child) => (
          <ChildToggle
            key={child.id}
            child={child}
            isVisible={visibleChildren.includes(child.id)}
            onToggleVisibility={toggleChildVisibility}
            showStats={true}
          />
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="font-medium text-farmhouse-brown">Tasks</div>
            {daysOfWeek.map((day, index) => (
              <div
                key={day}
                className={`font-medium text-center ${index === currentDay ? "text-farmhouse-navy" : "text-farmhouse-brown"}`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {TASK_TYPES.map(type => {
              const tasksOfType = children
                .filter(child => visibleChildren.includes(child.id))
                .flatMap(child => 
                  child.taskAssignments
                    .filter(assignment => assignment.definition.type === type)
                    .map(assignment => ({ assignment, child }))
                );

              return (
                <TaskGroup key={type} type={type}>
                  <div className="space-y-2">
                    {tasksOfType.map(({ assignment, child }) => {
                      const colors = getColorClasses(child.color || 'blue');
                      const Icon = availableIcons[assignment.definition.icon];
                      return (
                        <div
                          key={`${child.id}-${assignment.id}`}
                          className="grid grid-cols-8 gap-2 bg-white rounded-lg p-3 items-center border border-farmhouse-beige hover:shadow-md transition-all"
                        >
                          <div className="text-sm flex items-center gap-3">
                            <div className="text-farmhouse-brown">
                              {React.createElement(Icon, {
                                className: "w-4 h-4"
                              })}
                            </div>
                            <div>
                              <div className="font-medium text-farmhouse-navy">
                                {assignment.definition.title}
                              </div>
                              <div className="text-xs text-farmhouse-brown">
                                {child.name}
                              </div>
                            </div>
                          </div>
                          {[...Array(7)].map((_, dayIndex) => (
                            <div
                              key={dayIndex}
                              className="flex justify-center"
                            >
                              {assignment.days.includes(dayIndex) && (
                                <button
                                  onClick={() => handleTaskComplete(child.id, assignment.id, dayIndex)}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all
                                    ${assignment.completions?.[`${assignment.id}-${dayIndex}`] ? `${colors.bg} text-white` : 'bg-white border-2 ' + colors.muted}`}
                                >
                                  {assignment.completions?.[`${assignment.id}-${dayIndex}`] && <Check className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </TaskGroup>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 