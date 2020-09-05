import { Subject } from 'rxjs';
import { RootEffect } from './effect';
import { setup } from './test-helper';
import { ignoreElements } from 'rxjs/operators';

it('sources data from subject', () => {
  const value = { count$: new Subject() };
  const effect: RootEffect<typeof value> = ({ sources }) => {
    return sources.count$().pipe(ignoreElements());
  };
  setup(
    { value, effect },
    ({ expectObservable, effect$, hot, storeEvent$ }) => {
      hot('a').subscribe(value.count$);
      expectObservable(effect$).toBe('');
      expectObservable(storeEvent$).toBe('(abc)', {
        a: { type: 'effect', name: 'root', event: 'spawn' },
        b: {
          type: 'link',
          from: { type: 'subject', name: 'count$' },
          to: { type: 'effect', name: 'root' },
        },
        c: {
          type: 'value',
          from: { type: 'subject', name: 'count$' },
          to: { type: 'effect', name: 'root' },
          value: 'a',
        },
      });
    }
  );
});
