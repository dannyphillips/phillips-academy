import { useState } from 'react';
import { X } from 'lucide-react';
import { Child } from '../types/types';
import { colors } from '../constants/colors';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (child: Omit<Child, 'id' | 'tasks' | 'totalPoints'>) => void;
}

export function AddChildModal({ isOpen, onClose, onSave }: AddChildModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [color, setColor] = useState(colors[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      age: parseInt(age),
      color
    });
    setName('');
    setAge('');
    setColor(colors[0].value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-farmhouse-navy">
            Add New Child
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-farmhouse-brown hover:text-farmhouse-navy rounded-full hover:bg-farmhouse-beige/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-farmhouse-navy mb-1">
              First Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-farmhouse-navy mb-1">
              Age
            </label>
            <input
              id="age"
              type="number"
              required
              min="1"
              max="18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input-field"
              placeholder="Enter age"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-farmhouse-navy mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === c.value ? 'border-blue-800' : 'border-transparent'
                  } ${c.class} hover:opacity-90 transition-opacity`}
                  title={c.name}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="secondary-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
            >
              Add Child
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 