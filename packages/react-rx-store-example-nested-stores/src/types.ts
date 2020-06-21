import { Subject, Observable } from "rxjs";

/** Our context value, which contains subjects & observables */
export interface RootContextValue {
  mount$: Subject<string>;
}
