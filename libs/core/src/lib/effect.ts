import { Observable, concat, of } from 'rxjs';
import { Sources, createSources } from './sources';
import { Sinks, createSinks } from './sinks';
import { StoreValue } from './store-value';
import { finalize, tap, filter } from 'rxjs/operators';
import { debug } from 'debug';
import { ensureDevtools } from './devtools';

export type SpawnEffect<T extends StoreValue> = (
  effect: Effect<T>,
  options?: {
    name: string;
  }
) => Observable<any>;

interface EffectArgs<T extends StoreValue> {
  sources: Sources<T>;
  sinks: Sinks<T>;
  spawnEffect: SpawnEffect<T>;
}

// Creates an observable that will be subscribed to *before*
// the underlying effect is subscribed to, will immediately
// run a devtools hook & complete.
const before$ = (ref: { name: string }) =>
  of(null).pipe(
    tap(() => {
      // TODO - add a devtools hook here
      debug(`rx-store:${ref.name}`)('spawn');
    }),
    filter(() => false)
  );

// Creates an observable that will be subscribed to *after*
// the underlying effect is subscribed to, will immediately
// run a devtools hook & complete.
const after = (ref: { name: string }) => {
  debug(`rx-store:${ref.name}`)('teardown');
  // TODO this won't cleanup on unsubscribe!
  window.__rxStoreEffects.next({
    ...ref,
    event: 'teardown',
  });
};

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
 * @param rootEffectFn
 */
export const spawnRootEffect = <T extends {}>(
  storeValue: T,
  rootEffectFn: Effect<T>
) => {
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
  const spawnEffect: SpawnEffect<T> = (effect, { name }) => {
    // Curries the sources and sinks with the debug key, to track this
    // effects "inputs" and "outputs" in the devtools.
    const sources = createSources(name, storeValue);
    const sinks = createSinks(name, storeValue);

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
      ensureDevtools();

      debug(`rx-store:${curriedNameWithId}`)('spawn');

      window.__rxStoreEffects.next({
        name: `${curriedNameWithId}`,
        event: 'spawn',
      });

      window.__rxStoreLinks.next({
        from: { type: 'effect', name },
        to: { type: 'effect', name: `${curriedNameWithId}` },
      });
      return spawnEffect(effect, {
        name: curriedNameWithId,
      });
    };

    // Run the effect function passing in the curried sources, sinks, and
    // spawnEffect function for the effectFn to run any of its children effectFn
    const effect$ = effect({ sources, sinks, spawnEffect: childSpawnEffect });

    // Sandwich the effect between before and after streams, allowing devools
    // hooks to run when the effect is subscribed & torn down.
    const ref = { name };
    return concat(before$(ref), effect$).pipe(finalize(() => after(ref)));
  };
  ensureDevtools();
  window.__rxStoreEffects.next({ name: `root`, event: 'spawn' });
  return spawnEffect(rootEffectFn, { name: 'root' });
};
