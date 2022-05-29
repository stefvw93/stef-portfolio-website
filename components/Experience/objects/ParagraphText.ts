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
      "2021 - current",
      "Stijlbreuk \\\\ front-end developer",
      "",
      "2019 - 2021",
      "Hulan \\\\ lead front-end developer",
      "",
      "2018 - 2019",
      "Hulan \\\\ front-end developer",
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
      size: 0.13,
      height: 0,
      curveSegments: 4,
    }

    const material = new THREE.MeshStandardMaterial({ color })
    const space = geometryParams.size! * 0.4
    const lineHeight = geometryParams.size! * 1.6
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

    const bbox = new THREE.Box3()
    bbox.setFromObject(text)

    text.position.set(-(bbox.max.x - bbox.min.x) * 0.5, 0.01, 1)

    text.rotation.x = -Math.PI * 0.5
    this.experience.scene.add(text)
    this.experience.camera.lookAt(text.position)
  }
}
