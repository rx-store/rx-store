import React, {
  Suspense,
  useEffect,
  useState,
  unstable_useTransition as useTransition,
} from 'react';
import { useStore, useSubscription, getResource } from '@rx-store/react';
import { rootContext, ResultImage } from '../main';

const initialResource = {
  read: () => ({
    url: '',
  }),
};

export const App = () => {
  // This is just standard Rx Store stuff, access some streams from the store...
  const { resultImage$, searchInput$ } = useStore(rootContext);
  const [searchInput] = useSubscription(searchInput$);

  const [resource, setResource] = useState<{ read: () => ResultImage }>(
    initialResource
  );
  // const [startTransition, isPending] = useTransition({
  //   timeoutMs: 3000,
  // });
  useEffect(() => {
    // startTransition(() => {
    const resource = getResource(
      resultImage$,
      (hashMap) => hashMap[searchInput$.getValue()]
    );
    setResource(resource);
    // });
  }, [resultImage$, searchInput, searchInput$]);

  // This is not a promise, although it does represent a future value we can act like we have now

  return (
    <>
      <input
        type="text"
        value={searchInput || ''}
        onChange={(event) => {
          searchInput$.next(event.target.value);
        }}
      />
      <br />
      <Suspense fallback={<>suspended. wait.</>}>
        <PreviewImage resource={resource} />
      </Suspense>
    </>
  );
};

const PreviewImage: React.FC<{ resource: { read: () => ResultImage } }> = ({
  resource,
}) => {
  // Because of how suspense works, we are able to render this "even if its not there", this may throw a promise!
  const resultImage = resource.read();

  // React will wait for that promise to resolve, then retry rendering, so we can just "pretend" we always read the value!
  return resultImage ? <img src={resultImage.url} alt="" /> : null;
};

export default App;
