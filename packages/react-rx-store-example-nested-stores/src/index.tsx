import React, { useEffect, useState, Children } from "react";
import ReactDOM from "react-dom";
import { createStoreValue } from "./store/value";
import { appRootEffect } from "./store/effects";
import App from "./App";
import { store } from "@rx-store/react-rx-store";

const value = createStoreValue();
const { Manager, context } = store(value, appRootEffect);

export const rootContext = context;

const Renders: React.FC<{}> = (props) => {
  const [state, setState] = useState<number>();
  useEffect(() => {
    setInterval(() => setState(Math.random()), 1000);
  }, []);
  return (
    <>
      {state}
      {props.children}
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    {/* Render the `react-rx-store` Provider with the context value & root effect */}
    <Renders>
      <Manager>
        <App />
      </Manager>
    </Renders>
  </React.StrictMode>,
  document.getElementById("root")
);

// ReactDOM.render(
//   <Manager>
//     <App />
//   </Manager>,
// document.getElementById("root")
// );
