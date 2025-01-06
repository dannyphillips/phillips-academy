import { useState } from 'react';
import { User, Trophy, Check, Star, Flame, Users, CalendarDays, ListTodo, Plus, Edit2, Trash2, BookOpen, Palette, Music, Code, Calculator, Brain, Dumbbell, Utensils, Sun, Moon } from 'lucide-react';
import { Child, UniqueTask } from '../types/types';
import { getAllUniqueTasks, getColorClasses } from '../utils/taskUtils';

interface ChildWeekViewProps {
  children: Child[];
  handleTaskComplete: (childId: number, taskId: number) => void;
  daysOfWeek: string[];
  currentDay: number;
}

export function ChildWeekView({ children, handleTaskComplete, daysOfWeek, currentDay }: ChildWeekViewProps) {
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

  const allTasks = getAllUniqueTasks(children) as UniqueTask[];
  const categories = ["Morning Routine", "Evening Routine", "academic"];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-farmhouse-navy">Family Weekly Schedule</h1>
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
                                t.title === task.title &&
                                t.frequency.includes(dayIndex)
                            );
                            if (!childTask) return null;
                            const childColors = getColorClasses(child.color);
                            return (
                              <button
                                key={child.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskComplete(child.id, childTask.id);
                                }}
                                className={`w-6 h-6 rounded-full border-2 transition-all 
                                  ${childTask.completed ? `${childColors.completed} border-transparent` : `${childColors.bg} border-transparent`}
                                  hover:shadow-md`}
                                title={`${child.name} - ${childTask.completed ? "Completed" : "Incomplete"}`}
                              >
                                {childTask.completed && (
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