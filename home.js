import * as THREE from "https://esm.sh/three";
import { EffectComposer } from 'https://esm.sh/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://esm.sh/three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, document.body.clientHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x303030);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / document.body.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 0);

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

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

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

// Animation loop
function animate() {
  pointCloud.rotation.y += 0.002; // Rotate the point cloud to give some motion

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

  function showMenuScreen() {
    $(".splash-wrapper").fadeIn(1500);
    $(".loader").hide();
    $(".menudiv").show();
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
        // Wait for 1 second before showing the menu screen
        setTimeout(function() {
          showMenuScreen();
        }, 350); 
      }
    }

    // Start the zoom animation
    animateZoom();
  });
});
