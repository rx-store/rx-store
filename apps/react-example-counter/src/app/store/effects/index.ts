import {
  scan,
  delayWhen,
  withLatestFrom,
  map,
  switchMap,
  startWith,
  mergeMap,
} from 'rxjs/operators';
import { RxStoreEffect } from '@rx-store/rx-store';
import { AppContextValue } from '../../app-context-value.interface';
import { range, timer, merge, Observable } from 'rxjs';

const animateNumbers: (count: number) => RxStoreEffect<AppContextValue> = (
  count
) => (sources): Observable<number> =>
  range(0, count).pipe(
    delayWhen((value) => timer(value * 100)),
    withLatestFrom(sources.time$), // this is just here so you can see the "devtools" shows we used a source
    map(([a]) => a)
  );

/**
 * Rx Store will subscribe to the effect for us.
 *
 * While the effect is subscribed, values emitted on the `counterChange$`
 * source will be scanned over, the emitted `1` and `-1` values will be summed
 * (starting with 0), and the current sum will be emitted onto the count$ sink.
 *
 * The effect will remain subscribed while the <Manager /> component is mounted.
 */
export const counter: RxStoreEffect<AppContextValue> = (
  sources,
  sinks,
  spawnEffect
) =>
  sources.counterChange$.pipe(
    scan((acc, val) => acc + val, 0),
    startWith(0),
    mergeMap((count) => {
      // TODO - send args to runEffect instead of childEffect for introspection?
      return spawnEffect('count-up', animateNumbers(count));
    }),
    sinks.count$
  );

export const time: RxStoreEffect<AppContextValue> = (sources, sinks) =>
  timer(0, 1000).pipe(sinks.time$);

export const appRootEffect: RxStoreEffect<AppContextValue> = (
  sources,
  sinks,
  spawnEffect
) => merge(spawnEffect('time', time), spawnEffect('counter', counter));
