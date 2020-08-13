import { StoreValue, Effect } from '..';
import { Observer } from 'rxjs';
import { Context } from 'vm';

export interface StoreEventNode {
  type: 'subject' | 'effect';
  name: string;
}

export interface StoreEventLink {
  type: 'link';
  from: StoreEventNode;
  to: StoreEventNode;
}

export interface StoreEventEffect {
  type: 'effect';
  name: string;
  event: 'spawn' | 'teardown';
}

export interface StoreEventSubject {
  type: 'subject';
  name: string;
}

export interface StoreEventValue {
  type: 'value';
  from: StoreEventNode;
  to: StoreEventNode;
  value: unknown;
}

export type StoreEvent =
  | StoreEventLink
  | StoreEventEffect
  | StoreEventSubject
  | StoreEventValue;

export interface StoreArg<T extends StoreValue> {
  effect?: undefined | Effect<T>;
  value: T;
  observer?: Observer<StoreEvent>;
}
