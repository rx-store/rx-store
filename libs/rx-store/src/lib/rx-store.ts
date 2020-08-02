import { Observable } from 'rxjs';

/** A function that will subscribe to an effect */
export type RxStoreEffect<T> = (
  sources: T,
  sinks: T,
  runEffect: (debugKey: string, effect: RxStoreEffect<T>) => Observable<any>
) => Observable<any>;
