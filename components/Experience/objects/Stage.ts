import * as THREE from "three"
import { Experience } from "../Experience"

export class Stage {
  private gui = this.experience.gui?.addFolder("Stage")

  static create(experience: Experience) {
    return new Stage(experience)
  }

  constructor(public experience: Experience) {
    this.createLights()
    this.createFloor()
    this.gui?.close()
  }

  private createLights() {
    const color = 0xfffff
    const ambientLight = new THREE.AmbientLight(color, 0.5)

    this.gui
      ?.add(ambientLight, "intensity")
      .name("ambient light intensity")
      .min(0)
      .max(1)
      .step(0.01)

    this.gui
      ?.addColor({ int: color }, "int")
      .name("ambient light color")
      .onChange((value: number) => ambientLight.color.set(value))

    this.experience.scene.add(ambientLight)
  }

  private createFloor() {
    const color = 0xbada55
    const material = new THREE.MeshStandardMaterial({ color })
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), material)
    plane.rotation.x = Math.PI * -0.5

    this.gui
      ?.addColor({ int: color }, "int")
      .name("floor color")
      .onChange((value: number) => plane.material.color.set(value))

    this.experience.scene.add(plane)
  }
}
