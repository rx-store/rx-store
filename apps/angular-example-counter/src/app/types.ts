import { Subject } from 'rxjs';
import { StoreValue } from '@rx-store/core';

/** Our context value, which contains subjects & observables */
export interface AppStoreValue extends StoreValue {
  /**
   * These "subjects" are your app's "state"
   *
   * They are single sources of truth,
   * they are multi-cast, read & write.
   */
  counterChange$: Subject<number>;
  count$: Subject<number>;
}
