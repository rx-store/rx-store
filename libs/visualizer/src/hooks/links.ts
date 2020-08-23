import { useEffect } from 'react';
import { tap, map, filter, throttleTime } from 'rxjs/operators';
import { StoreEvent } from '@rx-store/core';
import { Observable } from 'rxjs';

export const useLinks = (
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
        filter((event) => event.type === 'link'),
        map(({ from, to }: any) => {
          console.log('links add', from, to);

          const findNode = ({ type, name }: any) => {
            switch (type) {
              case 'effect':
                return nodes.current.find(
                  (node: any) => node.effect && node.name === name
                );
              case 'subject':
                return nodes.current.find(
                  (node: any) => node.subject && node.name === name
                );
            }
          };

          if (!findNode(from) || !findNode(to)) {
            console.warn(from, to);
            return null;
          }

          return {
            source: findNode(from),
            target: findNode(to),
          };
        }),
        filter((v) => !!v),
        tap((link) => {
          links.current.push(link);
        }),
        throttleTime(100, undefined, { trailing: true }),
        tap(() => {
          // forceRender()
          console.log('run layout', links.current.length, nodes.current.length);
          layout.stop();
          layout.start();
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [layout, links, nodes, storeObservable]);
};
