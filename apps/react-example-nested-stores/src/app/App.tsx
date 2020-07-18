import React, { useState, useEffect, useMemo } from "react";
import { interval, Observable } from "rxjs";
import { store, useStore } from "@rx-store/react-rx-store";
import { RootContextValue } from "./types";
import { RxStoreEffect } from "@rx-store/rx-store";
import {rootContext} from "./Manager";


export interface ChildContextValue extends RootContextValue {
  foo$: Observable<number>;
}

const createChildEffect: (i: number) => RxStoreEffect<ChildContextValue> = (
  i
) => (value) => {
  value.count$.subscribe((count) => console.log({ c: count }));
  const subscription = value.foo$.subscribe((value) =>
    console.log(`hello from ${i} with value of ${value}`)
  );
  return () => subscription.unsubscribe();
};

const createChildValue: (
  parentStore: RootContextValue,
  i: number
) => ChildContextValue = (parentStore, i) => ({
  ...parentStore,
  foo$: interval(1000 * (i + 1)),
});

const Child: React.FC<{ i: number }> = ({ i }) => {
  // debugging logs
  useEffect(() => {
    console.log("child mount", i);
    return () => console.log("child unmount", i);
  }, [i]);

  // use the root store
  const rootStore = useStore(rootContext);

  // create a child store
  const { Manager } = useMemo(
    () =>
      store<ChildContextValue>(
        createChildValue(rootStore, i),
        createChildEffect(i)
      ),
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
