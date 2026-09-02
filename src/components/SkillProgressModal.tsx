import { useState, useMemo, useCallback } from 'react';
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

function SkillProgressForm({
  childSkill,
  skill,
  onClose,
  onUpdateProgress,
  onToggleCompletion,
}: Omit<SkillProgressModalProps, 'isOpen'>) {
  const [progressValue, setProgressValue] = useState(childSkill.currentValue || 0);
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const progressPercentage = useMemo(
    () => calculateProgressPercentage(childSkill, skill),
    [childSkill, skill]
  );
  const progressText = useMemo(
    () => getProgressDisplayText(childSkill, skill),
    [childSkill, skill]
  );

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
  }, [childSkill, progressValue, notes, onUpdateProgress, onClose, skill]);

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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-farmhouse-linen text-farmhouse-teal">
            {getIcon(skill.badge, 20)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-farmhouse-navy">{skill.name}</h2>
            <p className="text-sm text-farmhouse-brown">{skill.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-farmhouse-brown hover:text-farmhouse-navy rounded-full hover:bg-farmhouse-beige/50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-farmhouse-navy">Progress</span>
          {skill.progressType === 'counter' && (
            <span className="text-sm text-farmhouse-brown">{progressText}</span>
          )}
        </div>

        {skill.progressType === 'counter' && (
          <div className="skill-progress-bar h-2 mb-2">
            <div
              className="skill-progress-fill h-2"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        {skill.progressType === 'boolean' && (
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-full ${
                childSkill.isCompleted
                  ? 'bg-farmhouse-sage/20 text-farmhouse-sage'
                  : 'bg-farmhouse-linen text-farmhouse-brown'
              }`}
            >
              {childSkill.isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Target className="w-5 h-5" />
              )}
            </div>
            <span className="text-sm text-farmhouse-brown">
              {childSkill.isCompleted ? 'Completed' : 'In Progress'}
            </span>
          </div>
        )}
      </div>

      {skill.progressType === 'counter' && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => handleIncrement(-1)}
              disabled={isUpdating || (childSkill.currentValue || 0) <= 0}
              className="p-2 rounded-full bg-farmhouse-rust/10 text-farmhouse-rust hover:bg-farmhouse-rust/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex-1">
              <input
                type="number"
                value={progressValue}
                onChange={e => setProgressValue(parseInt(e.target.value) || 0)}
                min="0"
                max={skill.targetValue}
                className="input-field"
              />
            </div>

            <button
              onClick={() => handleIncrement(1)}
              disabled={isUpdating}
              className="p-2 rounded-full bg-farmhouse-sage/20 text-farmhouse-sage hover:bg-farmhouse-sage/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-farmhouse-navy mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this progress update..."
              className="input-field"
              rows={3}
            />
          </div>

          <button
            onClick={handleUpdateProgress}
            disabled={isUpdating}
            className="primary-button w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrendingUp className="w-4 h-4" />
            Update Progress
          </button>
        </div>
      )}

      {skill.progressType === 'boolean' && (
        <div className="mb-6">
          <button
            onClick={handleToggleCompletion}
            disabled={isUpdating}
            className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              childSkill.isCompleted
                ? 'bg-farmhouse-rust text-white hover:bg-farmhouse-rust/90'
                : 'bg-farmhouse-sage text-white hover:bg-farmhouse-sage/90'
            }`}
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

      {childSkill.progressHistory && childSkill.progressHistory.length > 0 && (
        <div className="border-t border-farmhouse-beige pt-4">
          <h3 className="text-sm font-medium text-farmhouse-navy mb-3">Progress History</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {childSkill.progressHistory
              .slice()
              .reverse()
              .map((entry: ProgressEntry, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-farmhouse-brown">{entry.date.toLocaleDateString()}</span>
                    <span className="text-farmhouse-navy font-medium">{entry.value}</span>
                  </div>
                  {entry.notes && (
                    <span className="text-farmhouse-stone text-xs truncate max-w-32">
                      {entry.notes}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="border-t border-farmhouse-beige pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-farmhouse-brown">Started:</span>
            <div className="font-medium text-farmhouse-navy">
              {childSkill.startedAt.toLocaleDateString()}
            </div>
          </div>
          {childSkill.completedAt && (
            <div>
              <span className="text-farmhouse-brown">Completed:</span>
              <div className="font-medium text-farmhouse-navy">
                {childSkill.completedAt.toLocaleDateString()}
              </div>
            </div>
          )}
          {skill.targetValue && (
            <div>
              <span className="text-farmhouse-brown">Target:</span>
              <div className="font-medium text-farmhouse-navy">
                {skill.targetValue} {skill.progressDescription}
              </div>
            </div>
          )}
          <div>
            <span className="text-farmhouse-brown">Duration:</span>
            <div className="font-medium text-farmhouse-navy">{skill.estimatedDuration}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkillProgressModal({
  isOpen,
  onClose,
  childSkill,
  skill,
  onUpdateProgress,
  onToggleCompletion,
}: SkillProgressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <SkillProgressForm
          key={`${childSkill.childId}-${childSkill.skillId}`}
          childSkill={childSkill}
          skill={skill}
          onClose={onClose}
          onUpdateProgress={onUpdateProgress}
          onToggleCompletion={onToggleCompletion}
        />
      </div>
    </div>
  );
}
