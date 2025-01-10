import { Trophy, Check, Flame } from 'lucide-react';
import { Child } from '../types/types';
import { getColorClasses, getTaskMapping } from '../utils/taskUtils';

interface ChildDayViewProps {
  children: Child[];
  activeChild: number;
  setActiveChild: (index: number) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  daysOfWeek: string[];
  handleTaskComplete: (childId: number, taskId: number) => void;
}

export function ChildDayView({
  children,
  activeChild,
  setActiveChild,
  selectedDay,
  setSelectedDay,
  daysOfWeek,
  handleTaskComplete
}: ChildDayViewProps) {
  if (children.length === 0) {
    return <div>No children found</div>;
  }

  const currentChild = children[activeChild];
  if (!currentChild) {
    return <div>Invalid child selected</div>;
  }

  const colors = getColorClasses(currentChild.color || 'blue');

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {children.map((child, index) => {
          const childColors = getColorClasses(child.color || 'blue');
          const isActive = index === activeChild;
          return (
            <button
              key={child.id}
              onClick={() => setActiveChild(index)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-3 border-2 ${
                isActive ? `${childColors.bg} border-transparent` : childColors.muted
              }`}
            >
              <span className={isActive ? 'text-white' : ''}>
                {child.name}
              </span>
              <div className={`flex items-center gap-1 ${isActive ? 'text-white/90' : ''}`}>
                <Trophy className="w-4 h-4" />
                <span className="font-medium">{child.totalPoints}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        {daysOfWeek.map((day, index) => (
          <button
            key={day}
            onClick={() => setSelectedDay(index)}
            className={`day-button ${
              index === selectedDay ? `${colors.bg} text-white` : 'day-button-inactive'
            }`}
          >
            {day[0]}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {currentChild.tasks
          .filter((task) => task.days.includes(selectedDay))
          .map((task) => {
            const taskMapping = getTaskMapping(task.title);
            const Icon = taskMapping.icon;
            return (
              <div
                key={task.id}
                className="task-card"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleTaskComplete(currentChild.id, task.id)}
                    className={`task-button ${
                      task.completed ? `${colors.bg} text-white` : 'task-button-incomplete'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4" />}
                  </button>
                  <div className="flex-grow flex items-center gap-3">
                    <div className="text-farmhouse-brown">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-farmhouse-navy">
                        {taskMapping.category === 'academic' ? task.title : taskMapping.category}
                      </h3>
                      <p className="text-sm text-farmhouse-brown">
                        {task.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-farmhouse-brown">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      <span className="text-sm font-medium">{task.points}</span>
                    </div>
                    {task.streak > 0 && (
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-medium">{task.streak}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
} 