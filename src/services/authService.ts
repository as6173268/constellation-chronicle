import * as R from 'ramda';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';

// Immutable types
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: 'user' | 'editor' | 'admin';
  readonly createdAt: Date;
}

export interface AuthState {
  readonly user: O.Option<User>;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
}

export interface Credentials {
  readonly email: string;
  readonly password: string;
}

export interface SignUpData extends Credentials {
  readonly name: string;
}

// Pure function for mock user validation
const validateCredentials = (email: string, password: string): boolean =>
  email === 'editor@constellation.com' && password === 'editor123';

// Pure function to create user
const createUser = (id: string, email: string, name: string, role: User['role'] = 'user'): User => ({
  id,
  email,
  name,
  role,
  createdAt: new Date()
});

// Pure function to create editor user
const createEditorUser = (email: string): User =>
  createUser('1', email, 'Editor', 'editor');

// Pure function to create regular user
const createRegularUser = (email: string, name: string): User =>
  createUser(Date.now().toString(), email, name, 'user');

// Pure functions for localStorage operations
const storeUser = (user: User): void =>
  localStorage.setItem('user', JSON.stringify(user));

const clearStoredUser = (): void =>
  localStorage.removeItem('user');

const getStoredUser = (): O.Option<User> =>
  R.pipe(
    () => localStorage.getItem('user'),
    O.fromNullable,
    O.chain(stored =>
      E.tryCatch(
        () => JSON.parse(stored),
        () => undefined
      ) as any // Type assertion for simplicity
    ),
    O.filter((user: any) => user && typeof user === 'object' && user.id)
  )();

// Functional authentication operations
export const signIn = (credentials: Credentials): TE.TaskEither<Error, User> =>
  TE.tryCatch(
    async () => {
      if (validateCredentials(credentials.email, credentials.password)) {
        const user = createEditorUser(credentials.email);
        storeUser(user);
        return user;
      }
      throw new Error('Invalid credentials');
    },
    (error) => error as Error
  );

export const signUp = (data: SignUpData): TE.TaskEither<Error, User> =>
  TE.tryCatch(
    async () => {
      const user = createRegularUser(data.email, data.name);
      storeUser(user);
      return user;
    },
    (error) => error as Error
  );

export const signOut = (): TE.TaskEither<Error, void> =>
  TE.tryCatch(
    async () => {
      clearStoredUser();
    },
    (error) => error as Error
  );

// Pure function to get current user
export const getCurrentUser = (): O.Option<User> => getStoredUser();

// Pure function to check authentication
export const isAuthenticated = (): boolean =>
  O.isSome(getCurrentUser());

// Pure function to check role
export const hasRole = (role: string): boolean =>
  R.pipe(
    getCurrentUser,
    O.map(user => user.role === role),
    O.getOrElse(() => false)
  )(undefined);

// Curried version for composition
export const hasSpecificRole = R.curry((role: string) => hasRole(role));

// Pure function to check if user is editor
export const isEditor = (): boolean =>
  hasRole('editor') || hasRole('admin');

// Pure function to initialize auth state
export const initializeAuthState = (): AuthState => ({
  user: getCurrentUser(),
  isAuthenticated: isAuthenticated(),
  isLoading: false
});

// Functional auth state change listener (simplified)
export const createAuthStateListener = (
  callback: (state: AuthState) => void
): (() => void) => {
  const handler = () => callback(initializeAuthState());

  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener('storage', handler);
  };
};

// Functional composition for auth checks
export const requireAuth = <T>(fn: (user: User) => T): (user: O.Option<User>) => O.Option<T> =>
  R.pipe(
    O.map(fn)
  );

export const requireEditor = <T>(fn: (user: User) => T): (user: O.Option<User>) => O.Option<T> =>
  R.pipe(
    O.filter(user => user.role === 'editor' || user.role === 'admin'),
    O.map(fn)
  );

// Utility functions for functional composition
export const withAuth = <T>(fn: (user: User) => T): TE.TaskEither<Error, T> =>
  R.pipe(
    getCurrentUser,
    O.fold(
      () => TE.left(new Error('Not authenticated')),
      (user) => TE.right(fn(user))
    )
  );

export const withEditorAuth = <T>(fn: (user: User) => T): TE.TaskEither<Error, T> =>
  R.pipe(
    getCurrentUser,
    O.fold(
      () => TE.left(new Error('Not authenticated')),
      (user) => user.role === 'editor' || user.role === 'admin'
        ? TE.right(fn(user))
        : TE.left(new Error('Editor access required'))
    )
  );