import { createStoreValue } from './store/value';
import { store } from '@rx-store/react';
import { appRootEffect } from './store/effects';
import { RootContextValue } from './types';

const value = createStoreValue();
export const { Manager, context } = store<RootContextValue>({
  value,
  effect: appRootEffect,
});

export const rootContext = context;
