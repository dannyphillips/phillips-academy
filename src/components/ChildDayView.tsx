import { Check, Flame, Trophy } from 'lucide-react';
import { Child } from '../types/types';
import { getColorClasses, getTaskMapping } from '../utils/taskUtils';
import { ChildToggle } from './ChildToggle';

interface ChildDayViewProps {
  children: Child[];
  activeChild: number;
  setActiveChild: (index: number) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  daysOfWeek: string[];
  handleTaskComplete: (childId: string, taskId: string) => void;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.map((child, index) => (
          <ChildToggle
            key={child.id}
            child={child}
            onEdit={() => {}} // No edit in child view
            isVisible={index === activeChild}
            onToggleVisibility={() => setActiveChild(index)}
            showStats={true}
          />
        ))}
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
                      <Icon className="w-5 h-5" />
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