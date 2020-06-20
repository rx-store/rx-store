import React from "react";
import ReactDOM from "react-dom";
import { createStoreValue } from "./store/value";
import { appRootEffect } from "./store/effects";
import App from "./App";
import { createStore } from "@rx-store/react-rx-store";

const value = createStoreValue();
const { Manager, useStore } = createStore(value, appRootEffect);

export const useRootStore = useStore;

ReactDOM.render(
  <React.StrictMode>
    {/* Render the `react-rx-store` Provider with the context value & root effect */}
    <Manager>
      <App />
    </Manager>
  </React.StrictMode>,
  document.getElementById("root")
);
