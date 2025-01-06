import { useState } from 'react';
import { Plus, Edit2, Trash2, Trophy, Star, Check, Flame, User, Users, CalendarDays, ListTodo, BookOpen, Palette, Music, Code, Calculator, Brain, Dumbbell, Utensils, Sun, Moon } from 'lucide-react';
import { Child, Task, UniqueTask } from '../types/types';
import { getAllUniqueTasks, getColorClasses } from '../utils/taskUtils';

interface ParentWeekViewProps {
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  daysOfWeek: string[];
  currentDay: number;
  openTaskEditor: (task?: Task) => void;
}

export function ParentWeekView({ children, setChildren, daysOfWeek, currentDay, openTaskEditor }: ParentWeekViewProps) {
  const allTasks = getAllUniqueTasks(children) as UniqueTask[];
  const categories = ["Morning Routine", "Evening Routine", "academic"];
  const [visibleChildren, setVisibleChildren] = useState<number[]>(
    children.map((child) => child.id)
  );

  const toggleChildVisibility = (childId: number) => {
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
          const childColors = getColorClasses(child.color);
          const isVisible = visibleChildren.includes(child.id);
          return (
            <button
              key={child.id}
              onClick={() => toggleChildVisibility(child.id)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-3 border-2 ${
                isVisible ? `${childColors.bg} border-transparent` : childColors.muted
              }`}
            >
              <span className={isVisible ? 'text-white' : ''}>
                {child.name}
              </span>
              <div className={`flex items-center gap-1 ${isVisible ? 'text-white/90' : ''}`}>
                <Trophy className="w-4 h-4" />
                <span className="font-medium">{child.totalPoints}</span>
              </div>
            </button>
          );
        })}
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
                          {task.icon}
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
                                className={`w-6 h-6 rounded-full transition-all flex items-center justify-center
                                  ${isAssigned ? colors.bg : colors.muted}
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