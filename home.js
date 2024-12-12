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

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1, 0.2, 0.1);

composer.addPass(renderPass);
composer.addPass(bloomPass);

// Animation loop
function animate() {
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
