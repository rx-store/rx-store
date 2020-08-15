import React, { useMemo } from 'react';
import { useSubscription, useStore } from '@rx-store/react';
import { rootContext } from './Manager';
import { scanSum } from './store/operators/scan-sum';

function Counter() {
  const store = useStore(rootContext);

  const [count] = useSubscription(store.count$);

  const localCount$ = useMemo(() => store.counterChange$.pipe(scanSum()), [
    store.counterChange$,
  ]);
  const [localCount] = useSubscription(localCount$);

  return (
    <div className="App">
      <h1> Counter</h1>
      count: {count}
      local: {localCount}
      <button onClick={() => store.counterChange$.next(1)}>add</button>
      <button onClick={() => store.counterChange$.next(-1)}>subtract</button>
    </div>
  );
}

export default Counter;
