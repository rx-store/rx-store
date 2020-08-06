import { scan, startWith, switchMap } from 'rxjs/operators';
import { RxStoreEffect } from '@rx-store/rx-store';
import { AppContextValue } from '../../app-context-value.interface';
import { timer, merge } from 'rxjs';

/**
 * Rx Store will subscribe to the effect for us.
 *
 * While the effect is subscribed, values emitted on the `counterChange$`
 * source will be scanned over, the emitted `1` and `-1` values will be summed
 * (starting with 0), and the current sum will be emitted onto the count$ sink.
 *
 * The effect will remain subscribed while the <Manager /> component is mounted.
 */
export const counter: RxStoreEffect<AppContextValue> = ({
  sources,
  sinks,
  spawnEffect,
}) =>
  sources.counterChange$().pipe(
    scan((acc, val) => acc + val, 0),
    startWith(0),
    switchMap(() =>
      spawnEffect(() => timer(0, 1000), { name: 'timer'})
    ),
    sinks.count$()
  );

export const time: RxStoreEffect<AppContextValue> = ({ sinks }) =>
  timer(0, 1000).pipe(sinks.time$());

export const appRootEffect: RxStoreEffect<AppContextValue> = ({
  spawnEffect,
}) =>
  merge(
    spawnEffect(time, { name: 'time' }),
    spawnEffect(counter, { name: 'counter' })
  );
