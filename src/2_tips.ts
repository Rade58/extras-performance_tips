import * as THREE from "three";

import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";
// import { GLTFLoader, RGBELoader } from "three/examples/jsm/Addons.js";

import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

import { AxesHelper } from "three";

import Stats from "stats.js";

// Helpful Tips are at the end of our if(canvas) statement

/**
 * @name Stats.js
 */
const stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

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

    // if render.shadowMap.autoUpdate is set to false
    // we would use this here
    // renderer.shadowMap.needsUpdate = true;

    // for dumping to work
    orbit_controls.update();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);

    // --------------------------------------------------
    stats.end();
  }

  tick();

  // -----------------------------------------------------------
  // -----------------------------------------------------------
  // -----------------------------------------------------------
  // ----------- Tips ------------------------------------------
  // -----------------------------------------------------------
  // -----------------------------------------------------------
  // -----------------------------------------------------------
  // -----------------------------------------------------------
  // -----------------------------------------------------------
  /**
   * @name Tips
   * @description tips
   */

  // ---- RENDERING INFORMATIONS
  // console.log(renderer.info);
  //
  // ---- GOOD JAVASCRIPT CODE
  //  Keep performant native JavaScript code especially in the tick function

  // ---- DISPOSE OF THINGS
  // Dispose geometries or material or textures when they are not needed
  // https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects
  /* scene.remove(cube);
  cube.geometry.dispose();
  cube.material.dispose(); */

  // ---- LIGHTS
  // - avoid them as much as you can
  // - use baked lights as we did in our portal scene
  // - if needed use cheap lights (AmbientLight, DirectionalLight, HemisphereLight)
  //            with PointLight you can have performances issues

  // - avoid adding/removing lights (mterial supporting lights will need to recompile)

  // ---- SHADOWS
  // - avoid them (use baked ones)

  // - optimize shadow maps
  // make sure they perfectly fit witj the scene
  // use helper to determine this (enable helper in gui)
  /* 
  // here in case of our scene this will make perfect fit
  directionalLight.shadow.camera.top = 3;
  directionalLight.shadow.camera.right = 6;
  directionalLight.shadow.camera.left = -6;
  directionalLight.shadow.camera.bottom = -3;
  directionalLight.shadow.camera.far = 10;
  // try to use smallest possible resolution with a
  // decent result for the mapSize
  directionalLight.shadow.mapSize.set(1024, 1024);

  // and if using helper above changes won't happen
  // so you need to update it like this
  directionalLight.shadow.camera.updateProjectionMatrix();
  directionalLightCameraHelper.update();

  // directionalLightCameraHelper (I already added to the code)
  // it's invisible by default, you can enable it with gui 
  */

  // - use castShadow and receiveShadow wisely
  // for example in our case our torus knot, sphere and cube
  // shouldn't receive shadow
  // and our floor plane shouldn't cast shadow becausenothing
  // us there to receive shadow that would be casted from floor
  /* 
  torusKnot.receiveShadow = false;
  cube.receiveShadow = false;
  sphere.receiveShadow = false;

  floor.castShadow = false; 
  */
  // - deactivate shadow auto update
  /*
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  */
  // we use this needsUpdate
  // only when you need to update
  // for example if you deactivate autoUpdate shadow will not
  // move as the animation is flowing
  // which you would notice on shadow casted from torus knot and
  // received by plane
  // that is why I went to ticj function and there I placed
  // .needsUpdate = true

  // ----- GEOMETRIES
  // - use Buffer Geometries (I think they are now default)
  // You don't need to write SphereBufferGeometry, it is deprecated
  // we write SphereGeometry
  // - do not update vertices

  // - mutualize geometries
  //
  // good for performances
  /*
  const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);

  for (let index = 0; index < 50; index++) {
    // bad for performances
    // too many geometries
    // const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);

    const mat = new THREE.MeshNormalMaterial();

    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.x = (Math.random() - 0.5) * 10;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 10;

    mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
    mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;

    scene.add(mesh);
  }
 */

  // - merge geometries

  // we have array with all geometries
  const geometries: THREE.BoxGeometry[] = [];
  for (let index = 0; index < 50; index++) {
    const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);

    geo.translate(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10
    );

    geo.rotateX((Math.random() - 0.5) * Math.PI * 2);
    geo.rotateY((Math.random() - 0.5) * Math.PI * 2);

    geometries.push(geo);
  }

  // we can now merge all geometries
  const merged = BufferGeometryUtils.mergeGeometries(geometries);

  const mat = new THREE.MeshNormalMaterial();

  const mesh = new THREE.Mesh(merged, mat);

  scene.add(mesh);
  // now you can do spector test and you will see that amout of draw calles i lowered
}
