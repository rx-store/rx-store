import { Subject, Observable } from "rxjs";
import { RxStoreSubjects, RxStoreObservables } from "@rx-store/rx-store";

/**
 * These "subjects" are your app's "state"
 *
 * They are single sources of truth,
 * they are multi-cast, read & write.
 */
export interface AppSubjects extends RxStoreSubjects {
  counterChange$: Subject<number>;
  count$: Subject<number>;
}

/**
 * These "observables" are your app's "selectors".
 *
 * They derive state, manipulate time, are lazy &
 * uni-cast, and are read only.
 */
export interface AppObservables extends RxStoreObservables {
  count$: Observable<number>;
}

/** Our context value, which contains subjects & observables */
export type AppContextValue = {
  subjects: AppSubjects;
  observables: AppObservables;
};
