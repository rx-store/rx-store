import React, { useState, useContext, useEffect } from "react";
import { rxStoreContext } from "./store";
import { unstable_batchedUpdates } from "react-dom";
import { Subscription, combineLatest } from "rxjs";
import { map, startWith } from "rxjs/operators";

function App() {
  const [increments, setIncrements] = useState<number>();
  const [decrements, setDecrements] = useState<number>();
  const [total, setTotal] = useState<number>();
  const [stateCounter, setStateCounter] = useState<number>();

  const { subjects, observables } = useContext(rxStoreContext);

  useEffect(() => {
    unstable_batchedUpdates(() => {
      const subscriptions: Subscription[] = [];
      subscriptions.push(
        observables.incrementCount$.subscribe(increments => {
          setIncrements(increments);
        }),

        observables.decrementCount$.subscribe(decrements =>
          setDecrements(decrements)
        ),

        combineLatest(
          observables.incrementCount$.pipe(startWith(0)),
          observables.decrementCount$.pipe(startWith(0))
        )
          .pipe(map(([inc, dec]: [number, number]) => inc + dec))
          .subscribe(total => setTotal(total)),

        subjects.stateCounter$.subscribe(count => setStateCounter(count))
      );
      return () => subscriptions.forEach(s => s.unsubscribe());
    });
  }, []);

  return (
    <div className="App">
      <h1> Counter</h1>
      count: {stateCounter}, increments: {increments}, decrements: {decrements},
      total: {total}
      <button onClick={() => subjects.streamCounterChange$.next(1)}>add</button>
      <button onClick={() => subjects.streamCounterChange$.next(-1)}>
        subtract
      </button>
    </div>
  );
}

export default App;
