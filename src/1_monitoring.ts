import * as THREE from "three";

import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";
// import { GLTFLoader, RGBELoader } from "three/examples/jsm/Addons.js";

import { AxesHelper } from "three";

import Stats from "stats.js";

// console.log(Stats);

// Mesuring performances

// we will use FPS meter like stats.js

// also you van use Spector.js to see how many drawCalls
// is made for your scene

// and you can print out renderer info, where you can see
// for example of how many triangles are your geometries build, or how
// many geometries you have in the scene

// at the end of our hugre if statement: if(canvas)
// i printed rendered info

/**
 * @name Stats.js
 */
const stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// we can use tick function instead of this
/* function animate() {
  stats.begin();

  // monitored code goes here

  stats.end();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate); */

// ------------ gui -------------------
/**
 * @description Debug UI - lil-ui
 */
const gui = new GUI({
  width: 340,
  title: "Tweak It",
  closeFolders: false,
});

/**
 * @description gui parmeters
 */
const parameters = {
  //
  "rotate model": 0,
};

const directionalLightGui = gui.addFolder("Directional Light stuff");
const rendererGui = gui.addFolder("Renderer stuff");
directionalLightGui.close();
rendererGui.close();
// -------------------------------------------------------------
// -------------------------------------------------------------

//------------ canvas settings -----------
/**
 * @description canvas settings
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// ----------------------------------------

const canvas: HTMLCanvasElement | null = document.querySelector("canvas.webgl");

if (canvas) {
  // ---- loaders -------
  /**
   * @description loaders
   */

  // const gltfLoader = new GLTFLoader();
  // const cubeTextureLoader = new THREE.CubeTextureLoader();
  // const rgbeLoader = new RGBELoader();
  // const textureLoader = new THREE.TextureLoader();

  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------
  // -------------------------------------------------------------------

  // ------- Scene
  const scene = new THREE.Scene();

  // -------- Camera -------------------------------
  const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(2, 2, 6);
  scene.add(camera);

  // ----------------------------------------------
  // ----------------------------------------------
  // ----------------------------------------------
  // ----------------------------------------------
  // Meshes, Geometries, Materials
  // ----------------------------------------------
  // ----------------------------------------------
  // ----------------------------------------------
  // ----------------------------------------------

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial()
  );

  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.set(-5, 0, 0);
  scene.add(cube);

  const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
    new THREE.MeshStandardMaterial()
  );

  torusKnot.castShadow = true;
  torusKnot.receiveShadow = true;
  scene.add(torusKnot);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
  );

  sphere.position.set(5, 0, 0);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial()
  );

  floor.position.set(0, -2, 0);
  floor.rotation.x = -Math.PI * 0.5;
  floor.castShadow = true;
  floor.receiveShadow = true;
  scene.add(floor);

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // ------------------------- LIGHTS ----------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  /**
   * @description Directional light
   */
  const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
  directionalLight.position.set(0.25, 3, 2.25);
  scene.add(directionalLight);

  directionalLight.shadow.camera.far = 15;
  directionalLight.shadow.mapSize.set(1024, 1024);

  directionalLight.shadow.normalBias = 0.05;

  const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera
  );

  // directionalLight.target.position.set(0, 2, 0);

  directionalLight.castShadow = true;
  directionalLight.target.updateWorldMatrix(true, true);

  directionalLightCameraHelper.visible = false;

  directionalLightGui
    .add(directionalLightCameraHelper, "visible")
    .name("Helper visibility");

  scene.add(directionalLightCameraHelper);

  directionalLightGui.add(directionalLight, "castShadow");

  directionalLightGui
    .add(directionalLight, "intensity")
    .min(0)
    .max(10)
    .step(0.001)
    .name("directLightIntensity");
  directionalLightGui
    .add(directionalLight.position, "x")
    .min(-10)
    .max(10)
    .step(0.001)
    .name("directLighX");
  directionalLightGui
    .add(directionalLight.position, "y")
    .min(-10)
    .max(10)
    .step(0.001)
    .name("directLighY");
  directionalLightGui
    .add(directionalLight.position, "z")
    .min(-10)
    .max(10)
    .step(0.001)
    .name("directLighZ");

  directionalLightGui
    .add(directionalLight.target.position, "x")
    .min(-10)
    .max(10)
    .step(0.001)
    .name("directLighTargetPositionX")
    .onChange(() => {
      directionalLight.target.updateWorldMatrix(true, true);
    });

  directionalLightGui
    .add(directionalLight.target.position, "y")
    .min(-10)
    .max(10)
    .step(0.001)
    .name("directLighTargetPositionY")
    .onChange(() => {
      directionalLight.target.updateWorldMatrix(true, true);
    });

  directionalLightGui
    .add(directionalLight.target.position, "z")
    .min(-10)
    .max(10)
    .step(0.001)
    .name("directLighTargetPositionZ")
    .onChange(() => {
      directionalLight.target.updateWorldMatrix(true, true);
    });

  directionalLightGui
    .add(directionalLight.shadow.camera, "far")
    .min(-10)
    .max(20)
    .step(0.001)
    .name("directLighShadowCameraFar")
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix();
      directionalLightCameraHelper.update();
    });

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // -------------------------------------------------------------

  // -------- Controls and helpers

  const orbit_controls = new OrbitControls(camera, canvas);
  orbit_controls.enableDamping = true;

  const axesHelper = new AxesHelper();
  axesHelper.setColors("red", "green", "blue");
  scene.add(axesHelper);
  // ----------------------------------------------
  // ----------------------------------------------

  // -------------- RENDERER ----------------------
  // ----------------------------------------------
  const renderer = new THREE.WebGLRenderer({
    canvas,
    //To make the edges of the objects more smooth (we are setting this in this lesson)
    antialias: true,
    // alpha: true,
    powerPreference: "high-performance",
  });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  // maybe this should be only inside       tick

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // -------------- SHADOWS ----------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ------------- TONE MAPPING ------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 3;

  rendererGui.add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  });
  rendererGui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  /**
   * Event Listeners
   */

  window.addEventListener("resize", (e) => {
    console.log("resizing");
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "h") {
      gui.show(gui._hidden);
    }
  });

  const mouse = new THREE.Vector2();
  window.addEventListener("mousemove", (_event) => {
    mouse.x = (_event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(_event.clientY / sizes.height) * 2 + 1;

    // console.log({ mouse });
  });

  /* window.addEventListener("dblclick", () => {
    console.log("double click");

    // handling safari
    const fullscreenElement =
      // @ts-ignore webkit
      document.fullscreenElement || document.webkitFullScreenElement;
    //

    // if (!document.fullscreenElement) {
    if (!fullscreenElement) {
      if (canvas.requestFullscreen) {
        // go fullscreen
        canvas.requestFullscreen();

        // @ts-ignore webkit
      } else if (canvas.webkitRequestFullScreen) {
        // @ts-ignore webkit
        canvas.webkitRequestFullScreen();
      }
    } else {
      // @ts-ignore
      if (document.exitFullscreen) {
        document.exitFullscreen();

        // @ts-ignore webkit
      } else if (document.webkitExitFullscreen) {
        // @ts-ignore webkit
        document.webkitExitFullscreen();
      }
    }
  }); */

  // ---------------------- TICK -----------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------

  const clock = new THREE.Clock();

  /**
   * @description tick
   */
  function tick() {
    stats.begin();
    // monitored code goes here
    // -------------------------------------------------

    const elapsedTime = clock.getElapsedTime();

    torusKnot.rotation.y = elapsedTime * 0.1;

    // for dumping to work
    orbit_controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);

    // --------------------------------------------------
    stats.end();
  }

  tick();
}
