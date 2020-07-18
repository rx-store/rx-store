import { Subject, BehaviorSubject } from "rxjs";
import { scanSum } from "./operators/scan-sum";
import {AppContextValue} from "../app-context-value.interface";

export const createStoreValue = () => {
  const counterChange$ = new Subject<number>();

  /** Our context value, which contains subjects & observables */
  const storeValue: AppContextValue = {
    counterChange$,
    count$: new BehaviorSubject(0),
    localCount$: counterChange$.pipe(scanSum()),
  };
  return storeValue;
};
