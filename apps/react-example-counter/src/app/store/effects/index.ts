import {
  scan,
  startWith,
  tap,
  delayWhen,
  withLatestFrom,
  map,
  exhaustMap,
} from 'rxjs/operators';
import { RxStoreEffect } from '@rx-store/rx-store';
import { AppContextValue } from '../../app-context-value.interface';
import { range, timer } from 'rxjs';

const countUpEffect: (count: number) => RxStoreEffect<AppContextValue> = (
  count
) => (sources, sinks, runEffect) =>
  range(0, count).pipe(
    delayWhen((value) => timer(value * 1000)),
    withLatestFrom(sources.counterChange$), // this is just here so you can see the "devtools" shows we used a source
    map(([a, b]) => a)
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
export const appRootEffect: RxStoreEffect<AppContextValue> = (
  sources,
  sinks,
  spawnEffect
) =>
  sources.counterChange$.pipe(
    scan((acc, val) => acc + val, 0),
    startWith(0),
    exhaustMap((count) => {
      // TODO - send args to runEffect instead of childEffect for introspection?
      return spawnEffect('count-up', countUpEffect(count));
    }),
    tap((count: number) => sinks.count$(count))
  );
