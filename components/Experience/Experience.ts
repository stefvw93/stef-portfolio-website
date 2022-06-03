import gsap, { Power1 } from "gsap";
import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getCssVar } from "../../utils/getCssVar";
import { HeadsUpLayer } from "./objects/HeadsUpLayer";
import { TitleText } from "./objects/TitleText";
export class Experience {
  debug = false;
  gui = this.debug ? new GUI() : null;
  guiFolder = this.gui?.addFolder("Scene");
  size = new THREE.Vector2(globalThis.innerWidth, globalThis.innerHeight);
  clock = new THREE.Clock();
  center = new THREE.Vector3(0, 0, 0);
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls?: OrbitControls;
  loadingManager = new THREE.LoadingManager();
  textureLoader = new THREE.TextureLoader(this.loadingManager);
  referenceFps = 60;
  referenceFrameMs = 1000 / this.referenceFps;
  private resizeListeners = new Set<() => any>();
  private tickListeners = new Set<(t: number, dt: number) => any>();
  private destroyListeners = new Set<() => any>();
  private backgroundColor = 0xffffff;

  constructor(query: string) {
    this.canvas = document.querySelector(query)!;
    this.renderer = this.createRenderer();
    this.scene = this.createScene();
    this.camera = this.createCamera();
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
    TitleText.create(this, {
      main: "CREATIVE",
      top: "STEF VAN WIJCHEN",
      bottom: "DEVELOPER",
    });

    /**
     * Listeners
     */
    gsap.ticker.add(this.tick);
    window.addEventListener("resize", this.handleResize);

    console.log(this);
  }

  addResizeListener = (fn: () => any) => this.resizeListeners.add(fn);
  addTickListener = (fn: (t: number, dt: number) => any) =>
    this.tickListeners.add(fn);
  addDestroyListener = (fn: () => any) => this.destroyListeners.add(fn);

  private createCamera() {
    const center = new THREE.Vector3(0, 0, 0);
    const camera = new THREE.PerspectiveCamera(
      55,
      this.size.width / this.size.height,
      0.1,
      100
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

    this.scene.add(camera);

    return camera;
  }

  private createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(this.backgroundColor);

    this.guiFolder
      ?.addColor({ int: this.backgroundColor }, "int")
      .name("backgroundColor")
      .onChange((value: number) => {
        scene.fog?.color.set(value);
        (scene.background as THREE.Color).set(value);
      })
      .name("scene background");

    return scene;
  }

  private createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    renderer.setSize(this.size.width, this.size.height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return renderer;
  }

  private createControls() {
    const controls = new OrbitControls(this.camera, this.canvas);
    controls.enableDamping = true;
    controls.enabled = this.debug;
    return controls;
  }

  private tick = (time: number, deltaTime: number) => {
    if (this.controls?.enabled) this.controls.update();
    this.tickListeners.forEach((f) => f(time, deltaTime));
    this.renderer.render(this.scene, this.camera);
  };

  private handleResize = () => {
    gsap.killTweensOf(this.size);
    gsap.to(this.size, {
      width: window.innerWidth,
      height: window.innerHeight,
      duration: 0.2,
      ease: Power1.easeInOut,
      onUpdate: () => {
        this.camera.aspect = this.size.width / this.size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.size.width, this.size.height);
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.resizeListeners.forEach((f) => f());
      },
    });
  };

  destroy = () => {
    gsap.ticker.remove(this.tick);
    window.removeEventListener("resize", this.handleResize);
    this.destroyListeners.forEach((f) => f());
    this.gui?.destroy();
  };
}
