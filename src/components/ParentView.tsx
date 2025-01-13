import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Search } from 'lucide-react';
import { Child, TaskDefinition, TaskAssignment, TaskEditor, EditingTask, IconName } from '../types/types';
import { TaskType } from '../constants/taskTypes';
import { ParentListView } from './ParentListView';
import { ParentWeekView } from './ParentWeekView';
import { 
  addTaskDefinition, 
  addTaskAssignment, 
  updateTaskDefinition,
  updateTaskAssignment,
  deleteTaskDefinition,
  deleteTaskAssignment,
  getTaskDefinitions,
  addChild,
  updateChild,
  deleteChild
} from '../services/database';
import { ChildModal } from './ChildModal';
import { taskTemplates, availableIcons } from '../data/taskTemplates';
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
  const [taskDefinitions, setTaskDefinitions] = useState<TaskDefinition[]>([]);

  // Load task definitions
  useEffect(() => {
    const loadTaskDefinitions = async () => {
      try {
        const definitions = await getTaskDefinitions();
        setTaskDefinitions(definitions);
      } catch (error) {
        console.error('Error loading task definitions:', error);
      }
    };
    loadTaskDefinitions();
  }, []);

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

  const handleTemplateSelect = (template: TaskDefinition) => {
    setEditingTask({
      definition: {
        title: template.title,
        type: template.type,
        icon: template.icon,
        defaultPoints: template.defaultPoints,
        defaultDays: template.defaultDays
      }
    });
    setSearchQuery(template.title);
    setShowSuggestions(false);
  };

  const openTaskEditor = (taskDefinition?: TaskDefinition, taskAssignment?: TaskAssignment) => {
    setTaskEditor({
      isOpen: true,
      isNew: !taskDefinition,
      taskDefinition,
      taskAssignment
    });

    if (taskDefinition) {
      // Editing existing task
      const childrenWithTask = children.filter(child =>
        child.taskAssignments.some(assignment => 
          assignment.taskDefinitionId === taskDefinition.id
        )
      );
      setEditingTask({
        definition: taskDefinition,
        assignment: taskAssignment || {
          points: taskDefinition.defaultPoints,
          days: taskDefinition.defaultDays,
          streak: 0,
          completions: {}
        }
      });
      setSearchQuery(taskDefinition.title);
      setSelectedChildren(childrenWithTask.map(child => child.id));
    } else {
      // Creating new task
      setEditingTask({
        definition: {
          title: '',
          type: 'learning_task',
          icon: 'Book',
          defaultPoints: 1,
          defaultDays: []
        },
        assignment: {
          points: 1,
          days: [],
          streak: 0,
          completions: {}
        }
      });
      setSearchQuery('');
      setSelectedChildren([]);
    }
    setShowSuggestions(false);
  };

  const handleSaveTask = async () => {
    if (!editingTask.definition?.title || !editingTask.definition.icon) return;

    try {
      let taskDefinition: TaskDefinition;

      // Save or update task definition
      if (taskEditor.isNew) {
        const definitionData: Omit<TaskDefinition, 'id'> = {
          title: editingTask.definition.title,
          type: editingTask.definition.type || 'learning_task',
          icon: editingTask.definition.icon,
          defaultPoints: editingTask.definition.defaultPoints || 1,
          defaultDays: editingTask.definition.defaultDays || []
        };
        taskDefinition = await addTaskDefinition(definitionData);
        setTaskDefinitions(prev => [...prev, taskDefinition]);
      } else if (taskEditor.taskDefinition) {
        const definitionUpdates: Partial<Omit<TaskDefinition, 'id'>> = {
          title: editingTask.definition.title,
          type: editingTask.definition.type,
          icon: editingTask.definition.icon,
          defaultPoints: editingTask.definition.defaultPoints,
          defaultDays: editingTask.definition.defaultDays
        };
        await updateTaskDefinition(taskEditor.taskDefinition.id, definitionUpdates);
        taskDefinition = {
          ...taskEditor.taskDefinition,
          ...definitionUpdates
        };
        setTaskDefinitions(prev => 
          prev.map(def => 
            def.id === taskDefinition.id ? taskDefinition : def
          )
        );
      } else {
        throw new Error('Invalid task editor state');
      }

      // Handle task assignments
      const currentAssignments = children.flatMap(child => 
        child.taskAssignments.filter(assignment => 
          assignment.taskDefinitionId === taskDefinition.id
        )
      );

      // Remove assignments for unselected children
      const removePromises = currentAssignments
        .filter(assignment => !selectedChildren.includes(assignment.childId))
        .map(async assignment => {
          try {
            await deleteTaskAssignment(assignment.id);
          } catch (error) {
            console.error('Error deleting task assignment:', error);
          }
        });

      // Add or update assignments for selected children
      const assignmentPromises = selectedChildren.map(async childId => {
        try {
          const existingAssignment = currentAssignments.find(a => a.childId === childId);
          const assignmentData = {
            taskDefinitionId: taskDefinition.id,
            childId,
            points: editingTask.assignment?.points || taskDefinition.defaultPoints,
            days: editingTask.assignment?.days || taskDefinition.defaultDays,
            streak: existingAssignment?.streak || 0,
            completions: existingAssignment?.completions || {}
          };

          if (existingAssignment) {
            await updateTaskAssignment(existingAssignment.id, assignmentData);
            return {
              ...assignmentData,
              id: existingAssignment.id,
              definition: taskDefinition
            };
          } else {
            const newAssignment = await addTaskAssignment(assignmentData);
            return {
              ...newAssignment,
              definition: taskDefinition
            };
          }
        } catch (error) {
          console.error('Error updating/adding task assignment:', error);
          return null;
        }
      });

      await Promise.all([...removePromises, ...assignmentPromises]);

      // Update local state
      setChildren(prev => 
        prev.map(child => {
          const isSelected = selectedChildren.includes(child.id);
          const assignments = child.taskAssignments.filter(
            assignment => assignment.taskDefinitionId !== taskDefinition.id
          );

          if (isSelected) {
            const assignmentData = {
              taskDefinitionId: taskDefinition.id,
              childId: child.id,
              points: editingTask.assignment?.points || taskDefinition.defaultPoints,
              days: editingTask.assignment?.days || taskDefinition.defaultDays,
              streak: 0,
              completions: {},
              definition: taskDefinition
            } as TaskAssignment & { definition: TaskDefinition };
            assignments.push(assignmentData);
          }

          return {
            ...child,
            taskAssignments: assignments
          };
        })
      );

      // Reset editor state
      setTaskEditor({ isOpen: false, isNew: true });
      setEditingTask({});
      setSelectedChildren([]);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task. Please try again.');
    }
  };

  const handleSelectAllDays = () => {
    setEditingTask(prev => ({
      ...prev,
      assignment: {
        ...prev.assignment,
        days: [0, 1, 2, 3, 4, 5, 6]
      }
    }));
  };

  const openChildModal = (child?: Child) => {
    setEditingChild(child || null);
    setIsChildModalOpen(true);
  };

  const handleSaveChild = async (childData: Omit<Child, 'id' | 'taskAssignments' | 'totalPoints'>) => {
    try {
      if (editingChild) {
        const updates: Partial<Omit<Child, 'id' | 'taskAssignments'>> = {
          ...childData,
          totalPoints: editingChild.totalPoints
        };
        await updateChild(editingChild.id, updates);
        setChildren(prev => prev.map(child => 
          child.id === editingChild.id 
            ? { ...child, ...updates }
            : child
        ));
      } else {
        const newChildData: Omit<Child, 'id' | 'taskAssignments'> = {
          ...childData,
          totalPoints: 0
        };
        const savedChild = await addChild(newChildData);
        setChildren(prev => [...prev, savedChild]);
      }
      setIsChildModalOpen(false);
      setEditingChild(null);
    } catch (error) {
      console.error('Error saving child:', error);
    }
  };

  const handleDeleteChild = async (childId: string) => {
    try {
      await deleteChild(childId);
      setChildren(prev => prev.filter(child => child.id !== childId));
      setIsChildModalOpen(false);
      setEditingChild(null);
    } catch (error) {
      console.error('Error deleting child:', error);
      alert('Error deleting child. Please try again.');
    }
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
            taskDefinitions={taskDefinitions}
          />
        ) : (
          <ParentListView
            children={children}
            openTaskEditor={openTaskEditor}
            onEditChild={openChildModal}
            setChildren={setChildren}
            taskDefinitions={taskDefinitions}
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
        onDelete={handleDeleteChild}
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
                        definition: {
                          ...prev.definition,
                          title: value
                        }
                      }));
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="input-field pl-10"
                    placeholder="Search or enter new task..."
                  />
                  {showSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-farmhouse-beige rounded-md shadow-lg max-h-60 overflow-auto">
                      {taskDefinitions.map((definition) => (
                        <button
                          key={definition.id}
                          className="w-full text-left px-4 py-2 hover:bg-farmhouse-cream/50 focus:bg-farmhouse-cream/50 focus:outline-none"
                          onClick={() => handleTemplateSelect(definition)}
                        >
                          <div className="flex items-center gap-2">
                            {React.createElement(availableIcons[definition.icon], {
                              className: "w-4 h-4 text-farmhouse-brown"
                            })}
                            <div className="font-medium text-farmhouse-navy">
                              {definition.title}
                            </div>
                          </div>
                        </button>
                      ))}
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
                          definition: {
                            ...prev.definition,
                            icon: iconName
                          }
                        }))}
                        className={`p-2 rounded hover:bg-farmhouse-cream/50 flex items-center justify-center ${
                          editingTask.definition?.icon === iconName ? 'bg-farmhouse-cream' : ''
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
                  value={editingTask.definition?.type ?? "learning_task"}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      definition: {
                        ...prev.definition,
                        type: e.target.value as TaskType
                      }
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
                  value={editingTask.assignment?.points ?? editingTask.definition?.defaultPoints ?? 1}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      assignment: {
                        ...prev.assignment,
                        points: parseInt(e.target.value) || 1
                      }
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
                        setEditingTask((prev) => {
                          const currentDays = prev.assignment?.days || prev.definition?.defaultDays || [];
                          const newDays = currentDays.includes(index)
                            ? currentDays.filter((d) => d !== index)
                            : [...currentDays, index];
                          return {
                            ...prev,
                            assignment: {
                              ...prev.assignment,
                              days: newDays
                            }
                          };
                        })
                      }
                      className={`day-button ${
                        (editingTask.assignment?.days || editingTask.definition?.defaultDays || []).includes(index)
                          ? 'day-button-active'
                          : 'day-button-inactive'
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