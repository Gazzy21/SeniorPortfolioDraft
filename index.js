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
scene.background = new THREE.Color(0x303030);

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

// const sphereGeometry = new THREE.SphereGeometry(1000, 64, 32);
// const sphereMaterial = new THREE.MeshStandardMaterial({
//   wireframe: true,
// });
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// scene.add(sphere);
// sphere.position.set(0, 0, 0);
// sphere.castShadow = true;

// const sphere2Geometry = new THREE.SphereGeometry(8, 64, 32);
// const sphere2Material = new THREE.MeshBasicMaterial({
//   color: 0xaffaaaa,
// });
// const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
// scene.add(sphere2);
// sphere2.position.set(0, 0, -100); // Starting position of the orbiting sphere
// sphere2.castShadow = true;

const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.PointsMaterial({ 
  color: 0xffffff, 
  size: 0.005
});
const torus = new THREE.Points(torusGeometry, torusMaterial); 
scene.add(torus);
torus.position.set(0, 0, -100)
torus.castShadow = true

const octahedronGeometry = new THREE.OctahedronGeometry(45); // You can adjust the size as needed
const octahedronMaterial = new THREE.MeshBasicMaterial({
  color: 0xAFFA,
  wireframe: true,
});
const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
scene.add(octahedron);
octahedron.position.set(0, 0, -100);
octahedron.castShadow = true;

const octahedron2Geometry = new THREE.OctahedronGeometry(45); // You can adjust the size as needed
const octahedron2Material = new THREE.PointsMaterial({
});
const octahedron2 = new THREE.Points(octahedron2Geometry, octahedron2Material);
scene.add(octahedron2);
octahedron2.position.set(0, 0, -100);
octahedron2.castShadow = true;

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

// Add orbiting logic for sphere2 around point (0, 0, -100)
let theta = 0; // This will control the orbit of the sphere2
const orbitCenter = new THREE.Vector3(0, 0, -100); // Orbit center (0, 0, -100)
const orbitRadius = 50; // The radius of the orbit

function animate() {
  // sphere.rotation.y += 0.0025;
  // sphere.rotation.x += 0.0025;
  // sphere.rotation.z += 0.0025;
  octahedron.rotation.y += 0.02
  octahedron2.rotation.y += 0.02
  torus.rotation.y += 0.02
  // Update the position of sphere2 to make it orbit around (0, 0, -100)
  // sphere2.position.y = orbitCenter.y + orbitRadius * Math.cos(theta);  // X position based on orbit
  // sphere2.position.x = orbitCenter.x + orbitRadius * Math.sin(theta);  // Z position based on orbit

  // Increase the angle to continue orbiting
  // theta += 0.005; // Change this value to adjust the speed of orbit

  // Call composer.render() instead of renderer.render()
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