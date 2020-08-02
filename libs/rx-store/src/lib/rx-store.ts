import {Observable} from 'rxjs'

/** A function that will subscribe to an effect */
export type RxStoreEffect<T> = (sources: T, sinks: T) => Observable<any>;
