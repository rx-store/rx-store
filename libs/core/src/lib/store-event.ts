import { Observer } from 'rxjs';

/**
 * These enumerate the different types of events emitted on the {@link StoreObserver}
 */
export enum StoreEventType {
  subject = 'subject',
  effect = 'effect',
  value = 'value',
  link = 'link',
}

/**
 * This is not an event, this is a typing that describes a node
 * which is used by various events to refer to "subjects" and "effects"
 */
export interface StoreEventNode {
  type: StoreEventType.subject | StoreEventType.effect;
  name: string;
}

/**
 * This event is emitted on the {@link StoreObserver} anytime there is a new "link" between
 * "nodes", meaning Rx Store becomes aware that an effect node
 * consumer or emits onto a subject node.
 */
export interface StoreEventLink {
  type: StoreEventType.link;
  from: StoreEventNode;
  to: StoreEventNode;
}

/**
 * This event is emitted on the {@link StoreObserver} anytime an effect is spawned or torn down
 */
export interface StoreEventEffect {
  type: StoreEventType.effect;
  name: string;
  event: 'spawn' | 'teardown';
}

/**
 * This event is emitted on the {@link StoreObserver} anytime there is a subject, meaning
 * any new subject or effect that Rx Store becomes aware of
 */
export interface StoreEventSubject {
  type: StoreEventType.subject;
  name: string;
}

/**
 * This event is emitted on the {@link StoreObserver} anytime there is a value, meaning:
 * - An {@link Effect} projected a value to the {@link Effect} that spawned it
 * - A subject in the {@link StoreValue} emitted a value that triggered an {@link Effect}'s {@link Sources}
 * - An {@link Effect} emitted a value onto one of the subjects in the {@link StoreValue} via on of it's {@link Sinks}
 */
export interface StoreEventValue {
  type: StoreEventType.value;
  from: StoreEventNode;
  to: StoreEventNode;
  value: unknown;
}

/**
 * This is a discriminated union of all events for each {@link StoreEventType}
 */
export type StoreEvent =
  | StoreEventLink
  | StoreEventEffect
  | StoreEventSubject
  | StoreEventValue;

/**
 * Rx Store accepts a `StoreObserver` which emits {@link StoreEvent}`s, which is
 * used by devtools & the visualizer, it can also be hooked into for
 * any use which requires observing the events in the store.
 */
export type StoreObserver = Observer<StoreEvent>;
