import React from 'react';
import { Canvas } from 'react-three-fiber';
import { Sky } from 'drei';
import { Physics } from 'use-cannon';

import { Ground } from './components/Ground';
import Cubes from './components/Cubes';
import { Player } from './components/Player';
import { Hud } from './components/Hud';
import { Controls } from './components/Controls';

function App() {

  return (
    <>
    <Controls /> 
    <Canvas className="canvas" shadowMap sRGB camera={{ position: [0, 0, 2.5], fov: 69, far: 30 }} gl={{ antialias: true }}  >
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.25}  />
      <fog attach="fog" args={['#ccc', 1, 35]} />
      <pointLight castShadow intensity={0.7} position={[100, 100, 100]}   />
      <Hud position={[0, 0, -2]} />
      <Physics gravity={[0, -30, 0]}>
        <Ground position={[0, 0.5, 0]} />
        <Player position={[0, 3, 10]} />
        <Cubes />
      </Physics>
    </Canvas>
    </>
  );
}

export default App;
