import React from 'react';
import { Edit2, Trash2, CircleDot } from 'lucide-react';
import { Child, Task, UniqueTask } from '../types/types';
import { getAllUniqueTasks, getColorClasses } from '../utils/taskUtils';
import { TASK_TYPES } from '../constants/taskTypes';
import { ChildToggle } from './ChildToggle';
import { TaskGroup } from './TaskGroup';
import { ConfirmModal } from './ConfirmModal';
import { deleteTask } from '../services/database';
import { availableIcons } from '../data/taskTemplates';
import { useState } from 'react';

interface ParentListViewProps {
  children: Child[];
  openTaskEditor: (task?: Task) => void;
  onEditChild: (child: Child) => void;
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
}

export function ParentListView({ children, openTaskEditor, onEditChild, setChildren }: ParentListViewProps) {
  const allTasks = getAllUniqueTasks(children) as UniqueTask[];
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    childId?: string;
    taskId?: string;
    taskTitle?: string;
  }>({ isOpen: false });

  const handleDeleteTask = async (childId: string, taskId: string) => {
    try {
      await deleteTask(childId, taskId);
      
      // Update local state
      setChildren(prev => 
        prev.map(child => 
          child.id === childId
            ? {
                ...child,
                tasks: child.tasks.filter(t => t.id !== taskId)
              }
            : child
        )
      );
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
            {allTasks
              .filter((task) => task.category === type)
              .map((task) => {
                const assignedChildren = children.filter((child) =>
                  child.tasks.some((t) => t.title === task.title)
                );
                return (
                  <div
                    key={`task-${task.key}`}
                    className="p-4 flex items-center gap-4 hover:bg-farmhouse-cream/50 transition-all"
                  >
                    <div className="flex-grow flex items-center gap-3">
                      <div className="text-farmhouse-brown">
                        {React.createElement(availableIcons[task.icon] || CircleDot, {
                          className: "w-5 h-5"
                        })}
                      </div>
                      <div>
                        <h3 className="font-medium text-farmhouse-navy">
                          {task.title}
                        </h3>
                        {!task.assignedToChildren && (
                          <p className="text-sm text-farmhouse-brown italic">
                            Available for anyone
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
                              key={`${task.key}-${child.id}`}
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
                          onClick={() => {
                            const childWithTask = children.find(child => 
                              child.tasks.some(t => t.title === task.title)
                            );
                            const actualTask = childWithTask?.tasks.find(t => t.title === task.title);
                            openTaskEditor(actualTask || {
                              ...task,
                              id: '', // Will be assigned by database
                              completed: false,
                              streak: 0,
                              points: 1,
                              days: [],
                              type: task.category // Use category as type for unassigned tasks
                            });
                          }}
                          className="p-2 text-farmhouse-brown hover:text-farmhouse-navy rounded-full hover:bg-farmhouse-beige/50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {assignedChildren.length > 0 && (
                          <button
                            onClick={() => {
                              // Get the first child's task as reference
                              const firstChild = assignedChildren[0];
                              const taskToDelete = firstChild.tasks.find(t => t.title === task.title);
                              if (taskToDelete) {
                                setDeleteConfirm({
                                  isOpen: true,
                                  childId: firstChild.id,
                                  taskId: taskToDelete.id,
                                  taskTitle: task.title
                                });
                              }
                            }}
                            className="p-2 text-farmhouse-brown hover:text-red-500 rounded-full hover:bg-red-50"
                            title="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
          if (deleteConfirm.childId && deleteConfirm.taskId) {
            handleDeleteTask(deleteConfirm.childId, deleteConfirm.taskId);
          }
        }}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteConfirm.taskTitle}"? This action cannot be undone.`}
      />
    </div>
  );
} 