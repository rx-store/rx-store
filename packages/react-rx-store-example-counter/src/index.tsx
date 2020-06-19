import React from "react";
import ReactDOM from "react-dom";
import { storeValue } from "./store/value";
import { appRootEffect } from "./store/effects";
import { Provider } from "@rx-store/react-rx-store";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    {/* Render the `react-rx-store` Provider with the context value & root effect */}
    <Provider value={storeValue} rootEffect={appRootEffect}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
