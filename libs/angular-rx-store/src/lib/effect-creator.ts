import { Observable } from 'rxjs';

interface EffectResultHandler<T> {
  next(value: T): void;
  error(error: any): void
}

export const createEffect = <T = unknown>(
  sourceFn: () => Observable<T>,
  resultHandlerFn: () => EffectResultHandler<T>
) => {
  const obs = resultHandlerFn();
  const sub = sourceFn().subscribe({
    next: value => obs.next(value),
    error: error => obs.error(error),
  });
  return () => {
    sub.unsubscribe();
  };
};
