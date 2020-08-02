import { Subject } from 'rxjs';

/** Our context value, which contains subjects & observables */
export interface AppContextValue {
  /**
   * These "subjects" are your app's "state"
   *
   * They are single sources of truth,
   * they are multi-cast, read & write.
   */
  counterChange$: Subject<number>;
  count$: Subject<number>;
}
