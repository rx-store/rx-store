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
import {OrbitControls} from "drei"

// Geometry
function GroundPlane() {
  return (
    <mesh receiveShadow rotation={[5, 0, 0]} position={[0, 0, -10]}>
      <planeBufferGeometry attach="geometry" args={[500, 500]} />
      <meshStandardMaterial attach="material" color="white" />
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
  // subscribe to the rx store subject that this 3D object represents
  const [next] = useSubscription(props.subject);
  return (
    <BoxWithText
      text={`${props.name}: ${next}`}
      {...props}
      boxColor="red"
    />
  );
}

function BoxWithText({ x, y, width, height, text, boxColor }, i) {
  // This reference will give us direct access to the mesh
  const boxMeshRef = useRef();

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => {
    if (undefined === boxMeshRef.current) return;
    boxMeshRef.current.rotation.y += 0.01;
  });

  const { viewport } = useThree();

  const font = useRef<any>();
  useEffect(() => {
    const loader = new THREE.FontLoader();
    loader.load('/assets/helvetiker_regular.typeface.json', function (_font) {
      font.current = _font;
    });
  }, []);

  if (!font.current) return null;

  return (
    <group>
      <mesh
        position={[
          x - width * 0.5 - viewport.width / 2 + 0.1,
          y - height * 0.5 - viewport.height / 2 - 0.1,
          3,
        ]}
        scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
        onClick={(e) => setActive(!active)}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
      >
        <textBufferGeometry
          attach="geometry"
          args={[
            text,
            {
              font: font.current,
              size: height / 3,
              height: 0.01,
            },
          ]}
        />
        <meshStandardMaterial attach="material" color="black" />
      </mesh>
      <mesh
        position={[
          x - width * 0.5 - viewport.width / 2,
          y - height * 0.5 - viewport.height / 2,
          2,
        ]}
        ref={boxMeshRef}
        scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
        onClick={(e) => setActive(!active)}
        onPointerOver={(e) => setHover(true)}
        onPointerOut={(e) => setHover(false)}
      >
        <boxBufferGeometry attach="geometry" args={[width, height, width]} />
        <meshStandardMaterial attach="material" color={boxColor} />
      </mesh>
    </group>
  );
}

function Line({ x0, y0, x1, y1 }, i) {
  const boxMeshRef = useRef();
  const { viewport, size } = useThree();
  const [ref, object] = useResource();
  const points = useMemo(
    () => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x1-x0, y1-y0, 0)],
    [x0, x1, y0, y1]
  );
  const onUpdate = useCallback((self) => self.setFromPoints(points), [points]);
  console.log(viewport.width, viewport.height);
  console.log(x0, y0, x1, y1);

  return (
    <line
      position={[x0 - viewport.width / 2, y0 - viewport.height / 2, 2]}
      ref={ref}
    >
      <bufferGeometry attach="geometry" onUpdate={onUpdate} />
      <lineBasicMaterial
        attach="material"
        color={'#9c88ff'}
        linewidth={10}
        linecap={'round'}
        linejoin={'round'}
      />
    </line>
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
        <Legacy />
        <GroundPlane />
        <BackDrop />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export const Legacy = () => {
  const { viewport, size } = useThree();
  const { effects, subjects } = useDevtools();
  return (
    <WebCola
      // onTick={console.log}
      onHandleLayout={(cola, nodes, links, constraints, groups) => {
        return cola
          .nodes(nodes)
          .links(links)
          .groups(groups)
          .constraints(constraints)
          .linkDistance(3)
          .avoidOverlaps(true)
          .handleDisconnected(false);
      }}
      renderLayout={(layout) => (
        /*console.log(layout.nodes().map((n) => `${n.x} x ${n.y}`)) ||*/ <>
          {layout.groups().map(({ bounds: { x, X, y, Y } }, i) => {
            const width = X - x;
            const height = Y - y;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width,
                  height,
                  backgroundColor: 'orange',
                  borderRadius: 5,
                  zIndex: -2,
                }}
              />
            );
          })}
          {layout.links().map(({ source, target }, i) => {
            const { x, y } = source;
            const { x: x2, y: y2 } = target;
            return (
              <Line
                key={i}
                x0={x}
                y0={y}
                x1={x2}
                y1={y2}
                borderColor="blue"
                zIndex={-1}
              />
            );
          })}
          {layout
            .nodes()
            .map((props) =>
              props.subject ? (
                <Subject key={props.name} {...props} />
              ) : (
                <Effect key={props.name} {...props} />
              )
            )}
        </>
      )}
      nodes={[...subjects, ...effects]}
      links={[
        // { source: 1, target: 2 },
        // { source: 2, target: 0 },
        // { source: 2, target: 3 },
        // { source: 2, target: 4 },
        ...effects.map((effect, i) => ({
          source: i + subjects.length,
          target: 0,
        })),
        ...effects.map((effect, i) => ({
          source: i + subjects.length,
          target: 1,
        })),
        ...effects.map((effect, i) => ({
          source: i + subjects.length,
          target: 2,
        })),
      ]}
      // constraints={[
      //   {
      //     type: 'alignment',
      //     axis: 'y',
      //     offsets: subjects.map((_, i) => ({ node: i, offset: 0 })),
      //   },
      // ]}
      width={viewport.width}
      height={viewport.height}
    />
  );
};

export const useDevtools = () => {
  const store = useStore(rootContext);

  // todo useMemo??
  const subjects = Object.entries(store).reduce(
    (acc, [name, subject]) => [
      ...acc,
      { name, width: 0.5, height: 0.5, subject },
    ],
    []
  );

  // const effects = [];
  const effects = (window.__devtools_effects || []).map((name) => ({
    name,
    width: 0.5,
    height: 0.5,
    effect: true,
  }));

  const [_, forceRender] = useReducer((n) => n + 1, 0);

  useEffect(() => {
    const tick = () => {
      requestAnimationFrame(() => {
        // todo avoid if nothing has changed in the store??
        // console.log(window.__devtools_effects);
        forceRender();
        tick();
      });
    };
    tick();
    return () => {
      alert('unmount');
    };
  }, []);

  return { effects, subjects };
};
