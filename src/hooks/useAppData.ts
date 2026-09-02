import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Child, ChildSkill } from '../types/types';
import { getSkillById } from '../data/skills';
import { logout } from '../services/auth';
import { getCompletionDateKey } from '../utils/dateUtils';
import {
  getChildrenWithTasks,
  updateTaskCompletion,
  getAllChildSkills,
  addChildSkill,
  toggleSkillCompletion,
  updateSkillProgress,
} from '../services/database';

export function useAppData() {
  const navigate = useNavigate();

  const [view, setView] = useState<'day' | 'week'>('day');
  const [mode, setMode] = useState<'tasks' | 'skills'>('tasks');
  const [activeChild, setActiveChild] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [children, setChildren] = useState<Child[]>([]);
  const [allChildSkills, setAllChildSkills] = useState<ChildSkill[]>([]);
  const [loading, setLoading] = useState(true);

  const currentDay = new Date().getDay();

  const selectedChild = useMemo(
    () => children[activeChild] || null,
    [children, activeChild]
  );

  const childSkills = useMemo(() => {
    if (!selectedChild) return [];
    return allChildSkills.filter(skill => skill.childId === selectedChild.id);
  }, [allChildSkills, selectedChild]);

  const totalPoints = useMemo(
    () => children.reduce((total, child) => total + (child.totalPoints || 0), 0),
    [children]
  );

  useEffect(() => {
    if (activeChild >= children.length && children.length > 0) {
      setActiveChild(children.length - 1);
    }
  }, [children.length, activeChild]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedChildren, loadedSkills] = await Promise.all([
          getChildrenWithTasks(),
          getAllChildSkills(),
        ]);
        setChildren(loadedChildren);
        setAllChildSkills(loadedSkills);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTaskComplete = useCallback(async (
    childId: string,
    assignmentId: string,
    dayIndex: number
  ) => {
    const child = children.find(c => c.id === childId);
    const assignment = child?.taskAssignments.find(t => t.id === assignmentId);

    if (!child || !assignment) return;

    const completionKey = getCompletionDateKey(dayIndex);
    const isCurrentlyCompleted = assignment.completions?.[completionKey] || false;
    const newCompleted = !isCurrentlyCompleted;
    const newStreak = newCompleted ? assignment.streak + 1 : 0;
    const points = assignment.points;

    const previousChildren = children;
    const updatedChildren = children.map(c =>
      c.id === childId
        ? {
            ...c,
            taskAssignments: c.taskAssignments.map(t =>
              t.id === assignmentId
                ? {
                    ...t,
                    completions: {
                      ...(t.completions || {}),
                      [completionKey]: newCompleted,
                    },
                    streak: newStreak,
                  }
                : t
            ),
            totalPoints: newCompleted
              ? c.totalPoints + points
              : c.totalPoints - points,
          }
        : c
    );
    setChildren(updatedChildren);

    try {
      await updateTaskCompletion(assignmentId, newCompleted, newStreak, points, dayIndex);
    } catch (error) {
      console.error('Error updating task:', error);
      setChildren(previousChildren);
    }
  }, [children]);

  const handleLockClick = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }, [navigate]);

  const handleSkillToggle = useCallback(async (skillId: string, isCompleted: boolean) => {
    if (!selectedChild) return;

    const childId = selectedChild.id;
    const skillDefinition = getSkillById(skillId);
    const targetValue = skillDefinition?.targetValue;

    try {
      await toggleSkillCompletion(childId, skillId, isCompleted);

      setAllChildSkills(prev =>
        prev.map(skill =>
          skill.childId === childId && skill.skillId === skillId
            ? {
                ...skill,
                isCompleted,
                completedAt: isCompleted ? new Date() : undefined,
                currentValue: isCompleted && targetValue ? targetValue : skill.currentValue,
              }
            : skill
        )
      );
    } catch (error) {
      console.error('Error toggling skill completion:', error);
      alert('Error updating skill. Please check your connection and try again.');
    }
  }, [selectedChild]);

  const handleSkillAdd = useCallback(async (skillId: string) => {
    if (!selectedChild) return;

    try {
      const skillDefinition = getSkillById(skillId);
      if (!skillDefinition) {
        throw new Error('Skill definition not found');
      }

      const skillData = {
        childId: selectedChild.id,
        skillId,
        isCompleted: false,
        startedAt: new Date(),
        progressType: skillDefinition.progressType,
        targetValue: skillDefinition.targetValue,
        currentValue: 0,
        progressHistory: [],
      };

      try {
        const newSkill = await addChildSkill(skillData);
        setAllChildSkills(prev => [...prev, newSkill]);
      } catch (firestoreError) {
        console.warn('Firestore operation failed, using local fallback:', firestoreError);

        const localSkill: ChildSkill = {
          id: `${selectedChild.id}_${skillId}`,
          ...skillData,
          startedAt: new Date(),
          isCompleted: false,
          currentValue: 0,
          progressHistory: [],
        };

        setAllChildSkills(prev => [...prev, localSkill]);
        alert('Note: Skill added locally due to connection issues. Progress may not be saved permanently.');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Error adding skill. Please try again or check your connection.');
    }
  }, [selectedChild]);

  const handleUpdateSkillProgress = useCallback(async (
    skillId: string,
    newValue: number,
    notes?: string
  ) => {
    if (!selectedChild) return;

    const childId = selectedChild.id;

    try {
      await updateSkillProgress(childId, skillId, newValue, notes);

      setAllChildSkills(prev =>
        prev.map(skill =>
          skill.childId === childId && skill.skillId === skillId
            ? {
                ...skill,
                currentValue: newValue,
                isCompleted: skill.targetValue ? newValue >= skill.targetValue : skill.isCompleted,
                completedAt:
                  skill.targetValue && newValue >= skill.targetValue
                    ? new Date()
                    : skill.completedAt,
                progressHistory: [
                  ...(skill.progressHistory || []),
                  { date: new Date(), value: newValue, notes },
                ],
              }
            : skill
        )
      );
    } catch (error) {
      console.error('Error updating skill progress:', error);
      alert('Error updating progress. Please check your connection and try again.');
    }
  }, [selectedChild]);

  const handleChildDeleted = useCallback((childId: string) => {
    setAllChildSkills(prev => prev.filter(skill => skill.childId !== childId));
  }, []);

  const handleChildChange = useCallback((childIndex: number) => {
    setActiveChild(childIndex);
  }, []);

  return {
    view,
    setView,
    mode,
    setMode,
    activeChild,
    selectedDay,
    setSelectedDay,
    children,
    setChildren,
    loading,
    currentDay,
    selectedChild,
    childSkills,
    totalPoints,
    handleTaskComplete,
    handleLockClick,
    handleSkillToggle,
    handleSkillAdd,
    handleUpdateSkillProgress,
    handleChildDeleted,
    handleChildChange,
  };
}
