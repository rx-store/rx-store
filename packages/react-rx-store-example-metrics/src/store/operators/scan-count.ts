import { Observable } from "rxjs";
import { scan, startWith } from "rxjs/operators";

/**
 * An operator that counts up how many times the source observables emits
 * and emits the running total each time the source observable emits. Starts
 * with emitting 0 when subscribed to.
 */
export const scanCount = () => (source$: Observable<any>): Observable<number> =>
  source$.pipe(
    scan((acc, _) => acc + 1, 0),
    startWith(0)
  );
