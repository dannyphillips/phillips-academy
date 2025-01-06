import { Plus } from 'lucide-react';
import { Child, Task } from '../types/types';
import { getAllUniqueTasks, getColorClasses } from '../utils/taskUtils';

interface ParentWeekViewProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  daysOfWeek: string[];
  currentDay: number;
  openTaskEditor: (task?: Task) => void;
}

export function ParentWeekView({ children, setChildren, daysOfWeek, currentDay, openTaskEditor }: ParentWeekViewProps) {
  const allTasks = getAllUniqueTasks(children);
  const categories = ["routine", "academic"];

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
                  {category === "routine" ? "Daily Routines" : "Learning Tasks"}
                </h3>
                {allTasks
                  .filter((task) => task.category === category)
                  .map((task) => (
                    <div
                      key={task.key}
                      className="grid grid-cols-8 gap-2 bg-white rounded-lg p-3 items-center border border-farmhouse-beige hover:shadow-md transition-all"
                    >
                      <div className="text-sm">
                        <div className="font-medium text-farmhouse-navy">
                          {task.subject}
                        </div>
                        <div className="text-farmhouse-brown text-xs">
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
                                  ${isAssigned ? 'bg-farmhouse-sage border-farmhouse-sage text-white' : 'bg-white border-farmhouse-beige hover:border-farmhouse-sage'}
                                  hover:shadow-md`}
                                title={`${child.name} - ${isAssigned ? "Assigned" : "Not assigned"}`}
                              >
                                <span className="text-xs font-medium">
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