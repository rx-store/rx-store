import { Observable, Subject } from 'rxjs';
import { Sources } from './sources';
import { Sinks } from './sinks';
import { StoreValue } from '..';


export type SpawnEffect<T extends StoreValue> = (effect: RxStoreEffect<T>, options?: {
  name: string,
}) => Observable<any>;

interface RxStoreEffectArg<T extends StoreValue> {
  sources: Sources<T>;
  sinks: Sinks<T>;
  spawnEffect: SpawnEffect<T>;
}

/**
 * An effect is a function that is injected with sources, sinks, can spawn
 * effects using the injected spawnEffect() helper. The effect encapsulates
 * a unit of work as an observable. The work does not actually run until that
 * observable is subscribed to, by the <Manager /> component.
 */
export type RxStoreEffect<T extends StoreValue> = (
  obj: RxStoreEffectArg<T>
) => Observable<any>;
