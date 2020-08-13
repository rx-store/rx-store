import { createStoreValue } from './store/value';
import { store } from '@rx-store/react';
import { appRootEffect as effect } from './store/effects';
import { ReplaySubject } from 'rxjs';

window.__rxstore_devtools_observer = new ReplaySubject(5000);

const value = createStoreValue();
export const { Manager, context } = store({
  value,
  effect,
  observer: window.__rxstore_devtools_observer,
});

export const rootContext = context;
