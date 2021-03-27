import React, { memo } from 'react';
import { useBox } from 'use-cannon';
import { useState } from 'react';
import * as textures from '../textures';
import useSound from 'use-sound';

import boopSfx from '../audio/pedra.wav';

const Cube = ({ position, texture, addCube, removeCube }) => {
  const [hover, setHover] = useState(null);

  const [ref] = useBox(() => ({
    type: 'Static',
    //type: "Kinematic",
    position,
  }));


function maoAvanca()
{
  document.getElementById("mao").style.bottom = '-200px';
  document.getElementById("mao").style.right = '400px';
  document.getElementById("mao").style.transform = "rotate(-10deg)";
  setTimeout(() => {
    document.getElementById("mao").style.bottom = '-150px';
    document.getElementById("mao").style.right = '200px';
    document.getElementById("mao").style.transform = "rotate(-5deg)";
  }, 50);
  setTimeout(() => {
    document.getElementById("mao").style.bottom = '-100px';
    document.getElementById("mao").style.right = '150px';
    document.getElementById("mao").style.transform = "rotate(-0deg)";
  }, 100);
}
  const [play] = useSound(boopSfx);

  const color = texture === 'glass' ? 'skyblue' : 'white';
  return (
    <mesh
      castShadow
      ref={ref}
      onPointerMove={(e) => {
         setHover(Math.floor(e.faceIndex / 2));
        //  const hoverFace = Math.floor(e.faceIndex / 2);
        //  const { x, y, z } = ref.current.position;
        // if (hoverFace === 0) {
        //  moveCubeNew(x + 1, y, z);
        //   return;
        // }
        // if (hoverFace === 1) {
        //   moveCubeNew(x - 1, y, z);
        //   return;
        // }
        // if (hoverFace === 2) {
        //   moveCubeNew(x, y + 1, z);
        //   return;
        // }
        // if (hoverFace === 3) {
        //   moveCubeNew(x, y - 1, z);
        //   return;
        // }
        // if (hoverFace === 4) {
        //   moveCubeNew(x, y, z + 1);
        //   return;
        // }
        // if (hoverFace === 5) {
        //   moveCubeNew(x, y, z - 1);
        //   return;
        // }
        e.stopPropagation();
       
      }}
      onPointerOut={() => {
        setHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const clickedFace = Math.floor(e.faceIndex / 2);
        const { x, y, z } = ref.current.position;
        play();
        maoAvanca();
        if (clickedFace === 0) {
          e.altKey ? removeCube(x, y, z) : addCube(x + 1, y, z);
          return;
        }
        if (clickedFace === 1) {
          e.altKey ? removeCube(x, y, z) : addCube(x - 1, y, z);
          return;
        }
        if (clickedFace === 2) {
          e.altKey ? removeCube(x, y, z) : addCube(x, y + 1, z);
          return;
        }
        if (clickedFace === 3) {
          e.altKey ? removeCube(x, y, z) : addCube(x, y - 1, z);
          return;
        }
        if (clickedFace === 4) {
          e.altKey ? removeCube(x, y, z) : addCube(x, y, z + 1);
          return;
        }
        if (clickedFace === 5) {
          e.altKey ? removeCube(x, y, z) : addCube(x, y, z - 1);
          return;
        }
      }}
    >
         <boxBufferGeometry attach="geometry" />
         <meshStandardMaterial 
         attach="material"  
         map={textures[texture]} 
         color={hover!=null ? 'gray' : color}
         opacity={texture === 'glass' ? 0.7 : 1}
         transparent={true}
         />
         {/* <meshStandardMaterial
          
          envMap={textures['dirt']}
          //color={hover === index ? 'gray' : 'green'}
          opacity={texture === 'glass' ? 0.7 : 1}
          //color={'green'}
          transparent={true}
        /> */}
       
      {/* {[...Array(6)].map((_, index) => (
        <meshStandardMaterial
          //attachArray="material"
          map={textures['dirt']}
          key={index}
          color={hover === index ? 'gray' : 'green'}
          opacity={texture === 'glass' ? 0.7 : 1}
          //color={'green'}
          transparent={true}
        />
      ))} */}
      
      
    </mesh>
  );
};

// function equalProps(prevProps, nextProps) {
//   const equalPosition =
//     prevProps.position.x === nextProps.position.x &&
//     prevProps.position.y === nextProps.position.y &&
//     prevProps.position.z === nextProps.position.z;

//   return equalPosition && prevProps.texture === nextProps.texture;
// }

//export default memo(Cube, equalProps);
export default memo(Cube);
