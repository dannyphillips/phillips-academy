import React from 'react';
import { Edit2, Trash2, CircleDot } from 'lucide-react';
import { Child, TaskDefinition, TaskAssignment } from '../types/types';
import { getAllUniqueTaskDefinitions, getColorClasses } from '../utils/taskUtils';
import { TASK_TYPES } from '../constants/taskTypes';
import { ChildToggle } from './ChildToggle';
import { TaskGroup } from './TaskGroup';
import { ConfirmModal } from './ConfirmModal';
import { deleteTaskDefinition } from '../services/database';
import { availableIcons } from '../data/taskTemplates';
import { useState } from 'react';

interface ParentListViewProps {
  children: Child[];
  openTaskEditor: (taskDefinition?: TaskDefinition, taskAssignment?: TaskAssignment) => void;
  onEditChild: (child: Child) => void;
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  taskDefinitions: TaskDefinition[];
  setTaskDefinitions: React.Dispatch<React.SetStateAction<TaskDefinition[]>>;
  daysOfWeek: string[];
}

export function ParentListView({ children, openTaskEditor, onEditChild, setChildren, taskDefinitions, setTaskDefinitions, daysOfWeek }: ParentListViewProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    taskDefinitionId?: string;
    taskTitle?: string;
  }>({ isOpen: false });

  const handleDeleteTask = async (taskDefinitionId: string) => {
    try {
      console.log('Deleting task definition:', taskDefinitionId);
      await deleteTaskDefinition(taskDefinitionId);
      
      // Update local state for children
      setChildren(prev => {
        const newChildren = prev.map(child => ({
          ...child,
          taskAssignments: child.taskAssignments.filter(
            assignment => assignment.taskDefinitionId !== taskDefinitionId
          )
        }));
        console.log('Updated children:', newChildren);
        return newChildren;
      });

      // Update local state for task definitions
      setTaskDefinitions(prev => 
        prev.filter(def => def.id !== taskDefinitionId)
      );

      // Close the confirmation modal
      setDeleteConfirm({ isOpen: false });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Child List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {children.map((child) => (
          <ChildToggle
            key={child.id}
            child={child}
            onEdit={onEditChild}
          />
        ))}
      </div>

      {/* Tasks Section */}
      {TASK_TYPES.map((type) => (
        <TaskGroup key={type} type={type} className="space-y-4">
          <div className="bg-white rounded-lg border border-farmhouse-beige divide-y divide-farmhouse-beige">
            {taskDefinitions
              .filter((definition) => definition.type === type)
              .map((definition) => {
                // Find all children that have this task assigned
                const assignedChildren = children.filter((child) =>
                  child.taskAssignments.some(assignment => 
                    assignment.taskDefinitionId === definition.id
                  )
                );
                // Get the first assignment for this task definition from any child
                const taskAssignment = children
                  .flatMap(child => child.taskAssignments)
                  .find(assignment => assignment.taskDefinitionId === definition.id);

                return (
                  <div
                    key={`task-${definition.id}`}
                    className="p-4 flex items-center gap-4 hover:bg-farmhouse-cream/50 transition-all"
                  >
                    <div className="flex-grow flex items-center gap-3">
                      <div className="text-farmhouse-brown">
                        {availableIcons[definition.icon] && React.createElement(availableIcons[definition.icon], {
                          className: "w-5 h-5"
                        })}
                      </div>
                      <div>
                        <h3 className="font-medium text-farmhouse-navy">
                          {definition.title}
                        </h3>
                        {assignedChildren.length === 0 ? (
                          <p className="text-sm text-farmhouse-brown italic">
                            Available for anyone • {definition.defaultPoints} points • {definition.defaultDays.map(day => daysOfWeek[day][0]).join(', ')}
                          </p>
                        ) : (
                          <p className="text-sm text-farmhouse-brown">
                            {definition.defaultPoints} points • {definition.defaultDays.map(day => daysOfWeek[day][0]).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {assignedChildren.map((child) => {
                          const colors = getColorClasses(child.color || 'blue');
                          return (
                            <div
                              key={`${definition.id}-${child.id}`}
                              className={`w-8 h-8 rounded-full ${colors.bg} border-2 border-white flex items-center justify-center shadow-sm`}
                              title={child.name}
                            >
                              <span className="text-sm font-medium text-white">
                                {child.name[0]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openTaskEditor(definition, taskAssignment)}
                          className="p-2 text-farmhouse-brown hover:text-farmhouse-navy rounded-full hover:bg-farmhouse-beige/50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteConfirm({
                              isOpen: true,
                              taskDefinitionId: definition.id,
                              taskTitle: definition.title
                            });
                          }}
                          className="p-2 text-farmhouse-brown hover:text-red-500 rounded-full hover:bg-red-50"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </TaskGroup>
      ))}

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false })}
        onConfirm={() => {
          if (deleteConfirm.taskDefinitionId) {
            handleDeleteTask(deleteConfirm.taskDefinitionId);
          }
        }}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteConfirm.taskTitle}"? This will remove it from all children. This action cannot be undone.`}
      />
    </div>
  );
} 