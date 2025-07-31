import React, { useState, useMemo, useCallback } from 'react';
import { X, Plus, Minus, CheckCircle, Target, TrendingUp } from 'lucide-react';
import { ChildSkill, ProgressEntry } from '../types/types';
import { Skill } from '../data/skills';
import { getIcon } from '../utils/iconUtils';
import { calculateProgressPercentage, getProgressDisplayText, validateSkillProgress } from '../utils/skillUtils';

interface SkillProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  childSkill: ChildSkill;
  skill: Skill;
  onUpdateProgress: (skillId: string, newValue: number, notes?: string) => Promise<void>;
  onToggleCompletion: (skillId: string, isCompleted: boolean) => Promise<void>;
}

export const SkillProgressModal: React.FC<SkillProgressModalProps> = ({
  isOpen,
  onClose,
  childSkill,
  skill,
  onUpdateProgress,
  onToggleCompletion
}) => {
  const [progressValue, setProgressValue] = useState(childSkill.currentValue || 0);
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Memoize calculations
  const progressPercentage = useMemo(() => calculateProgressPercentage(childSkill, skill), [childSkill, skill]);
  const progressText = useMemo(() => getProgressDisplayText(childSkill, skill), [childSkill, skill]);

  const handleUpdateProgress = useCallback(async () => {
    if (!validateSkillProgress(childSkill, skill)) {
      alert('Invalid progress data. Please check the values.');
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdateProgress(childSkill.skillId, progressValue, notes);
      onClose();
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [childSkill.skillId, progressValue, notes, onUpdateProgress, onClose, skill]);

  const handleIncrement = useCallback(async (increment: number) => {
    setIsUpdating(true);
    try {
      const newValue = (childSkill.currentValue || 0) + increment;
      await onUpdateProgress(childSkill.skillId, newValue, `Incremented by ${increment}`);
    } catch (error) {
      console.error('Error incrementing progress:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [childSkill.currentValue, childSkill.skillId, onUpdateProgress]);

  const handleToggleCompletion = useCallback(async () => {
    setIsUpdating(true);
    try {
      await onToggleCompletion(childSkill.skillId, !childSkill.isCompleted);
      onClose();
    } catch (error) {
      console.error('Error toggling completion:', error);
    } finally {
      setIsUpdating(false);
    }
  }, [childSkill.skillId, childSkill.isCompleted, onToggleCompletion, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                {getIcon(skill.badge, 20)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{skill.name}</h2>
                <p className="text-sm text-gray-600">{skill.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Display */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              {skill.progressType === 'counter' && (
                <span className="text-sm text-gray-600">{progressText}</span>
              )}
            </div>
            
            {skill.progressType === 'counter' && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            )}

            {skill.progressType === 'boolean' && (
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${childSkill.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  {childSkill.isCompleted ? <CheckCircle className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                </div>
                <span className="text-sm text-gray-600">
                  {childSkill.isCompleted ? 'Completed' : 'In Progress'}
                </span>
              </div>
            )}
          </div>

          {/* Progress Controls */}
          {skill.progressType === 'counter' && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => handleIncrement(-1)}
                  disabled={isUpdating || (childSkill.currentValue || 0) <= 0}
                  className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <div className="flex-1">
                  <input
                    type="number"
                    value={progressValue}
                    onChange={(e) => setProgressValue(parseInt(e.target.value) || 0)}
                    min="0"
                    max={skill.targetValue}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={() => handleIncrement(1)}
                  disabled={isUpdating}
                  className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this progress update..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <button
                onClick={handleUpdateProgress}
                disabled={isUpdating}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Update Progress
              </button>
            </div>
          )}

          {/* Boolean Completion Toggle */}
          {skill.progressType === 'boolean' && (
            <div className="mb-6">
              <button
                onClick={handleToggleCompletion}
                disabled={isUpdating}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  childSkill.isCompleted
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {childSkill.isCompleted ? (
                  <>
                    <X className="w-4 h-4" />
                    Mark as Incomplete
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Mark as Complete
                  </>
                )}
              </button>
            </div>
          )}

          {/* Progress History */}
          {childSkill.progressHistory && childSkill.progressHistory.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Progress History</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {childSkill.progressHistory.slice().reverse().map((entry: ProgressEntry, index: number) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {entry.date.toLocaleDateString()}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {entry.value}
                      </span>
                    </div>
                    {entry.notes && (
                      <span className="text-gray-500 text-xs truncate max-w-32">
                        {entry.notes}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Details */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Started:</span>
                <div className="font-medium">
                  {childSkill.startedAt.toLocaleDateString()}
                </div>
              </div>
              {childSkill.completedAt && (
                <div>
                  <span className="text-gray-600">Completed:</span>
                  <div className="font-medium">
                    {childSkill.completedAt.toLocaleDateString()}
                  </div>
                </div>
              )}
              {skill.targetValue && (
                <div>
                  <span className="text-gray-600">Target:</span>
                  <div className="font-medium">
                    {skill.targetValue} {skill.progressDescription}
                  </div>
                </div>
              )}
              <div>
                <span className="text-gray-600">Duration:</span>
                <div className="font-medium">{skill.estimatedDuration}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
