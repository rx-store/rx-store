import React, { useState, useContext, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {rxStoreContext}from "./index"

function App() {
  const [count, setCount] = useState<number>(0);
  const rxStoreValue = useContext(rxStoreContext)
  useEffect(() => {
    rxStoreValue.count.subscribe((count) => setCount(count))
  })
  return (
    <div className="App">
        count: {count}
        <button onClick={() => rxStoreValue.count.next(count+1)}>add</button>
        <button onClick={() => rxStoreValue.count.next(count-1)}>subtract</button>
    </div>
  );
}

export default App;
