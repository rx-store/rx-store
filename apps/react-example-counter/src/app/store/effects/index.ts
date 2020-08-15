import { scan, startWith } from 'rxjs/operators';
import { Effect } from '@rx-store/core';
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
export const counter: Effect<AppContextValue> = ({ sources, sinks }) =>
  sources.counterChange$().pipe(
    scan((acc, val) => acc + val, 0),
    startWith(0),
    sinks.count$()
  );

export const time: Effect<AppContextValue> = ({ sinks }) =>
  timer(0, 1000).pipe(sinks.time$());

export const appRootEffect: Effect<AppContextValue> = ({ spawnEffect }) =>
  merge(
    spawnEffect(time, { name: 'time' }),
    spawnEffect(counter, { name: 'counter' })
  );
