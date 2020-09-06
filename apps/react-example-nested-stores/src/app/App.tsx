import React, { useState, useEffect, useMemo } from 'react';
import { merge, Subject } from 'rxjs';
import { store, useStore } from '@rx-store/react';
import { RootContextValue } from './types';
import { Effect } from '@rx-store/core';
import { rootContext } from './Manager';
import { tap, ignoreElements } from 'rxjs/operators';

export interface ChildContextValue extends RootContextValue {
  foo$: Subject<number>;
}

const createChildEffect: (i: number) => Effect<ChildContextValue, never> = (
  i
) => ({ sources }) =>
  merge(
    sources.count$().pipe(tap((count) => console.log({ c: count }))),
    sources
      .foo$()
      .pipe(
        tap((value) => console.log(`hello from ${i} with value of ${value}`))
      )
  ).pipe(ignoreElements());

const createChildValue: (
  parentStore: RootContextValue,
  i: number
) => ChildContextValue = (parentStore) => ({
  ...parentStore,
  foo$: new Subject(),
});

const Child: React.FC<{ i: number }> = ({ i }) => {
  // debugging logs
  useEffect(() => {
    console.log('child mount', i);
    return () => console.log('child unmount', i);
  }, [i]);

  // use the root store
  const rootStore = useStore<RootContextValue>(rootContext);

  // create a child store
  const { Manager } = useMemo(
    () =>
      store<ChildContextValue>({
        value: createChildValue(rootStore, i),
        effect: createChildEffect(i),
      }),
    [i, rootStore]
  );

  return (
    <Manager>
      child {i}
      <hr />
    </Manager>
  );
};

const App: React.FC<{}> = () => {
  const [n, setN] = useState(1);

  return (
    <>
      <button onClick={() => setN(n + 1)}>add a child</button>
      <button onClick={() => setN(n - 1)}>remove a child</button>
      <hr />
      {new Array(n).fill(null).map((_, i) => {
        return <Child key={i} i={i} />;
      })}
    </>
  );
};

export default App;
