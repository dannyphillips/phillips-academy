import { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Child } from '../types/types';

interface EditChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (childId: string, updates: Partial<Omit<Child, 'id' | 'tasks'>>) => void;
  onDelete: (childId: string) => void;
  child: Child | null;
}

export function EditChildModal({ isOpen, onClose, onSave, onDelete, child }: EditChildModalProps) {
  const [editingChild, setEditingChild] = useState<Partial<Child>>({});

  if (!isOpen || !child) return null;

  const handleSave = () => {
    if (!editingChild.name && !editingChild.age && !editingChild.color) return;
    onSave(child.id, editingChild);
    onClose();
  };

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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-farmhouse-navy mb-1">
              Name
            </label>
            <input
              type="text"
              value={editingChild.name ?? child.name}
              onChange={(e) =>
                setEditingChild((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-farmhouse-navy mb-1">
              Age
            </label>
            <input
              type="number"
              value={editingChild.age ?? child.age}
              onChange={(e) =>
                setEditingChild((prev) => ({
                  ...prev,
                  age: parseInt(e.target.value) || 0,
                }))
              }
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-farmhouse-navy mb-1">
              Color Theme
            </label>
            <select
              value={editingChild.color ?? child.color}
              onChange={(e) =>
                setEditingChild((prev) => ({
                  ...prev,
                  color: e.target.value,
                }))
              }
              className="input-field"
            >
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
              <option value="green">Green</option>
              <option value="orange">Orange</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between pt-4">
          <button
            onClick={() => {
              onDelete(child.id);
              onClose();
            }}
            className="danger-button"
          >
            <Trash2 className="w-4 h-4" />
            Delete Child
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="secondary-button">
              Cancel
            </button>
            <button onClick={handleSave} className="primary-button">
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 