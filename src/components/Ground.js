import React from 'react';
import { usePlane } from 'use-cannon';
import { TextureLoader, RepeatWrapping } from 'three';
import grass from '../images/grass.jpg';
import { useStore } from '../hooks/useStore';
import useSound from 'use-sound';
import boopSfx from '../audio/pedra.wav';
import * as THREE from 'three'


export const Ground = (props) => {
  
  const [play] = useSound(boopSfx);
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  const texture = new TextureLoader().load(grass);
  const [addCube, activeTexture] = useStore((state) => [
    state.addCube,
    state.texture,
  ]);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(100, 100);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  return (
    <mesh
      ref={ref}
      receiveShadow
      onClick={(e) => {
        e.stopPropagation();
        const [x, y, z] = Object.values(e.point).map((coord) =>
          Math.ceil(coord),
        );
        play();
        addCube(x, y, z, activeTexture);
      }}
    >
      <planeBufferGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial map={texture} attach="material" />
    </mesh>
  );
};
