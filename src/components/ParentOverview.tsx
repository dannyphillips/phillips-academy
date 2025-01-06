import { useState } from 'react';
import { User, Trophy, Check } from 'lucide-react';
import { Child } from '../types/types';
import { getAllUniqueTasks, getColorClasses } from '../utils/taskUtils';

interface ParentOverviewProps {
  children: Child[];
  setIsParentView: (value: boolean) => void;
  handleTaskComplete: (childId: number, taskId: number) => void;
  daysOfWeek: string[];
  currentDay: number;
}

export function ParentOverview({ 
  children, 
  setIsParentView, 
  handleTaskComplete, 
  daysOfWeek, 
  currentDay 
}: ParentOverviewProps) {
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

  const allTasks = getAllUniqueTasks(children);
  const categories = ["routine", "academic"];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Family Weekly Schedule
        </h1>
        <button
          onClick={() => setIsParentView(false)}
          className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Child View
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
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-3
                ${isVisible ? childColors.bg : "bg-gray-100"}
                ${isVisible ? childColors.border : "border-gray-200"}
                border-2`}
            >
              <span
                className={`font-medium ${isVisible ? childColors.text : "text-gray-400"}`}
              >
                {child.name}
              </span>
              <div
                className={`flex items-center gap-1 ${isVisible ? "" : "opacity-50"}`}
              >
                <Trophy
                  className={`w-4 h-4 ${isVisible ? "text-yellow-500" : "text-gray-400"}`}
                />
                <span className="font-medium">{child.totalPoints}</span>
              </div>
            </button>
          );
        })}
      </div>
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
                                  ${childTask.completed ? `${childColors.completed} border-transparent` : `${childColors.bg} ${childColors.border}`}
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