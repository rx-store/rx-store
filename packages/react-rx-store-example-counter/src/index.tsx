import React, { createContext, useEffect } from "react";
import { Observable, Subject } from "rxjs";
import { filter, delay } from "rxjs/operators";
import {
  RxStoreSubjects,
  RxStoreObservables,
  RxStoreEffect
} from "@rx-store/rx-store";
import ReactDOM from "react-dom";
import App from "./App";

interface AppSubjects extends RxStoreSubjects {
  count: Subject<number>;
}

interface AppObservables extends RxStoreObservables {
  evenCount: Observable<number>;
  oddCount: Observable<number>;
}

type AppContextValue = AppSubjects & AppObservables;

const appSubjects: AppSubjects = {
  count: new Subject()
};

const appObservables: AppObservables = {
  evenCount: appSubjects.count
    .asObservable()
    .pipe(filter((x: number) => x % 2 === 0)),

  oddCount: appSubjects.count
    .asObservable()
    .pipe(filter((x: number) => x % 2 !== 0))
};

const appContextValue: AppContextValue = {
  ...appObservables,
  ...appSubjects
};

export const rxStoreContext = createContext<AppContextValue>(appContextValue);

const appRootEffect: RxStoreEffect<AppContextValue> = ({ count }) => {
  const subscription = count
    .pipe(delay(1000))
    .subscribe(count => console.log({ count }));
  return () => subscription.unsubscribe();
};

const RxStoreProvider: React.FC<{
  value: AppContextValue;
  rootEffect: RxStoreEffect<AppContextValue>;
}> = ({ children, rootEffect, value }) => {
  useEffect(rootEffect(value), [value]);
  return (
    <rxStoreContext.Provider value={value}>{children}</rxStoreContext.Provider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <RxStoreProvider value={appContextValue} rootEffect={appRootEffect}>
      <App />
    </RxStoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
