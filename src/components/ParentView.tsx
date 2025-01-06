import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Child, Task, TaskEditor } from '../types/types';
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
  const [editingTask, setEditingTask] = useState<Partial<Task>>({});

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
    if (!editingTask.subject || !editingTask.title) return;
    setChildren((prev) =>
      prev.map((child) => ({
        ...child,
        tasks: child.tasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...editingTask,
              }
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
              <h2 className="text-xl font-semibold text-gray-800">
                {taskEditor.isNew ? "New Task" : "Edit Task"}
              </h2>
              <button
                onClick={() =>
                  setTaskEditor({
                    isOpen: false,
                    isNew: false,
                  })
                }
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="routine">Daily Routine</option>
                  <option value="academic">Learning Task</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={editingTask.subject}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="e.g., Morning Routine, Math"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="e.g., Brush teeth, Complete worksheet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                            : [...(prev.frequency || []), index],
                        }))
                      }
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                        ${editingTask.frequency?.includes(index) ? "bg-blue-500 border-blue-500 text-white" : "border-gray-300 hover:border-blue-500 text-gray-600"}`}
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
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
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