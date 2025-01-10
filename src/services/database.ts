import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc,
  query,
  where,
  DocumentReference,
  CollectionReference,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { Child, Task, FirestoreChild, FirestoreTask } from '../types/types';

// Collections
const CHILDREN_COLLECTION = 'children';
const TASKS_COLLECTION = 'tasks';

// Helper function to convert Firestore data to our app's data structure
const convertFirestoreDataToChild = async (
  childDoc: FirestoreChild,
  tasksSnapshot: FirestoreTask[]
): Promise<Child> => {
  return {
    id: parseInt(childDoc.id),
    name: childDoc.name,
    totalPoints: childDoc.totalPoints,
    tasks: tasksSnapshot.map(task => ({
      id: parseInt(task.id),
      title: task.title,
      completed: task.completed,
      streak: task.streak,
      points: task.points,
      days: task.days
    }))
  };
};

// Get all children and their tasks
export async function getChildren(): Promise<Child[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'children'));
    const children: Child[] = [];

    for (const doc of querySnapshot.docs) {
      const childData = doc.data() as FirestoreChild;
      
      // Get tasks for this child
      const tasksSnapshot = await getDocs(collection(db, 'tasks'));
      const tasks = tasksSnapshot.docs
        .map(taskDoc => {
          const task = taskDoc.data();
          return task.childId === doc.id ? {
            id: taskDoc.id,
            ...task
          } : null;
        })
        .filter((task): task is Task => task !== null);

      children.push({
        id: doc.id,
        name: childData.name,
        age: childData.age,
        color: childData.color,
        totalPoints: childData.totalPoints,
        tasks
      });
    }

    return children;
  } catch (error) {
    console.error('Error getting children:', error);
    throw error;
  }
}

// Update a task's completion status
export const updateTaskCompletion = async (
  childId: number,
  taskId: number,
  completed: boolean,
  streak: number,
  points: number
): Promise<void> => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId.toString());
    await updateDoc(taskRef, {
      completed,
      streak,
      points
    });

    // Update child's total points
    const childRef = doc(db, CHILDREN_COLLECTION, childId.toString());
    const childSnapshot = await getDocs(query(collection(db, CHILDREN_COLLECTION), where('id', '==', childId.toString())));
    const childData = childSnapshot.docs[0].data() as FirestoreChild;

    await updateDoc(childRef, {
      totalPoints: childData.totalPoints + (completed ? points : -points)
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Add a new task
export const addTask = async (childId: number, task: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const taskSnapshot = await getDocs(tasksRef);
    const newId = (taskSnapshot.size + 1).toString();

    const newTask: FirestoreTask = {
      title: task.title,
      completed: task.completed,
      streak: task.streak,
      points: task.points,
      days: task.days,
      id: newId,
      childId: childId.toString()
    };

    await setDoc(doc(tasksRef, newId), newTask);

    return {
      ...task,
      id: parseInt(newId)
    };
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export async function addChild(child: Omit<Child, 'id' | 'tasks'>): Promise<Child> {
  try {
    // Create the child document in Firestore
    const childRef = await addDoc(collection(db, 'children'), {
      name: child.name,
      age: child.age,
      color: child.color,
      totalPoints: 0
    });

    // Return the complete child object
    return {
      id: childRef.id,
      name: child.name,
      age: child.age,
      color: child.color,
      totalPoints: 0,
      tasks: []
    };
  } catch (error) {
    console.error('Error adding child:', error);
    throw error;
  }
}

export async function updateChild(
  childId: string,
  updates: Partial<Omit<Child, 'id' | 'tasks'>>
): Promise<void> {
  try {
    const childRef = doc(db, 'children', childId);
    await updateDoc(childRef, updates);
  } catch (error) {
    console.error('Error updating child:', error);
    throw error;
  }
}

export async function deleteChild(childId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'children', childId));
    
    // Delete all tasks associated with this child
    const tasksSnapshot = await getDocs(collection(db, 'tasks'));
    const deletePromises = tasksSnapshot.docs
      .filter(doc => doc.data().childId === childId)
      .map(doc => deleteDoc(doc.ref));
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting child:', error);
    throw error;
  }
} 