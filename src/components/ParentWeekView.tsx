import { useState } from 'react';
import { Plus, Trophy, Edit2 } from 'lucide-react';
import { Child, Task, UniqueTask } from '../types/types';
import { getAllUniqueTasks, getColorClasses } from '../utils/taskUtils';

interface ParentWeekViewProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  daysOfWeek: string[];
  currentDay: number;
  openTaskEditor: (task?: Task) => void;
  onEditChild: (child: Child) => void;
}

export function ParentWeekView({ children, setChildren, daysOfWeek, currentDay, openTaskEditor, onEditChild }: ParentWeekViewProps) {
  const allTasks = getAllUniqueTasks(children) as UniqueTask[];
  const categories = ["Morning Routine", "Evening Routine", "academic"];
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

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-farmhouse-navy">Weekly Schedule</h1>
        <button
          onClick={() => openTaskEditor()}
          className="primary-button"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </header>

      <div className="flex gap-4 items-center flex-wrap">
        {children.map((child) => {
          const childColors = getColorClasses(child.color || 'blue');
          const isVisible = visibleChildren.includes(child.id);
          return (
            <div
              key={child.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border-2 ${
                isVisible ? `${childColors.bg} border-transparent` : childColors.muted
              }`}
            >
              <button
                onClick={() => toggleChildVisibility(child.id)}
                className="flex items-center gap-2"
              >
                <span className={isVisible ? 'text-white' : ''}>
                  {child.name}
                </span>
                <div className={`flex items-center gap-1 ${isVisible ? 'text-white/90' : ''}`}>
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">{child.totalPoints}</span>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditChild(child);
                }}
                className="p-1 text-farmhouse-brown hover:text-farmhouse-navy rounded-full hover:bg-farmhouse-beige/50"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="font-medium text-farmhouse-brown">Tasks</div>
            {daysOfWeek.map((day, index) => (
              <div
                key={`header-${day}`}
                className={`font-medium text-center ${index === currentDay ? "text-farmhouse-navy" : "text-farmhouse-brown"}`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={`category-${category}`} className="space-y-2">
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
                      key={`task-${task.key}`}
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
                      {daysOfWeek.map((_, dayIndex) => (
                        <div
                          key={`task-${task.key}-day-${dayIndex}`}
                          className="flex flex-wrap justify-center gap-1 p-1"
                        >
                          {children.map((child) => {
                            if (!visibleChildren.includes(child.id)) return null;
                            const childTask = child.tasks.find(
                              (t) =>
                                t.title === task.title
                            );
                            const isAssigned = childTask?.days.includes(dayIndex);
                            const childColors = getColorClasses(child.color || 'blue');
                            return (
                              <button
                                key={`task-${task.key}-day-${dayIndex}-child-${child.id}`}
                                onClick={() => {
                                  setChildren((prev) =>
                                    prev.map((c) => {
                                      if (c.id !== child.id) return c;
                                      return {
                                        ...c,
                                        tasks: c.tasks.map((t) => {
                                          if (
                                            t.type !== task.category ||
                                            t.title !== task.title
                                          )
                                            return t;
                                          return {
                                            ...t,
                                            days: isAssigned
                                              ? t.days.filter(
                                                  (d) => d !== dayIndex,
                                                )
                                              : [
                                                  ...t.days,
                                                  dayIndex,
                                                ],
                                          };
                                        }),
                                      };
                                    }),
                                  );
                                }}
                                className={`w-6 h-6 rounded-full transition-all flex items-center justify-center border-2
                                  ${isAssigned ? childColors.bg + ' border-transparent' : childColors.muted}
                                  hover:shadow-md`}
                                title={`${child.name} - ${isAssigned ? "Assigned" : "Not assigned"}`}
                              >
                                <span className={`text-xs font-medium ${isAssigned ? 'text-white' : ''}`}>
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
    </div>
  );
} 