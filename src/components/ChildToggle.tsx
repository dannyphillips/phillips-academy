import { Edit2, Trophy } from 'lucide-react';
import { Child } from '../types/types';
import { getColorClasses } from '../utils/taskUtils';

interface ChildToggleProps {
  child: Child;
  onEdit: (child: Child) => void;
  isVisible?: boolean;
  onToggleVisibility?: (childId: string) => void;
  showStats?: boolean;
}

export function ChildToggle({ 
  child, 
  onEdit, 
  isVisible = true, 
  onToggleVisibility,
  showStats = true 
}: ChildToggleProps) {
  const colors = getColorClasses(child.color || 'blue');
  const completedTasks = child.tasks.filter(t => t.completed).length;
  const totalTasks = child.tasks.length;

  const content = (
    <div className="flex flex-col gap-2 w-full p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white">{child.name}</h3>
          <p className="text-white/80 text-sm">Age {child.age}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(child);
          }}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Edit2 className="w-4 h-4 text-white" />
        </button>
      </div>
      {showStats && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-white" />
            <span className="font-semibold text-white">{child.totalPoints} points</span>
          </div>
          <div className="text-sm text-white/80">
            {completedTasks}/{totalTasks} tasks completed
          </div>
        </div>
      )}
    </div>
  );

  const cardClasses = `rounded-lg transition-all border-2 ${colors.bg.replace('bg-', 'border-')} ${
    onToggleVisibility 
      ? `${colors.bg} ${!isVisible ? 'bg-opacity-25' : ''}`
      : `${colors.bg} shadow-md hover:shadow-lg`
  }`;

  return onToggleVisibility ? (
    <button
      onClick={() => onToggleVisibility(child.id)}
      className={cardClasses}
    >
      {content}
    </button>
  ) : (
    <div className={cardClasses}>
      {content}
    </div>
  );
} 