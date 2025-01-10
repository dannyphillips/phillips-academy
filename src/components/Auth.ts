import { auth } from '../firebase/config';
import { 
  signInAnonymously,
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';

const PARENT_CODE = '0000';
const KID_CODE = '2160';

export const signInWithCode = async (code: string): Promise<{ user: FirebaseUser; isParent: boolean }> => {
  try {
    if (code !== PARENT_CODE && code !== KID_CODE) {
      throw new Error('Invalid code');
    }

    // Sign in anonymously first
    const { user } = await signInAnonymously(auth);
    
    // Determine if parent based on code
    const isParent = code === PARENT_CODE;
    
    // Store the user type in localStorage
    localStorage.setItem('userType', isParent ? 'parent' : 'child');
    
    return { user, isParent };
  } catch (error) {
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    localStorage.removeItem('userType');
  } catch (error) {
    throw error;
  }
};

export const isParentUser = (): boolean => {
  return localStorage.getItem('userType') === 'parent';
}; 