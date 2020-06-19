import React, { useContext, useState, useEffect } from "react";
import { Observable } from "rxjs";
import { context } from "@rx-store/react-rx-store";
import { AppContextValue } from "./types";

function useRxStore() {
  const value = useContext(context);
  if (!value) throw new Error();
  const { subjects, observables } = value as AppContextValue;
  return { subjects, observables };
}

/**
 * A react hook for subscribing to an observable
 * it will subscribe to an observable given to it &
 * it will re-render your component anytime the observable
 * emits a value, produces an error, or completes.
 *
 * It will return a tuple of the latest value, the error
 * value, and the completion status (boolean):
 *
 * eg:
 *
 * subject.next(1)
 * subject.next(2)
 * subject.next(3)
 * subject.error('foo')
 *
 * In your component:
 *
 * const [count, error, complete] = useSubscription(obs$)
 * console.log({count, error, complete})
 *
 * Your component will render & log: 1, 2, 3, foo...
 */
function useSubscription<T>(
  source: Observable<T>
): [T | undefined, any, boolean] {
  const [next, setNext] = useState<T | undefined>();
  const [error, setError] = useState<any>();
  const [complete, setComplete] = useState<boolean>(false);
  useEffect(() => {
    const subscription = source.subscribe(
      (value) => setNext(value),
      (error) => setError(error),
      () => setComplete(true)
    );
    return subscription.unsubscribe;
  }, [source]);
  return [next, error, complete];
}

function Counter() {
  const { subjects, observables } = useRxStore();

  const [count] = useSubscription(subjects.count$);
  const [localCount] = useSubscription(observables.count$);

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
