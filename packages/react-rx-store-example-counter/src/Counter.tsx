import React from "react";
import { useRxStore, useSubscription } from "@rx-store/react-rx-store";
import { AppContextValue } from "./types";

function Counter() {
  const store = useRxStore<AppContextValue>();

  const [count] = useSubscription(store.count$);
  const [localCount] = useSubscription(store.localCount$);

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
