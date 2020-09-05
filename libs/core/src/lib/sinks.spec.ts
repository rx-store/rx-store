import { Subject, of } from 'rxjs';
import { RootEffect } from './effect';
import { setup } from './test-helper';
import { ignoreElements } from 'rxjs/operators';

it('sources data from subject', () => {
  const value = { count$: new Subject() };
  const effect: RootEffect<typeof value> = ({ sinks }) => {
    return of('hello world').pipe(sinks.count$(), ignoreElements());
  };
  setup({ value, effect }, ({ expectObservable, effect$, storeEvent$ }) => {
    expectObservable(effect$).toBe('|');
    expectObservable(storeEvent$).toBe('(abcd)', {
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
      d: { type: 'effect', event: 'teardown', name: 'root' },
    });
  });
});
