import { Loader2 } from 'lucide-react';
import { DashboardShell } from './components/DashboardShell';
import { DashboardContent } from './components/DashboardContent';
import { useAppData } from './hooks/useAppData';

export function App() {
  const {
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
  } = useAppData();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-farmhouse-cream">
        <Loader2 className="w-16 h-16 text-farmhouse-clay animate-spin opacity-80" />
      </div>
    );
  }

  return (
    <DashboardShell
      totalPoints={totalPoints}
      children={children}
      activeChild={activeChild}
      selectedDay={selectedDay}
      mode={mode}
      view={view}
      onLogout={handleLockClick}
      onChildChange={handleChildChange}
      onModeChange={setMode}
      onViewChange={setView}
      content={
        <DashboardContent
          mode={mode}
          view={view}
          children={children}
          setChildren={setChildren}
          activeChild={activeChild}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          currentDay={currentDay}
          selectedChild={selectedChild}
          childSkills={childSkills}
          onTaskComplete={handleTaskComplete}
          onChildDeleted={handleChildDeleted}
          onSkillToggle={handleSkillToggle}
          onSkillAdd={handleSkillAdd}
          onUpdateSkillProgress={handleUpdateSkillProgress}
        />
      }
    />
  );
}
