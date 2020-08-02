import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface RxStoreValue {
  [k: string]: Subject<any>;
}

export type Sinks<T extends RxStoreValue> = {
  [P in keyof T]?: T[P]['next'];
};

export type Sources<T extends RxStoreValue> = {
  [P in keyof T]?: ReturnType<T[P]['asObservable']>;
};

export const createSinks = <T extends {}>(
  debugKey: string,
  value: T
): Sinks<T> => {
  return Object.keys(value).reduce(
    (acc, subjectName) => ({
      ...acc,
      [subjectName]: (...args) => {
        console.log(`${debugKey} sink ${subjectName}: `, ...args);
        value[subjectName].next(...args);
      },
    }),
    {}
  ) as Sinks<T>;
};

export const createSources = <T extends {}>(
  debugKey: string,
  value: T
): Sources<T> => {
  return Object.keys(value).reduce(
    (acc, subjectName) => ({
      ...acc,
      [subjectName]: (value[subjectName] as Subject<any>)
        .asObservable()
        .pipe(
          tap((value) =>
            console.log(`${debugKey} source ${subjectName}:`, value)
          )
        ),
    }),
    {}
  ) as Sources<T>;
};

/** A function that will subscribe to an effect */
export type RxStoreEffect<T extends { [k: string]: Subject<any> }> = (
  sources: Sources<T>,
  sinks: Sinks<T>,
  runEffect: (debugKey: string, effect: RxStoreEffect<T>) => Observable<any>
) => Observable<any>;
