import { Subject, Observer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StoreValue, StoreEvent } from '..';
import { debug } from 'debug';
import { StoreEventType } from './store-arg';

/**
 * Sources are a read-only interface from the subjects
 * contained in the store value. Effects/components can react to events
 * occurring on their "sources" as "input."
 *
 * Each effect gets its own specialized or curried version
 * of the subject's "next" method, with closure state that
 * references the effect's debug key, used for devtools.
 */
export type Sources<T extends StoreValue> = {
  [P in keyof T]: () => ReturnType<T[P]['asObservable']>;
};

/**
 * The createSources method takes a debug key (string), store value
 * (object containing subjects), and returns an object with the same
 * keys as the original store value, but instead of the subjects
 * themselves the values are an observable, which is curried with
 * the debug key & when subscribed to, subscribes to the underlying subjects.
 *
 * Each effect should get its own sources object, with its own debug key.
 *
 * @param effectName A debug key used for devtools
 * @param storeValue The Rx Store value, object containing subjects
 * @returns An object matching the shape of the original storeValue, but with observables
 * instead of the subjects themselves.
 */
export const createSources = <T extends StoreValue>(
  effectName: string,
  value: T,
  observer?: Observer<StoreEvent>
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
              `source ${subjectName} value: ${value}`
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
