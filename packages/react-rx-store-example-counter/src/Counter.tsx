import React from "react";
import { useRxStore, useSubscription } from "@rx-store/react-rx-store";
import { AppContextValue } from "./types";

function Counter() {
  const { subjects, observables } = useRxStore<AppContextValue>();

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
