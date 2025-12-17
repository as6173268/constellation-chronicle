import * as R from 'ramda';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';

// Functional utilities for the application

// Pure function to safely get localStorage item
export const getLocalStorageItem = (key: string): O.Option<string> =>
  O.fromNullable(localStorage.getItem(key));

// Pure function to safely set localStorage item
export const setLocalStorageItem = (key: string, value: string): void =>
  localStorage.setItem(key, value);

// Pure function to safely parse JSON
export const safeJsonParse = <T>(json: string): O.Option<T> =>
  O.tryCatch(() => JSON.parse(json));

// Pure function to safely stringify JSON
export const safeJsonStringify = (value: any): O.Option<string> =>
  O.tryCatch(() => JSON.stringify(value));

// Functional localStorage operations
export const getParsedLocalStorageItem = <T>(key: string): O.Option<T> =>
  pipe(
    getLocalStorageItem(key),
    O.chain(safeJsonParse<T>)
  );

export const setParsedLocalStorageItem = (key: string, value: any): void =>
  pipe(
    safeJsonStringify(value),
    O.map(str => setLocalStorageItem(key, str))
  );

// Pure function for date formatting
export const formatDate = (date: Date): string =>
  date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

// Pure function for time formatting
export const formatTime = (date: Date): string =>
  date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

// Pure function for date and time formatting
export const formatDateTime = (date: Date): string =>
  `${formatDate(date)} ${formatTime(date)}`;

// Functional array operations
export const sortByDate = <T extends { createdAt?: Date; publishedAt?: string }>(items: readonly T[]): readonly T[] =>
  R.sort<T>((a, b) => {
    const dateA = a.createdAt || (a.publishedAt ? new Date(a.publishedAt) : new Date(0));
    const dateB = b.createdAt || (b.publishedAt ? new Date(b.publishedAt) : new Date(0));
    return dateB.getTime() - dateA.getTime();
  })(items);

export const takeLatest = <T>(count: number) => (items: readonly T[]): readonly T[] =>
  R.take(count, items);

// Functional search operations
export const createSearchFilter = (query: string) => <T extends Record<string, any>>(
  searchableFields: (keyof T)[]
) => (item: T): boolean => {
  const lowerQuery = query.toLowerCase();
  return searchableFields.some(field =>
    String(item[field]).toLowerCase().includes(lowerQuery)
  );
};

// Pure function for text truncation
export const truncateText = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

// Functional validation
export const isNonEmptyString = (str: string): boolean =>
  typeof str === 'string' && str.trim().length > 0;

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Functional composition helpers
export const composePredicates = <T>(...predicates: ((item: T) => boolean)[]) =>
  (item: T): boolean => predicates.every(predicate => predicate(item));

export const orPredicates = <T>(...predicates: ((item: T) => boolean)[]) =>
  (item: T): boolean => predicates.some(predicate => predicate(item));

// Pure function for creating slugs
export const createSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Functional async utilities
export const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

export const withDelay = <T>(ms: number) => (value: T): Promise<T> =>
  delay(ms).then(() => value);

// Error handling utilities
export const createError = (message: string): Error => new Error(message);

export const handleError = (error: unknown): Error =>
  error instanceof Error ? error : createError(String(error));

// Functional state management helpers
export const createStateUpdater = <T>() => (updater: (prev: T) => T) => updater;

export const createAsyncStateUpdater = <T>() =>
  (asyncUpdater: (prev: T) => Promise<T>) => asyncUpdater;