export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
} 