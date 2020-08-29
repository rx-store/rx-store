import { StoreValue, Effect } from '..';
import { Observer } from 'rxjs';

export enum StoreEventType {
  subject = 'subject',
  effect = 'effect',
  value = 'value',
  link = 'link',
}

export interface StoreEventNode {
  type: StoreEventType.subject | StoreEventType.effect;
  name: string;
}

export interface StoreEventLink {
  type: StoreEventType.link;
  from: StoreEventNode;
  to: StoreEventNode;
}

export interface StoreEventEffect {
  type: StoreEventType.effect;
  name: string;
  event: 'spawn' | 'teardown';
}

export interface StoreEventSubject {
  type: StoreEventType.subject;
  name: string;
}

export interface StoreEventValue {
  type: StoreEventType.value;
  from: StoreEventNode;
  to: StoreEventNode;
  value: unknown;
}

export type StoreEvent =
  | StoreEventLink
  | StoreEventEffect
  | StoreEventSubject
  | StoreEventValue;
