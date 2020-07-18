import {createStoreValue} from "./store/value";
import {store} from "@rx-store/react-rx-store";
import {appRootEffect} from "./store/effects";


const value = createStoreValue();
export const { Manager, context } = store(value, appRootEffect);

export const rootContext = context;
