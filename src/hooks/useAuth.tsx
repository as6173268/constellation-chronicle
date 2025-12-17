import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  User,
  AuthState,
  Credentials,
  SignUpData,
  signIn as functionalSignIn,
  signUp as functionalSignUp,
  signOut as functionalSignOut,
  getCurrentUser,
  isAuthenticated as functionalIsAuthenticated,
  isEditor as functionalIsEditor,
  initializeAuthState,
  createAuthStateListener
} from '@/services/authService';

interface AuthContextType {
  user: O.Option<User>;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEditor: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initializeAuthState);

  useEffect(() => {
    // Set initial state
    setAuthState(initializeAuthState());

    // Create auth state listener
    const unsubscribe = createAuthStateListener((newState) => {
      setAuthState(newState);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const credentials: Credentials = { email, password };

    const result = await functionalSignIn(credentials)();

    if (result._tag === 'Left') {
      return { error: result.left };
    }

    // Update state after successful sign in
    setAuthState(initializeAuthState());
    return { error: null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const signUpData: SignUpData = { email, password, name };

    const result = await functionalSignUp(signUpData)();

    if (result._tag === 'Left') {
      return { error: result.left };
    }

    // Update state after successful sign up
    setAuthState(initializeAuthState());
    return { error: null };
  };

  const signOut = async () => {
    const result = await functionalSignOut()();

    if (result._tag === 'Right') {
      setAuthState(initializeAuthState());
    }
  };

  const contextValue: AuthContextType = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    isEditor: pipe(
      authState.user,
      O.map(user => user.role === 'editor' || user.role === 'admin'),
      O.getOrElse(() => false)
    ),
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
