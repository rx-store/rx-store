import React, { useState, useEffect, useCallback } from 'react';
import { ReactThreeFiber } from 'react-three-fiber';
import * as THREE from 'three';
import { animated, useSpring } from '@react-spring/three';
import { Vector3, Font } from 'three';
import { VisualizerProps } from '../lib/visualizer';

export interface BoxWithTextProps {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  text: string;
  boxColor: ReactThreeFiber.Color;
  onClick?: () => void;
  theme: VisualizerProps['theme'];
  colorNamespaces: VisualizerProps['colorNamespaces'];
}

export function BoxWithText({
  x,
  y,
  width,
  text,
  boxColor,
  onClick,
  theme,
}: BoxWithTextProps) {
  const [font, setFont] = useState<Font>();
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

  const textPos: Vector3 = new Vector3(x + 2, y, 2);
  const boxPos: Vector3 = new Vector3(x, y, 0);

  if (!font) {
    console.warn('missing font, items will be missing from visualizer!');
    return null;
  }
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
              size: 1.7,
              height: 0.01,
            },
          ]}
        />
        <meshStandardMaterial attach="material" color="#eeeeee" />
      </mesh>
      {/* @ts-ignore - react three spring typings issue? */}
      <animated.mesh position={boxPos} scale={scale}>
        <sphereBufferGeometry attach="geometry" args={[2]} />
        <meshStandardMaterial attach="material" color={boxColor} />
      </animated.mesh>
    </group>
  );
}
