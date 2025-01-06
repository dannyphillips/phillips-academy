import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Child, Task, UniqueTask } from '../types/types';
import { getAllUniqueTasks, getColorClasses } from '../utils/taskUtils';

interface ParentListViewProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  openTaskEditor: (task?: Task) => void;
}

export function ParentListView({ children, openTaskEditor }: ParentListViewProps) {
  const allTasks = getAllUniqueTasks(children) as UniqueTask[];
  const categories = ["Morning Routine", "Evening Routine", "academic"];

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-farmhouse-navy">Manage Agenda</h1>
        <button
          onClick={() => openTaskEditor()}
          className="primary-button"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </header>

      {categories.map((category) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold text-farmhouse-navy">
            {category === "academic" ? "Learning Tasks" : category}
          </h2>
          <div className="bg-white rounded-lg border border-farmhouse-beige divide-y divide-farmhouse-beige">
            {allTasks
              .filter((task) => 
                category === "academic" 
                  ? task.category === "academic"
                  : task.category === "routine" && task.subject === category
              )
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
                    className="p-4 flex items-center gap-4 hover:bg-farmhouse-cream/50 transition-all"
                  >
                    <div className="flex-grow flex items-center gap-3">
                      <div className="text-farmhouse-brown">
                        {task.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-farmhouse-navy">
                          {task.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {assignedChildren.map((child) => {
                          const colors = getColorClasses(child.color);
                          return (
                            <div
                              key={child.id}
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
                      <button
                        onClick={() => {
                          const taskData = children[0].tasks.find(
                            (t) =>
                              t.subject === task.subject &&
                              t.title === task.title,
                          );
                          if (taskData) openTaskEditor(taskData);
                        }}
                        className="p-2 text-farmhouse-brown hover:text-farmhouse-navy rounded-full hover:bg-farmhouse-beige/50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          // Implement delete functionality
                        }}
                        className="p-2 text-farmhouse-brown hover:text-red-600 rounded-full hover:bg-farmhouse-beige/50"
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
  );
} 