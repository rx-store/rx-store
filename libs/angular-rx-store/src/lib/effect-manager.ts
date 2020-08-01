import { merge, Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export const createEffectManager = (unsubscribeNotifier$: Observable<void>) => {
  const effectsComplete$ = new Subject<void>();
  return {
    complete() {
      effectsComplete$.next();
      effectsComplete$.complete();
    },
    createEffect<T = unknown>(
      sourceFn: () => Observable<T>,
      resultHandlerFn: () => Observer<T>
    ) {
      const obs = resultHandlerFn();
      const sub = sourceFn()
        .pipe(
          takeUntil(unsubscribeNotifier$)
        )
        .subscribe({
          next: value => obs.next(value),
          error: error => obs.error(error)
        });
      return () => {
        sub.unsubscribe();
      };
    }
  };
};
