import * as THREE from "three";
import * as dat from "dat.gui";
import Stats from "three/examples/jsm/libs/stats.module";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry";
import * as SceneUtils from "three/addons/utils/SceneUtils.js";

const init = () => {
  const stats = new Stats();
  document.body.appendChild(stats.dom);

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

  const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;

  plane.rotation.x = -0.5 * Math.PI;
  plane.position.set(0, 0, 0);

  // Add plane to the
  scene.add(plane);

  camera.position.set(-50, 30, 20);
  camera.lookAt(scene.position);
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true; // Add smooth damping effect
  orbitControls.dampingFactor = 0.5;

  // Increase the spotlight intensity and adjust position
  const spotLight = new THREE.SpotLight(0xffffff, 2000, 100, Math.PI / 4);
  spotLight.position.set(-40, 60, -10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  const lightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(lightHelper);

  const ambienLight = new THREE.AmbientLight(0x3c3c3c);
  scene.add(ambienLight);

  const container = document.getElementById("webgl-output");
  if (container) {
    container.appendChild(renderer.domElement);
  }

  const material = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
  const geom = new THREE.BoxGeometry(5, 8, 3);

  const cube = new THREE.Mesh(geom, material);
  cube.position.y = 4;
  cube.castShadow = true;
  scene.add(cube);

  const controls = {
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,

    positionX: 0,
    positionY: 4,
    positionZ: 0,

    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scale: 1,

    translateX: 0,
    translateY: 0,
    translateZ: 0,

    visible: true,
    translate: () => {
      cube.translateX(controls.translateX);
      cube.translateY(controls.translateY);
      cube.translateZ(controls.translateZ);

      controls.positionX = cube.position.x;
      controls.positionY = cube.position.y;
      controls.positionZ = cube.position.z;
    },
  };

  const gui = new dat.GUI();
  const guiScale = gui.addFolder("scale");
  guiScale.add(controls, "scaleX", 0, 5);
  guiScale.add(controls, "scaleY", 0, 5);
  guiScale.add(controls, "scaleZ", 0, 5);

  const guiPosition = gui.addFolder("position");
  const contX = guiPosition.add(controls, "positionX", -10, 10);
  const contY = guiPosition.add(controls, "positionY", -4, 20);
  const contZ = guiPosition.add(controls, "positionZ", -10, 10);

  contX.listen();
  contX.onChange((value) => {
    cube.position.x = value;
  });

  contY.listen();
  contY.onChange((value) => {
    cube.position.y = value;
  });

  contZ.listen();
  contZ.onChange((value) => {
    cube.position.z = value;
  });

  const guiRotation = gui.addFolder("rotation");
  guiRotation.add(controls, "rotationX", -Math.PI, Math.PI);
  guiRotation.add(controls, "rotationY", -Math.PI, Math.PI);
  guiRotation.add(controls, "rotationZ", -Math.PI, Math.PI);

  const guiTranslate = gui.addFolder("translate");
  guiTranslate.add(controls, "translateX", -10, 10);
  guiTranslate.add(controls, "translateY", -10, 10);
  guiTranslate.add(controls, "translateZ", -10, 10);
  guiTranslate.add(controls, "translate")

  gui.add(controls, "visible");

  //Animation loop
  const animate = () => {
    stats.update();

    cube.visible = controls.visible;
    
    cube.rotation.x = controls.rotationX;
    cube.rotation.y = controls.rotationY;
    cube.rotation.z = controls.rotationZ;
    cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);

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
