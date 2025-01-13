import { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Child } from '../types/types';
import { colors } from '../constants/colors';
import { ConfirmModal } from './ConfirmModal';

interface ChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (child: Omit<Child, 'id' | 'taskAssignments'>) => void;
  onDelete?: (childId: string) => void;
  child?: Child;
}

export function ChildModal({ isOpen, onClose, onSave, onDelete, child }: ChildModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [color, setColor] = useState(colors[0].value);
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
      setColor(colors[0].value);
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
    setColor(colors[0].value);
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
            <label htmlFor="points" className="block text-sm font-medium text-farmhouse-navy mb-1">
              Points
            </label>
            <input
              id="points"
              type="number"
              required
              min="0"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="input-field"
              placeholder="Enter points"
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
          <div className="flex justify-between pt-4">
            {child && onDelete && (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg border-2 border-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Child</span>
              </button>
            )}
            <div className={`flex gap-2 ${!child || !onDelete ? '' : 'ml-auto'}`}>
              <button
                type="button"
                onClick={onClose}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{child ? 'Save Changes' : 'Add Child'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={() => {
          if (child && onDelete) {
            onDelete(child.id);
          }
        }}
        title="Delete Child"
        message={`Are you sure you want to delete ${child?.name}? This will remove all their tasks and progress. This action cannot be undone.`}
      />
    </div>
  );
} 