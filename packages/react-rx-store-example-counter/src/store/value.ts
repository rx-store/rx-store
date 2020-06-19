import { Subject, BehaviorSubject } from "rxjs";
import { AppSubjects, AppObservables, AppContextValue } from "../types";
import { scanSum } from "./operators/scan-sum";

/**
 * These "subjects" are your app's "state"
 *
 * They are single sources of truth,
 * they are multi-cast, read & write.
 */
export const appSubjects: AppSubjects = {
  counterChange$: new Subject(),
  count$: new BehaviorSubject(0),
};

/**
 * These "observables" are your app's "selectors".
 *
 * They derive state, manipulate time, are lazy &
 * uni-cast, and are read only.
 */
const appObservables: AppObservables = {
  count$: appSubjects.counterChange$.pipe(scanSum()),
};

/** Our context value, which contains subjects & observables */
export const storeValue: AppContextValue = {
  subjects: appSubjects,
  observables: appObservables,
};
