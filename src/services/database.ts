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
  CollectionReference
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
export const getChildren = async (): Promise<Child[]> => {
  try {
    const childrenSnapshot = await getDocs(collection(db, CHILDREN_COLLECTION));
    const children: Child[] = [];

    for (const childDoc of childrenSnapshot.docs) {
      const childData = childDoc.data() as FirestoreChild;
      
      // Get tasks for this child
      const tasksQuery = query(
        collection(db, TASKS_COLLECTION),
        where('childId', '==', childDoc.id)
      );
      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks = tasksSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as FirestoreTask[];

      children.push(await convertFirestoreDataToChild(childData, tasks));
    }

    return children;
  } catch (error) {
    console.error('Error getting children:', error);
    throw error;
  }
};

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