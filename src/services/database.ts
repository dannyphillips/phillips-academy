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
  FirestoreTaskAssignment
} from '../types/types';

// Collections
const CHILDREN_COLLECTION = 'children';
const TASK_DEFINITIONS_COLLECTION = 'taskDefinitions';
const TASK_ASSIGNMENTS_COLLECTION = 'taskAssignments';

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

    // Delete the task definition
    batch.delete(doc(db, TASK_DEFINITIONS_COLLECTION, taskDefinitionId));

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
    await updateDoc(doc(db, TASK_ASSIGNMENTS_COLLECTION, assignmentId), updates);
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
    const completionKey = `${assignmentId}-${dayIndex}`;

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