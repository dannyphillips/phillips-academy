import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Child, TaskDefinition, TaskAssignment } from '../types/types';
import { getAllUniqueTaskDefinitions, getColorClasses } from '../utils/taskUtils';
import { TASK_TYPES } from '../constants/taskTypes';
import { ChildToggle } from './ChildToggle';
import { TaskGroup } from './TaskGroup';
import { availableIcons } from '../data/taskTemplates';
import React from 'react';

interface ParentWeekViewProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  daysOfWeek: string[];
  currentDay: number;
  openTaskEditor: (taskDefinition?: TaskDefinition, taskAssignment?: TaskAssignment) => void;
  onEditChild: (child: Child) => void;
  taskDefinitions: TaskDefinition[];
}

export function ParentWeekView({ children, setChildren, daysOfWeek, currentDay, openTaskEditor, onEditChild, taskDefinitions }: ParentWeekViewProps) {
  const uniqueTaskDefinitions = getAllUniqueTaskDefinitions(children);
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
        <h1 className="text-3xl font-bold text-farmhouse-navy">Weekly Schedule</h1>
        <button
          onClick={() => openTaskEditor()}
          className="primary-button"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {children.map((child) => (
          <ChildToggle
            key={child.id}
            child={child}
            onEdit={onEditChild}
            isVisible={visibleChildren.includes(child.id)}
            onToggleVisibility={toggleChildVisibility}
          />
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="font-medium text-farmhouse-brown">Tasks</div>
            {daysOfWeek.map((day, index) => (
              <div
                key={`header-${day}`}
                className={`font-medium text-center ${index === currentDay ? "text-farmhouse-navy" : "text-farmhouse-brown"}`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {TASK_TYPES.map((type) => (
              <TaskGroup key={type} type={type} className="space-y-2">
                {uniqueTaskDefinitions
                  .filter((uniqueTask) => uniqueTask.definition.type === type)
                  .map(({ definition, assignedChildIds }) => {
                    const assignedChildren = children.filter((child) =>
                      assignedChildIds.includes(child.id)
                    );
                    // Get the first assignment for this task definition from any child
                    const taskAssignment = children
                      .flatMap(child => child.taskAssignments)
                      .find(assignment => assignment.taskDefinitionId === definition.id);

                    return (
                      <div
                        key={`task-${definition.id}`}
                        className="grid grid-cols-8 gap-2 bg-white rounded-lg p-3 items-center border border-farmhouse-beige hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-farmhouse-brown">
                            {React.createElement(availableIcons[definition.icon], {
                              className: "w-4 h-4"
                            })}
                          </div>
                          <div>
                            <div className="font-medium text-farmhouse-navy">
                              {definition.title}
                            </div>
                            <div className="flex -space-x-1">
                              {assignedChildren.map((child) => {
                                const colors = getColorClasses(child.color || 'blue');
                                return (
                                  <div
                                    key={`${definition.id}-${child.id}`}
                                    className={`w-5 h-5 rounded-full ${colors.bg} border border-white flex items-center justify-center`}
                                    title={child.name}
                                  >
                                    <span className="text-xs font-medium text-white">
                                      {child.name[0]}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        {daysOfWeek.map((_, dayIndex) => {
                          const isScheduled = taskAssignment?.days.includes(dayIndex);
                          return (
                            <div
                              key={`${definition.id}-${dayIndex}`}
                              className={`flex items-center justify-center ${
                                isScheduled
                                  ? "text-farmhouse-navy"
                                  : "text-farmhouse-brown/30"
                              }`}
                            >
                              {React.createElement(availableIcons[definition.icon], {
                                className: "w-4 h-4"
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
              </TaskGroup>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 