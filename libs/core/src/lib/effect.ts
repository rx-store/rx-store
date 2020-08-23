import { Observable } from 'rxjs';
import { Sources, createSources } from './sources';
import { Sinks, createSinks } from './sinks';
import { StoreValue } from './store-value';
import { finalize, tap } from 'rxjs/operators';
import { debug } from 'debug';
import { StoreArg } from './store-arg';

export type SpawnEffect<T extends StoreValue> = (
  effect: Effect<T>,
  options: {
    name: string;
    parentName?: string; // internal ONLY!
  }
) => Observable<any>;

interface EffectArgs<T extends StoreValue> {
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
export type Effect<T extends StoreValue> = (
  effectArgs: EffectArgs<T>
) => Observable<any>;

const ids: Record<string, number> = {};

/**
 * The spawnRootEffect runs the root effect which means the effectFn is called
 * with curried sources, sinks, and its own spawnEffect function used
 * to spawn child effects recursively.
 *
 * Running effects does not involve subscribing to the observables they return,
 * which is the responsibility of the <Manager /> component to subscribe/unsubscribe.
 * Running the effects only involves calling the effectFn, passing in curried sources, sinks
 * and spawnEffect function.
 *
 * @param storeValue
 * @param effect
 */
export const spawnRootEffect = <T extends StoreValue>({
  value,
  effect,
  observer,
}: StoreArg<T>) => {
  /**
   * spawnEffect closes over the `storeValue`. It takes in a `name`
   * and an effectFn.
   *
   * It curries sources, sinks, and a spawnEffect specific to the effectFn
   * being spawned, such that we retain the stack or context of where each
   * effect was spawned, all the way back to the root effect, for any effect,
   * like a stack trace.
   *
   * The effect (observable) is also wrapped in before and after "hooks" for
   * devtools, so devtools can known when the effect is actuall subscribed & torn down.
   *
   * The curried sources and sinks also have devtools hooks embedded in them such
   * that devtools knows when each effect receives value(s), which subject(s) they came
   * from, and which subject(s) each effect sinks data back into.
   */
  const spawnEffect: SpawnEffect<T> = (effect, { parentName, name }) => {
    // Curries the sources and sinks with the debug key, to track this
    // effects "inputs" and "outputs" in the devtools.
    const sources = createSources(name, value, observer);
    const sinks = createSinks(name, value, observer);

    // Keeps the "context" intact, by appending to name to create a path
    // each time an effect creates a child effect by running it's curried `spawnEffect()`
    const childSpawnEffect: SpawnEffect<T> = (effect, { name: childName }) => {
      const curriedName = name + ':' + childName;
      if (undefined === ids[curriedName]) {
        ids[curriedName] = 1;
      } else {
        ids[curriedName]++;
      }
      const id = ids[curriedName];
      const curriedNameWithId = `${curriedName}${id === 1 ? '' : id}`;

      debug(`rx-store:${curriedNameWithId}`)('spawn');

      if (observer) {
        observer.next({
          type: 'effect',
          name: `${curriedNameWithId}`,
          event: 'spawn',
        });

        observer.next({
          type: 'link',
          to: { type: 'effect', name },
          from: { type: 'effect', name: `${curriedNameWithId}` },
        });
      }
      return spawnEffect(effect, {
        parentName: name,
        name: curriedNameWithId,
      });
    };

    // Run the effect function passing in the curried sources, sinks, and
    // spawnEffect function for the effectFn to run any of its children effectFn
    const effect$ = effect({ sources, sinks, spawnEffect: childSpawnEffect });

    return effect$.pipe(
      tap((val) => {
        debug(`rx-store:${parentName}:${name}`)(`inner effect: ${val}`);
        if (observer) {
          observer.next({
            type: 'value',
            to: { type: 'effect', name },
            from: { type: 'effect', name: parentName },
            value: val,
          });
        }
      }),
      finalize(() => {
        debug(`rx-store:${name}`)('teardown');
        // TODO this won't cleanup on unsubscribe!
        if (observer) {
          observer.next({
            type: 'effect',
            event: 'teardown',
            name,
          });
        }
      })
    );
  };
  debug(`rx-store:root`)('spawn');
  if (observer) {
    observer.next({ type: 'effect', name: `root`, event: 'spawn' });
  }
  return spawnEffect(effect, { name: 'root' });
};
