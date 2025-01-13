import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Child, Task, TaskEditor, EditingTask, IconName } from '../types/types';
import { ParentListView } from './ParentListView';
import { ParentWeekView } from './ParentWeekView';
import { addTask, addChild, updateChild, deleteChild, updateTask, deleteTask } from '../services/database';
import { ChildModal } from './ChildModal';
import { taskTemplates, availableIcons, TaskTemplate } from '../data/taskTemplates';
import { getColorClasses } from '../utils/taskUtils';

interface ParentViewProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  daysOfWeek: string[];
  currentDay: number;
  view: 'day' | 'week';
}

export function ParentView({ children, setChildren, daysOfWeek, currentDay, view }: ParentViewProps) {
  const [taskEditor, setTaskEditor] = useState<TaskEditor>({
    isOpen: false,
    isNew: true
  });
  const [editingTask, setEditingTask] = useState<EditingTask>({});
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (taskEditor.isOpen) {
          setTaskEditor({ isOpen: false, isNew: true });
          setEditingTask({});
          setSelectedChildren([]);
        }
        if (isChildModalOpen) {
          setIsChildModalOpen(false);
          setEditingChild(null);
        }
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [taskEditor.isOpen, isChildModalOpen]);

  const handleSelectAllChildren = () => {
    setSelectedChildren(children.map(child => child.id));
  };

  const handleTemplateSelect = (template: TaskTemplate) => {
    setEditingTask({
      ...template,
      completed: false,
      streak: 0
    });
    setSearchQuery(template.title);
    setShowSuggestions(false);
  };

  const openTaskEditor = (task?: Task) => {
    setTaskEditor({
      isOpen: true,
      task,
      isNew: !task,
    });
    if (task) {
      const childrenWithTask = children.filter(child =>
        child.tasks.some(t => t.title === task.title)
      );
      setEditingTask(task);
      setSearchQuery(task.title);
      setSelectedChildren(childrenWithTask.map(child => child.id));
    } else {
      setEditingTask({
        title: '',
        completed: false,
        streak: 0,
        points: 1,
        days: [],
        type: 'learning_task'
      });
      setSearchQuery('');
      setSelectedChildren([]);
    }
    setShowSuggestions(false);
  };

  const handleSaveTask = async () => {
    if (!editingTask.title || !editingTask.icon) return;

    try {
      // Prepare the task data
      const taskData = {
        title: editingTask.title,
        completed: false,
        streak: 0,
        points: editingTask.points || 1,
        days: editingTask.days || [],
        type: editingTask.type || 'learning_task',
        icon: editingTask.icon
      };

      // Find all children who currently have this task
      const childrenWithTask = taskEditor.task 
        ? children.filter(child => 
            child.tasks.some(t => t.title === taskEditor.task?.title)
          )
        : [];

      // Optimistically update UI first
      setChildren(prevChildren =>
        prevChildren.map(child => {
          // If child is no longer selected, remove the task
          if (!selectedChildren.includes(child.id)) {
            return {
              ...child,
              tasks: child.tasks.filter(t => 
                taskEditor.task ? t.title !== taskEditor.task.title : true
              )
            };
          }
          
          // If child already had the task, update it
          if (childrenWithTask.some(c => c.id === child.id)) {
            return {
              ...child,
              tasks: child.tasks.map(t =>
                taskEditor.task && t.title === taskEditor.task.title
                  ? { ...t, ...taskData }
                  : t
              )
            };
          }
          
          // If child is newly selected, add the task (with a temporary ID)
          if (selectedChildren.includes(child.id)) {
            const tempTask = {
              ...taskData,
              id: `temp-${child.id}-${Date.now()}`,
            };
            return {
              ...child,
              tasks: [...child.tasks, tempTask]
            };
          }

          return child;
        })
      );

      // Prepare all database operations
      const operations = [];

      if (taskEditor.isNew) {
        // Add task to selected children
        operations.push(
          ...selectedChildren.map(childId => 
            addTask(childId, taskData)
          )
        );
      } else if (taskEditor.task) {
        // Remove task from unselected children
        operations.push(
          ...childrenWithTask
            .filter(child => !selectedChildren.includes(child.id))
            .map(child => {
              const taskToRemove = child.tasks.find(t => t.title === taskEditor.task?.title);
              return taskToRemove ? deleteTask(child.id, taskToRemove.id) : Promise.resolve();
            })
        );

        // Update task for existing assignments
        operations.push(
          ...childrenWithTask
            .filter(child => selectedChildren.includes(child.id))
            .map(child => {
              const taskToUpdate = child.tasks.find(t => t.title === taskEditor.task?.title);
              return taskToUpdate ? updateTask(child.id, taskToUpdate.id, taskData) : Promise.resolve();
            })
        );

        // Add task to newly selected children
        operations.push(
          ...selectedChildren
            .filter(childId => !childrenWithTask.some(c => c.id === childId))
            .map(childId => addTask(childId, taskData))
        );
      }

      // Execute all operations concurrently
      const results = await Promise.all(operations);

      // Update UI with actual server data
      setChildren(prevChildren =>
        prevChildren.map(child => {
          // Find any new or updated tasks for this child
          const validResults = results.filter((result): result is Task => 
            result !== undefined && 
            result !== null && 
            typeof result === 'object' && 
            'childId' in result && 
            result.childId === child.id
          );

          return {
            ...child,
            tasks: child.tasks
              // Remove temporary tasks and tasks that were unassigned
              .filter(t => {
                const wasUnassigned = taskEditor.task && 
                  t.title === taskEditor.task.title && 
                  !selectedChildren.includes(child.id);
                const isTemp = t.id.startsWith('temp-');
                return !isTemp && !wasUnassigned;
              })
              // Add newly created or updated tasks
              .concat(validResults)
          };
        })
      );

      // Reset editor state
      setTaskEditor({ isOpen: false, isNew: true });
      setEditingTask({});
      setSelectedChildren([]);
    } catch (error) {
      console.error('Error saving task:', error);
      // Revert optimistic update on error by refetching data
      // You would need to implement a refetch function
      // For now, we'll just show an error
      alert('Error saving task. Please try again.');
    }
  };

  const handleSelectAllDays = () => {
    setEditingTask(prev => ({
      ...prev,
      days: [0, 1, 2, 3, 4, 5, 6]
    }));
  };

  const handleAddChild = async (newChild: Omit<Child, 'id' | 'tasks' | 'totalPoints'>) => {
    try {
      // Add child to database
      const savedChild = await addChild({
        name: newChild.name,
        age: newChild.age,
        color: newChild.color,
        totalPoints: 0
      });

      // Update local state
      setChildren(prev => [...prev, savedChild]);
    } catch (error) {
      console.error('Error saving child:', error);
      // TODO: Show error message to user
    }
  };

  const handleUpdateChild = async (
    childId: string,
    updates: Partial<Omit<Child, 'id' | 'tasks'>>
  ) => {
    try {
      await updateChild(childId, updates);
      setChildren(prev => prev.map(child => 
        child.id === childId 
          ? { ...child, ...updates }
          : child
      ));
    } catch (error) {
      console.error('Error updating child:', error);
    }
  };

  const handleDeleteChild = async (childId: string) => {
    try {
      await deleteChild(childId);
      setChildren(prev => prev.filter(child => child.id !== childId));
    } catch (error) {
      console.error('Error deleting child:', error);
    }
  };

  const handleSaveChild = async (childData: Omit<Child, 'id' | 'tasks' | 'totalPoints'>) => {
    try {
      if (editingChild) {
        await handleUpdateChild(editingChild.id, childData);
      } else {
        await handleAddChild(childData);
      }
      setIsChildModalOpen(false);
      setEditingChild(null);
    } catch (error) {
      console.error('Error saving child:', error);
    }
  };

  const openChildModal = (child?: Child) => {
    setEditingChild(child || null);
    setIsChildModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-farmhouse-navy">Manage Agenda</h1>
          <div className="flex gap-2">
            <button
              onClick={() => openChildModal()}
              className="secondary-button"
            >
              Add Child
            </button>
            <button
              onClick={() => openTaskEditor()}
              className="primary-button"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </header>
        {view === 'week' ? (
          <ParentWeekView
            children={children}
            setChildren={setChildren}
            daysOfWeek={daysOfWeek}
            currentDay={currentDay}
            openTaskEditor={openTaskEditor}
            onEditChild={openChildModal}
          />
        ) : (
          <ParentListView
            children={children}
            openTaskEditor={openTaskEditor}
            onEditChild={openChildModal}
            setChildren={setChildren}
          />
        )}
      </div>

      <ChildModal
        isOpen={isChildModalOpen}
        onClose={() => {
          setIsChildModalOpen(false);
          setEditingChild(null);
        }}
        onSave={handleSaveChild}
        child={editingChild || undefined}
      />
      
      {taskEditor.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-farmhouse-navy">
                {taskEditor.isNew ? "New Task" : "Edit Task"}
              </h2>
              <button
                onClick={() => setTaskEditor({ isOpen: false, isNew: false })}
                className="p-2 text-farmhouse-brown hover:text-farmhouse-navy rounded-full hover:bg-farmhouse-beige/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-farmhouse-navy mb-1">
                  Task
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-farmhouse-brown" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchQuery(value);
                      setShowSuggestions(true);
                      setEditingTask(prev => ({
                        ...prev,
                        title: value
                      }));
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="input-field pl-10"
                    placeholder="Search or enter new task..."
                  />
                  {showSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-farmhouse-beige rounded-md shadow-lg max-h-60 overflow-auto">
                      {Object.entries(taskTemplates).map(([type, templates]) => (
                        <div key={type}>
                          <div className="px-4 py-2 bg-farmhouse-cream/50 font-medium text-farmhouse-navy">
                            {type.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </div>
                          {templates
                            .filter((template: TaskTemplate) => 
                              template.title.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((template: TaskTemplate, index: number) => (
                              <button
                                key={`${template.title}-${index}`}
                                className="w-full text-left px-4 py-2 hover:bg-farmhouse-cream/50 focus:bg-farmhouse-cream/50 focus:outline-none"
                                onClick={() => handleTemplateSelect(template)}
                              >
                                <div className="flex items-center gap-2">
                                  {React.createElement(template.icon, {
                                    className: "w-4 h-4 text-farmhouse-brown"
                                  })}
                                  <div className="font-medium text-farmhouse-navy">
                                    {template.title}
                                  </div>
                                </div>
                              </button>
                            ))}
                        </div>
                      ))}
                      {Object.values(taskTemplates).every((templates: TaskTemplate[]) => 
                        templates.every((template: TaskTemplate) => 
                          !template.title.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      ) && (
                        <div className="px-4 py-2 text-farmhouse-brown italic">
                          No matching templates. Creating new task.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-farmhouse-navy mb-1">
                  Icon
                </label>
                <div className="grid grid-cols-8 gap-2 p-2 border border-farmhouse-beige rounded-md">
                  {Object.entries(availableIcons).map(([name, Icon]) => {
                    const iconName = name as IconName;
                    return (
                      <button
                        key={name}
                        onClick={() => setEditingTask(prev => ({ 
                          ...prev, 
                          icon: iconName
                        }))}
                        className={`p-2 rounded hover:bg-farmhouse-cream/50 flex items-center justify-center ${
                          editingTask.icon === iconName ? 'bg-farmhouse-cream' : ''
                        }`}
                        title={name}
                      >
                        {React.createElement(Icon, {
                          className: "w-5 h-5 text-farmhouse-brown"
                        })}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-farmhouse-navy">
                    Assign to Children
                  </label>
                  <button
                    onClick={handleSelectAllChildren}
                    className="text-sm text-farmhouse-brown hover:text-farmhouse-navy"
                  >
                    Select All
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {children.map((child) => {
                      const colors = getColorClasses(child.color || 'blue');
                      return (
                        <button
                          key={child.id}
                          onClick={() => {
                            setSelectedChildren(prev =>
                              prev.includes(child.id)
                                ? prev.filter(id => id !== child.id)
                                : [...prev, child.id]
                            );
                          }}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 transition-colors ${
                            selectedChildren.includes(child.id)
                              ? `${colors.bg} text-white border-transparent`
                              : `border-farmhouse-beige text-farmhouse-brown hover:${colors.bg} hover:text-white hover:border-transparent`
                          }`}
                        >
                          {child.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-farmhouse-navy mb-1">
                  Type
                </label>
                <select
                  value={editingTask.type ?? "learning_task"}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      type: e.target.value as Task['type'],
                    }))
                  }
                  className="input-field"
                >
                  <option value="morning_routine">Morning Routine</option>
                  <option value="evening_routine">Evening Routine</option>
                  <option value="learning_task">Learning Task</option>
                  <option value="extra_task">Extra Task</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-farmhouse-navy mb-1">
                  Points
                </label>
                <input
                  type="number"
                  value={editingTask.points ?? 1}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      points: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="input-field"
                  min="1"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-farmhouse-navy">
                    Schedule
                  </label>
                  <button
                    onClick={handleSelectAllDays}
                    className="text-sm text-farmhouse-brown hover:text-farmhouse-navy"
                  >
                    Select All Days
                  </button>
                </div>
                <div className="flex gap-2">
                  {daysOfWeek.map((day, index) => (
                    <button
                      key={day}
                      onClick={() =>
                        setEditingTask((prev) => ({
                          ...prev,
                          days: prev.days?.includes(index)
                            ? prev.days.filter((d) => d !== index)
                            : [...(prev.days ?? []), index],
                        }))
                      }
                      className={`day-button ${
                        editingTask.days?.includes(index) ? 'day-button-active' : 'day-button-inactive'
                      }`}
                    >
                      {day[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setTaskEditor({ isOpen: false, isNew: false })}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className="primary-button"
              >
                <Save className="w-4 h-4" />
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 