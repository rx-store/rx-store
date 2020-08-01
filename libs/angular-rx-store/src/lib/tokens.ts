import { InjectionToken, Type } from '@angular/core';

export const ROOT_RX_STORE = new InjectionToken<Type<unknown>>(
  'Root Rx-Store Store'
);
export const ROOT_RX_EFFECTS = new InjectionToken<Type<unknown>>(
  'Root Rx-Store Effects'
);
