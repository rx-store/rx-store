import React, { useRef, useState, useEffect, useReducer, useMemo } from 'react';
import { useStore, useSubscription } from '@rx-store/react-rx-store';
// import { rootContext } from './Manager';

import { Canvas, useFrame, useThree, ReactThreeFiber } from 'react-three-fiber';
import * as THREE from 'three';
import { MapControls } from 'drei';
import { animated } from '@react-spring/three';
import { Layout } from 'webcola';
import { tap, map, filter, throttleTime } from 'rxjs/operators';
import { Vector3 } from 'three';

function Effect(props) {
  return <BoxWithText text={props.name} {...props} boxColor="hotpink" />;
}

function Subject(props) {
  // const store = useStore(rootContext);

  // subscribe to the rx store subject that this 3D object represents
  // const [next] = useSubscription(store[props.name]);

  return (
    // <BoxWithText text={`${props.name}: ${next}`} {...props} boxColor="red" />
    <BoxWithText text={`${props.name}: `} {...props} boxColor="red" />
  );
}

interface BoxWithTextProps {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  text: string;
  boxColor: ReactThreeFiber.Color;
}
function BoxWithText({ x, y, width, text, boxColor }: BoxWithTextProps) {
  const [font, setFont] = useState<any>();
  useEffect(() => {
    const loader = new THREE.FontLoader();
    loader.load('/assets/helvetiker_regular.typeface.json', function (_font) {
      setFont(_font);
    });
  }, []);

  const textPos: Vector3 = new Vector3(x - width / 2, y, 2);
  const boxPos: Vector3 = new Vector3(x, y, 0);
  if (!font) return null;
  return (
    <group>
      <mesh position={textPos}>
        <textBufferGeometry
          attach="geometry"
          args={[
            text,
            {
              font: font,
              size: 2,
              height: 0.01,
            },
          ]}
        />
        <meshStandardMaterial attach="material" color="black" />
      </mesh>
      <mesh position={boxPos}>
        <sphereBufferGeometry attach="geometry" args={[2]} />
        <meshStandardMaterial attach="material" color={boxColor} />
      </mesh>
    </group>
  );
}

function Line({ x0, y0, x1, y1 }) {
  const pos = [x0, y0, 0];

  const deltaX = x1 - x0;
  const deltaY = y1 - y0;
  const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const normX = deltaX / dist;
  const normY = deltaY / dist;

  return (
    <animated.mesh position={pos}>
      {/* <bufferGeometry attach="geometry" onUpdate={onUpdate} /> */}
      {/* <animated.standardMaterial attach="material" color={color} /> */}
      <arrowHelper
        args={[
          new THREE.Vector3(normX, normY, 0),
          undefined,
          dist - 5,
          'black',
          2,
          2,
        ]}
      />
    </animated.mesh>
  );
}

export const Visualizer = () => {
  return (
    <div style={{ border: '1px red solid', width: 1350, height: 500 }}>
      <Canvas
        style={{ background: '#aaccee' }}
        camera={{ position: [0, 0, 10] }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Layers />
        {/* <GroundPlane />
        <BackDrop /> */}
        <MapControls target={[0, 0, 0]} maxDistance={1000} minDistance={50} />
      </Canvas>
    </div>
  );
};

export const Layers = () => {
  // const store = useStore(rootContext);
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

  const bullets = useRef([]);
  useEffect(() => {
    if (!window.__rxStoreValues) return;
    const subscription = window.__rxStoreValues
      .pipe(
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

          const source = findNode(event.from);
          const target = findNode(event.to);

          const bullet = {
            x: source.x,
            y: source.y,
            z: 0,
            target,
            timeout: 1000,
          };
          bullets.current.push(bullet);
        }),
        throttleTime(100, undefined, { trailing: true }),
        tap(() => {
          // forceRender();
          layout.stop();
          layout.start(100);
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [window.__rxStoreValues]);

  useEffect(() => {
    if (!window.__rxStoreEffects) return;
    const subscription = window.__rxStoreEffects
      .pipe(
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
          layout.start(100);
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [window.__rxStoreEffects]);

  useEffect(() => {
    window.__rxStoreSubjects.subscribe(({ name }) => {
      nodes.current.push({
        name,
        width: 30,
        height: 5,
        subject: true,
      });
    });
  }, [window.__rxStoreSubjects]);

  useEffect(() => {
    if (!window.__rxStoreLinks) return;
    const subscription = window.__rxStoreLinks
      .pipe(
        map(({ from, to }) => {
          console.log('links add', from, to);

          // debugger;
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
            // debugger;
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
  }, [window.__rxStoreLinks]);

  useEffect(() => {
    layout.stop();
    layout.start(100);
  }, [layout]);

  useFrame((_, timeDelta) => {
    console.log(bullets.current.length, 'bullets');
    bullets.current.forEach((bullet) => {
      const from = new Vector3(bullet.x, bullet.y, 0);
      const to = new Vector3(bullet.target.x, bullet.target.y, 0);
      const delta = to.sub(from);
      const dist = delta.length();
      const dir = delta.normalize();

      // eslint-disable-next-line no-cond-assign
      if ((bullet.timeout -= timeDelta) < 0 || dist <= 10) {
        bullets.current.splice(
          bullets.current.findIndex((b) => b === bullet),
          1
        );
      }

      bullet.x += dir.x * timeDelta * 30;
      bullet.y += dir.y * timeDelta * 30;
    });
    forceRender();
  });

  return (
    <>
      {bullets.current.map((bullet, i) => {
        return (
          <mesh
            position={[
              bullet.x - size.width / 2,
              bullet.y - size.height / 2,
              bullet.z,
            ]}
            key={i}
          >
            <sphereBufferGeometry attach="geometry" />
            <meshStandardMaterial attach="material" />
          </mesh>
        );
      })}
      {layout
        .nodes()
        .map((obj) => ({
          ...obj,
          x: obj.x - size.width / 2,
          y: obj.y - size.height / 2,
        }))
        .map((props) =>
          props.subject ? (
            <Subject key={props.name} {...props} />
          ) : (
            <Effect key={props.name} {...props} />
          )
        )}
      {layout.links().map(({ source, target }, i) => {
        const { x, y } = source;
        const { x: x2, y: y2 } = target;

        return (
          <Line
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