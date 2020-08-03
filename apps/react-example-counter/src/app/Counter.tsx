import React, { useMemo, useCallback } from 'react';
import { useSubscription, useStore } from '@rx-store/react-rx-store';
import { rootContext } from './Manager';
import { scanSum } from './store/operators/scan-sum';

function Counter() {
  const store = useStore(rootContext);

  const [count] = useSubscription(store.count$);

  const localCount$ = useMemo(() => store.counterChange$.pipe(scanSum()), [
    store.counterChange$,
  ]);

  const [localCount] = useSubscription(localCount$);

  const increment = useCallback(() => store.counterChange$.next(1), [
    store.counterChange$,
  ]);

  const decrement = useCallback(() => store.counterChange$.next(-1), [
    store.counterChange$,
  ]);

  return (
    <div className="App">
      <h1> Counter</h1>
      count: {count}
      local: {localCount}
      <button onClick={increment}>add</button>
      <button onClick={decrement}>subtract</button>
    </div>
  );
}

export default Counter;
