import React from "react";
import { useSubscription, useStore } from "@rx-store/react-rx-store";
import {rootContext} from "./Manager";

function Counter() {
  const store = useStore(rootContext);

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
