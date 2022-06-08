import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

//Loading
const textureLoader = new THREE.TextureLoader();

const normalTexture = textureLoader.load("/textures/moonMap.png");

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereBufferGeometry(0.9, 64, 64);

// Materials

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.41;
material.roughness = 0.312;
material.normalMap = normalTexture;
material.color = new THREE.Color(0x8715e3);

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Lights
//llight 1
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

//light 2
const pointLight2 = new THREE.PointLight(0x0a536b, 0.6);
pointLight2.position.set(-0.6, 0.6, 1); // x,y,z
pointLight2.intensity = 1;
scene.add(pointLight2);

//control pointLight2
const light1 = gui.addFolder("Light 1");

light1.add(pointLight2.position, "y").min(-3).max(3).step(0.1);
light1.add(pointLight2.position, "x").min(-6).max(6).step(0.1);
light1.add(pointLight2.position, "z").min(-3).max(3).step(0.1);
light1.add(pointLight2, "intensity").min(0).max(10).step(0.1);

// const pointLightHelper = new THREE.PointLightHelper(pointLight2, 0.6);
// scene.add(pointLightHelper);

//light 3
const pointLight3 = new THREE.PointLight(0xc91a1a, 0.6);
pointLight3.position.set(1, -0.9, 1); // x,y,z
pointLight3.intensity = 0.8;
scene.add(pointLight3);

//color change object
const light2Color = {
  color: 0xff0000,
};

light1.addColor(light2Color, "color").onChange(() => {
  pointLight2.color.set(light2Color.color);
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

document.addEventListener("mousemove", onDocumentMouseMove);

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowX;
  mouseY = event.clientY - windowY;
}

function updateSphere(event) {
  sphere.position.y = window.scrollY * 0.005;
}

window.addEventListener("scroll", updateSphere);

const clock = new THREE.Clock();

const tick = () => {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.5 * elapsedTime;

  sphere.rotation.x += 0.5 * (targetY - sphere.rotation.x);
  sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y);
  sphere.position.z += 0.5 * (targetY - sphere.rotation.x);
  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
