import { Observable, Subject } from 'rxjs';
import { Sources } from './sources';
import { Sinks } from './sinks';
import { RxStoreValue } from '..';


export type SpawnEffect<T extends RxStoreValue> = (effect: RxStoreEffect<T>, options?: {
  name: string,
}) => Observable<any>;

interface RxStoreEffectArg<T extends RxStoreValue> {
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
export type RxStoreEffect<T extends RxStoreValue> = (
  obj: RxStoreEffectArg<T>
) => Observable<any>;
