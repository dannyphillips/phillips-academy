import { useState } from "react";
import { User, Users, CalendarDays, ListTodo } from "lucide-react";
import { Child } from "./types/types";
import { ChildView } from "./components/ChildView";
import { ParentOverview } from "./components/ParentOverview";
import { TaskManager } from "./components/TaskManager";
import { initialChildren } from "./data/initialData.tsx";

export function App() {
  const [isParentView, setIsParentView] = useState(false);
  const [activeChild, setActiveChild] = useState(0);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [isTaskManager, setIsTaskManager] = useState(false);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = new Date().getDay();
  const [children, setChildren] = useState<Child[]>(initialChildren);

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

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <div className="nav-container">
              <button
                onClick={() => setIsParentView(false)}
                className={`nav-toggle ${!isParentView ? 'nav-toggle-active' : ''}`}
              >
                <User className="w-4 h-4" />
                Kid Mode
              </button>
              <button
                onClick={() => setIsParentView(true)}
                className={`nav-toggle ${isParentView ? 'nav-toggle-active' : ''}`}
              >
                <Users className="w-4 h-4" />
                Parent Mode
              </button>
            </div>
            {isParentView && (
              <div className="nav-container">
                <button
                  onClick={() => setIsTaskManager(false)}
                  className={`nav-toggle ${!isTaskManager ? 'nav-toggle-active' : ''}`}
                >
                  <CalendarDays className="w-4 h-4" />
                  Week View
                </button>
                <button
                  onClick={() => setIsTaskManager(true)}
                  className={`nav-toggle ${isTaskManager ? 'nav-toggle-active' : ''}`}
                >
                  <ListTodo className="w-4 h-4" />
                  Task Manager
                </button>
              </div>
            )}
          </div>
        </div>
        {isParentView ? (
          isTaskManager ? (
            <TaskManager
              children={children}
              setChildren={setChildren}
              setIsTaskManager={setIsTaskManager}
              daysOfWeek={daysOfWeek}
              currentDay={currentDay}
            />
          ) : (
            <ParentOverview
              children={children}
              setIsParentView={setIsParentView}
              handleTaskComplete={handleTaskComplete}
              daysOfWeek={daysOfWeek}
              currentDay={currentDay}
            />
          )
        ) : (
          <ChildView
            children={children}
            activeChild={activeChild}
            setActiveChild={setActiveChild}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            daysOfWeek={daysOfWeek}
            handleTaskComplete={handleTaskComplete}
          />
        )}
      </div>
    </div>
  );
}
