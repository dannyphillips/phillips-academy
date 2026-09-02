interface ModeToggleProps {
  mode: 'tasks' | 'skills';
  onModeChange: (mode: 'tasks' | 'skills') => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="nav-container">
        <button
          onClick={() => onModeChange('tasks')}
          className={`nav-toggle ${mode === 'tasks' ? 'nav-toggle-active' : ''}`}
        >
          Tasks
        </button>
        <button
          onClick={() => onModeChange('skills')}
          className={`nav-toggle ${mode === 'skills' ? 'nav-toggle-active' : ''}`}
        >
          Skills
        </button>
      </div>
    </div>
  );
}
