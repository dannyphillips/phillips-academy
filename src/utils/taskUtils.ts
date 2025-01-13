import { Child, TaskDefinition, UniqueTaskDefinition } from '../types/types';
import { TaskType } from '../constants/taskTypes';

// Color utility functions
const colorClasses: Record<string, { bg: string; muted: string }> = {
  sage: { bg: 'bg-farmhouse-sage', muted: 'border-farmhouse-sage/30 text-farmhouse-sage' },
  clay: { bg: 'bg-farmhouse-clay', muted: 'border-farmhouse-clay/30 text-farmhouse-clay' },
  teal: { bg: 'bg-farmhouse-teal', muted: 'border-farmhouse-teal/30 text-farmhouse-teal' },
  'dusty-blue': { bg: 'bg-farmhouse-dusty-blue', muted: 'border-farmhouse-dusty-blue/30 text-farmhouse-dusty-blue' },
  moss: { bg: 'bg-farmhouse-moss', muted: 'border-farmhouse-moss/30 text-farmhouse-moss' },
  stone: { bg: 'bg-farmhouse-stone', muted: 'border-farmhouse-stone/30 text-farmhouse-stone' },
  rust: { bg: 'bg-farmhouse-rust', muted: 'border-farmhouse-rust/30 text-farmhouse-rust' },
  slate: { bg: 'bg-farmhouse-slate', muted: 'border-farmhouse-slate/30 text-farmhouse-slate' },
  olive: { bg: 'bg-farmhouse-olive', muted: 'border-farmhouse-olive/30 text-farmhouse-olive' },
  taupe: { bg: 'bg-farmhouse-taupe', muted: 'border-farmhouse-taupe/30 text-farmhouse-taupe' },
  plum: { bg: 'bg-farmhouse-plum', muted: 'border-farmhouse-plum/30 text-farmhouse-plum' },
  sienna: { bg: 'bg-farmhouse-sienna', muted: 'border-farmhouse-sienna/30 text-farmhouse-sienna' }
};

export function getColorClasses(color: string) {
  return colorClasses[color] || colorClasses.sage;
}

export function getAllUniqueTaskDefinitions(children: Child[]): UniqueTaskDefinition[] {
  const uniqueTasks = new Map<string, UniqueTaskDefinition>();

  // Add all task definitions from children's assignments
  children.forEach(child => {
    child.taskAssignments.forEach(assignment => {
      const definition = assignment.definition;
      if (!uniqueTasks.has(definition.id)) {
        uniqueTasks.set(definition.id, {
          definition,
          assignedChildIds: [child.id]
        });
      } else {
        const existing = uniqueTasks.get(definition.id)!;
        if (!existing.assignedChildIds.includes(child.id)) {
          existing.assignedChildIds.push(child.id);
        }
      }
    });
  });

  return Array.from(uniqueTasks.values());
} 