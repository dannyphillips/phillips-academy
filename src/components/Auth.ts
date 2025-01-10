import { auth } from '../firebase/config';
import { 
  signInAnonymously,
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';

const VALID_CODE = '2160';

export const signInWithCode = async (code: string): Promise<{ user: FirebaseUser; isParent: boolean }> => {
  try {
    if (code !== VALID_CODE) {
      throw new Error('Invalid code');
    }

    // Sign in anonymously first
    const { user } = await signInAnonymously(auth);
    
    // For now, all valid codes are parent codes
    const isParent = true;
    
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