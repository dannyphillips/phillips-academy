import { Plus, Edit2 } from 'lucide-react';
import { Child, Task, UniqueTask } from '../types/types';
import { getAllUniqueTasks, getColorClasses } from '../utils/taskUtils';
import { ChildToggle } from './ChildToggle';

interface ParentListViewProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  openTaskEditor: (task?: Task) => void;
  onEditChild: (child: Child) => void;
}

export function ParentListView({ children, openTaskEditor, onEditChild }: ParentListViewProps) {
  const allTasks = getAllUniqueTasks(children) as UniqueTask[];
  const taskTypes = ['morning_routine', 'evening_routine', 'learning_task', 'extra_task'];

  const getTaskTypeDisplayName = (type: string) => {
    return type.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
      {taskTypes.map((type) => (
        <div key={type} className="space-y-4">
          <h2 className="text-xl font-semibold text-farmhouse-navy">
            {getTaskTypeDisplayName(type)}
          </h2>
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
                        <task.icon className="w-5 h-5" />
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
                        onClick={() => {
                          const childWithTask = children.find(child => 
                            child.tasks.some(t => t.title === task.title)
                          );
                          const actualTask = childWithTask?.tasks.find(t => t.title === task.title);
                          openTaskEditor(actualTask);
                        }}
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