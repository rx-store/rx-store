import { Subject } from 'rxjs';
import { Effect } from './effect';
import { setup } from './test-helper';

it('sources data from subject', () => {
  const value = { count$: new Subject() };
  const effect: Effect<typeof value> = ({ sources }) => {
    return sources.count$();
  };
  setup(
    { value, effect },
    ({ expectObservable, effect$, hot, storeEvent$ }) => {
      // hack to emit mocked values onto the subject in the store value
      // TODO - i don't understand why changing to "cold" breaks test?
      hot('a').subscribe(value.count$);

      expectObservable(effect$).toBe('a');
      expectObservable(storeEvent$).toBe('(abcd)', {
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
        d: {
          type: 'value',
          to: { type: 'effect', name: 'root' },
          from: { type: 'effect', name: '' },
          value: 'a',
        },
      });
    }
  );
});
