import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Child, Task, TaskEditor, EditingTask } from '../types/types';
import { ParentListView } from './ParentListView';
import { ParentWeekView } from './ParentWeekView';

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
    isNew: false,
  });
  const [editingTask, setEditingTask] = useState<EditingTask>({});

  const openTaskEditor = (task?: Task) => {
    setTaskEditor({
      isOpen: true,
      task,
      isNew: !task,
    });
    setEditingTask(
      task || {
        id: Math.max(0, ...children.flatMap((c) => c.tasks.map((t) => t.id))) + 1,
        category: "routine",
        subject: "",
        title: "",
        completed: false,
        frequency: [],
        streak: 0,
        points: 10,
      },
    );
  };

  const saveTask = () => {
    if (!editingTask.subject || !editingTask.title || !editingTask.category) return;

    const fullTask: Task = {
      id: editingTask.id!,
      category: editingTask.category,
      subject: editingTask.subject,
      title: editingTask.title,
      icon: editingTask.icon!,
      completed: editingTask.completed ?? false,
      frequency: editingTask.frequency ?? [],
      streak: editingTask.streak ?? 0,
      points: editingTask.points ?? 10,
      details: editingTask.details,
    };

    setChildren((prev) =>
      prev.map((child) => ({
        ...child,
        tasks: child.tasks.map((task) =>
          task.id === editingTask.id
            ? fullTask
            : task,
        ),
      })),
    );
    setTaskEditor({
      isOpen: false,
      isNew: false,
    });
    setEditingTask({});
  };

  return (
    <>
      {view === 'day' ? (
        <ParentListView
          children={children}
          setChildren={setChildren}
          openTaskEditor={openTaskEditor}
        />
      ) : (
        <ParentWeekView
          children={children}
          setChildren={setChildren}
          daysOfWeek={daysOfWeek}
          currentDay={currentDay}
          openTaskEditor={openTaskEditor}
        />
      )}

      {taskEditor.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-farmhouse-navy">
                {taskEditor.isNew ? "New Task" : "Edit Task"}
              </h2>
              <button
                onClick={() =>
                  setTaskEditor({
                    isOpen: false,
                    isNew: false,
                  })
                }
                className="p-2 text-farmhouse-brown hover:text-farmhouse-navy rounded-full hover:bg-farmhouse-beige/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-farmhouse-navy mb-1">
                  Category
                </label>
                <select
                  value={editingTask.category}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      category: e.target.value as "routine" | "academic",
                    }))
                  }
                  className="input-field"
                >
                  <option value="routine">Daily Routine</option>
                  <option value="academic">Learning Task</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-farmhouse-navy mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={editingTask.subject ?? ""}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="input-field"
                  placeholder="e.g., Morning Routine, Math"
                />
              </div>
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
                  Schedule
                </label>
                <div className="flex gap-2">
                  {daysOfWeek.map((day, index) => (
                    <button
                      key={day}
                      onClick={() =>
                        setEditingTask((prev) => ({
                          ...prev,
                          frequency: prev.frequency?.includes(index)
                            ? prev.frequency.filter((d) => d !== index)
                            : [...(prev.frequency ?? []), index],
                        }))
                      }
                      className={`day-button ${
                        editingTask.frequency?.includes(index) ? 'day-button-active' : 'day-button-inactive'
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
                onClick={() =>
                  setTaskEditor({
                    isOpen: false,
                    isNew: false,
                  })
                }
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                onClick={saveTask}
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