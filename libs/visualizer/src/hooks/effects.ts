import { useEffect } from 'react';
import { tap, filter, throttleTime } from 'rxjs/operators';
import { StoreEvent } from '@rx-store/core';
import { Observable } from 'rxjs';

export const useEffects = (
  storeObservable: Observable<StoreEvent>,
  layout: any,
  forceRender: any,
  nodes: any,
  links: any
) => {
  useEffect(() => {
    if (!storeObservable) return;
    const subscription = storeObservable
      .pipe(
        filter((event) => event.type === 'effect'),
        tap(({ name, event }: any) => {
          if (event === 'spawn') {
            nodes.current.push({
              name,
              width: 30,
              height: 5,
              effect: true,
            });
            console.log('effects add', name);
          } else {
            const index = nodes.current.findIndex((o: any) => name === o.name);
            nodes.current.splice(index, 1);

            Object.entries(links.current)
              .reduce((acc: any, [i, link]: any) => {
                if (
                  (link.source.effect && link.source.name === name) ||
                  (link.target.effect && link.target.name === name)
                ) {
                  return [...acc, i];
                }
                return acc;
              }, [])
              .reverse()
              .forEach((i: number) => {
                links.current.splice(i, 1);
              });
            console.log('effects delete', name);
          }
        }),
        throttleTime(100, undefined, { trailing: true }),
        tap(() => {
          // forceRender();
          layout.stop();
          layout.start(1);
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [layout, links, nodes, storeObservable]);
};
