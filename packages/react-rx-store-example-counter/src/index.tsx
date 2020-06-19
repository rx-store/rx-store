import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { RxStoreProvider, appContextValue, appRootEffect } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <RxStoreProvider value={appContextValue} rootEffect={appRootEffect}>
      <App />
    </RxStoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
