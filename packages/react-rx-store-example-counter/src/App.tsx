import React, { useState, useContext, useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { Subscription, combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { context } from "@rx-store/react-rx-store";
import { AppContextValue } from "./types";

function useRxStore() {
  const value = useContext(context);
  if (!value) throw new Error();
  const { subjects, observables } = value as AppContextValue;
  return { subjects, observables };
}

function App() {
  const [increments, setIncrements] = useState<number>();
  const [decrements, setDecrements] = useState<number>();
  const [total, setTotal] = useState<number>();
  const [stateCounter, setStateCounter] = useState<number>();

  const { subjects, observables } = useRxStore();

  useEffect(() => {
    unstable_batchedUpdates(() => {
      const subscriptions: Subscription[] = [];
      subscriptions.push(
        observables.incrementCount$.subscribe((increments) => {
          setIncrements(increments);
        }),

        observables.decrementCount$.subscribe((decrements) =>
          setDecrements(decrements)
        ),

        combineLatest(
          observables.incrementCount$.pipe(startWith(0)),
          observables.decrementCount$.pipe(startWith(0))
        )
          .pipe(map(([inc, dec]: [number, number]) => inc + dec))
          .subscribe((total) => setTotal(total)),

        subjects.count$.subscribe((count) => setStateCounter(count))
      );
      return () => subscriptions.forEach((s) => s.unsubscribe());
    });
  }, [
    observables.decrementCount$,
    observables.incrementCount$,
    subjects.count$,
  ]);

  return (
    <div className="App">
      <h1> Counter</h1>
      count: {stateCounter}, increments: {increments}, decrements: {decrements},
      total: {total}
      <button onClick={() => subjects.counterChange$.next(1)}>add</button>
      <button onClick={() => subjects.counterChange$.next(-1)}>subtract</button>
    </div>
  );
}

export default App;
