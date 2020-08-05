import { RxStoreValue } from '..';
import { debug } from 'debug';
import { tap } from 'rxjs/operators';
import { Observable, MonoTypeOperatorFunction, Subject } from 'rxjs';

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
 */
export type Sinks<T extends RxStoreValue> = {
  [P in keyof T]?: MonoTypeOperatorFunction<Parameters<T[P]['next']>[0]>;
};

/**
 * The createSinks method takes a debug key (string), store value
 * (object containing subjects), and returns an object with the same
 * keys as the original store value, but instead of the subjects
 * themselves the values are a "next" method, which is curried with
 * the debug key & forwards the events to the underlying subjects.
 *
 * Each effect should get its own sinks object, with its own debug key.
 *
 * @param debugKey A debug key used for devtools
 * @param storeValue The Rx Store value, object containing subjects
 * @returns An object matching the shape of the original storeValue, but with "next" methods
 * instead of the subjects themselves.
 */
export const createSinks = <StoreValue extends {}>(
  debugKey: string,
  storeValue: StoreValue
): Sinks<StoreValue> => {
  return Object.keys(storeValue).reduce(
    (acc, subjectName) => ({
      ...acc,
      [subjectName]: (source: Observable<any>) => {
        return source.pipe(
          tap((value) => {
            debug(`rx-store:${debugKey}`)(`sink ${subjectName}: ${value}`);
            if(!window.__devtools_sinks) {
              window.__devtools_sinks = new Subject<any>()
            }
            window.__devtools_sinks.next({subjectName, debugKey})
            storeValue[subjectName].next(value);
          })
        );
      },
    }),
    {}
  ) as Sinks<StoreValue>;
};
