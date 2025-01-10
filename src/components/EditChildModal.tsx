import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Child } from '../types/types';
import { colors } from '../constants/colors';

interface EditChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (childId: number, updates: Partial<Omit<Child, 'id' | 'tasks'>>) => void;
  onDelete: (childId: number) => void;
  child: Child;
}

export function EditChildModal({ isOpen, onClose, onSave, onDelete, child }: EditChildModalProps) {
  const [name, setName] = useState(child.name);
  const [age, setAge] = useState(child.age.toString());
  const [color, setColor] = useState(child.color);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setName(child.name);
    setAge(child.age.toString());
    setColor(child.color);
  }, [child]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: Partial<Omit<Child, 'id' | 'tasks'>> = {};
    
    if (name !== child.name) updates.name = name;
    if (parseInt(age) !== child.age) updates.age = parseInt(age);
    if (color !== child.color) updates.color = color;

    if (Object.keys(updates).length > 0) {
      onSave(child.id, updates);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-farmhouse-navy">
            Edit Child
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
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <div className="flex gap-2">
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
                Save Changes
              </button>
            </div>
          </div>
        </form>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4">
              <h3 className="text-lg font-semibold text-farmhouse-navy">
                Delete Child?
              </h3>
              <p className="text-farmhouse-brown">
                Are you sure you want to delete {child.name}? This will remove all their tasks and progress.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(child.id);
                    setShowDeleteConfirm(false);
                    onClose();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 