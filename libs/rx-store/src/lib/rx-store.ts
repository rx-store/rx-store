import { Observable, Subject } from 'rxjs';

export type Sinks<T extends { [k: string]: Subject<any> }> = {
  [P in keyof T]?: T[P]['next'];
};

export const createSinks = <T extends {}>(debugKey: string, value: T) => {
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

/** A function that will subscribe to an effect */
export type RxStoreEffect<T> = (
  sources: T,
  sinks: Sinks<T>,
  runEffect: (debugKey: string, effect: RxStoreEffect<T>) => Observable<any>
) => Observable<any>;
