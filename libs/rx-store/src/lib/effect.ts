import { Observable, Subject } from 'rxjs';
import { Sources } from './sources';
import { Sinks } from './sinks';

/** A function that will subscribe to an effect */
export type RxStoreEffect<T extends { [k: string]: Subject<any> }> = (
  sources: Sources<T>,
  sinks: Sinks<T>,
  runEffect: (debugKey: string, effect: RxStoreEffect<T>) => Observable<any>
) => Observable<any>;
