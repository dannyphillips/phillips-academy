import { lazy, Suspense, type Dispatch, type SetStateAction } from 'react';
import { Loader2 } from 'lucide-react';
import { Child, ChildSkill } from '../types/types';
import { isParentUser } from '../services/auth';
import { DAYS_OF_WEEK } from '../constants/daysOfWeek';

const ChildDayView = lazy(() =>
  import('./ChildDayView').then(m => ({ default: m.ChildDayView }))
);
const ChildWeekView = lazy(() =>
  import('./ChildWeekView').then(m => ({ default: m.ChildWeekView }))
);
const ParentView = lazy(() =>
  import('./ParentView').then(m => ({ default: m.ParentView }))
);
const SkillsView = lazy(() =>
  import('./SkillsView').then(m => ({ default: m.SkillsView }))
);

interface DashboardContentProps {
  mode: 'tasks' | 'skills';
  view: 'day' | 'week';
  children: Child[];
  setChildren: Dispatch<SetStateAction<Child[]>>;
  activeChild: number;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  currentDay: number;
  selectedChild: Child | null;
  childSkills: ChildSkill[];
  onTaskComplete: (childId: string, assignmentId: string, dayIndex: number) => void;
  onChildDeleted: (childId: string) => void;
  onSkillToggle: (skillId: string, isCompleted: boolean) => Promise<void>;
  onSkillAdd: (skillId: string) => void;
  onUpdateSkillProgress: (skillId: string, newValue: number, notes?: string) => Promise<void>;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="w-6 h-6 animate-spin text-farmhouse-navy" />
    </div>
  );
}

function SkillsPanel({
  selectedChild,
  childSkills,
  onSkillToggle,
  onSkillAdd,
  onUpdateSkillProgress,
}: Pick<
  DashboardContentProps,
  'selectedChild' | 'childSkills' | 'onSkillToggle' | 'onSkillAdd' | 'onUpdateSkillProgress'
>) {
  return (
    <SkillsView
      selectedChild={selectedChild}
      childSkills={childSkills}
      onSkillToggle={onSkillToggle}
      onSkillAdd={onSkillAdd}
      onUpdateSkillProgress={onUpdateSkillProgress}
    />
  );
}

export function DashboardContent(props: DashboardContentProps) {
  const {
    mode,
    view,
    children,
    setChildren,
    activeChild,
    selectedDay,
    setSelectedDay,
    currentDay,
    selectedChild,
    childSkills,
    onTaskComplete,
    onChildDeleted,
    onSkillToggle,
    onSkillAdd,
    onUpdateSkillProgress,
  } = props;

  return (
    <Suspense fallback={<LoadingFallback />}>
      {isParentUser() ? (
        mode === 'tasks' ? (
          <ParentView
            children={children}
            setChildren={setChildren}
            daysOfWeek={[...DAYS_OF_WEEK]}
            currentDay={currentDay}
            view={view}
            onChildDeleted={onChildDeleted}
          />
        ) : (
          <SkillsPanel
            selectedChild={selectedChild}
            childSkills={childSkills}
            onSkillToggle={onSkillToggle}
            onSkillAdd={onSkillAdd}
            onUpdateSkillProgress={onUpdateSkillProgress}
          />
        )
      ) : mode === 'tasks' ? (
        view === 'day' ? (
          <ChildDayView
            children={children}
            activeChild={activeChild}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            daysOfWeek={[...DAYS_OF_WEEK]}
            handleTaskComplete={onTaskComplete}
          />
        ) : (
          <ChildWeekView
            children={children}
            handleTaskComplete={onTaskComplete}
            daysOfWeek={[...DAYS_OF_WEEK]}
            currentDay={currentDay}
          />
        )
      ) : (
        <SkillsPanel
          selectedChild={selectedChild}
          childSkills={childSkills}
          onSkillToggle={onSkillToggle}
          onSkillAdd={onSkillAdd}
          onUpdateSkillProgress={onUpdateSkillProgress}
        />
      )}
    </Suspense>
  );
}
