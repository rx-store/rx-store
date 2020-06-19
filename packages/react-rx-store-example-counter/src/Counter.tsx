import React, { useState, useContext, useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { Subscription, combineLatest } from "rxjs";
import { map, startWith, scan } from "rxjs/operators";
import { context } from "@rx-store/react-rx-store";
import { AppContextValue } from "./types";
import { scanSum } from "./store/operators/scan-sum";

function useRxStore() {
  const value = useContext(context);
  if (!value) throw new Error();
  const { subjects, observables } = value as AppContextValue;
  return { subjects, observables };
}

function Counter() {
  const [localCount, setLocalCount] = useState<number>();
  const [count, setCount] = useState<number>();

  const { subjects, observables } = useRxStore();

  useEffect(() => {
    unstable_batchedUpdates(() => {
      const subscriptions: Subscription[] = [];
      subscriptions.push(
        subjects.count$.subscribe((count) => setCount(count)),
        observables.count$.subscribe((count) => setLocalCount(count))
      );
      return () => subscriptions.forEach((s) => s.unsubscribe());
    });
  }, [subjects.count$, observables.count$]);

  return (
    <div className="App">
      <h1> Counter</h1>
      count: {count}
      local: {localCount}
      <button onClick={() => subjects.counterChange$.next(1)}>add</button>
      <button onClick={() => subjects.counterChange$.next(-1)}>subtract</button>
    </div>
  );
}

export default Counter;
