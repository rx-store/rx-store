import React, { createContext, useEffect } from "react";
import { RxStoreValue, RxStoreEffect } from "@rx-store/rx-store";

export const context = createContext<RxStoreValue | null>(null);

/**
 * Mount this at the top of your app.
 *
 * It subscribes your Rx Store's root effect, and provides a context
 * allowing children components to subscribe to the streams in the
 * context value.
 */
export const Provider: React.FC<{
  contextValue: RxStoreValue;
  rootEffect: RxStoreEffect<any>;
}> = ({ children, rootEffect, contextValue }) => {
  useEffect(rootEffect(contextValue), [contextValue]);
  return <context.Provider value={contextValue}>{children}</context.Provider>;
};
