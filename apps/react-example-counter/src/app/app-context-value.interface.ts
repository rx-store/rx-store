import { Subject, BehaviorSubject } from 'rxjs';
import { RxStoreValue } from '@rx-store/rx-store';

/** Our context value, which contains subjects & observables */
export interface AppContextValue extends RxStoreValue {
  /**
   * These "subjects" are your app's "state"
   *
   * They are single sources of truth,
   * they are multi-cast, read & write.
   */
  counterChange$: Subject<number>;
  count$: Subject<number>;
  time$: BehaviorSubject<number>;
}
