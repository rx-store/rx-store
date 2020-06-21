import { RootContextValue } from "../types";
import { Subject, BehaviorSubject } from "rxjs";

export const createStoreValue = () => {
  const mount$ = new Subject<string>();

  /** Our context value, which contains subjects & observables */
  const storeValue: RootContextValue = {
    mount$,
  };
  return storeValue;
};
