import { createStoreValue } from './store/value';
import { store } from '@rx-store/react';
import { appRootEffect as effect } from './store/effects';

const value = createStoreValue();
export const { Manager, context } = store({ value, effect });

export const rootContext = context;
