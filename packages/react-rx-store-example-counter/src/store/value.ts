import { Subject, BehaviorSubject } from "rxjs";
import { AppContextValue } from "../types";
import { scanSum } from "./operators/scan-sum";

const counterChange$ = new Subject<number>();

/** Our context value, which contains subjects & observables */
export const storeValue: AppContextValue = {
  counterChange$,
  count$: new BehaviorSubject(0),
  localCount$: counterChange$.pipe(scanSum()),
};
