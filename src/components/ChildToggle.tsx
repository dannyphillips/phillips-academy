import { Edit2, Trophy } from 'lucide-react';
import { Child } from '../types/types';
import { getColorClasses } from '../utils/taskUtils';

interface ChildToggleProps {
  child: Child;
  onEdit?: (child: Child) => void;
  isVisible?: boolean;
  onToggleVisibility?: (childId: string) => void;
  showStats?: boolean;
  selectedDay?: number;
}

export function ChildToggle({ 
  child, 
  onEdit, 
  isVisible = true, 
  onToggleVisibility,
  showStats = true,
  selectedDay = new Date().getDay()
}: ChildToggleProps) {
  const colors = getColorClasses(child.color || 'blue');
  const completedTasks = child.taskAssignments.filter(t => t.completions?.[`${t.id}-${selectedDay}`]).length;
  const totalTasks = child.taskAssignments.filter(t => t.days.includes(selectedDay)).length;

  const content = (
    <div className="flex flex-col w-full p-3 gap-2">
      <div className="flex justify-between items-center">
        <div className="w-8" /> {/* Spacer to help center the name */}
        <h3 className="text-[36px] font-normal text-white leading-tight">{child.name}</h3>
        {onEdit && (
          onToggleVisibility ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onEdit(child);
              }}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-white" />
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(child);
              }}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-white" />
            </button>
          )
        )}
        {!onEdit && <div className="w-8" />} {/* Spacer to help center the name */}
      </div>
      {showStats && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2 py-1">
            <Trophy className="w-4 h-4 text-white" />
            <span className="font-bold text-lg text-white">{child.totalPoints}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2 py-1">
            <span className="font-medium text-sm text-white">{completedTasks}/{totalTasks} Today</span>
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