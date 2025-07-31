import React from 'react';

interface ModeToggleProps {
  mode: 'tasks' | 'skills';
  onModeChange: (mode: 'tasks' | 'skills') => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-gray-100 rounded-lg p-1 flex">
        <button
          onClick={() => onModeChange('tasks')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'tasks'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => onModeChange('skills')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === 'skills'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Skills
        </button>
      </div>
    </div>
  );
}; 
