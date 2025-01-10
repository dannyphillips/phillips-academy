import { Plus, Edit2, Trophy } from 'lucide-react';
import { Child, Task, UniqueTask } from '../types/types';
import { getAllUniqueTasks, getColorClasses } from '../utils/taskUtils';

interface ParentListViewProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  openTaskEditor: (task?: Task) => void;
  onEditChild: (child: Child) => void;
}

export function ParentListView({ children, openTaskEditor, onEditChild }: ParentListViewProps) {
  const allTasks = getAllUniqueTasks(children) as UniqueTask[];
  const categories = ["Morning Routine", "Evening Routine", "academic"];

  return (
    <div className="space-y-6">
      {/* Child List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.map((child) => {
          const colors = getColorClasses(child.color || 'blue');
          const completedTasks = child.tasks.filter(t => t.completed).length;
          const totalTasks = child.tasks.length;
          
          return (
            <div
              key={child.id}
              className={`${colors.bg} rounded-lg p-4 text-white shadow-md hover:shadow-lg transition-shadow`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{child.name}</h3>
                  <p className="text-white/80 text-sm">Age {child.age}</p>
                </div>
                <button
                  onClick={() => onEditChild(child)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">{child.totalPoints} points</span>
                </div>
                <div className="text-sm text-white/80">
                  {completedTasks}/{totalTasks} tasks completed
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tasks Section */}
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
                  child.tasks.some((t) => t.title === task.title)
                );
                return (
                  <div
                    key={`task-${task.key}`}
                    className="p-4 flex items-center gap-4 hover:bg-farmhouse-cream/50 transition-all"
                  >
                    <div className="flex-grow flex items-center gap-3">
                      <div className="text-farmhouse-brown">
                        <task.icon size={20} />
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
                      <button
                        onClick={() => openTaskEditor(task)}
                        className="p-2 text-farmhouse-brown hover:text-farmhouse-navy rounded-full hover:bg-farmhouse-beige/50"
                      >
                        <Edit2 className="w-4 h-4" />
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