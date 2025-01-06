import { useState } from 'react';
import { ListTodo, CalendarDays, Users, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { Child, Task, TaskEditor } from '../types/types';
import { getAllUniqueTasks, getColorClasses } from '../utils/taskUtils';

interface TaskManagerProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  setIsTaskManager: (value: boolean) => void;
  daysOfWeek: string[];
  currentDay: number;
}

export function TaskManager({ children, setChildren, setIsTaskManager, daysOfWeek, currentDay }: TaskManagerProps) {
  const [isListView, setIsListView] = useState(true);
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

  const allTasks = getAllUniqueTasks(children);
  const categories = ["routine", "academic"];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsListView(true)}
              className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${isListView ? "bg-white shadow-sm" : "hover:bg-gray-50"}`}
            >
              <ListTodo className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setIsListView(false)}
              className={`px-3 py-1.5 rounded-md flex items-center gap-2 transition-all ${!isListView ? "bg-white shadow-sm" : "hover:bg-gray-50"}`}
            >
              <CalendarDays className="w-4 h-4" />
              Week
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openTaskEditor()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
          <button
            onClick={() => setIsTaskManager(false)}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Family View
          </button>
        </div>
      </header>

      {isListView ? (
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                {category === "routine" ? "Daily Routines" : "Learning Tasks"}
              </h2>
              <div className="bg-white rounded-lg border border-gray-200 divide-y">
                {allTasks
                  .filter((task) => task.category === category)
                  .map((task) => {
                    const assignedChildren = children.filter((child) =>
                      child.tasks.some(
                        (t) =>
                          t.subject === task.subject &&
                          t.title === task.title,
                      ),
                    );
                    return (
                      <div
                        key={task.key}
                        className="p-4 flex items-center gap-4"
                      >
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800">
                            {task.subject}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {task.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {assignedChildren.map((child) => {
                              const colors = getColorClasses(child.color);
                              return (
                                <div
                                  key={child.id}
                                  className={`w-8 h-8 rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}
                                  title={child.name}
                                >
                                  <span
                                    className={`text-sm font-medium ${colors.text}`}
                                  >
                                    {child.name[0]}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => {
                              const taskData = children[0].tasks.find(
                                (t) =>
                                  t.subject === task.subject &&
                                  t.title === task.title,
                              );
                              if (taskData) openTaskEditor(taskData);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              // Implement delete functionality
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="font-medium text-gray-500">Tasks</div>
              {daysOfWeek.map((day, index) => (
                <div
                  key={day}
                  className={`font-medium text-center ${index === currentDay ? "text-blue-600" : "text-gray-500"}`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category} className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    {category === "routine" ? "Daily Routines" : "Learning Tasks"}
                  </h3>
                  {allTasks
                    .filter((task) => task.category === category)
                    .map((task) => (
                      <div
                        key={task.key}
                        className="grid grid-cols-8 gap-2 bg-white rounded-lg p-3 items-center"
                      >
                        <div className="text-sm">
                          <div className="font-medium text-gray-800">
                            {task.subject}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {task.title}
                          </div>
                        </div>
                        {[...Array(7)].map((_, dayIndex) => (
                          <div
                            key={dayIndex}
                            className="flex flex-wrap justify-center gap-1 p-1"
                          >
                            {children.map((child) => {
                              const childTask = child.tasks.find(
                                (t) =>
                                  t.subject === task.subject &&
                                  t.title === task.title,
                              );
                              const isAssigned =
                                childTask?.frequency.includes(dayIndex);
                              const colors = getColorClasses(child.color);
                              return (
                                <button
                                  key={child.id}
                                  onClick={() => {
                                    setChildren((prev) =>
                                      prev.map((c) => {
                                        if (c.id !== child.id) return c;
                                        return {
                                          ...c,
                                          tasks: c.tasks.map((t) => {
                                            if (
                                              t.subject !== task.subject ||
                                              t.title !== task.title
                                            )
                                              return t;
                                            return {
                                              ...t,
                                              frequency: isAssigned
                                                ? t.frequency.filter(
                                                    (d) => d !== dayIndex,
                                                  )
                                                : [
                                                    ...t.frequency,
                                                    dayIndex,
                                                  ],
                                            };
                                          }),
                                        };
                                      }),
                                    );
                                  }}
                                  className={`w-6 h-6 rounded-full border-2 transition-all
                                    ${isAssigned ? `${colors.bg} ${colors.border}` : "bg-gray-50 border-gray-200 hover:border-gray-300"}
                                    hover:shadow-md`}
                                  title={`${child.name} - ${isAssigned ? "Assigned" : "Not assigned"}`}
                                >
                                  <span
                                    className={`text-xs font-medium ${isAssigned ? colors.text : "text-gray-400"}`}
                                  >
                                    {child.name[0]}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
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
    </div>
  );
} 