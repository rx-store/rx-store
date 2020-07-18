import Counter from "./Counter";
import React, { useState } from "react";

const App: React.FC<{}> = () => {
  const [n, setN] = useState(1);

  return (
    <>
      {new Array(n).fill(null).map((_, i) => (
        <Counter key={i} />
      ))}
      <button onClick={() => setN(n + 1)}>add a counter</button>
      <button onClick={() => setN(n - 1)}>remove a counter</button>
    </>
  );
};

export default App;
