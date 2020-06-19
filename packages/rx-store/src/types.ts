import { Subject, Observable } from "rxjs";

/**
 * These "subjects" are your app's "state"
 *
 * They are single sources of truth,
 * they are multi-cast, read & write.
 */
export interface RxStoreSubjects {
  [property: string]: Subject<any> | Subject<any>[] | RxStoreSubjects;
}

/**
 * These "observables" are your app's "selectors".
 *
 * They derive state, manipulate time, are lazy &
 * uni-cast, and are read only.
 */
export interface RxStoreObservables {
  [property: string]: Observable<any> | Observable<any>[] | RxStoreObservables;
}

/**
 * The store value should be exposed by your UI framework of choice:
 * - $rootScope in Angular v1
 * - Dependency Injection in Angular v2+
 * - Context in React 16+
 * - A global variable on the window object ;)
 */
export type RxStoreValue = {
  subjects: RxStoreSubjects;
  observables: RxStoreObservables;
};

/** A function that will unsubscribe a effect */
export type RxEffectCleanupFn = () => void;

/** A function that will subscribe to an effect */
export type RxStoreEffect<T extends RxStoreValue> = (
  value: T
) => RxEffectCleanupFn;
