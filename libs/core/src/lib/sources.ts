import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { debug } from 'debug';
import { StoreEventType, StoreObserver } from './store-event';
import { StoreValue } from './store-value';

/**
 * Sources are a read-only interface from the subjects
 * contained in the store value. Effects and consumers
 * can react to events occurring on their "sources" as their "input."
 *
 * Each effect gets its own specialized or curried version
 * of the subject's "next" method, with closure state that
 * references the effect's debug key, used for devtools.
 *
 * This is a mapped type in Typescript, meaning it has the same
 * type as the {@link StoreValue} except the values of the object
 * described by the type are mapped to observables, which essentially
 * "seals them off" and makes them read only.
 */
export type Sources<Value extends StoreValue> = {
  [P in keyof Value]: () => ReturnType<Value[P]['asObservable']>;
};

/**
 * The createSources method takes a debug key (string), {@link StoreValue}
 * (object containing subjects), and returns an object with the same
 * keys as the original {@link StoreValue}, but instead of the subjects
 * themselves the values are an observable, which is curried with
 * the debug key & when subscribed to, subscribes to the underlying subjects.
 *
 * Each effect should get its own sources object, with its own debug key.
 *
 * @param effectName A debug key used for devtools
 * @param storeValue The Rx {@link StoreValue} object containing subjects
 * @returns An object matching the shape of the original {@link StoreValue}, but with observables
 * instead of the subjects themselves.
 *
 * @internal
 */
export const createSources = <T extends StoreValue>(
  effectName: string,
  value: T,
  observer?: StoreObserver
): Sources<T> => {
  return Object.keys(value).reduce(
    (acc, subjectName) => ({
      ...acc,
      [subjectName]: () => {
        debug(`rx-store:${effectName}`)(`source ${subjectName}`);
        if (observer) {
          observer.next({
            type: StoreEventType.link,
            from: { type: StoreEventType.subject, name: subjectName },
            to: { type: StoreEventType.effect, name: effectName },
          });
        }
        return (value[subjectName] as Subject<any>).asObservable().pipe(
          tap((value) => {
            debug(`rx-store:${effectName}`)(
              `source ${subjectName} value:`,
              value
            );
            if (observer) {
              observer.next({
                type: StoreEventType.value,
                from: { type: StoreEventType.subject, name: subjectName },
                to: { type: StoreEventType.effect, name: effectName },
                value,
              });
            }
          })
        );
      },
    }),
    {}
  ) as Sources<T>;
};
