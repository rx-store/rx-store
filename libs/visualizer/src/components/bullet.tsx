import React from 'react';
import { useThree } from 'react-three-fiber';

export const Bullet = ({ bullet }: { bullet: any }) => {
  const { size } = useThree();
  return (
    <mesh
      position={[
        bullet.x - size.width / 2,
        bullet.y - size.height / 2,
        bullet.z,
      ]}
    >
      <sphereBufferGeometry attach="geometry" />
      <meshStandardMaterial attach="material" color={0xeeeeee} />
    </mesh>
  );
};
