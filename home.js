import * as THREE from "https://esm.sh/three";
// import { OrbitControls } from "https://esm.sh/three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from 'https://esm.sh/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js';

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
camera.position.set(0, 0, -10);  // Move the camera away from the objects

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// const orbit = new OrbitControls(camera, renderer.domElement);
// orbit.update();

const cylinderGeometry = new THREE.CylinderGeometry( 5, 5, 5, 32 ); 
const cylinderMaterial = new THREE.MeshStandardMaterial( {color: 0xaffa} ); 
const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial ); 
scene.add(cylinder);
cylinder.position.set(-40,0,-50);
cylinder.rotation.x = 0.5 * Math.PI;
cylinder.rotation.y = 1 * Math.PI;

const octahedronGeometry = new THREE.OctahedronGeometry(15); // You can adjust the size as needed
const octahedronMaterial = new THREE.MeshBasicMaterial({
  color: 0xAFFA,
  wireframe: true,
});
const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
scene.add(octahedron);
octahedron.position.set(0, -30, -100);
octahedron.castShadow = true;

// const planeGeometry = new THREE.PlaneGeometry(30, 30);
// const planeMaterial = new THREE.MeshStandardMaterial({
//   color: 0x808080,
//   side: THREE.DoubleSide
// });
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(plane);
// plane.rotation.x = -0.5 * Math.PI;
// plane.receiveShadow = true;

const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;

const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
scene.add(dLightHelper);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1, 0.2, 0.1);

composer.addPass(renderPass);
composer.addPass(bloomPass);

function animate() {
  
  composer.render();
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update UnrealBloomPass size on window resize
  bloomPass.setSize(window.innerWidth, window.innerHeight);
});