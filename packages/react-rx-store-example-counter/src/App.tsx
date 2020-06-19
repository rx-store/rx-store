import React, { useState, useContext, useEffect } from "react";
import { rxStoreContext } from "./store";

function App() {
  const [count, setCount] = useState<number>(0);
  const { subjects } = useContext(rxStoreContext);

  useEffect(() => {
    subjects.count$.subscribe(count => setCount(count));
  });

  return (
    <div className="App">
      count: {count}
      <button onClick={() => subjects.count$.next(count + 1)}>add</button>
      <button onClick={() => subjects.count$.next(count - 1)}>subtract</button>
    </div>
  );
}

export default App;
