import { scan, startWith, tap, delayWhen, switchMap } from 'rxjs/operators';
import { RxStoreEffect } from '@rx-store/rx-store';
import { AppContextValue } from '../../app-context-value.interface';
import { range, timer } from 'rxjs';

const childEffect: (count: number) => RxStoreEffect<AppContextValue> = (
  count
) => (sources, sinks) =>
  range(0, count).pipe(delayWhen((value) => timer(value * 100)));

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
  createChildEffect
) =>
  sources.counterChange$.pipe(
    scan((acc, val) => acc + val, 0),
    startWith(0),
    switchMap((count) => {
      return createChildEffect(childEffect(count));
    }),
    tap((count: number) => sinks.count$(count))
  );
