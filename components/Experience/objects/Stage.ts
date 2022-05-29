import * as THREE from "three"
import { Experience } from "../Experience"

export class Stage {
  private gui = this.experience.gui?.addFolder("Stage")

  static floorColor = 0xcfff33

  static create(experience: Experience) {
    return new Stage(experience)
  }

  constructor(public experience: Experience) {
    this.createLights()
    this.createFloor()
    this.gui?.close()
  }

  private createLights() {
    const color = 0xffffff
    const axes = ["x", "y", "z"]

    /**
     * Hemisphere light
     */
    const hemisphereLight = new THREE.HemisphereLight(
      Experience.backgroundColor,
      Stage.floorColor,
      0.3
    )

    this.gui
      ?.add(hemisphereLight, "intensity")
      .name("Hemisphere light intensity")
      .min(0)
      .max(1)
      .step(0.01)

    /**
     * Ambient light
     */
    const ambientLight = new THREE.AmbientLight(color, 0.45)
    const ambientLightFolder = this.gui?.addFolder("Ambient light")

    ambientLightFolder?.add(ambientLight, "intensity").min(0).max(1).step(0.01)

    ambientLightFolder
      ?.addColor({ int: color }, "int")
      .name("color")
      .onChange((value: number) => ambientLight.color.set(value))

    /**
     * Directional light
     */
    const directionalLight = new THREE.DirectionalLight(color, 0.6)
    directionalLight.position.set(0.8, 0.4, 1)
    directionalLight.castShadow = true
    directionalLight.shadow.camera
    directionalLight.shadow.mapSize.width = 512
    directionalLight.shadow.mapSize.height = 512
    directionalLight.shadow.camera.top = 1
    directionalLight.shadow.camera.right = 0.8
    directionalLight.shadow.camera.bottom = -0.3
    directionalLight.shadow.camera.left = -0.8

    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight
    )
    const directionalLightShadowCameraHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera
    )

    const directionalLightFolder = this.gui?.addFolder("Directional light")

    axes.forEach((axis) =>
      directionalLightFolder
        ?.add(directionalLight.position, axis)
        .min(-10)
        .max(10)
        .step(0.01)
        .onChange(() => directionalLightHelper.update())
    )

    directionalLightFolder
      ?.add(directionalLight, "intensity")
      .min(0)
      .max(1)
      .step(0.01)

    directionalLightFolder
      ?.addColor({ int: color }, "int")
      .name("color")
      .onChange((value: number) => directionalLight.color.set(value))

    this.experience.scene.add(
      hemisphereLight,
      ambientLight,
      directionalLight,
      directionalLight.target
    )

    if (this.experience.debug) {
      this.experience.scene.add(
        directionalLightHelper,
        directionalLightShadowCameraHelper
      )
    }
  }

  private createFloor() {
    const color = Stage.floorColor
    const material = new THREE.MeshStandardMaterial({ color })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), material)
    plane.rotation.x = Math.PI * -0.5
    plane.receiveShadow = true

    this.gui
      ?.addColor({ int: color }, "int")
      .name("floor color")
      .onChange((value: number) => plane.material.color.set(value))

    this.experience.scene.add(plane)
  }
}
