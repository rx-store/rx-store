import { Observable, Observer } from 'rxjs';
import { Sources, createSources } from './sources';
import { Sinks, createSinks } from './sinks';
import { StoreValue } from './store-value';
import { finalize, tap } from 'rxjs/operators';
import { debug } from 'debug';
import { StoreEventType, StoreEvent } from './store-event';

/**
 * The **SpawnEffect** type is a generic type describing the type of
 * the spawnEffect function. Pass the **StoreValue** type to
 * the **SpawnEffect** type to consume it as a type. This ensures consumers
 * of the **SpawnEffect** typing get the mapped type's with the sources &
 * sinks typings. Example:
 *
 * SpawnEffect<AppStoreValue>.
 *
 *
 * The **function signature** specified by this typing is also itself
 * a generic. This is so that if you want to spawn an inner
 * effect that projects values onto the outer effect that spawned it,
 * you can type check that the inner effect projects the correct type of
 * value back, and to ensure that if the inner effect is flattened back into
 * the outer effect, the outer effect has access to the correct typings:
 *
 *  spawnEffect<boolean>(() => from(...).mapTo(true))
 */
export type SpawnEffect<Subjects extends StoreValue> = <Projected>(
  effect: Effect<Subjects, Projected>,
  options: {
    name: string;
  }
) => Observable<Projected>;

/**
 * As the name suggests, this is for internal use only. End users
 * are intended to use **spawnRootEffect**, and then their effect
 * is passed a curried **spawnEffect** function to spawn inner effects
 * recursively. As this happens, we build a "stack" tracking where all
 * the effects were spawned from. In order to keep the "stack" internal
 * to prevent users corrupting it and to simplify the public API, the
 * **spawnRootEffect** and **spawnEffect** functions both internally
 * call **spawnEffectInternal**, which itself is used to curry and then
 * close over the sources, sinks, and **spawnEffect** function. Only
 * the internal function has access to the stack.
 */
type SpawnEffectInternal<Subjects extends StoreValue> = <Projected = unknown>(
  effect: Effect<Subjects, Projected>,
  stack: string[]
) => Observable<Projected>;

/**
 * This interface defines the object passed to all effect
 * functions as an argument. Via the object defined by this
 * interface, effects can access the sources, sinks, and
 * spawnEffect function (used to spawn inner effects)
 */
export interface EffectArgs<Subjects extends StoreValue> {
  sources: Sources<Subjects>;
  sinks: Sinks<Subjects>;
  spawnEffect: SpawnEffect<Subjects>;
}

/**
 * This is the function signature that all effects must implement.
 *
 * An effect is a function that is injected with sources, sinks, can spawn
 * effects using the injected spawnEffect() helper. The effect encapsulates
 * a unit of work as an observable. The work does not actually run until that
 * observable is subscribed to, by the <Manager /> component.
 *
 * This typing is generic, the first argument to the generic is used to
 * configure the mapped types for the sources & sinks that are passed to the
 * effect function implementing this type. The second generic paramater is used
 * to specify the projected value, in case you are flattening values into the outer
 * effect and want to strongly type the interface between the outer & inner effect.
 */
export type Effect<Subjects extends StoreValue, Projected = unknown> = (
  effectArgs: EffectArgs<Subjects>
) => Observable<Projected>;

/**
 * This typing is used to refer to the root effect in particular
 * which is a specialized version of the Effect which must not project
 * any values, since there is no effect above it & Rx Store does not
 * use any of the values projected by the root effect.
 */
export type RootEffect<Subjects extends StoreValue> = (
  effectArgs: EffectArgs<Subjects>
) => Observable<never>;

/**
 * This typing specifies the object that must be passed to the
 * **spawnRootEffect** function. Users must pass in a store value,
 * the root effect they are spawning, and can optionally pass in an observer
 * used to observe all events happening anywhere in the store.
 */
export interface SpawnRootEffectArgs<Subjects extends StoreValue> {
  value: Subjects;
  effect: RootEffect<Subjects>;
  observer?: Observer<StoreEvent>;
}

/**
 * This hashmap is used to keep track of an auto incrementing counter
 * so that each instance of the effect is numbered and can be distinguised
 * from other instances of the same effect when introspecting store events
 * with the store observer / devtools.
 */
const ids: Record<string, number> = {};

/**
 * This function resets the auto-incrementing IDs, it is used to make
 * tests deterministic if they need to assert on the dynamically generated
 * effect IDs. You could also use this to reset the IDs for some other use case.
 */
export const resetIds = () => {
  Object.keys(ids).forEach((key) => {
    delete ids[key];
  });
};

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
export const spawnRootEffect = <Subjects extends StoreValue>({
  value,
  effect,
  observer,
}: SpawnRootEffectArgs<Subjects>): Observable<never> => {
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
  const spawnEffectInternal: SpawnEffectInternal<Subjects> = (
    effect,
    stack
  ) => {
    const name = stack[stack.length - 1];
    const parentName: string | undefined = stack[stack.length - 2];
    // Curries the sources and sinks with the debug key, to track this
    // effects "inputs" and "outputs" in the devtools.
    const sources = createSources(name, value, observer);
    const sinks = createSinks(name, value, observer);

    // Keeps the "context" intact, by appending to name to create a path
    // each time an effect creates a child effect by running it's curried `spawnEffect()`
    const childSpawnEffect: SpawnEffect<Subjects> = (
      effect,
      { name: childName }
    ) => {
      if (undefined === ids[childName]) {
        ids[childName] = 1;
      } else {
        ids[childName]++;
      }
      const id = ids[childName];
      const curriedNameWithId = `${childName}${id === 1 ? '' : id}`;

      debug(`rx-store:${curriedNameWithId}`)('spawn from', parentName);

      if (observer) {
        observer.next({
          type: StoreEventType.effect,
          name: `${curriedNameWithId}`,
          event: 'spawn',
        });

        observer.next({
          type: StoreEventType.link,
          to: { type: StoreEventType.effect, name },
          from: { type: StoreEventType.effect, name: `${curriedNameWithId}` },
        });
      }

      return spawnEffectInternal(effect, [...stack, curriedNameWithId]);
    };

    // Run the effect function passing in the curried sources, sinks, and
    // spawnEffect function for the effectFn to run any of its children effectFn
    const effect$ = effect({ sources, sinks, spawnEffect: childSpawnEffect });

    return effect$.pipe(
      tap((val) => {
        debug(`rx-store:${stack.join(':')}`)(`inner effect:`, val);
        if (observer) {
          observer.next({
            type: StoreEventType.value,
            to: { type: StoreEventType.effect, name },
            from: { type: StoreEventType.effect, name: parentName || '' },
            value: val,
          });
        }
      }),
      finalize(() => {
        debug(`rx-store:${name}`)('teardown');
        // TODO this won't cleanup on unsubscribe!
        if (observer) {
          observer.next({
            type: StoreEventType.effect,
            event: 'teardown',
            name,
          });
        }
      })
    );
  };
  debug(`rx-store:root`)('spawn');
  if (observer) {
    observer.next({
      type: StoreEventType.effect,
      name: `root`,
      event: 'spawn',
    });
  }
  return spawnEffectInternal<never>(effect, ['root']);
};
