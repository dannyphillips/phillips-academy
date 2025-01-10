import { useState } from "react";
import { Lock, LockOpen, CalendarDays, ListTodo } from "lucide-react";
import { Child } from "./types/types";
import { ChildDayView } from "./components/ChildDayView";
import { ChildWeekView } from "./components/ChildWeekView";
import { ParentView } from "./components/ParentView";
import { initialChildren } from "./data/initialData";
import { logout, isParentUser } from "./components/Auth";
import { useNavigate } from "react-router-dom";

export function App() {
  const navigate = useNavigate();
  // Primary navigation toggles
  const [view, setView] = useState<'day' | 'week'>('day');
  
  // Child state
  const [activeChild, setActiveChild] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [children, setChildren] = useState<Child[]>(initialChildren);

  // Constants
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = new Date().getDay();

  const handleTaskComplete = (childId: number, taskId: number) => {
    setChildren(
      children.map((child) =>
        child.id === childId
          ? {
              ...child,
              tasks: child.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      completed: !task.completed,
                      streak: !task.completed ? task.streak + 1 : 0,
                      points: !task.completed
                        ? task.points + task.streak * 2
                        : task.points,
                    }
                  : task,
              ),
              totalPoints: !child.tasks.find((t) => t.id === taskId)?.completed
                ? child.totalPoints +
                  (child.tasks.find((t) => t.id === taskId)?.points || 0)
                : child.totalPoints,
            }
          : child,
      ),
    );
  };

  const handleLockClick = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-farmhouse-cream">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <img 
              src="/phillips-academy/assets/logo.png" 
              alt="Phillips Homeschool Academy" 
              className="h-24 w-auto object-contain"
            />
            {/* Lock Toggle */}
            <button
              onClick={handleLockClick}
              className={`nav-toggle !px-3 ${isParentUser() ? 'nav-toggle-active' : ''}`}
              title={isParentUser() ? "Parent Mode (Click to Logout)" : "Kid Mode (Click to Logout)"}
            >
              {isParentUser() ? (
                <LockOpen className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center">
            <div className="nav-container">
              <button
                onClick={() => setView('day')}
                className={`nav-toggle ${view === 'day' ? 'nav-toggle-active' : ''}`}
              >
                <ListTodo className="w-4 h-4" />
                Day View
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
