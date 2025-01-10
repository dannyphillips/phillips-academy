import React, { useState } from 'react';
import { X, Save, Plus, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Child, Task, TaskEditor, EditingTask } from '../types/types';
import { ParentListView } from './ParentListView';
import { ParentWeekView } from './ParentWeekView';
import { addTask, addChild, updateChild, deleteChild } from '../services/database';
import { AddChildModal } from './AddChildModal';
import { EditChildModal } from './EditChildModal';
import { taskTemplates, availableIcons, TaskTemplate } from '../data/taskTemplates';

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
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

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
      setEditingTask(task);
      setSearchQuery(task.title);
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
    }
    setShowSuggestions(false);
  };

  const handleSaveTask = async () => {
    if (!editingTask.title || selectedChildren.length === 0 || !editingTask.icon) return;

    try {
      const savePromises = selectedChildren.map(childId => {
        const newTask: Omit<Task, 'id'> = {
          title: editingTask.title!,
          completed: false,
          streak: 0,
          points: editingTask.points || 1,
          days: editingTask.days || [],
          type: editingTask.type || 'learning_task',
          icon: editingTask.icon!
        };
        return addTask(childId, newTask);
      });

      const savedTasks = await Promise.all(savePromises);

      // Update local state
      setChildren(prevChildren => 
        prevChildren.map(child => 
          selectedChildren.includes(child.id)
            ? {
                ...child,
                tasks: [...child.tasks, savedTasks[selectedChildren.indexOf(child.id)]]
              }
            : child
        )
      );

      // Reset editor state
      setTaskEditor({ isOpen: false, isNew: true });
      setEditingTask({});
      setSelectedChildren([]);
    } catch (error) {
      console.error('Error saving task:', error);
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

  return (
    <>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-farmhouse-navy">Manage Agenda</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddChildModalOpen(true)}
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
        {view === 'day' ? (
          <ParentListView
            children={children}
            setChildren={setChildren}
            openTaskEditor={openTaskEditor}
            onEditChild={setEditingChild}
          />
        ) : (
          <ParentWeekView
            children={children}
            setChildren={setChildren}
            daysOfWeek={daysOfWeek}
            currentDay={currentDay}
            onEditChild={setEditingChild}
            openTaskEditor={openTaskEditor}
          />
        )}
      </div>

      <AddChildModal
        isOpen={isAddChildModalOpen}
        onClose={() => setIsAddChildModalOpen(false)}
        onSave={handleAddChild}
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
                    const IconComponent = Icon as LucideIcon;
                    return (
                      <button
                        key={name}
                        onClick={() => setEditingTask(prev => ({ ...prev, icon: IconComponent }))}
                        className={`p-2 rounded hover:bg-farmhouse-cream/50 ${
                          editingTask.icon === IconComponent ? 'bg-farmhouse-cream' : ''
                        }`}
                        title={name}
                      >
                        {React.createElement(IconComponent, {
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
                <div className="flex flex-wrap gap-2">
                  {children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        setSelectedChildren(prev =>
                          prev.includes(child.id)
                            ? prev.filter(id => id !== child.id)
                            : [...prev, child.id]
                        );
                      }}
                      className={`px-3 py-1 rounded-full border-2 transition-colors ${
                        selectedChildren.includes(child.id)
                          ? 'bg-farmhouse-navy text-white border-farmhouse-navy'
                          : 'border-farmhouse-beige text-farmhouse-brown hover:border-farmhouse-navy'
                      }`}
                    >
                      {child.name}
                    </button>
                  ))}
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

      {editingChild && (
        <EditChildModal
          isOpen={!!editingChild}
          onClose={() => setEditingChild(null)}
          onSave={async (childId: string, updates) => {
            await updateChild(childId, updates);
            setChildren(prev => prev.map(child => 
              child.id === childId 
                ? { ...child, ...updates }
                : child
            ));
          }}
          onDelete={async (childId: string) => {
            await deleteChild(childId);
            setChildren(prev => prev.filter(child => child.id !== childId));
          }}
          child={editingChild}
        />
      )}
    </>
  );
} 