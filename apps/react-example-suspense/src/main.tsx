import React from 'react-experimental';
import ReactDOM from 'react-dom-experimental';
import { StoreValue, Effect } from '@rx-store/core';
import { store } from '@rx-store/react';
import { BehaviorSubject, Subject, interval } from 'rxjs';
import App from './app/app';
import { Suspense } from 'react';
import { scan } from 'rxjs/operators';

interface AppStoreValue extends StoreValue {
  count$: Subject<number>;
}

const storeValue: AppStoreValue = {
  count$: new BehaviorSubject(0),
};

const effect: Effect<AppStoreValue> = ({ sources, sinks }) =>
  interval(1000).pipe(sinks.count$());

const { Manager, context } = store({ value: storeValue, effect });
export const rootContext = context;

ReactDOM.unstable_createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Manager>
      <App />
    </Manager>
  </React.StrictMode>
);
