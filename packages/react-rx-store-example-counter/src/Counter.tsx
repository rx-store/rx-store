import React from "react";
import { useSubscription, useStore } from "@rx-store/react-rx-store";
import { ChildContextValue } from "./App";

function Counter() {
  const store = useStore<ChildContextValue>();

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
