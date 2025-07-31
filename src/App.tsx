import { useState, useEffect, useCallback, useMemo } from "react";
import { Lock, LockOpen, CalendarDays, ListTodo, Loader2, Trophy } from "lucide-react";
import { Child, ChildSkill } from "./types/types";
import { ChildDayView } from "./components/ChildDayView";
import { ChildWeekView } from "./components/ChildWeekView";
import { ParentView } from "./components/ParentView";
import { SkillsView } from "./components/SkillsView";
import { ModeToggle } from "./components/ModeToggle";
import { logout, isParentUser } from "./components/Auth";
import { useNavigate } from "react-router-dom";
import { 
  getChildrenWithTasks, 
  updateTaskCompletion,
  getAllChildSkills, 
  addChildSkill, 
  toggleSkillCompletion,
  updateSkillProgress
} from "./services/database";

export function App() {
  const navigate = useNavigate();
  // Primary navigation toggles
  const [view, setView] = useState<'day' | 'week'>('day');
  const [mode, setMode] = useState<'tasks' | 'skills'>('tasks');
  
  // Child state
  const [activeChild, setActiveChild] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [children, setChildren] = useState<Child[]>([]);
  const [allChildSkills, setAllChildSkills] = useState<ChildSkill[]>([]);
  const [loading, setLoading] = useState(true);

  // Constants
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = new Date().getDay();

  // Memoize the selected child to prevent unnecessary re-renders
  const selectedChild = useMemo(() => {
    return children[activeChild] || null;
  }, [children, activeChild]);

  // Memoize skills for the selected child
  const childSkills = useMemo(() => {
    if (!selectedChild) return [];
    return allChildSkills.filter(skill => skill.childId === selectedChild.id);
  }, [allChildSkills, selectedChild]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load children and skills in parallel
        const [loadedChildren, loadedSkills] = await Promise.all([
          getChildrenWithTasks(),
          getAllChildSkills()
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

  const handleTaskComplete = useCallback(async (childId: string, assignmentId: string, dayIndex: number) => {
    const child = children.find(c => c.id === childId);
    const assignment = child?.taskAssignments.find(t => t.id === assignmentId);
    
    if (!child || !assignment) return;

    // Calculate the date for this completion
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Get start of week (Sunday)
    const completionDate = new Date(currentWeekStart);
    completionDate.setDate(currentWeekStart.getDate() + dayIndex);
    const completionKey = completionDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Get the current completion state for this specific day
    const isCurrentlyCompleted = assignment.completions?.[completionKey] || false;
    const newCompleted = !isCurrentlyCompleted;

    // Calculate streak and points
    const newStreak = newCompleted ? assignment.streak + 1 : 0;
    const points = assignment.points;

    // Optimistically update the UI
    const updatedChildren = children.map((c) =>
      c.id === childId
        ? {
            ...c,
            taskAssignments: c.taskAssignments.map((t) =>
              t.id === assignmentId
                ? {
                    ...t,
                    completions: {
                      ...(t.completions || {}),
                      [completionKey]: newCompleted
                    },
                    streak: newStreak
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
      // Make the database update in the background
      await updateTaskCompletion(assignmentId, newCompleted, newStreak, points, dayIndex);
    } catch (error) {
      console.error('Error updating task:', error);
      // Revert to the previous state if the update fails
      setChildren(children);
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
    try {
      await toggleSkillCompletion(skillId, isCompleted);
      
      // Update local state
      setAllChildSkills(prev => 
        prev.map(skill => 
          skill.skillId === skillId 
            ? { ...skill, isCompleted, completedAt: isCompleted ? new Date() : undefined }
            : skill
        )
      );
    } catch (error) {
      console.error('Error toggling skill completion:', error);
      
      // Fallback: Update locally
      setAllChildSkills(prev => 
        prev.map(skill => 
          skill.skillId === skillId 
            ? { ...skill, isCompleted, completedAt: isCompleted ? new Date() : undefined }
            : skill
        )
      );
      
      alert('Note: Skill updated locally due to connection issues. Changes may not be saved permanently.');
    }
  }, []);

  const handleSkillAdd = useCallback(async (skillId: string) => {
    if (!selectedChild) return;
    
    try {
      // Get the skill definition to set proper progress configuration
      const { getSkillById } = await import('./data/skills');
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
        progressHistory: []
      };
      
      try {
        const newSkill = await addChildSkill(skillData);
        setAllChildSkills(prev => [...prev, newSkill]);
      } catch (firestoreError) {
        console.warn('Firestore operation failed, using local storage fallback:', firestoreError);
        
        // Fallback: Create skill locally
        const localSkill: ChildSkill = {
          ...skillData,
          startedAt: new Date(),
          isCompleted: false,
          currentValue: 0,
          progressHistory: []
        };
        
        setAllChildSkills(prev => [...prev, localSkill]);
        
        // Show a warning to the user
        alert('Note: Skill added locally due to connection issues. Progress may not be saved permanently.');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Error adding skill. Please try again or check your connection.');
    }
  }, [selectedChild]);

  const handleUpdateSkillProgress = useCallback(async (skillId: string, newValue: number, notes?: string) => {
    try {
      await updateSkillProgress(skillId, newValue, notes);
      
      // Update local state
      setAllChildSkills(prev => 
        prev.map(skill => 
          skill.skillId === skillId 
            ? { 
                ...skill, 
                currentValue: newValue,
                isCompleted: skill.targetValue ? newValue >= skill.targetValue : skill.isCompleted,
                completedAt: skill.targetValue && newValue >= skill.targetValue ? new Date() : skill.completedAt,
                progressHistory: [
                  ...(skill.progressHistory || []),
                  { date: new Date(), value: newValue, notes }
                ]
              }
            : skill
        )
      );
    } catch (error) {
      console.error('Error updating skill progress:', error);
      
      // Fallback: Update locally
      setAllChildSkills(prev => 
        prev.map(skill => 
          skill.skillId === skillId 
            ? { 
                ...skill, 
                currentValue: newValue,
                isCompleted: skill.targetValue ? newValue >= skill.targetValue : skill.isCompleted,
                completedAt: skill.targetValue && newValue >= skill.targetValue ? new Date() : skill.completedAt,
                progressHistory: [
                  ...(skill.progressHistory || []),
                  { date: new Date(), value: newValue, notes }
                ]
              }
            : skill
        )
      );
      
      alert('Note: Progress updated locally due to connection issues. Changes may not be saved permanently.');
    }
  }, []);

  const handleChildChange = useCallback(async (childIndex: number) => {
    setActiveChild(childIndex);
    // No need to load skills separately since we have all skills loaded
  }, []);

  // Memoize total points calculation
  const totalPoints = useMemo(() => {
    return children.reduce((total, child) => total + (child.totalPoints || 0), 0);
  }, [children]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-farmhouse-cream">
        <Loader2 className="w-16 h-16 text-farmhouse-clay animate-spin opacity-80" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-farmhouse-cream">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <img 
              src="/phillips-academy/assets/logo-circle-crop.png" 
              alt="Phillips Homeschool Academy" 
              className="h-24 w-auto object-contain"
            />
            {/* Lock Toggle */}
            <button
              onClick={handleLockClick}
              className={`nav-toggle !px-3 flex items-center gap-2 ${isParentUser() ? 'nav-toggle-active' : ''}`}
              title={isParentUser() ? "Parent Mode (Click to Logout)" : "Kid Mode (Click to Logout)"}
            >
              {isParentUser() ? (
                <>
                  <LockOpen className="w-5 h-5" />
                  <span>Go to Child Mode</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Go to Parent Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Combined Score Display */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-farmhouse-clay" />
              <span className="text-2xl font-bold text-farmhouse-navy">
                {totalPoints} Points
              </span>
            </div>
          </div>

          {/* Mode Toggle */}
          <ModeToggle mode={mode} onModeChange={setMode} />

          {/* View Toggle - Only show for tasks mode */}
          {mode === 'tasks' && (
            <div className="flex justify-center">
              <div className="nav-container">
                <button
                  onClick={() => setView('day')}
                  className={`nav-toggle ${view === 'day' ? 'nav-toggle-active' : ''}`}
                >
                  <ListTodo className="w-4 h-4" />
                  List View
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`nav-toggle ${view === 'week' ? 'nav-toggle-active' : ''}`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Week View
                </button>
              </div>
            </div>
          )}

          {isParentUser() ? (
            mode === 'tasks' ? (
              <ParentView
                children={children}
                setChildren={setChildren}
                daysOfWeek={daysOfWeek}
                currentDay={currentDay}
                view={view}
              />
            ) : (
              <SkillsView
                selectedChild={selectedChild}
                childSkills={childSkills}
                onSkillToggle={handleSkillToggle}
                onSkillAdd={handleSkillAdd}
                onUpdateSkillProgress={handleUpdateSkillProgress}
              />
            )
          ) : (
            mode === 'tasks' ? (
              view === 'day' ? (
                <ChildDayView
                  children={children}
                  activeChild={activeChild}
                  setActiveChild={handleChildChange}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  daysOfWeek={daysOfWeek}
                  handleTaskComplete={handleTaskComplete}
                />
              ) : (
                <ChildWeekView
                  children={children}
                  handleTaskComplete={handleTaskComplete}
                  daysOfWeek={daysOfWeek}
                  currentDay={currentDay}
                />
              )
            ) : (
              <SkillsView
                selectedChild={selectedChild}
                childSkills={childSkills}
                onSkillToggle={handleSkillToggle}
                onSkillAdd={handleSkillAdd}
                onUpdateSkillProgress={handleUpdateSkillProgress}
              />
            )
          )}
          </div>
      </div>
    </div>
  );
}
