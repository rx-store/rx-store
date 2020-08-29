import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { store, useStore, useSubscription } from './react';
import { BehaviorSubject } from 'rxjs';
import { act } from 'react-dom/test-utils';

it('legacy signature', () => {
  expect(true).toBe(true);
});

it('new signature', () => {
  const value = { count$: new BehaviorSubject(0) };
  const { Manager, context } = store<typeof value>(value);
  const MyComponent: React.FC<{}> = () => {
    const store = useStore(context);
    const [count] = useSubscription(store.count$);
    return <div role="main">{count}</div>;
  };
  render(
    <Manager>
      <MyComponent />
    </Manager>
  );
  expect(screen.getByRole('main')).toHaveTextContent('0');
  act(() => {
    value.count$.next(1);
  });
  expect(screen.getByRole('main')).toHaveTextContent('1');
});
