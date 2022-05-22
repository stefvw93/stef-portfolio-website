import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import { Experience } from "../Experience"
import * as THREE from "three"

export class TitleText {
  private gui = this.experience.gui?.addFolder("Title text")

  static create(experience: Experience, text: string = "Hello, world!") {
    return new TitleText(experience, text)
  }

  constructor(public experience: Experience, public readonly text: string) {
    this.createText()
    this.gui?.close()
  }

  private async createText() {
    const fontLoader = new FontLoader()

    const font = await fontLoader.loadAsync(
      "/fonts/helvetiker_regular.typeface.json"
    )

    const color = 0x000000
    const text = new THREE.Mesh(
      new TextGeometry(this.text, {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      }),
      new THREE.MeshStandardMaterial({ color })
    )
    text.geometry.computeBoundingBox()
    text.geometry.center()
    text.position.y = text.geometry.boundingBox?.max.y || 0

    this.gui?.add(text.material, "wireframe")
    this.gui
      ?.addColor({ int: color }, "int")
      .name("text color")
      .onChange((value: number) => text.material.color.set(value))

    this.experience.scene.add(text)
  }
}
