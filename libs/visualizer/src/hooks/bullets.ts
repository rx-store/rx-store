import { useRef, useEffect } from 'react';
import { tap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StoreEvent } from '@rx-store/core';
import { useFrame } from 'react-three-fiber';
import { Line3, Vector3 } from 'three';

export const useBullets = (
  storeObservable: Observable<StoreEvent>,
  layout: any,
  forceRender: any,
  nodes: any,
  links: any
) => {
  const bullets = useRef([]);
  useEffect(() => {
    if (!storeObservable) return;
    const subscription = storeObservable
      .pipe(
        filter((event) => event.type === 'value'),
        tap((event) => {
          const findNode = ({ type, name }) => {
            switch (type) {
              case 'effect':
                return nodes.current.find(
                  (node) => node.effect && node.name === name
                );
              case 'subject':
                return nodes.current.find(
                  (node) => node.subject && node.name === name
                );
            }
          };

          const findLink = () => {
            const source = findNode(event.from);
            const target = findNode(event.to);
            const link = links.current.find(
              (link) =>
                (link.source === source && link.target === target) ||
                (link.target === source && link.source === target)
            );
            return link;
          };

          if (!findNode(event.from) || !findNode(event.to) || !findLink()) {
            console.warn(event.from, event.to);
            return null;
          }
          findNode(event.to).value = event.value;
          findNode(event.from).value = event.value;
          // forceRender();

          const bullet = {
            x: findNode(event.from).x,
            y: findNode(event.from).y,
            z: 1,
            link: findLink(),
            at: 0,
          };
          bullets.current.push(bullet);
        }),
        // throttleTime(100, undefined, { trailing: true }),
        tap(() => {
          // forceRender();
          // layout.stop();
          // layout.start(1);
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [forceRender, layout, storeObservable]);

  useFrame((_, timeDelta) => {
    bullets.current.forEach((bullet) => {
      const line = new Line3(
        new Vector3(bullet.link.source.x, bullet.link.source.y),
        new Vector3(bullet.link.target.x, bullet.link.target.y)
      );

      bullet.at += timeDelta * 2;
      if (bullet.at >= 1) {
        bullets.current.splice(
          bullets.current.findIndex((b) => b === bullet),
          1
        );
      }

      const at = new Vector3();
      line.at(bullet.at, at);
      bullet.x = at.x;
      bullet.y = at.y;
    });
    forceRender();
  });

  return { bullets };
};
