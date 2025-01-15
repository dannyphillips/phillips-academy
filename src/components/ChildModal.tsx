import { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Child } from '../types/types';

interface ChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (childData: Omit<Child, 'id' | 'taskAssignments'>) => void;
  onDelete: (childId: string) => void;
  child?: Child;
}

export function ChildModal({ isOpen, onClose, onSave, onDelete, child }: ChildModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [color, setColor] = useState('blue');
  const [points, setPoints] = useState('0');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (child) {
      setName(child.name);
      setAge(child.age.toString());
      setColor(child.color);
      setPoints(child.totalPoints.toString());
    } else {
      setName('');
      setAge('');
      setColor('blue');
      setPoints('0');
    }
  }, [child, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      age: parseInt(age),
      color,
      totalPoints: parseInt(points)
    });
    setName('');
    setAge('');
    setColor('blue');
    setPoints('0');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-farmhouse-navy">
            {child ? 'Edit Child' : 'Add New Child'}
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
            <label className="block text-sm font-medium text-farmhouse-navy mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-farmhouse-navy mb-1">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input-field"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-farmhouse-navy mb-1">
              Points
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="input-field"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-farmhouse-navy mb-1">
              Color Theme
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="input-field"
              required
            >
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
              <option value="green">Green</option>
              <option value="orange">Orange</option>
            </select>
          </div>
          <div className="flex justify-between pt-4">
            {child && (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="danger-button"
              >
                <Trash2 className="w-4 h-4" />
                Delete Child
              </button>
            )}
            <div className="flex gap-2 ml-auto">
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
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && child && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-6">
            <h2 className="text-xl font-semibold text-farmhouse-navy">
              Delete Child
            </h2>
            <p className="text-farmhouse-brown">
              Are you sure you want to delete {child.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(child.id);
                  setDeleteConfirm(false);
                }}
                className="danger-button"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 