export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface CodeAuthData {
  code: string;
  isParent: boolean;
}

export const PARENT_CODE = '1234'; // You should store this securely in your Firebase config 