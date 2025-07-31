import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SortDirection } from '../utils/sortUtils';

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  options: SortOption[];
  value: string;
  direction: SortDirection;
  onSortChange: (field: string, direction: SortDirection) => void;
  className?: string;
  placeholder?: string;
}

export function SortSelect({ 
  options, 
  value, 
  direction, 
  onSortChange, 
  className = '',
  placeholder = 'Sort by...'
}: SortSelectProps) {
  const handleFieldChange = (newField: string) => {
    onSortChange(newField, direction);
  };

  const handleDirectionToggle = () => {
    const newDirection = direction === 'asc' ? 'desc' : 'asc';
    onSortChange(value, newDirection);
  };

  const getSortIcon = () => {
    return direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => handleFieldChange(e.target.value)}
          className="appearance-none bg-white border border-farmhouse-beige rounded-lg px-3 py-2 pr-8 text-sm text-farmhouse-navy focus:outline-none focus:ring-2 focus:ring-farmhouse-clay focus:border-transparent"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-farmhouse-brown pointer-events-none" />
      </div>
      
      {value && (
        <button
          onClick={handleDirectionToggle}
          className="p-2 text-farmhouse-brown hover:text-farmhouse-navy rounded-full hover:bg-farmhouse-beige/50 transition-colors"
          title={`Sort ${direction === 'asc' ? 'descending' : 'ascending'}`}
        >
          <span className="text-lg">{getSortIcon()}</span>
        </button>
      )}
    </div>
  );
} 
