import React, { useState, useEffect, useMemo } from "react";
import { interval, Observable } from "rxjs";
import { store, useStore } from "@rx-store/react-rx-store";
import { RootContextValue } from "./types";
import { RxStoreEffect } from "@rx-store/rx-store/types";
import { rootContext } from ".";

const Child: React.FC<{ i: number }> = ({ i }) => {
  console.log("child render", i);
  // debugging logs
  useEffect(() => {
    console.log("child mount", i);
    return () => console.log("child unmount", i);
  }, [i]);

  // use the root store
  const rootStore = useStore(rootContext);

  useEffect(() => {
    rootStore.mount$.next(`child ${i}`);
  });

  return (
    <>
      child {i}
      <hr />
    </>
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
