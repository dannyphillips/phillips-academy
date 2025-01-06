import { ChevronLeft, ChevronRight, Trophy, Star, Check, Flame } from 'lucide-react';
import { Child } from '../types/types';
import { getColorClasses } from '../utils/taskUtils';

interface ChildViewProps {
  children: Child[];
  activeChild: number;
  setActiveChild: (index: number) => void;
  selectedDay: number;
  setSelectedDay: React.Dispatch<React.SetStateAction<number>>;
  daysOfWeek: string[];
  handleTaskComplete: (childId: number, taskId: number) => void;
}

export function ChildView({
  children,
  activeChild,
  setActiveChild,
  selectedDay,
  setSelectedDay,
  daysOfWeek,
  handleTaskComplete,
}: ChildViewProps) {
  const activeChildData = children[activeChild];
  const colorClasses = getColorClasses(activeChildData.color);
  const filteredTasks = activeChildData.tasks.filter((task) =>
    task.frequency.includes(selectedDay)
  );
  const completedTasks = filteredTasks.filter((task) => task.completed).length;

  return (
    <div className="max-w-3xl mx-auto">
      <header className="text-center mb-8">
        <div className="flex justify-center gap-4 mb-6">
          {children.map((child, index) => {
            const childColors = getColorClasses(child.color);
            return (
              <button
                key={child.id}
                onClick={() => setActiveChild(index)}
                className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${activeChild === index ? childColors.activeTab : childColors.tab}`}
              >
                {child.name}
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm">{child.totalPoints}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedDay((prev) => (prev - 1 + 7) % 7)}
            className={`p-2 rounded-full ${colorClasses.button}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {daysOfWeek.map((day, index) => (
              <button
                key={day}
                onClick={() => setSelectedDay(index)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${selectedDay === index ? `${colorClasses.activeTab}` : `${colorClasses.tab} opacity-70`}`}
              >
                {day}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedDay((prev) => (prev + 1) % 7)}
            className={`p-2 rounded-full ${colorClasses.button}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <h1 className={`text-4xl font-bold ${colorClasses.text} mb-2`}>
          {activeChildData.name}'s {daysOfWeek[selectedDay]} Adventure! 🚀
        </h1>
        <div className="flex items-center justify-center gap-1">
          {[...Array(filteredTasks.length)].map((_, index) => (
            <Star
              key={index}
              className={`w-8 h-8 ${index < completedTasks ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
        <p className={`${colorClasses.text} mt-2`}>
          {completedTasks} out of {filteredTasks.length} tasks completed
        </p>
      </header>
      <main className="space-y-6">
        {["routine", "academic"].map((category) => (
          <div key={category}>
            <h2 className={`text-2xl font-semibold ${colorClasses.text} mb-3`}>
              {category === "routine" ? "Daily Routines" : "Learning Tasks"}
            </h2>
            <div className="space-y-4">
              {filteredTasks
                .filter((task) => task.category === category)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleTaskComplete(activeChildData.id, task.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                            ${task.completed ? `${colorClasses.completed} border-transparent` : `${colorClasses.bg} ${colorClasses.border}`}`}
                        >
                          {task.completed && <Check className="w-4 h-4 text-white" />}
                        </button>
                        <div>
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <p className="text-sm text-gray-500">{task.subject}</p>
                        </div>
                      </div>
                      {task.streak > 0 && (
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Flame className="w-4 h-4" />
                          <span className="text-sm font-medium">{task.streak}</span>
                        </div>
                      )}
                    </div>
                    {task.details && (
                      <div className="mt-3 pl-9 space-y-1 text-sm text-gray-500">
                        {task.details.pages && <p>📖 {task.details.pages}</p>}
                        {task.details.chapter && <p>📑 {task.details.chapter}</p>}
                        {task.details.notes && <p>📝 {task.details.notes}</p>}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
} 