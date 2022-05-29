import { Font } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Experience } from "../Experience";
import typeface from "../assets/Koulen_regular.json";
import * as THREE from "three";

export class TitleText {
  mesh = this.createMesh();

  private gui = this.experience.gui?.addFolder("Title text");

  static create(experience: Experience, text: string = "Hello, world!") {
    return new TitleText(experience, text);
  }

  constructor(public experience: Experience, public readonly text: string) {
    experience.addTickListener(this.handleTick);
    this.gui?.close();
  }

  private handleTick = () => {
    this.mesh.lookAt(this.experience.camera.position);
    // this.mesh.rotation.y = 0;
    this.mesh.rotation.z = 0;
  };

  private createMesh() {
    const font = new Font(typeface);

    const color = 0x0000ff;
    const mesh = new THREE.Mesh(
      new TextGeometry(this.text, {
        font,
        size: 0.15,
        height: 0.15,
        curveSegments: 32,
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.005,
        bevelOffset: 0,
        bevelSegments: 8,
      }),
      new THREE.MeshStandardMaterial({
        color,
      })
    );

    mesh.geometry.computeBoundingBox();
    mesh.geometry.center();

    const boundingBox = mesh.geometry.boundingBox!;
    const width = Math.abs(boundingBox.max.x - boundingBox.min.x);
    mesh.position.y = boundingBox.max.y;
    mesh.position.x = -2 + width * 0.5;

    this.gui?.add(mesh.material, "wireframe");
    this.gui
      ?.addColor({ int: color }, "int")
      .name("text color")
      .onChange((value: number) => mesh.material.color.set(value));

    this.experience.scene.add(mesh);

    return mesh;
  }
}
