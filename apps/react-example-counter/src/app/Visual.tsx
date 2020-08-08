import React, {
  useRef,
  useState,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import WebCola from 'react-cola';
import { useStore, useSubscription } from '@rx-store/react-rx-store';
import { rootContext } from './Manager';

import { Canvas, useFrame, useThree, useResource } from 'react-three-fiber';
import * as THREE from 'three';
import { OrbitControls } from 'drei';
import { useSpring } from '@react-spring/core';
import { animated } from '@react-spring/three';
import { Layout } from 'webcola';
import { tap, delay, map, filter, throttleTime } from 'rxjs/operators';

// Geometry
function GroundPlane() {
  return (
    <mesh receiveShadow rotation={[5, 0, 0]} position={[0, 0, -15]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshStandardMaterial attach="material" color="gray" />
    </mesh>
  );
}
function BackDrop() {
  return (
    <mesh receiveShadow position={[0, -1, -5]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshStandardMaterial attach="material" color="white" />
    </mesh>
  );
}

function Effect(props, i) {
  return <BoxWithText text={props.name} {...props} boxColor="hotpink" />;
}

function Subject(props, i) {
  const store = useStore(rootContext);

  // subscribe to the rx store subject that this 3D object represents
  const [next, error, complete] = useSubscription(store[props.name]);
  // console.log(next,error,complete);

  useEffect(() => {
    // console.log(('subject mount'));
    // return () => console.log(('subject unmount'));
  }, []);

  return (
    <BoxWithText text={`${props.name}: ${next}`} {...props} boxColor="red" />
  );
}

function BoxWithText({ x, y, z, width, height, text, boxColor }, i) {
  // This reference will give us direct access to the mesh
  const boxMeshRef = useRef();

  // Set up state for the hovered and active state
  // const [hovered, setHover] = useState(false);
  // const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => {
  //   if (undefined === boxMeshRef.current) return;
  //   boxMeshRef.current.rotation.y += 0.01;
  // });

  const { viewport } = useThree();

  const [font, setFont] = useState<any>();
  useEffect(() => {
    const loader = new THREE.FontLoader();
    loader.load('/assets/helvetiker_regular.typeface.json', function (_font) {
      setFont(_font);
    });
  }, []);

  const { textPos, boxPos } = useSpring({
    textPos: [x - width / 2, y, 1],
    boxPos: [x, y, 0],
    // config: { mass: 10, tension: 10, friction: 100, precision: 0.00001 }
  });

  // const textPos = [
  //   // x - width * 0.5 - viewport.width / 2 + 0.1,
  //   // y - height * 0.5 - viewport.height / 2 - 0.1,
  //   // 3,
  //   x - width / 2,
  //   y - height / 2,
  //   1,
  // ];
  // const boxPos = [
  //   // x - width * 0.5 - viewport.width / 2,
  //   // y - height * 0.5 - viewport.height / 2,
  //   // 2,
  //   x,
  //   y,
  //   0,
  // ];

  if (!font) return null;

  return (
    <group>
      <animated.mesh
        position={textPos}
        scale={true ? [1.5, 1.5, 1.5] : [1, 1, 1]}
        // onClick={(e) => setActive(!active)}
        // onPointerOver={(e) => setHover(true)}
        // onPointerOut={(e) => setHover(false)}
      >
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
        <animated.meshStandardMaterial attach="material" color="black" />
      </animated.mesh>
      <animated.mesh
        position={boxPos}
        ref={boxMeshRef}
        scale={true ? [1.5, 1.5, 1.5] : [1, 1, 1]}
        // onClick={(e) => setActive(!active)}
        // onPointerOver={(e) => setHover(true)}
        // onPointerOut={(e) => setHover(false)}
        
      >
        <boxBufferGeometry attach="geometry" args={[width, height, 1]} />
        <meshStandardMaterial attach="material" color={boxColor} wireframe />
      </animated.mesh>
    </group>
  );
}

function Line({ x0, y0, x1, y1, isActive }, i) {
  const { viewport, size } = useThree();

  const { pos1 } = useSpring({
    pos1: [x1 - x0, y1 - y0, 0],
    // config: { mass: 100, tension: 100, friction: 100, precision: 0.00001 }
  });

  const points = useMemo(
    () => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x1 - x0, y1 - y0, 0)],
    [x0, x1, y0, y1]
  );
  const { color } = useSpring({
    color: isActive ? 'red' : 'black',
  });

  const { pos } = useSpring({
    pos: [x0, y0, 0],
    // config: { mass: 100, tension: 100, friction: 100, precision: 0.00001 }
  });
  // const pos = [x0, y0, 0];

  const onUpdate = useCallback((self) => self.setFromPoints(points), [points]);

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
        args={[new THREE.Vector3(normX, normY, 0), undefined, dist - 5, 'black',2,2]}
      />
    </animated.mesh>
  );
}

export const Visual = () => {
  return (
    <div style={{ border: '1px red solid', width: 1000, height: 1000 }}>
      <Canvas
        style={{ background: '#aaccee' }}
        camera={{ position: [0, 0, 10] }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <New />
        {/* <GroundPlane />
        <BackDrop /> */}
        <OrbitControls
          target={[0, 0, 0]}
          maxDistance={1000}
          minDistance={100}
        />
      </Canvas>
    </div>
  );
};

// export const Legacy = () => {
//   const { viewport, size } = useThree();
//   const { effects, subjects, links, activeLinks } = useDevtools();
//   // console.log({ effects, subjects, links });

//   return (
//     <WebCola
//       // onTick={console.log}
//       onHandleLayout={(cola, nodes, links, constraints, groups) => {
//         return cola
//         .nodes(nodes)
//         .links(links)
//         .groups(groups)
//         .constraints(constraints)
//           .flowLayout('y', 50)
//           .linkDistance(30)
//           .avoidOverlaps(true)
//           .handleDisconnected(true)

//       }}
//       renderLayout={(layout) => (
//         <>
//           {/* {layout.groups().map(({ bounds: { x, X, y, Y } }, i) => {
//             const width = X - x;
//             const height = Y - y;
//             return (
//               <div
//                 key={i}
//                 style={{
//                   position: 'absolute',
//                   left: x,
//                   top: y,
//                   width,
//                   height,
//                   backgroundColor: 'orange',
//                   borderRadius: 5,
//                   zIndex: -2,
//                 }}
//               />
//             );
//           })} */}
//           {layout.links().map(({ source, target }, i) => {
//             const isActive =
//               Array.from(activeLinks).findIndex(
//                 (obj) =>
//                   obj.subjectName === target.name &&
//                   obj.debugKey === source.name
//               ) !== -1;

//             const { x, y } = source;
//             const { x: x2, y: y2 } = target;

//             return (
//               <Line key={i} x0={x} y0={y} x1={x2} y1={y2} isActive={isActive} />
//             );
//           })}
//           {layout
//             .nodes()
//             .map((props, i) =>
//               props.subject ? (
//                 <Subject key={i} {...props} />
//               ) : (
//                 <Effect key={i} {...props} />
//               )
//             )}
//         </>
//       )}
//       nodes={[
//         ...subjects,
//         ...effects.map((effectName) => ({
//           name: effectName,
//           width: 0.5,
//           height: 0.5,
//           effect: true,
//         })),
//       ]}
//       links={[
//         ...Array.from(links).map(({ from, to }) => {
//           const findIndex = (obj) => {
//             switch (obj.type) {
//               case 'effect':
//                 return (
//                   subjects.length +
//                   Array.from(effects).findIndex((name) => name === obj.name)
//                 );
//               case 'subject':
//                 return subjects.findIndex(({ name }) => name === obj.name);
//             }
//           };

//           // console.log(from, findIndex(from), to, findIndex(to));

//           return {
//             source: findIndex(from),
//             // subjects.length +
//             // effects.findIndex((effect) => effect.name === value.debugKey),
//             target: findIndex(to),
//             //  subjects.findIndex(
//             //   (subject) => subject.name === value.subjectName          ),
//           };
//         }),

//         // ...effects.map((effect, i) => ({
//         //   source: i + subjects.length,
//         //   target: 1,
//         // })),
//         // ...effects.map((effect, i) => ({
//         //   source: i + subjects.length,
//         //   target: 2,
//         // })),
//       ]}
//       groups={[
//         {
//           leaves: subjects.map((_, i) => i),
//         },
//       ]}
//       // constraints={[
//       //   {
//       //     type: 'alignment',
//       //     axis: 'y',
//       //     offsets: subjects.map((_, i) => ({ node: i, offset: 0 })),
//       //   },
//       // ]}
//       width={viewport.width}
//       height={viewport.height}
//     />
//   );
// };

export const New = () => {
  const store = useStore(rootContext);
  const [_, forceRender] = useReducer((n) => n + 1, 0);
  const { size } = useThree();

  const nodes = useRef([]);
  const links = useRef([]);

  const layout = useMemo(() => {
    console.log('create layout!', nodes.current);
    return new Layout()
      .nodes(nodes.current)
      .links(links.current)
      .size([size.width, size.height])
      .flowLayout('y', 0)
      .linkDistance(50)
      .avoidOverlaps(true)
      .handleDisconnected(true)
      .on('end', forceRender);
  }, []);

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
          layout.start(10);
        })
      )
      .subscribe();
    return () => subscription.unsubscribe();
  }, [window.__rxStoreEffects]);

  useEffect(() => {
    const subjects = Object.keys(store).reduce(
      (acc, name) => [...acc, name],
      []
    );
    console.log('subjects changed', subjects);
    subjects.forEach((subject) => {
      nodes.current.push({
        name: subject,
        width: 30,
        height: 5,
        subject: true,
      });
    });
  }, [store]);

  useEffect(() => {
    if (!window.__rxStoreLinks) return;
    const subscription = window.__rxStoreLinks
      .pipe(
        map(({ from, to }) => {
          console.log('links add', from, to);

          // debugger;
          const findIndex = ({ type, name }) => {
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

          if (!findIndex(from) || !findIndex(to)) {
            // debugger;
            console.warn(from, to);
            return null;
          }

          return {
            source: findIndex(from),
            target: findIndex(to),
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
    layout.start(10);
  }, [layout]);
  // console.log(JSON.stringify(layout.nodes(), null, 2), layout.nodes().length);

  // return null;
  return (
    <>
      {layout
        .nodes()
        .map((obj) => ({
          ...obj,
          x: obj.x - size.width / 2,
          y: obj.y - size.height / 2,
        }))
        .map((props, i) =>
          props.subject ? (
            <Subject key={props.name} {...props} />
          ) : (
            <Effect key={props.name} {...props} />
          )
        )}
      {layout.links().map(({ source, target }, i) => {
        // const isActive =
        //   Array.from(activeLinks).findIndex(
        //     (obj) =>
        //       obj.subjectName === target.name &&
        //       obj.debugKey === source.name
        //   ) !== -1;

        const { x, y } = source;
        const { x: x2, y: y2 } = target;

        return (
          <Line
            key={i}
            x0={x - size.width / 2}
            y0={y - size.height / 2}
            x1={x2 - size.width / 2}
            y1={y2 - size.height / 2}
            isActive={false}
          />
          // <Line key={i} x0={x} y0={y} x1={x2} y1={y2} isActive={false} />
        );
      })}
    </>
  );
};

// export const useDevtools = () => {
//   const store = useStore(rootContext);

//   const subjects = useMemo(() => {
//     const subjects = Object.keys(store).reduce(
//       (acc, name) => [...acc, name],
//       []
//     );
//     // console.log('subjects changed',subjects)
//     return subjects;
//   }, [store]);
//   // console.log(subjects);

//   const [_, forceRender] = useReducer((n) => n + 1, 0);

//   useEffect(() => {
//     forceRender();
//   }, [subjects]);

//   const links = useRef(new Set());
//   useEffect(() => {
//     if (!window.__rxStoreLinks) return;

//     const subscription = window.__rxStoreLinks
//       .pipe(
//         tap((value) => {
//           debugger;
//           if (!links.current.has(value)) {
//             links.current.add(value);
//             // console.log('link add', JSON.stringify(value));
//             forceRender();
//           }
//         })
//       )
//       .subscribe();
//     return () => subscription.unsubscribe();
//   }, [window.__rxStoreLinks]);

//   return {
//     // effects: Array.from(effects.current),
//     subjects,
//     links: Array.from(links.current),
//     activeLinks: [], //activeLinks.current,
//   };
// };
