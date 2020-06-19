import React, { createContext, useEffect } from "react";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { filter, scan, tap, startWith } from "rxjs/operators";
import { RxStoreEffect } from "@rx-store/rx-store";
import { AppSubjects, AppObservables, AppContextValue } from "../types";

export const scanCount = () => (source$: Observable<any>): Observable<number> =>
  source$.pipe(
    scan((acc, _) => acc + 1, 0),
    startWith(0)
  );

const appSubjects: AppSubjects = {
  streamCounterChange$: new Subject(),
  stateCounter$: new BehaviorSubject(0)
};

const appObservables: AppObservables = {
  incrementCount$: appSubjects.streamCounterChange$.asObservable().pipe(
    filter((x: number) => x === 1),
    scanCount(),
    tap(console.log)
  ),

  decrementCount$: appSubjects.streamCounterChange$.asObservable().pipe(
    filter((x: number) => x === -1),
    scanCount()
  )
};

export const appContextValue: AppContextValue = {
  subjects: appSubjects,
  observables: appObservables
};

export const rxStoreContext = createContext<AppContextValue>(appContextValue);

export const appRootEffect: RxStoreEffect<AppContextValue> = ({ subjects }) => {
  const subscription = subjects.streamCounterChange$
    .asObservable()
    .pipe(
      scan((acc, val) => acc + val, 0),
      startWith(0)
    )
    .subscribe(count => appSubjects.stateCounter$.next(count));
  return () => subscription.unsubscribe();
};

export const RxStoreProvider: React.FC<{
  value: AppContextValue;
  rootEffect: RxStoreEffect<AppContextValue>;
}> = ({ children, rootEffect, value }) => {
  useEffect(rootEffect(value), [value]);
  return (
    <rxStoreContext.Provider value={value}>{children}</rxStoreContext.Provider>
  );
};
