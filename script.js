//https://www.youtube.com/watch?v=IA3HjAV2nzU

import * as THREE from "https://esm.sh/three";
import { OrbitControls } from "https://esm.sh/three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 8);
orbit.update();

const loader = new FontLoader();

loader.load( 'fonts/GodOfWar_Regular.json', function (font: THREE.Font ) {

	const geometry = new TextGeometry( 'Hello three.js!', {
		font: font,
		size: 80,
		depth: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );

  const textMesh = new THREE.Mesh(geometry, [
    new THREE.MeshPhongMaterial({ color: 0xad4000}),
    new THREE.MeshPhongMaterial({ color: 0x5c2301})
  ])

  textMesh.castShadow = true
  textMesh.position.y += 15
  textMesh.position.z -=40
  textMesh.position.x = -8
  textMesh.rotation.y = -0.50
  scene.add(textMesh)
} );

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.recieveShadow = true;

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

function animate() {
  

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);