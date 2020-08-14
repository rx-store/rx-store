import React, {
  useRef,
  useState,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import { Canvas, useFrame, useThree, ReactThreeFiber } from 'react-three-fiber';
import * as THREE from 'three';
import { MapControls } from 'drei';
import { animated, useSpring } from '@react-spring/three';
import { Layout } from 'webcola';
import { tap, map, filter, throttleTime } from 'rxjs/operators';
import { Vector3, Line3 } from 'three';
import { StoreArg, StoreValue, StoreEvent } from '@rx-store/core';
import { Observable } from 'rxjs';

function Effect(props) {
  return (
    <BoxWithText
      text={props.name}
      {...props}
      boxColor="hotpink"
      onClick={() => props.onClick('effect', props.name)}
    />
  );
}

function Subject(props) {
  // const store = useStore(rootContext);

  // subscribe to the rx store subject that this 3D object represents
  // const [next] = useSubscription(store[props.name]);

  return (
    // <BoxWithText text={`${props.name}: ${next}`} {...props} boxColor="red" />
    <BoxWithText
      text={`${props.name}: ${props.value}`}
      {...props}
      boxColor="red"
      onClick={() => props.onClick('subject', props.name)}
    />
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
function BoxWithText({
  x,
  y,
  width,
  text,
  boxColor,
  onClick,
}: BoxWithTextProps) {
  const [font, setFont] = useState<any>();
  useEffect(() => {
    const loader = new THREE.FontLoader();
    loader.load('/assets/helvetiker_regular.typeface.json', function (_font) {
      setFont(_font);
    });
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  const onHover = useCallback(
    (e, value) => {
      e.stopPropagation(); // stop it at the first intersection
      setIsHovered(value);
    },
    [setIsHovered]
  );

  const { scale } = useSpring({
    scale: isHovered ? [1.5, 1.5, 1.5] : [1, 1, 1],
  });

  const textPos: Vector3 = new Vector3(x - width / 2, y, 2);
  const boxPos: Vector3 = new Vector3(x, y, 0);
  if (!font) return null;
  return (
    <group
      onClick={onClick}
      onPointerOver={(e) => onHover(e, true)}
      onPointerOut={(e) => onHover(e, false)}
    >
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
      <animated.mesh position={boxPos} scale={scale}>
        <sphereBufferGeometry attach="geometry" args={[2]} />
        <meshStandardMaterial attach="material" color={boxColor} />
      </animated.mesh>
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

export const Visualizer = <T extends StoreValue>({
  onClick,
  storeObservable,
}) => {
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
    if (!storeObservable) return;
    const subscription = (storeObservable as Observable<StoreEvent>)
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
          forceRender();

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
  }, [layout]);

  useEffect(() => {
    if (!window.__rxstore_devtools_observer) return;
    const subscription = window.__rxstore_devtools_observer
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
    console.log(window.__rxstore_devtools_observer, 'subscribe!');

    (window.__rxstore_devtools_observer as Observable<StoreEvent>)
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
    if (!window.__rxstore_devtools_observer) return;
    const subscription = window.__rxstore_devtools_observer
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
  }, [window.__rxstore_devtools_observer]);

  useEffect(() => {
    layout.stop();
    layout.start(1);
  }, [layout]);

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
