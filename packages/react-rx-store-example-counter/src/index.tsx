import React from "react";
import ReactDOM from "react-dom";
import Counter from "./Counter";
import { storeValue } from "./store/value";
import { appRootEffect } from "./store/effects";
import { Provider } from "@rx-store/react-rx-store";

ReactDOM.render(
  <React.StrictMode>
    {/* Render the `react-rx-store` Provider with the context value & root effect */}
    <Provider contextValue={storeValue} rootEffect={appRootEffect}>
      <Counter />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
