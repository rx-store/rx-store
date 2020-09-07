import { StoreValue } from '..';
import { debug } from 'debug';
import { tap } from 'rxjs/operators';
import { Observable, MonoTypeOperatorFunction, Observer } from 'rxjs';
import { StoreEvent, StoreEventType } from './store-arg';

/**
 * Sinks are a write-only interface into the subjects
 * contained in the store value. Effects/components can emit events
 * onto their sinks to "output".
 *
 * Each effect gets its own specialized or curried version
 * of the subject's "next" method, with closure state that
 * references the effect's debug key, used for devtools.
 *
 * The next method from the subject is then wrapped in an operator
 * such that it can be consumed by referencing it from a pipeline
 *
 * This is a mapped type in Typescript, meaning it has the same
 * type as the {@link StoreValue} except the values of the object
 * described by the type are mapped to `next()` methods, which essentially
 * "seals them off" and makes them write only.
 */
export type Sinks<T extends StoreValue> = {
  [P in keyof T]: () => MonoTypeOperatorFunction<Parameters<T[P]['next']>[0]>;
};

/**
 * The createSinks method takes a debug key (string), {@link StoreValue}
 * (object containing subjects), and returns an object with the same
 * keys as the original {@link StoreValue} passed in to the method,
 * but instead of the subjects themselves the values are a "next" method, which is
 * curried with the debug key & forwards the events to the underlying subjects.
 *
 * Each effect should get its own sinks object, with its own debug key.
 *
 * @param effectName A debug key used for devtools
 * @param storeValue The Rx Store value, object containing subjects
 * @returns An object matching the shape of the original storeValue, but with "next" methods
 * instead of the subjects themselves.
 *
 * @internal
 */
export const createSinks = <T extends StoreValue>(
  effectName: string,
  storeValue: T,
  observer?: Observer<StoreEvent>
): Sinks<T> => {
  return Object.keys(storeValue).reduce(
    (acc, subjectName) => ({
      ...acc,
      [subjectName]: () => {
        debug(`rx-store:${effectName}`)(`sink ${subjectName}`);
        if (observer) {
          observer.next({
            type: StoreEventType.link,
            to: { type: StoreEventType.subject, name: subjectName },
            from: { type: StoreEventType.effect, name: effectName },
          });
        }
        return (source: Observable<unknown>) => {
          return source.pipe(
            tap((value) => {
              debug(`rx-store:${effectName}`)(`sink ${subjectName}:`, value);
              if (observer) {
                observer.next({
                  type: StoreEventType.value,
                  to: { type: StoreEventType.subject, name: subjectName },
                  from: { type: StoreEventType.effect, name: effectName },
                  value,
                });
              }
              storeValue[subjectName].next(value);
            })
          );
        };
      },
    }),
    {}
  ) as Sinks<T>;
};
