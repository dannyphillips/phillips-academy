import { useState, useEffect } from "react";
import { Lock, LockOpen, CalendarDays, ListTodo, Loader2, Trophy } from "lucide-react";
import { Child } from "./types/types";
import { ChildDayView } from "./components/ChildDayView";
import { ChildWeekView } from "./components/ChildWeekView";
import { ParentView } from "./components/ParentView";
import { logout, isParentUser } from "./components/Auth";
import { useNavigate } from "react-router-dom";
import { getChildren, updateTaskCompletion } from "./services/database";

export function App() {
  const navigate = useNavigate();
  // Primary navigation toggles
  const [view, setView] = useState<'day' | 'week'>('day');
  
  // Child state
  const [activeChild, setActiveChild] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  // Constants
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = new Date().getDay();

  useEffect(() => {
    const loadChildren = async () => {
      try {
        const loadedChildren = await getChildren();
        setChildren(loadedChildren);
      } catch (error) {
        console.error('Error loading children:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, []);

  const handleTaskComplete = async (childId: string, assignmentId: string, dayIndex: number) => {
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
  };

  const handleLockClick = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

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
                {children.reduce((total, child) => total + (child.totalPoints || 0), 0)} Points
              </span>
            </div>
          </div>

          {/* View Toggle */}
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

          {isParentUser() ? (
            <ParentView
              children={children}
              setChildren={setChildren}
              daysOfWeek={daysOfWeek}
              currentDay={currentDay}
              view={view}
            />
          ) : (
            view === 'day' ? (
              <ChildDayView
                children={children}
                activeChild={activeChild}
                setActiveChild={setActiveChild}
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
          )}
          </div>
      </div>
    </div>
  );
}
