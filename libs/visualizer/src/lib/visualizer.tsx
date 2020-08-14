import React, { useRef, useEffect, useReducer, useMemo } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import { MapControls } from 'drei';
import { Layout } from 'webcola';
import { tap, map, filter, throttleTime } from 'rxjs/operators';
import { Vector3, Line3 } from 'three';
import { StoreEvent } from '@rx-store/core';
import { Observable } from 'rxjs';
import { Effect } from '../components/effect';
import { Link } from '../components/link';
import { Subject } from '../components/subject';
import { useBullets } from '../hooks/bullets';
import { Bullet } from '../components/bullet';

export const Visualizer = ({ onClick, storeObservable }) => {
  return (
    <div style={{ border: '1px red solid', width: 1350, height: 1000 }}>
      <Canvas
        style={{ background: '#aaccee' }}
        camera={{ position: [0, 0, 10] }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Layers onClick={onClick} storeObservable={storeObservable} />
        {/* <GroundPlane />
        <BackDrop /> */}
        <MapControls target={[0, 0, 0]} maxDistance={1000} minDistance={50} />
      </Canvas>
    </div>
  );
};

export const Layers = ({ onClick, storeObservable }) => {
  const [, forceRender] = useReducer((n) => n + 1, 0);
  const { size } = useThree();

  const nodes = useRef([]);
  const links = useRef([]);

  const layout = useMemo(() => {
    console.log('create layout!', nodes.current);
    return new Layout()
      .nodes(nodes.current)
      .links(links.current)
      .size([size.width, size.height])
      .on('end', forceRender);
  }, []);

  const { bullets } = useBullets(
    storeObservable,
    layout,
    forceRender,
    nodes,
    links
  );

  useEffect(() => {
    if (!storeObservable) return;
    const subscription = storeObservable
      .pipe(
        filter((event) => event.type === 'effect'),
        tap(({ name, event }) => {
          if (event === 'spawn') {
            nodes.current.push({
              name,
              width: 30,
              height: 5,
              effect: true,
            });
            console.log('effects add', name);
          } else {
            const index = nodes.current.findIndex((o) => name === o.name);
            nodes.current.splice(index, 1);

            Object.entries(links.current)
              .reduce((acc, [i, link]) => {
                if (
                  (link.source.effect && link.source.name === name) ||
                  (link.target.effect && link.target.name === name)
                ) {
                  return [...acc, i];
                }
                return acc;
              }, [])
              .reverse()
              .forEach((i) => {
                console.log(i);

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
  }, [layout]);

  useEffect(() => {
    (storeObservable as Observable<StoreEvent>)
      .pipe(filter((event) => event.type === 'subject'))
      .subscribe(({ name }) => {
        nodes.current.push({
          name,
          width: 30,
          height: 5,
          subject: true,
        });
      });
  }, []);

  useEffect(() => {
    if (!storeObservable) return;
    const subscription = storeObservable
      .pipe(
        filter((event) => event.type === 'link'),
        map(({ from, to }) => {
          console.log('links add', from, to);

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
  }, [storeObservable]);

  useEffect(() => {
    layout.stop();
    layout.start(1);
  }, [layout]);

  return (
    <>
      {bullets.current.map((bullet, i) => (
        <Bullet bullet={bullet} key={i} />
      ))}
      {(layout.nodes().map((obj) => ({
        ...obj,
        x: obj.x - size.width / 2,
        y: obj.y - size.height / 2,
      })) as any[]).map((props) =>
        props.subject ? (
          <Subject key={props.name} {...props} onClick={onClick} />
        ) : (
          <Effect key={props.name} {...props} onClick={onClick} />
        )
      )}
      {(layout.links() as any).map(({ source, target }, i) => {
        const { x, y } = source;
        const { x: x2, y: y2 } = target;

        return (
          <Link
            key={i}
            x0={x - size.width / 2}
            y0={y - size.height / 2}
            x1={x2 - size.width / 2}
            y1={y2 - size.height / 2}
          />
        );
      })}
    </>
  );
};
