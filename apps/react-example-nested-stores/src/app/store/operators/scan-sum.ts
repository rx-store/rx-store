import { Observable } from "rxjs";
import { scan, startWith } from "rxjs/operators";

/**
 * An operator that sums up the values the source observables emits
 * and emits the running total each time the source observable emits. Starts
 * with emitting 0 when subscribed to.
 */
export const scanSum = () => (source$: Observable<any>): Observable<number> =>
  source$.pipe(
    scan((acc, val) => acc + val, 0),
    startWith(0)
  );
