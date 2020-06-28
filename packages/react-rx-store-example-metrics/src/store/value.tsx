import { RootContextValue } from "../types";
import { ReplaySubject } from "rxjs";

export const createStoreValue = () => {
  const interactiveComponent$ = new ReplaySubject<string>(100000, 5);

  /** Our context value, which contains subjects & observables */
  const storeValue: RootContextValue = {
    interactiveComponent$,
  };
  return storeValue;
};
