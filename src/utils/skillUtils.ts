import { ChildSkill } from '../types/types';
import { Skill } from '../data/skills';

/**
 * Calculate the progress percentage for a skill
 */
export function calculateProgressPercentage(childSkill: ChildSkill, skill: Skill): number {
  if (skill.progressType === 'counter' && skill.targetValue) {
    return Math.min((childSkill.currentValue || 0) / skill.targetValue * 100, 100);
  }
  return childSkill.isCompleted ? 100 : 0;
}

/**
 * Check if a skill is completed based on its progress type and current value
 */
export function isSkillCompleted(childSkill: ChildSkill, skill: Skill): boolean {
  if (skill.progressType === 'counter' && skill.targetValue) {
    return (childSkill.currentValue || 0) >= skill.targetValue;
  }
  return childSkill.isCompleted;
}

/**
 * Get the progress display text for a skill
 */
export function getProgressDisplayText(childSkill: ChildSkill, skill: Skill): string {
  if (skill.progressType === 'counter' && skill.targetValue) {
    const current = childSkill.currentValue || 0;
    const target = skill.targetValue;
    const description = skill.progressDescription || 'items';
    return `${current} / ${target} ${description}`;
  }
  return childSkill.isCompleted ? 'Completed' : 'In Progress';
}

/**
 * Get the appropriate progress type for a skill based on its definition
 */
export function getSkillProgressType(skill: Skill): 'boolean' | 'counter' {
  return skill.progressType || 'boolean';
}

/**
 * Validate skill progress data
 */
export function validateSkillProgress(childSkill: ChildSkill, skill: Skill): boolean {
  if (skill.progressType === 'counter') {
    if (skill.targetValue === undefined || skill.targetValue <= 0) {
      return false;
    }
    if (childSkill.currentValue === undefined || childSkill.currentValue < 0) {
      return false;
    }
  }
  return true;
}

/**
 * Get the next milestone for a counter-based skill
 */
export function getNextMilestone(childSkill: ChildSkill, skill: Skill): number | null {
  if (skill.progressType === 'counter' && skill.targetValue) {
    const current = childSkill.currentValue || 0;
    const target = skill.targetValue;
    
    // Calculate milestones at 25%, 50%, 75%, and 100%
    const milestones = [
      Math.ceil(target * 0.25),
      Math.ceil(target * 0.5),
      Math.ceil(target * 0.75),
      target
    ];
    
    // Find the next milestone
    for (const milestone of milestones) {
      if (current < milestone) {
        return milestone;
      }
    }
  }
  return null;
}

/**
 * Get the progress history summary
 */
export function getProgressHistorySummary(childSkill: ChildSkill): {
  totalUpdates: number;
  lastUpdate: Date | null;
  averageProgress: number;
} {
  const history = childSkill.progressHistory || [];
  
  if (history.length === 0) {
    return {
      totalUpdates: 0,
      lastUpdate: null,
      averageProgress: 0
    };
  }
  
  const totalUpdates = history.length;
  const lastUpdate = history[history.length - 1]?.date || null;
  
  // Calculate average progress per update
  let totalProgress = 0;
  for (let i = 1; i < history.length; i++) {
    totalProgress += history[i].value - history[i - 1].value;
  }
  const averageProgress = history.length > 1 ? totalProgress / (history.length - 1) : 0;
  
  return {
    totalUpdates,
    lastUpdate,
    averageProgress
  };
} 
