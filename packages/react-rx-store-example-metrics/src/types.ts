import { ReplaySubject } from "rxjs";

/** Our context value, which contains subjects & observables */
export interface RootContextValue {
  interactiveComponent$: ReplaySubject<string>;
}
