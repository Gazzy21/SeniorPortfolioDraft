import * as THREE from "https://esm.sh/three";
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
camera.position.set(0, 0, -10);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.PointsMaterial({ 
  color: 0xffffff, 
  size: 0.005
});
const torus = new THREE.Points(torusGeometry, torusMaterial); 
scene.add(torus);
torus.position.set(0, 0, -100);
torus.castShadow = true;

const octahedronGeometry = new THREE.OctahedronGeometry(45); 
const octahedronMaterial = new THREE.MeshBasicMaterial({
  color: 0xAFFA,
  wireframe: true,
});
const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
scene.add(octahedron);
octahedron.position.set(0, 0, -100);
octahedron.castShadow = true;

const octahedron2Geometry = new THREE.OctahedronGeometry(45); 
const octahedron2Material = new THREE.PointsMaterial({});
const octahedron2 = new THREE.Points(octahedron2Geometry, octahedron2Material);
scene.add(octahedron2);
octahedron2.position.set(0, 0, -100);
octahedron2.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x404040);
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

// Step 1: Create Point Cloud
const pointCount = 5000; // Number of points in the cloud
const pointsGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(pointCount * 3); // 3 values (x, y, z) per point
const colors = new Float32Array(pointCount * 3); // 3 values (r, g, b) per point

// Define an array of predefined colors (as hex values)
const colorOptions = [
  // new THREE.Color(0xff0000), // Red
  // new THREE.Color(0x00ff00), // Green
  new THREE.Color(0x0000ff), // Blue
  // new THREE.Color(0xffff00), // Yellow
  new THREE.Color(0xff00ff), // Magenta
  // new THREE.Color(0x00ffff), // Cyan
  // new THREE.Color(0xffffff), // White
];

// Randomly generate the positions for each point in 3D space
for (let i = 0; i < pointCount; i++) {
  positions[i * 3] = Math.random() * 100 - 50;  // x position
  positions[i * 3 + 1] = Math.random() * 100 - 50;  // y position
  positions[i * 3 + 2] = Math.random() * 100 - 50;  // z position

  // Randomly select a color from the predefined set for each point
  const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

  colors[i * 3] = randomColor.r; // red
  colors[i * 3 + 1] = randomColor.g; // green
  colors[i * 3 + 2] = randomColor.b; // blue
}

pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Step 2: Create a PointsMaterial with desired properties (color, size, etc.)
const pointsMaterial = new THREE.PointsMaterial({
  size: 0.05,
  vertexColors: true, // Enable vertex colors (important for individual point colors)
  transparent: true,
  opacity: 0.8
});

// Step 3: Create the Points object and add it to the scene
const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(pointCloud);

// Animation loop
function animate() {
  octahedron.rotation.y += 0.02;
  octahedron2.rotation.y += 0.02;
  torus.rotation.y += 0.02;

  // Rotate the point cloud to give some motion
  pointCloud.rotation.x += 0.001;

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
