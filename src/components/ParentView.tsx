import { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { Child, Task, TaskEditor, EditingTask } from '../types/types';
import { ParentListView } from './ParentListView';
import { ParentWeekView } from './ParentWeekView';
import { addTask, addChild, updateChild, deleteChild } from '../services/database';
import { AddChildModal } from './AddChildModal';
import { EditChildModal } from './EditChildModal';

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

  const openTaskEditor = (task?: Task) => {
    setTaskEditor({
      isOpen: true,
      task,
      isNew: !task,
    });
    setEditingTask(task || {
      title: '',
      completed: false,
      streak: 0,
      points: 1,
      days: []
    });
  };

  const handleSaveTask = async () => {
    if (!editingTask.title) return;

    try {
      const newTask: Omit<Task, 'id'> = {
        title: editingTask.title,
        completed: false,
        streak: 0,
        points: editingTask.points || 1,
        days: editingTask.days || []
      };

      // Add task to database
      const savedTask = await addTask(children[0].id, newTask);

      // Update local state
      setChildren(
        children.map(child =>
          child.id === children[0].id
            ? {
                ...child,
                tasks: [...child.tasks, savedTask]
              }
            : child
        )
      );

      // Reset editor state
      setTaskEditor({ isOpen: false, isNew: true });
      setEditingTask({});
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleAddChild = async (newChild: Omit<Child, 'id' | 'tasks' | 'totalPoints'>) => {
    try {
      // Add child to database
      const savedChild = await addChild({
        name: newChild.name,
        age: newChild.age,
        color: newChild.color
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
                  Title
                </label>
                <input
                  type="text"
                  value={editingTask.title ?? ""}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="input-field"
                  placeholder="e.g., Brush teeth, Complete worksheet"
                />
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
                <label className="block text-sm font-medium text-farmhouse-navy mb-1">
                  Schedule
                </label>
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
          onSave={handleUpdateChild}
          onDelete={handleDeleteChild}
          child={editingChild}
        />
      )}
    </>
  );
} 