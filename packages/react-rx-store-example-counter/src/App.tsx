import React, { useState, useEffect } from "react";
import { interval, Observable } from "rxjs";
import { createStore } from "@rx-store/react-rx-store";

const GrandChild: React.FC<{ i: number; j: number }> = ({ i, j }) => {
  console.log("render", i, j);
  useEffect(() => {
    console.log("child mount", i, j);
    return () => console.log("child unmount", i, j);
  }, []);
  return (
    <>
      <hr />
      {i}-{j}
    </>
  );
};

const Child: React.FC<{ i: number }> = ({ i }) => {
  const value = { foo$: interval(1000) };
  const { Manager } = createStore<{ foo$: Observable<number> }>(
    value,
    (value) => {
      // @ts-ignore
      // value.parent.count$.subscribe((c) => console.log({ c }));
      const s = value.foo$.subscribe((value) =>
        console.log(`hello from ${i} with value of ${value}`)
      );
      return () => s.unsubscribe();
    }
  );

  console.log("render", i);
  const [n, setN] = useState(3);
  useEffect(() => {
    console.log("child mount", i);
    return () => console.log("child unmount", i);
  }, []);
  return (
    <Manager>
      <button onClick={() => setN(n + 1)}>add a grand child to {i}</button>
      <button onClick={() => setN(n - 1)}>remove a grand child to {i}</button>
      {new Array(n).fill(null).map((_, j) => {
        return <GrandChild key={`${i}-${j}`} i={i} j={j}></GrandChild>;
      })}
      <hr />
    </Manager>
  );
};

const App: React.FC<{}> = () => {
  const [n, setN] = useState(3);

  return (
    <>
      <button onClick={() => setN(n + 1)}>add a child</button>
      <button onClick={() => setN(n - 1)}>remove a child</button>
      <hr />
      {/* {new Array(n).fill(null).map((_, i) => (
        <Counter key={i} />
      ))} */}
      {new Array(n).fill(null).map((_, i) => {
        return <Child key={i} i={i} />;
      })}
    </>
  );
};

export default App;
