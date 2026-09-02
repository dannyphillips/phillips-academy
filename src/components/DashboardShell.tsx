import type { ReactNode } from 'react';
import { Lock, LockOpen, CalendarDays, ListTodo, Trophy } from 'lucide-react';
import { Child } from '../types/types';
import { ChildToggle } from './ChildToggle';
import { ModeToggle } from './ModeToggle';
import { isParentUser } from '../services/auth';

interface DashboardShellProps {
  totalPoints: number;
  children: Child[];
  activeChild: number;
  selectedDay: number;
  mode: 'tasks' | 'skills';
  view: 'day' | 'week';
  onLogout: () => void;
  onChildChange: (index: number) => void;
  onModeChange: (mode: 'tasks' | 'skills') => void;
  onViewChange: (view: 'day' | 'week') => void;
  content: ReactNode;
}

export function DashboardShell({
  totalPoints,
  children,
  activeChild,
  selectedDay,
  mode,
  view,
  onLogout,
  onChildChange,
  onModeChange,
  onViewChange,
  content,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen w-full bg-farmhouse-cream">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <img
              src="/assets/logo-circle-crop.png"
              alt="Phillips Homeschool Academy"
              className="h-24 w-auto object-contain"
            />
            <button
              onClick={onLogout}
              className={`nav-toggle !px-3 flex items-center gap-2 ${isParentUser() ? 'nav-toggle-active' : ''}`}
              title={isParentUser() ? 'Parent Mode (Click to Logout)' : 'Child Mode (Click to Logout)'}
            >
              {isParentUser() ? (
                <>
                  <LockOpen className="w-5 h-5" />
                  <span>Logout (Parent)</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>

          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-farmhouse-clay" />
              <span className="text-2xl font-bold text-farmhouse-navy">
                {totalPoints} Points
              </span>
            </div>
          </div>

          {children.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {children.map((child, index) => (
                <ChildToggle
                  key={child.id}
                  child={child}
                  isVisible={index === activeChild}
                  onToggleVisibility={() => onChildChange(index)}
                  showStats={true}
                  selectedDay={selectedDay}
                />
              ))}
            </div>
          )}

          <ModeToggle mode={mode} onModeChange={onModeChange} />

          {mode === 'tasks' && (
            <div className="flex justify-center">
              <div className="nav-container">
                <button
                  onClick={() => onViewChange('day')}
                  className={`nav-toggle ${view === 'day' ? 'nav-toggle-active' : ''}`}
                >
                  <ListTodo className="w-4 h-4" />
                  List View
                </button>
                <button
                  onClick={() => onViewChange('week')}
                  className={`nav-toggle ${view === 'week' ? 'nav-toggle-active' : ''}`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Week View
                </button>
              </div>
            </div>
          )}

          {content}
        </div>
      </div>
    </div>
  );
}
