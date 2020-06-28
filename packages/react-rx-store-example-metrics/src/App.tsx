import React, { useState, useEffect, useContext } from "react";
import { rootContext } from ".";

const Child: React.FC<{ i: number }> = ({ i }) => {
  const store = useContext(rootContext);
  useEffect(() => {
    // emit onto subject
    store.interactiveComponent$.next(`child-${i}`);

    // debugging logs
    console.log(`child ${i}: effect ran, `, performance.now());
    return () => console.log("child unmount", i);
  }, [i]);

  return (
    <>
      child {i}
      <hr />
    </>
  );
};

const App: React.FC<{}> = () => {
  const [n, setN] = useState(1000);

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
