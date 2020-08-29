import { scan, startWith, take, mergeMap } from 'rxjs/operators';
import { Effect } from '@rx-store/core';
import { AppContextValue } from '../../app-context-value.interface';
import { of, interval } from 'rxjs';

/**
 * Rx Store will subscribe to the effect for us.
 *
 * While the effect is subscribed, values emitted on the `counterChange$`
 * source will be scanned over, the emitted `1` and `-1` values will be summed
 * (starting with 0), and the current sum will be emitted onto the count$ sink.
 *
 * The effect will remain subscribed while the <Manager /> component is mounted.
 */
export const appRootEffect: Effect<AppContextValue> = ({
  sources,
  sinks,
  spawnEffect,
}) => {
  // return spawnEffect(
  //   ({ spawnEffect }) => {
  //     return interval(1000).pipe(
  //       mergeMap((val) => {
  //         return spawnEffect(({ sinks }) => interval(1000).pipe(take(10)), {
  //           name: 'foo',
  //         });
  //       }),
  //       sinks.count$()
  //     );
  //   },
  //   { name: 'test' }
  // );
  return sources.counterChange$().pipe(
    scan((acc, val) => acc + val, 0),
    startWith(0),
    sinks.count$()
  );
};
