import React from "react";
import ReactDOM from "react-dom";
import { createStoreValue } from "./store/value";
import { appRootEffect } from "./store/effects";
import App from "./App";
import { store } from "@rx-store/react-rx-store";

const value = createStoreValue();
const { Manager, context } = store(value, appRootEffect);

export const rootContext = context;

ReactDOM.render(
  <React.StrictMode>
    {/* Render the `react-rx-store` Provider with the context value & root effect */}
    <Manager>
      <App />
    </Manager>
  </React.StrictMode>,
  document.getElementById("root")
);
