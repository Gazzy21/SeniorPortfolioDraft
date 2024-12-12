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
camera.position.set(0, 0, 10); // Adjusted position for better view of the scene

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const sphereGeometry = new THREE.SphereGeometry(10, 32, 32); // Sphere with radius 10 and segments 32
const sphereMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(0, 0, -100); // Position the sphere in the scene
sphere.castShadow = true; // Enable shadow casting

const icosahedronGeometry = new THREE.IcosahedronGeometry(45, 1);
const icosahedronMaterial = new THREE.MeshBasicMaterial({
  color: 0xAFFA,
  transparent: true,
  opacity: 0.3,
  side: THREE.DoubleSide
});
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
scene.add(icosahedron);
icosahedron.position.set(0, 0, -100);
icosahedron.castShadow = true;

const icosahedron2Geometry = new THREE.IcosahedronGeometry(45, 1);
const icosahedron2Material = new THREE.PointsMaterial({});
const icosahedron2 = new THREE.Points(icosahedron2Geometry, icosahedron2Material);
scene.add(icosahedron2);
icosahedron2.position.set(0, 0, -100);
icosahedron2.castShadow = true;

const icosahedron2Edges = new THREE.EdgesGeometry(icosahedron2Geometry);
const icosahedron2EdgesMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 2
});
const icosahedron2EdgeLines = new THREE.LineSegments(icosahedron2Edges, icosahedron2EdgesMaterial);
scene.add(icosahedron2EdgeLines);
icosahedron2EdgeLines.position.set(0, 0, -100)

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1, 0.2, 0.1);

composer.addPass(renderPass);
composer.addPass(bloomPass);

// Step 1: Create Point Cloud
const pointCount = 3000;
const pointsGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(pointCount * 3); // 3 values (x, y, z) per point
const colors = new Float32Array(pointCount * 3); // 3 values (r, g, b) per point

// Define an array of predefined colors (as hex values)
const colorOptions = [
  new THREE.Color(0x0000ff), // Blue
  new THREE.Color(0xff00ff), // Magenta
  new THREE.Color(0xffffff), // White
];

// Randomly generate the positions for each point in 3D space
for (let i = 0; i < pointCount; i++) {
  positions[i * 3] = Math.random() * 100 - 50;  // x position
  positions[i * 3 + 1] = Math.random() * 100 - 50;  // y position
  positions[i * 3 + 2] = Math.random() * 100 - 50;  // z position

  const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];
  colors[i * 3] = randomColor.r; // red
  colors[i * 3 + 1] = randomColor.g; // green
  colors[i * 3 + 2] = randomColor.b; // blue
}

pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Step 2: Create a PointsMaterial
const pointsMaterial = new THREE.PointsMaterial({
  size: 0.075,
  vertexColors: true, // Enable vertex colors (important for individual point colors)
  transparent: true,
  opacity: 0.8
});

// Step 3: Create the Points object and add it to the scene
const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
scene.add(pointCloud);
pointCloud.position.set(0, 0, -20); // Ensure the point cloud is in the same area as other objects

// Animation loop
function animate() {
  icosahedron.rotation.y += 0.002;
  icosahedron2.rotation.y += 0.002;
  icosahedron2EdgeLines.rotation.y += 0.002;
  icosahedron.rotation.x += 0.002;
  icosahedron2.rotation.x += 0.002;
  icosahedron2EdgeLines.rotation.x += 0.002;
  icosahedron.rotation.z += 0.002;
  icosahedron2.rotation.z += 0.002;
  icosahedron2EdgeLines.rotation.z += 0.002;
  sphere.rotation.y -= 0.002;

  pointCloud.rotation.x += 0.002; // Rotate the point cloud to give some motion

  composer.render();
}

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  bloomPass.setSize(window.innerWidth, window.innerHeight);
});

$(document).ready(function () {
  function showLoadingScreen() {
    $(".splash-wrapper").fadeIn(1500); // Fade in the loading screen
  }

  function hideLoadingScreen() {
    $(".splash-wrapper").fadeOut(1500); // Fade out the loading screen
  }

  setTimeout(function () {
    hideLoadingScreen(); // Initially hide the loading screen
  }, 3000);

  $("#enter").on("click", function () {
    // Target position (zoom level)
    var targetZ = -89;
    // Duration for the zoom effect in milliseconds
    var duration = 5000; // 5 seconds
    var fadeduration = 1000;
    var startZ = camera.position.z;
    var startTime = performance.now();

    // Fade out the text element (enterdiv)
    $("#enterdiv").fadeOut(fadeduration);

    // Animation function for zoom
    function animateZoom() {
      var elapsed = performance.now() - startTime;
      var progress = Math.min(elapsed / duration, 1); // Ensure progress doesn't exceed 1

      // Linearly interpolate the Z position for camera zoom
      camera.position.z = THREE.MathUtils.lerp(startZ, targetZ, progress);

      // Continue animating if the progress is less than 1
      if (progress < 1) {
        requestAnimationFrame(animateZoom);
      } else {
        // Show loading screen again when zoom animation ends
        showLoadingScreen();

      }
    }

    // Start the zoom animation
    animateZoom();
  });
});
