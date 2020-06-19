import { Subject, Observable } from "rxjs";

export interface RxStoreSubjects {
  count: Subject<any> | Subject<any>[] | RxStoreSubjects;
}

export interface RxStoreObservables {
  [property: string]: Observable<any> | Observable<any>[] | RxStoreObservables;
}

export type RxStoreValue = RxStoreSubjects & RxStoreObservables;

export type RxEffectCleanupFn = () => void;

export type RxEffect<T> = (value: T) => RxEffectCleanupFn;
