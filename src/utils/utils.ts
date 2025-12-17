import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as R from 'ramda';

// Functional class name utility
export const cn = (...inputs: ClassValue[]): string =>
  R.pipe(
    (classes: ClassValue[]) => clsx(...classes),
    twMerge
  )(inputs);

// Curried version for composition
export const cnCurried = R.curry(
  (additionalClasses: ClassValue[], baseClasses: ClassValue[]): string =>
    cn(...baseClasses, ...additionalClasses)
);

// Pure function for conditional class application
export const conditionalClass = (condition: boolean, className: string): string =>
  condition ? className : '';

// Pure function for variant class application
export const variantClass = <T extends string>(
  variant: T,
  variantMap: Record<T, string>
): string =>
  variantMap[variant] || '';

// Functional class composition
export const composeClasses = (...classFunctions: ((...args: any[]) => string)[]) =>
  (...args: any[]): string =>
    R.pipe(
      R.map(fn => fn(...args)),
      R.filter(Boolean),
      classes => cn(...classes)
    )(classFunctions);
