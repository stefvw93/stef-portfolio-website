import gsap from "gsap"
import GUI from "lil-gui"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Stage } from "./objects/Stage"

export class Experience {
  debug = true
  gui = this.debug ? new GUI() : null
  guiFolder = this.gui?.addFolder("Scene")
  size = new THREE.Vector2(globalThis.innerWidth, globalThis.innerHeight)
  clock = new THREE.Clock()
  canvas: HTMLCanvasElement
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls

  constructor(query: string) {
    this.canvas = document.querySelector(query)!
    this.renderer = this.createRenderer()
    this.scene = this.createScene()
    this.camera = this.createCamera()
    this.controls = this.createControls()
    this.guiFolder?.close()

    if (this.debug) {
      this.scene.add(new THREE.AxesHelper(2))
    }

    /**
     * Objects
     */
    Stage.create(this)

    /**
     * Listeners
     */
    gsap.ticker.add(this.tick)
    window.addEventListener("resize", this.handleResize)
  }

  private createCamera() {
    const camera = new THREE.PerspectiveCamera(
      45,
      this.size.width / this.size.height,
      0.1,
      100
    )
    camera.position.y = 2
    camera.position.z = 3
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.scene.add(camera)
    return camera
  }

  private createScene() {
    const scene = new THREE.Scene()
    const bgColor = 0x00f0ff
    scene.fog = new THREE.Fog(bgColor, 0.1, 50)
    scene.background = new THREE.Color(bgColor)

    this.guiFolder
      ?.addColor({ int: bgColor }, "int")
      .onChange((value: number) => {
        scene.fog?.color.set(value)
        ;(scene.background as THREE.Color).set(value)
      })
      .name("scene background")

    return scene
  }

  private createRenderer() {
    const renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    renderer.setSize(this.size.width, this.size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    return renderer
  }

  private createControls() {
    const controls = new OrbitControls(this.camera, this.canvas)
    controls.enableDamping = true
    return controls
  }

  private tick = () => {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  private handleResize = () => {
    this.size.width = window.innerWidth
    this.size.height = window.innerHeight
    this.camera.aspect = this.size.width / this.size.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.size.width, this.size.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  destroy = () => {
    gsap.ticker.remove(this.tick)
    window.removeEventListener("resize", this.handleResize)
    this.gui?.destroy()
  }
}
