import { createStoreValue } from './store/value';
import { store } from '@rx-store/react';
import { appRootEffect as effect } from './store/effects';
import { ReplaySubject } from 'rxjs';
import { StoreEvent } from '@rx-store/core';

export const devTools$ = new ReplaySubject<StoreEvent>(5000);

const value = createStoreValue();
export const { Manager, context } = store({
  value,
  effect,
  observer: devTools$,
});

export const rootContext = context;
