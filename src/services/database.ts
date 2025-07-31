import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc,
  query,
  where,
  addDoc,
  deleteDoc,
  getDoc,
  increment,
  writeBatch
} from 'firebase/firestore';
import { 
  Child, 
  FirestoreChild, 
  TaskDefinition,
  TaskAssignment,
  FirestoreTaskDefinition,
  FirestoreTaskAssignment,
  ChildSkill
} from '../types/types';
import { taskTemplates } from '../data/taskTemplates';

// Collections
const CHILDREN_COLLECTION = 'children';
const TASK_DEFINITIONS_COLLECTION = 'taskDefinitions';
const TASK_ASSIGNMENTS_COLLECTION = 'taskAssignments';
const CHILD_SKILLS_COLLECTION = 'childSkills';

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

// Helper function to deduplicate requests
function deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }
  
  const promise = requestFn();
  pendingRequests.set(key, promise);
  
  promise.finally(() => {
    pendingRequests.delete(key);
  });
  
  return promise;
}

// Helper function to convert Firestore data to our app's data structure
const convertFirestoreDataToChild = async (
  childDoc: FirestoreChild & { id: string }
): Promise<Child> => {
  // Get all task assignments for this child
  const assignmentsSnapshot = await getDocs(
    query(collection(db, TASK_ASSIGNMENTS_COLLECTION), where('childId', '==', childDoc.id))
  );

  const taskAssignments: (TaskAssignment & { definition: TaskDefinition })[] = [];

  for (const assignmentDoc of assignmentsSnapshot.docs) {
    const assignment = {
      id: assignmentDoc.id,
      ...assignmentDoc.data()
    } as TaskAssignment;

    // Get the task definition
    const definitionDoc = await getDoc(doc(db, TASK_DEFINITIONS_COLLECTION, assignment.taskDefinitionId));
    if (definitionDoc.exists()) {
      const definition = {
        id: definitionDoc.id,
        ...definitionDoc.data()
      } as TaskDefinition;

      taskAssignments.push({
        ...assignment,
        definition
      });
    }
  }

  return {
    id: childDoc.id,
    name: childDoc.name,
    age: childDoc.age,
    color: childDoc.color,
    totalPoints: childDoc.totalPoints,
    taskAssignments
  };
};

// Get all children with their task assignments and definitions
export async function getChildren(): Promise<Child[]> {
  return deduplicateRequest('getChildren', async () => {
    try {
      const querySnapshot = await getDocs(collection(db, CHILDREN_COLLECTION));
      const children: Child[] = [];

      for (const doc of querySnapshot.docs) {
        const childData = doc.data() as FirestoreChild;
        const child = await convertFirestoreDataToChild({ ...childData, id: doc.id });
        children.push(child);
      }

      return children;
    } catch (error) {
      console.error('Error getting children:', error);
      throw error;
    }
  });
}

// Get all task definitions
export async function getTaskDefinitions(): Promise<TaskDefinition[]> {
  try {
    const querySnapshot = await getDocs(collection(db, TASK_DEFINITIONS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TaskDefinition));
  } catch (error) {
    console.error('Error getting task definitions:', error);
    throw error;
  }
}

// Add a new task definition
export async function addTaskDefinition(
  taskDefinition: Omit<TaskDefinition, 'id'>
): Promise<TaskDefinition> {
  try {
    const docRef = await addDoc(collection(db, TASK_DEFINITIONS_COLLECTION), taskDefinition);
    return {
      id: docRef.id,
      ...taskDefinition
    };
  } catch (error) {
    console.error('Error adding task definition:', error);
    throw error;
  }
}

// Update a task definition
export async function updateTaskDefinition(
  taskDefinitionId: string,
  updates: Partial<Omit<TaskDefinition, 'id'>>
): Promise<void> {
  try {
    await updateDoc(doc(db, TASK_DEFINITIONS_COLLECTION, taskDefinitionId), updates);
  } catch (error) {
    console.error('Error updating task definition:', error);
    throw error;
  }
}

// Delete a task definition and all its assignments
export async function deleteTaskDefinition(taskDefinitionId: string): Promise<void> {
  try {
    const batch = writeBatch(db);

    // Delete all assignments for this task definition
    const assignmentsSnapshot = await getDocs(
      query(collection(db, TASK_ASSIGNMENTS_COLLECTION), 
        where('taskDefinitionId', '==', taskDefinitionId)
      )
    );

    assignmentsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Delete the task definition itself
    const taskDefRef = doc(db, TASK_DEFINITIONS_COLLECTION, taskDefinitionId);
    batch.delete(taskDefRef);

    // Commit all the deletes in one batch
    await batch.commit();
  } catch (error) {
    console.error('Error deleting task definition:', error);
    throw error;
  }
}

// Add a task assignment
export async function addTaskAssignment(
  assignment: Omit<TaskAssignment, 'id'>
): Promise<TaskAssignment> {
  try {
    const docRef = await addDoc(collection(db, TASK_ASSIGNMENTS_COLLECTION), assignment);
    return {
      id: docRef.id,
      ...assignment
    };
  } catch (error) {
    console.error('Error adding task assignment:', error);
    throw error;
  }
}

// Update a task assignment
export async function updateTaskAssignment(
  assignmentId: string,
  updates: Partial<Omit<TaskAssignment, 'id' | 'taskDefinitionId' | 'childId'>>
): Promise<void> {
  try {
    // Only update the fields that are provided
    const validUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    await updateDoc(doc(db, TASK_ASSIGNMENTS_COLLECTION, assignmentId), validUpdates);
  } catch (error) {
    console.error('Error updating task assignment:', error);
    throw error;
  }
}

// Delete a task assignment
export async function deleteTaskAssignment(assignmentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TASK_ASSIGNMENTS_COLLECTION, assignmentId));
  } catch (error) {
    console.error('Error deleting task assignment:', error);
    throw error;
  }
}

// Update task completion status
export const updateTaskCompletion = async (
  assignmentId: string,
  completed: boolean,
  streak: number,
  points: number,
  dayIndex: number
): Promise<void> => {
  try {
    const assignmentRef = doc(db, TASK_ASSIGNMENTS_COLLECTION, assignmentId);
    const assignmentDoc = await getDoc(assignmentRef);
    
    if (!assignmentDoc.exists()) {
      throw new Error('Task assignment not found');
    }
    
    const assignment = assignmentDoc.data() as FirestoreTaskAssignment;
    
    // Calculate the date for this completion
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Get start of week (Sunday)
    const completionDate = new Date(currentWeekStart);
    completionDate.setDate(currentWeekStart.getDate() + dayIndex);
    const completionKey = completionDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Update both documents in parallel
    await Promise.all([
      // Update assignment completion
      updateDoc(assignmentRef, {
        [`completions.${completionKey}`]: completed,
        streak,
        points
      }),
      // Update child points
      updateDoc(doc(db, CHILDREN_COLLECTION, assignment.childId), {
        totalPoints: increment(completed ? points : -points)
      })
    ]);
  } catch (error) {
    console.error('Error updating task completion:', error);
    throw error;
  }
};

// Add a new child
export async function addChild(child: Omit<Child, 'id' | 'taskAssignments'>): Promise<Child> {
  try {
    const childRef = await addDoc(collection(db, CHILDREN_COLLECTION), {
      name: child.name,
      age: child.age,
      color: child.color,
      totalPoints: 0
    });

    return {
      id: childRef.id,
      name: child.name,
      age: child.age,
      color: child.color,
      totalPoints: 0,
      taskAssignments: []
    };
  } catch (error) {
    console.error('Error adding child:', error);
    throw error;
  }
}

// Update a child
export async function updateChild(
  childId: string,
  updates: Partial<Omit<Child, 'id' | 'taskAssignments'>>
): Promise<void> {
  try {
    await updateDoc(doc(db, CHILDREN_COLLECTION, childId), updates);
  } catch (error) {
    console.error('Error updating child:', error);
    throw error;
  }
}

// Delete a child and all their task assignments
export async function deleteChild(childId: string): Promise<void> {
  try {
    const batch = writeBatch(db);
    
    // Delete all task assignments for this child
    const assignmentsSnapshot = await getDocs(
      query(collection(db, TASK_ASSIGNMENTS_COLLECTION), where('childId', '==', childId))
    );
    
    assignmentsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete the child
    batch.delete(doc(db, CHILDREN_COLLECTION, childId));
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting child:', error);
    throw error;
  }
}

export async function initializeTaskDefinitions(): Promise<void> {
  try {
    const batch = writeBatch(db);
    const existingDefs = await getTaskDefinitions();
    
    // Only add templates that don't already exist (matching by title)
    const existingTitles = new Set(existingDefs.map(def => def.title));
    
    Object.values(taskTemplates).flat().forEach(template => {
      if (!existingTitles.has(template.title)) {
        const definitionRef = doc(collection(db, TASK_DEFINITIONS_COLLECTION));
        batch.set(definitionRef, template);
      }
    });

    await batch.commit();
    console.log('Task definitions initialized successfully');
  } catch (error) {
    console.error('Error initializing task definitions:', error);
    throw error;
  }
} 

// Skills-related functions

// Get all skills for all children (bulk operation)
export async function getAllChildSkills(): Promise<ChildSkill[]> {
  return deduplicateRequest('getAllChildSkills', async () => {
    try {
      const querySnapshot = await getDocs(collection(db, CHILD_SKILLS_COLLECTION));
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          childId: data.childId,
          skillId: data.skillId,
          isCompleted: data.isCompleted,
          startedAt: data.startedAt.toDate(),
          completedAt: data.completedAt?.toDate(),
          notes: data.notes,
          progressType: data.progressType || 'boolean',
          targetValue: data.targetValue,
          currentValue: data.currentValue || 0,
          progressHistory: data.progressHistory?.map((entry: any) => ({
            date: entry.date.toDate(),
            value: entry.value,
            notes: entry.notes
          })) || []
        } as ChildSkill;
      });
    } catch (error) {
      console.error('Error getting all child skills:', error);
      throw error;
    }
  });
}

// Get all skills for a child (keep for backward compatibility)
export async function getChildSkills(childId: string): Promise<ChildSkill[]> {
  return deduplicateRequest(`getChildSkills:${childId}`, async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, CHILD_SKILLS_COLLECTION), where('childId', '==', childId))
      );
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          childId: data.childId,
          skillId: data.skillId,
          isCompleted: data.isCompleted,
          startedAt: data.startedAt.toDate(),
          completedAt: data.completedAt?.toDate(),
          notes: data.notes,
          progressType: data.progressType || 'boolean',
          targetValue: data.targetValue,
          currentValue: data.currentValue || 0,
          progressHistory: data.progressHistory?.map((entry: any) => ({
            date: entry.date.toDate(),
            value: entry.value,
            notes: entry.notes
          })) || []
        } as ChildSkill;
      });
    } catch (error) {
      console.error('Error getting child skills:', error);
      throw error;
    }
  });
}

// Add a skill for a child
export async function addChildSkill(
  childSkill: Omit<ChildSkill, 'id'>
): Promise<ChildSkill> {
  try {
    // Prepare the data for Firestore, ensuring proper Date handling
    const firestoreData = {
      childId: childSkill.childId,
      skillId: childSkill.skillId,
      isCompleted: childSkill.isCompleted || false,
      startedAt: new Date(), // Always use current date for new skills
      completedAt: childSkill.completedAt ? new Date(childSkill.completedAt) : null,
      notes: childSkill.notes || null,
      progressType: childSkill.progressType || 'boolean',
      targetValue: childSkill.targetValue || null,
      currentValue: childSkill.currentValue || 0,
      progressHistory: childSkill.progressHistory || []
    };
    
    const docRef = await addDoc(collection(db, CHILD_SKILLS_COLLECTION), firestoreData);
    
    return {
      ...childSkill,
      startedAt: new Date(),
      isCompleted: false,
      currentValue: childSkill.currentValue || 0,
      progressHistory: childSkill.progressHistory || []
    };
  } catch (error) {
    console.error('Error adding child skill:', error);
    
    // Check if it's a permission error
    if (error instanceof Error && error.message.includes('permission')) {
      console.error('Permission denied. This might be due to Firestore rules not being deployed.');
      throw new Error('Permission denied. Please ensure Firestore rules are properly configured.');
    }
    
    throw error;
  }
}

// Update a child skill
export async function updateChildSkill(
  skillId: string,
  updates: Partial<Omit<ChildSkill, 'id' | 'childId' | 'skillId'>>
): Promise<void> {
  try {
    const validUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    await updateDoc(doc(db, CHILD_SKILLS_COLLECTION, skillId), validUpdates);
  } catch (error) {
    console.error('Error updating child skill:', error);
    throw error;
  }
}

// Toggle skill completion (for boolean skills)
export async function toggleSkillCompletion(
  skillId: string,
  isCompleted: boolean
): Promise<void> {
  try {
    const updates: Partial<ChildSkill> = {
      isCompleted,
      completedAt: isCompleted ? new Date() : undefined
    };
    
    await updateChildSkill(skillId, updates);
  } catch (error) {
    console.error('Error toggling skill completion:', error);
    throw error;
  }
}

// Update skill progress (for counter skills)
export async function updateSkillProgress(
  skillId: string,
  newValue: number,
  notes?: string
): Promise<void> {
  try {
    const skillRef = doc(db, CHILD_SKILLS_COLLECTION, skillId);
    const skillDoc = await getDoc(skillRef);
    
    if (!skillDoc.exists()) {
      throw new Error('Skill not found');
    }
    
    const skillData = skillDoc.data();
    const currentValue = skillData.currentValue || 0;
    const targetValue = skillData.targetValue;
    const progressHistory = skillData.progressHistory || [];
    
    // Add new progress entry
    const newEntry = {
      date: new Date(),
      value: newValue,
      notes
    };
    
    const updatedHistory = [...progressHistory, newEntry];
    
    // Check if skill is completed
    const isCompleted = targetValue ? newValue >= targetValue : false;
    
    const updates: Partial<ChildSkill> = {
      currentValue: newValue,
      progressHistory: updatedHistory,
      isCompleted,
      completedAt: isCompleted ? new Date() : skillData.completedAt
    };
    
    await updateChildSkill(skillId, updates);
  } catch (error) {
    console.error('Error updating skill progress:', error);
    throw error;
  }
}

// Increment skill progress (for counter skills)
export async function incrementSkillProgress(
  skillId: string,
  increment: number = 1,
  notes?: string
): Promise<void> {
  try {
    const skillRef = doc(db, CHILD_SKILLS_COLLECTION, skillId);
    const skillDoc = await getDoc(skillRef);
    
    if (!skillDoc.exists()) {
      throw new Error('Skill not found');
    }
    
    const skillData = skillDoc.data();
    const currentValue = skillData.currentValue || 0;
    const newValue = currentValue + increment;
    
    await updateSkillProgress(skillId, newValue, notes);
  } catch (error) {
    console.error('Error incrementing skill progress:', error);
    throw error;
  }
}

// Delete a child skill
export async function deleteChildSkill(skillId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CHILD_SKILLS_COLLECTION, skillId));
  } catch (error) {
    console.error('Error deleting child skill:', error);
    throw error;
  }
}

// Delete all skills for a child (when deleting child)
export async function deleteChildSkills(childId: string): Promise<void> {
  try {
    const batch = writeBatch(db);
    
    const skillsSnapshot = await getDocs(
      query(collection(db, CHILD_SKILLS_COLLECTION), where('childId', '==', childId))
    );
    
    skillsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting child skills:', error);
    throw error;
  }
} 

// Test function to check collection access
export async function testChildSkillsAccess(): Promise<boolean> {
  try {
    const querySnapshot = await getDocs(collection(db, CHILD_SKILLS_COLLECTION));
    console.log('Successfully accessed childSkills collection');
    return true;
  } catch (error) {
    console.error('Error accessing childSkills collection:', error);
    return false;
  }
} 
