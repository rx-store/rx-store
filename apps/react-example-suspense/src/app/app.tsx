import React from 'react-experimental';
import { useStore, useSubscription } from '@rx-store/react';
import { rootContext } from '../main';
import { Suspense } from 'react';

export const App = () => {
  const store = useStore(rootContext);
  const [next] = useSubscription(store.count$);
  return (
    <Suspense fallback={<>suspended. wait.</>}>
      <Child next={next} />
    </Suspense>
  );
};

const Child = ({ next }: { next: any }) => {
  console.log('child render');
  if (next % 2 === 0) {
    throw new Promise(() => {
      // suspend, no need to resolve it will just wait until useSubscription updates!
    });
  }
  return <>{next}</>;
};

export default App;
