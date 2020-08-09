import { scan, startWith } from 'rxjs/operators';
import { Effect } from '@rx-store/rx-store';
import { RootAppStore } from '../../types';

/**
 * For any "global side effects", you'd create effects, and nest
 * them under your root effect.
 *
 * In this example, we globally subsribe to the `counterChange$`
 * subject, we scan over the `1` and `-1` values, emitting a running total,
 * and start it with 0. We "next"  or emit the values onto the count$
 * subject.
 *
 * These global side effects are subscribed when the top level
 * Rx Store <Provider /> is first mounted, and unsubscribed for you
 * when that component unmounts.
 *
 * You also have the option to make your subscriptions not global,
 * by accessing the context value directly in your components, and
 * subscribing. See the <Provider /> component for an example.
 */
export const appRootEffect: Effect<RootAppStore> = ({sources, sinks}) => {
  return sources.counterChange$()
    .pipe(
      scan((acc, val) => acc + val, 0),
      startWith(0),
      sinks.count$()
    )
};
