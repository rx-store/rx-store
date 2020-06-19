import React, { createContext, useEffect } from "react";
import { Subject } from "rxjs";
import { filter, delay } from "rxjs/operators";
import { RxStoreEffect } from "@rx-store/rx-store";
import { AppSubjects, AppObservables, AppContextValue } from "../types";

const appSubjects: AppSubjects = {
  count$: new Subject()
};

const appObservables: AppObservables = {
  evenCount$: appSubjects.count$
    .asObservable()
    .pipe(filter((x: number) => x % 2 === 0)),

  oddCount$: appSubjects.count$
    .asObservable()
    .pipe(filter((x: number) => x % 2 !== 0))
};

export const appContextValue: AppContextValue = {
  subjects: appSubjects,
  observables: appObservables
};

export const rxStoreContext = createContext<AppContextValue>(appContextValue);

export const appRootEffect: RxStoreEffect<AppContextValue> = ({ subjects }) => {
  const subscription = subjects.count$
    .pipe(delay(1000))
    .subscribe(count => console.log({ count }));
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
