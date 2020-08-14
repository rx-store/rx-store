import React from 'react';
import * as THREE from 'three';
import { animated } from '@react-spring/three';

export function Link({ x0, y0, x1, y1 }) {
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
