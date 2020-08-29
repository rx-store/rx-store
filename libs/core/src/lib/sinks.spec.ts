import { Subject, of } from 'rxjs';
import { Effect } from './effect';
import { setup } from './test-helper';

it('sources data from subject', () => {
  const value = { count$: new Subject() };
  const effect: Effect<typeof value> = ({ sinks }) => {
    return of('hello world').pipe(sinks.count$());
  };
  setup({ value, effect }, ({ expectObservable, effect$, storeEvent$ }) => {
    expectObservable(effect$).toBe('(a|)', { a: 'hello world' });

    expectObservable(storeEvent$).toBe('(abcde)', {
      a: { type: 'effect', name: 'root', event: 'spawn' },
      b: {
        type: 'link',
        to: { type: 'subject', name: 'count$' },
        from: { type: 'effect', name: 'root' },
      },
      c: {
        type: 'value',
        to: { type: 'subject', name: 'count$' },
        from: { type: 'effect', name: 'root' },
        value: 'hello world',
      },
      d: {
        type: 'value',
        to: { type: 'effect', name: 'root' },
        from: { type: 'effect', name: '' },
        value: 'hello world',
      },
      e: { type: 'effect', event: 'teardown', name: 'root' },
    });
  });
});
