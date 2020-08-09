import { Subject, Observable } from 'rxjs';
import { StoreValue } from '@rx-store/rx-store';

/** Our context value, which contains subjects & observables */
export interface RootAppStore extends StoreValue {
  /**
   * These "subjects" are your app's "state"
   *
   * They are single sources of truth,
   * they are multi-cast, read & write.
   */
  counterChange$: Subject<number>;
  count$: Subject<number>;

  /**
   * These "observables" are your app's "selectors".
   *
   * They derive state, manipulate time, are lazy &
   * uni-cast, and are read only.
   */
  // localCount$: Observable<number>;
}
