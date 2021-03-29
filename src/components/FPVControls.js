import React, { useEffect } from 'react';
import { PointerLockControls as PointerLockControlsImpl } from 'three/examples/jsm/controls/PointerLockControls';
import { useThree, extend } from 'react-three-fiber';
import { useRef } from 'react';

extend({ PointerLockControlsImpl });

export const FPVControls = (props) => {
  const { camera, gl } = useThree();
  const controls = useRef();

setTimeout(function(){ 
  if(controls.current.isLocked===false){
    document.getElementById("aparece").style.display = 'block';
  }
  else{
    document.getElementById("aparece").style.display = 'none';
  }
 //console.log(controls.current.isLocked);
 }, 500);


  useEffect(() => {
    
    document.getElementsByClassName("canvas").[0].addEventListener('click', () => {
      controls.current.lock();
    });
    document.getElementsByClassName("btnStart").[0].addEventListener('click', () => {
      document.getElementById("aparece").style.display = "none";
      controls.current.lock();
    });
    
  }, []);

  return (
    <pointerLockControlsImpl
      ref={controls}
      args={[camera, gl.domElement]}
      {...props}
    />
  );
};
