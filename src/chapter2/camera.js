import * as dat from "dat.gui";
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const init = () => {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  const axes = new THREE.AxesHelper(20);
  scene.add(axes);

  const planeGeometry = new THREE.PlaneGeometry(180, 180);
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(0, 0, 0);

  // Add plane to the
  scene.add(plane);

  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(120, 60, 180);
  camera.lookAt(scene.position);
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true; // Add smooth damping effect
  orbitControls.dampingFactor = 0.5;

  // Increase the spotlight intensity and adjust position
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(-20, 40, 60);
  scene.add(directionalLight);

  const lightHelper = new THREE.SpotLightHelper(directionalLight);
  scene.add(lightHelper);

  const ambienLight = new THREE.AmbientLight(0x292929);
  scene.add(ambienLight);

  const container = document.getElementById("webgl-output");
  if (container) {
    container.appendChild(renderer.domElement);
  }

  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

  for (let j = 0; j < planeGeometry.parameters.height / 5; j++) {
    for (let i = 0; i < planeGeometry.parameters.width / 5; i++) {
      const rnd = Math.random() * 0.75 + 0.25;
      const cubeMaterial = new THREE.MeshLambertMaterial();
      cubeMaterial.color = new THREE.Color(rnd, 0, 0);
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

      cube.position.z = -(planeGeometry.parameters.height / 2) + 2 + j * 5;
      cube.position.x = -(planeGeometry.parameters.width / 2) + 2 + i * 5;
      cube.position.y = 2;

      scene.add(cube);
    }
  }

  const controls = {
    perspective: "Perspective",
    switchCamera: () => {
      if (camera instanceof THREE.PerspectiveCamera) {
        camera = new THREE.OrthographicCamera(
          window.innerWidth / -16,
          window.innerWidth / 16,
          window.innerHeight / 16,
          window.innerHeight / -16,
          -200,
          500
        );
        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;
        camera.lookAt(scene.position);
        controls.perspective = "Orthographic";
      } else {
        camera = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;
        camera.lookAt(scene.position);
        controls.perspective = "Perspective";
      }
      const orbitControls = new OrbitControls(camera, renderer.domElement);
      orbitControls.enableDamping = true; // Add smooth damping effect
      orbitControls.dampingFactor = 0.5;
    },
  };

  const gui = new dat.GUI();
  gui.add(controls, "switchCamera");
  gui.add(controls, "perspective").listen();

  //Animation loop
  const animate = () => {
    stats.update();

    renderer.render(scene, camera);
  };

  renderer.setAnimationLoop(animate);

  // Render in UI
  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onWindowResize);
};

init();
