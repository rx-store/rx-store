import { Subject, BehaviorSubject } from 'rxjs';
import { AppContextValue } from '../app-context-value.interface';

export const createStoreValue = () => {
  const counterChange$ = new Subject<number>();

  /** Our context value, which contains subjects & observables */
  const storeValue: AppContextValue = {
    counterChange$,
    count$: new BehaviorSubject(0),
    time$: new BehaviorSubject<number>(0),
  };

  return storeValue;
};
