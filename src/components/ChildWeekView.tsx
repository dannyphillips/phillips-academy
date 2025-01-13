import { useState } from 'react';
import { Trophy, Check } from 'lucide-react';
import { Child, UniqueTask } from '../types/types';
import { getAllUniqueTasks, getColorClasses } from '../utils/taskUtils';
import { ChildToggle } from './ChildToggle';

interface ChildWeekViewProps {
  children: Child[];
  handleTaskComplete: (childId: string, taskId: string, dayIndex: number) => void;
  daysOfWeek: string[];
  currentDay: number;
}

export function ChildWeekView({ children, handleTaskComplete, daysOfWeek, currentDay }: ChildWeekViewProps) {
  const [visibleChildren, setVisibleChildren] = useState<string[]>(
    children.map((child) => child.id)
  );

  const toggleChildVisibility = (childId: string) => {
    setVisibleChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  const allTasks = getAllUniqueTasks(children) as UniqueTask[];
  const categories = ["Morning Routine", "Evening Routine", "academic"];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-farmhouse-navy">Family Weekly Schedule</h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.map((child) => (
          <ChildToggle
            key={child.id}
            child={child}
            isVisible={visibleChildren.includes(child.id)}
            onToggleVisibility={toggleChildVisibility}
            showStats={true}
          />
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="font-medium text-farmhouse-brown">Tasks</div>
            {daysOfWeek.map((day, index) => (
              <div
                key={day}
                className={`font-medium text-center ${index === currentDay ? "text-farmhouse-navy" : "text-farmhouse-brown"}`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <h3 className="text-lg font-semibold text-farmhouse-navy mb-3">
                  {category === "academic" ? "Learning Tasks" : category}
                </h3>
                {allTasks
                  .filter((task) => 
                    category === "academic" 
                      ? task.category === "academic"
                      : task.category === "routine" && task.subject === category
                  )
                  .map((task) => (
                    <div
                      key={task.key}
                      className="grid grid-cols-8 gap-2 bg-white rounded-lg p-3 items-center border border-farmhouse-beige hover:shadow-md transition-all"
                    >
                      <div className="text-sm flex items-center gap-3">
                        <div className="text-farmhouse-brown">
                          <task.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-farmhouse-navy">
                            {task.title}
                          </div>
                        </div>
                      </div>
                      {[...Array(7)].map((_, dayIndex) => (
                        <div
                          key={dayIndex}
                          className="flex flex-wrap justify-center gap-1 p-1"
                        >
                          {children.map((child) => {
                            if (!visibleChildren.includes(child.id)) return null;
                            const childTask = child.tasks.find(
                              (t) =>
                                t.type === task.category &&
                                t.title === task.title &&
                                t.days.includes(dayIndex)
                            );
                            if (!childTask) return null;
                            const childColors = getColorClasses(child.color);
                            return (
                              <button
                                key={child.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskComplete(child.id, childTask.id, dayIndex);
                                }}
                                className={`w-6 h-6 rounded-full border-2 transition-all 
                                  ${childTask.completions?.[`${childTask.id}-${dayIndex}`] ? `${childColors.bg} border-transparent` : 'bg-white border-gray-200'}
                                  hover:shadow-md`}
                                title={`${child.name} - ${childTask.completions?.[`${childTask.id}-${dayIndex}`] ? "Completed" : "Incomplete"}`}
                              >
                                {childTask.completions?.[`${childTask.id}-${dayIndex}`] && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
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
    </div>
  );
} 