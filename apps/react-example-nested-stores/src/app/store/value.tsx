import { RootContextValue } from '../types';
import { Subject, BehaviorSubject } from 'rxjs';

export const createStoreValue = () => {
  const counterChange$ = new Subject<number>();

  /** Our context value, which contains subjects & observables */
  const storeValue: RootContextValue = {
    counterChange$,
    count$: new BehaviorSubject(0),
  };
  return storeValue;
};
