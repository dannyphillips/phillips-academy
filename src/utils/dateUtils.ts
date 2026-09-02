/** Get the ISO date key (YYYY-MM-DD) for a day index in the current week (Sunday = 0). */
export function getCompletionDateKey(dayIndex: number): string {
  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay());
  const completionDate = new Date(currentWeekStart);
  completionDate.setDate(currentWeekStart.getDate() + dayIndex);
  return completionDate.toISOString().split('T')[0];
}
