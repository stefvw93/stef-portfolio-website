import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader"
import {
  TextGeometry,
  TextGeometryParameters,
} from "three/examples/jsm/geometries/TextGeometry"
import { Experience } from "../Experience"
import typeface from "../assets/PP_Neue_Montreal_Book_Regular.json"
import * as THREE from "three"

export class ParagraphText {
  private gui = this.experience.gui?.addFolder("Paragraph text")

  static create(
    experience: Experience,
    text: string[] = [
      "Hello, world! What is up?",
      "The quick brown fox jumps over the lazy dog.",
      "",
      "Another one",
    ]
  ) {
    return new ParagraphText(experience, text)
  }

  constructor(public experience: Experience, public readonly text: string[]) {
    this.createText()
    this.gui?.close()
  }

  private createText() {
    const font = new Font(typeface)

    const color = 0x000000
    const text = new THREE.Group()
    const geometryParams: TextGeometryParameters = {
      font,
      size: 0.1,
      height: 0,
      curveSegments: 4,
    }

    const material = new THREE.MeshStandardMaterial({ color })
    const space = geometryParams.size! * 0.4
    const lineHeight = geometryParams.size! * 1.5
    const offset = new THREE.Vector2()

    for (let i = 0, l = this.text.length; i < l; i++) {
      const sentence = this.text[i].split(" ")

      for (let ii = 0, ll = sentence.length; ii < ll; ii++) {
        const word = sentence[ii]
        const mesh = new THREE.Mesh(
          new TextGeometry(word, geometryParams),
          material
        )

        mesh.position.x = offset.x
        mesh.position.y = offset.y
        mesh.geometry.computeBoundingBox()
        offset.x += (mesh.geometry.boundingBox?.max.x ?? 0) + space
        text.add(mesh)
      }

      offset.x = 0
      offset.y -= lineHeight
    }

    text.position.y = 0.01
    text.rotation.x = -Math.PI * 0.5
    this.experience.scene.add(text)
  }
}
