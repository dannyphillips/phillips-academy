import { ReactNode } from 'react';
import { TaskType, getTaskTypeDisplayName } from '../constants/taskTypes';

interface TaskGroupProps {
  type: TaskType;
  children: ReactNode;
  className?: string;
  showEmptyGroups?: boolean;
}

export function TaskGroup({ type, children, className = '', showEmptyGroups = false }: TaskGroupProps) {
  // If there are no children and we don't want to show empty groups, return null
  if (!showEmptyGroups && !children) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      <h2 className="text-xl font-semibold text-farmhouse-navy">
        {getTaskTypeDisplayName(type)}
      </h2>
      {children}
    </div>
  );
} 