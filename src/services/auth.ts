import { auth } from '../firebase/config';
import {
  signInAnonymously,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';

const PARENT_CODE = '0000';
const KID_CODE = '2160';

export const signInWithCode = async (
  code: string
): Promise<{ user: FirebaseUser; isParent: boolean }> => {
  if (code !== PARENT_CODE && code !== KID_CODE) {
    throw new Error('Invalid code');
  }

  const { user } = await signInAnonymously(auth);
  const isParent = code === PARENT_CODE;

  localStorage.setItem('userType', isParent ? 'parent' : 'child');

  return { user, isParent };
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
  localStorage.removeItem('userType');
};

export const isParentUser = (): boolean => {
  return localStorage.getItem('userType') === 'parent';
};
