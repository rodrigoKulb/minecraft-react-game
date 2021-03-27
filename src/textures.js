import dirtImg from './images/dirt.jpg';
import glassImg from './images/glass.png';
import greenImg from './images/green.jpg';
import logImg from './images/log.jpg';
import woodImg from './images/wood.png';
import dirtgrassImg from './images/dirtgrass.jpg';
import aguaImg from './images/agua.jpg';

import { TextureLoader } from 'three';
import * as THREE from 'three'

export const dirt = new TextureLoader().load(dirtImg);
export const glass = new TextureLoader().load(glassImg);
export const green = new TextureLoader().load(greenImg);
export const wood = new TextureLoader().load(woodImg);
export const log = new TextureLoader().load(logImg);
export const dirtgrass = new TextureLoader().load(dirtgrassImg);
export const agua = new TextureLoader().load(aguaImg);

dirt.magFilter = THREE.NearestFilter;
dirt.minFilter = THREE.LinearMipMapLinearFilter;

glass.magFilter = THREE.NearestFilter;
glass.minFilter = THREE.LinearMipMapLinearFilter;

green.magFilter = THREE.NearestFilter;
green.minFilter = THREE.LinearMipMapLinearFilter;

wood.magFilter = THREE.NearestFilter;
wood.minFilter = THREE.LinearMipMapLinearFilter;

log.magFilter = THREE.NearestFilter;
log.minFilter = THREE.LinearMipMapLinearFilter;

dirtgrass.magFilter = THREE.NearestFilter;
dirtgrass.minFilter = THREE.LinearMipMapLinearFilter;

agua.magFilter = THREE.NearestFilter;
agua.magFilter = THREE.LinearMipMapLinearFilter;