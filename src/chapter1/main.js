import * as THREE from "three";
import * as dat from 'dat.gui';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();

renderer.setClearColor(new THREE.Color(0x000000));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const axes = new THREE.AxesHelper(20);
scene.add(axes);

const planeGeometry = new THREE.PlaneGeometry(60, 20);
const planeMaterial = new THREE.MeshLambertMaterial({
  color: 0xaaaaaa,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

plane.rotation.x = -0.5 * Math.PI;
plane.position.set(15, 0, 0);

scene.add(plane);

// Create a cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-4, 3, 0);
cube.castShadow = true;

scene.add(cube);

// Create a sphere
const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
const sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0x7777ff,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(20, 4, 2);
sphere.castShadow = true;

scene.add(sphere);

camera.position.set(-30, 40, 30);
camera.lookAt(scene.position);

// Increase the spotlight intensity and adjust position
const spotLight = new THREE.SpotLight(0xffffff, 1000);
spotLight.position.set(-10, 20, -5);
spotLight.castShadow = true;
scene.add(spotLight);

const lightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(lightHelper);

const ambienLight = new THREE.AmbientLight(0x353535);
scene.add(ambienLight);

const container = document.getElementById("webgl-output");
if (container) {
  container.appendChild(renderer.domElement);
}

let step = 0;

const controls = {
  rotationSpeed: 0.02,
  bouncingSpeed: 0.03,
}

const gui = new dat.GUI();
gui.add(controls, 'rotationSpeed', 0, 0.5);
gui.add(controls, 'bouncingSpeed', 0, 0.5);

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true; // Add smooth damping effect
orbitControls.dampingFactor = 0.5;

//Animation loop
function animate() {
	cube.rotation.x += controls.rotationSpeed;
  cube.rotation.y += controls.rotationSpeed;
  cube.rotation.z += controls.rotationSpeed;

	// Bounce the sphere up and down
  step += controls.bouncingSpeed;
  sphere.position.x = 20 + 10 * (Math.cos(step));
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Render in UI
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);
