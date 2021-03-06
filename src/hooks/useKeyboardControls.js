import { useState, useEffect } from 'react';
import { useStore } from './useStore';
//import andarSom from '../audio/andar.wav';
//import jumpSom from '../audio/jump.wav';



function actionByKey(key) {
  const keys = {
    KeyW: 'moveForward',
    KeyS: 'moveBackward',
    KeyA: 'moveLeft',
    KeyD: 'moveRight',
    Space: 'jump',
  };
  return keys[key];
}




function textureByKey(key) {
  const keys = {
    Digit1: 'dirt',
    Digit2: 'glass',
    Digit3: 'green',
    Digit4: 'wood',
    Digit5: 'log',
    Digit6: 'dirtgrass',
    Digit7: 'agua',
  };
  return keys[key];
}
export const useKeyboardControls = () => {


  useEffect(() => {
    document.getElementsByClassName("botoesZerar").[0].addEventListener('click', () => {
      window.localStorage.setItem('world',null);
    });
  }, []);


  const [movement, setMovement] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
  });

  const [setTexture] = useStore((state) => [state.setTexture]);
  //const [plaingCount,setPlaingCount] = useState(0);
  //const [playAndar] = useState(new Audio(andarSom));
  //const [playJump] = useState(new Audio(jumpSom));
  

  let plaingCount =  [];
  plaingCount['KeyS'] = 0;
  plaingCount['KeyA'] = 0;
  plaingCount['KeyW'] = 0;
  plaingCount['KeyD'] = 0;

  // //let total = 0;
  // useEffect(() => {
    
  //   const teclaKeyPress = (e) => {
  //     console.log(e.code);
  //     if(e.code==='Escape')
  //     {
  //       document.getElementById("aparece").style.display = 'block';
       
  //     }
  //     if(e.code==='KeyS' || e.code==='KeyA' || e.code==='KeyW' || e.code==='KeyD')
  //     {
  //       animaMao();
  //     }
  //   //   if(e.code==='Space')  playJump.play();
  //   //   plaingCount[e.code] = 1;
  //   //   total =   plaingCount['KeyS']+plaingCount['KeyA']+plaingCount['KeyW']+plaingCount['KeyD'];

  //   //   if(total>0){
  //   //     playAndar.play();
  //   //   }
  //   //   for ( var i = 0; i < plaingCount.length; i++ ){
  //   //     total += plaingCount[i];
 
  //   //  }
  //    }
  //   const teclaKeyUp = (e) => {
  //     if(e.code==='KeyS' || e.code==='KeyA' || e.code==='KeyW' || e.code==='KeyD')
  //     {
  //       animaMao();
  //     }
  //     //plaingCount[e.code] = 0;
  //     //total =   plaingCount['KeyS']+plaingCount['KeyA']+plaingCount['KeyW']+plaingCount['KeyD'];
      
  //     //if(total===0){

  //     //playAndar.pause();
  //    //}
  //   }
  //   document.addEventListener('keypress', teclaKeyPress);
  //   document.addEventListener('keyup', teclaKeyUp);

  //   return () => {
  //     document.removeEventListener('keypress', teclaKeyPress);
  //     document.removeEventListener('keyup', teclaKeyUp);
  //   };
  // }, []);


  useEffect(() => {
   
    const handleKeyDown = (e) => {

      // Movement key
      if (actionByKey(e.code)) {
        setMovement((state) => ({
          ...state,
          [actionByKey(e.code)]: true,
        }));
      }
      // Change texture key
      if (textureByKey(e.code)) {
        setTexture(textureByKey(e.code));
      }
    };
    const handleKeyUp = (e) => {


      if (actionByKey(e.code)) {
        setMovement((state) => ({
          ...state,
          [actionByKey(e.code)]: false,
        }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [setTexture]);

  return movement;
};


