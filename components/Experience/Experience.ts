import gsap, { Power1 } from "gsap";
import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { debounce } from "../../utils/debounce";
import { ScrollMotion } from "../../utils/ScrollMotion";
import { HeadsUpLayer } from "./objects/HeadsUpLayer";

export class Experience {
  debug = false;
  gui = this.debug ? new GUI() : null;
  guiFolder = this.gui?.addFolder("Scene");

  container: HTMLElement;
  size = new THREE.Vector2(window.innerWidth, window.innerHeight);
  clock = new THREE.Clock();
  center = new THREE.Vector3(0, 0, 0);
  canvas: HTMLCanvasElement;
  backgroundCanvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  backgroundRenderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  backgroundScene: THREE.Scene;
  controls?: OrbitControls;
  camera: THREE.PerspectiveCamera;
  backgroundCamera: THREE.PerspectiveCamera;
  loadingManager = new THREE.LoadingManager();
  textureLoader = new THREE.TextureLoader(this.loadingManager);
  referenceFps = 60;
  referenceFrameMs = 1000 / this.referenceFps;
  resizeListeners = new Set<() => any>();
  tickListeners = new Set<(t: number, dt: number) => any>();
  destroyListeners = new Set<() => any>();
  backgroundColor = 0xffffff;

  get dpr() {
    return Math.min(window.devicePixelRatio || 1, 3);
  }

  constructor() {
    this.container = document.querySelector(".experience")!;
    this.backgroundCanvas = document.querySelector("canvas.webgl.background")!;
    this.canvas = document.querySelector("canvas.webgl.foreground")!;
    this.renderer = this.createRenderer({ alpha: true });
    this.backgroundRenderer = this.createRenderer({
      dpr: 0.01,
      canvas: this.backgroundCanvas,
    });
    this.scene = this.createScene();
    this.backgroundScene = this.createScene(true);
    this.camera = this.createCamera();
    this.backgroundCamera = this.createCamera(this.backgroundScene);
    this.controls = this.createControls();

    this.gui?.close();
    this.guiFolder?.close();

    if (this.debug) {
      this.scene.add(new THREE.AxesHelper(2));
    }

    /**
     * Objects
     */
    HeadsUpLayer.create(this);

    /**
     * Listeners
     */
    gsap.ticker.add(this.tick);
    window.addEventListener("resize", this.handleResize);

    /**
     * other setup
     */
    this.setContainerSize();
  }

  addResizeListener = (fn: () => any) => this.resizeListeners.add(fn);
  addTickListener = (fn: (t: number, dt: number) => any) =>
    this.tickListeners.add(fn);
  addDestroyListener = (fn: () => any) => this.destroyListeners.add(fn);

  setContainerSize() {
    gsap.set(this.container, {
      width: this.size.width,
      height: this.size.height,
    });
  }

  createCamera(scene = this.scene) {
    const center = new THREE.Vector3(0, 0, 0);
    const camera = new THREE.PerspectiveCamera(
      55,
      this.size.width / this.size.height,
      0.1,
      20
    );
    camera.position.set(0, 0, 4.1);
    camera.lookAt(center);

    const controls = ["x", "y", "z"];
    controls.forEach((axis) => {
      this.guiFolder
        ?.add(camera.position, axis)
        .name(`camera ${axis}`)
        .min(-10)
        .max(10)
        .step(0.01)
        .onChange(() => camera.lookAt(center));
    });

    scene.add(camera);

    return camera;
  }

  createScene(hasBackground = false) {
    const scene = new THREE.Scene();
    if (hasBackground) scene.background = new THREE.Color(this.backgroundColor);
    return scene;
  }

  createRenderer({
    alpha = false,
    canvas = this.canvas,
    dpr = this.dpr,
    highPerformance = true,
  }: {
    alpha?: boolean;
    canvas?: HTMLCanvasElement;
    dpr?: number;
    highPerformance?: boolean;
  } = {}) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha,
    });

    renderer.setSize(this.size.width, this.size.height);
    renderer.setPixelRatio(dpr);

    return renderer;
  }

  createControls() {
    if (!this.debug) return;
    const controls = new OrbitControls(this.camera, this.canvas);
    controls.enableDamping = true;
    return controls;
  }

  tick = (time: number, deltaTime: number) => {
    // if (this.controls?.enabled) this.controls.update();
    if (ScrollMotion.instance) {
      this.camera.position.y = ScrollMotion.instance.smoothY * -0.0035;
    }

    this.tickListeners.forEach((f) => f(time, deltaTime));
    this.backgroundRenderer.render(this.backgroundScene, this.backgroundCamera);

    if ((ScrollMotion.instance?.smoothY ?? 0) <= window.innerHeight) {
      this.renderer.render(this.scene, this.camera);
    }
  };

  handleResize = debounce(() => {
    if (this.size.width === window.innerWidth) return;
    this.size.width = window.innerWidth;
    this.size.height = window.innerHeight;
    this.setContainerSize();
    this.camera.aspect = this.size.width / this.size.height;
    this.camera.updateProjectionMatrix();
    this.backgroundCamera.aspect = this.size.width / this.size.height;
    this.backgroundCamera.updateProjectionMatrix();
    this.renderer.setSize(this.size.width, this.size.height);
    this.renderer.setPixelRatio(this.dpr);
    this.backgroundRenderer.setSize(this.size.width, this.size.height);
    this.backgroundRenderer.setPixelRatio(0.01);
    this.resizeListeners.forEach((f) => f());
  });

  destroy = () => {
    gsap.ticker.remove(this.tick);
    window.removeEventListener("resize", this.handleResize);
    this.destroyListeners.forEach((f) => f());
    this.gui?.destroy();
  };
}
