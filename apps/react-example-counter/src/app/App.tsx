import Counter from './Counter';
import React, { useState, useMemo } from 'react';

const App: React.FC<{}> = () => {
  // const [n, setN] = useState(1);
  const n = 1;
  return (
    <>
      {/* {new Array(n).fill(null).map((_, i) => ( */}
      <Counter />
      {/* ))} */}
      {/* <button onClick={}>add a counter</button>
      <button onClick={() => setN(n - 1)}>remove a counter</button> */}
    </>
  );
};

export default App;
