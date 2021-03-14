import dirtImg from './images/dirt.jpg';
import grassImg from './images/grass.jpg';
import logImg from './images/log.jpg';
import woodImg from './images/wood.png';
import dirtgrassImg from './images/dirtgrass.jpg';
import { TextureLoader } from 'three';
import * as THREE from 'three'

export const dirt = new TextureLoader().load(dirtImg);
export const grass = new TextureLoader().load(grassImg);
export const wood = new TextureLoader().load(woodImg);
export const log = new TextureLoader().load(logImg);
export const dirtgrass = new TextureLoader().load(dirtgrassImg);

dirt.magFilter = THREE.NearestFilter;
dirt.minFilter = THREE.LinearMipMapLinearFilter;

grass.magFilter = THREE.NearestFilter;
grass.minFilter = THREE.LinearMipMapLinearFilter;

wood.magFilter = THREE.NearestFilter;
wood.minFilter = THREE.LinearMipMapLinearFilter;

log.magFilter = THREE.NearestFilter;
log.minFilter = THREE.LinearMipMapLinearFilter;

dirtgrass.magFilter = THREE.NearestFilter;
dirtgrass.minFilter = THREE.LinearMipMapLinearFilter;