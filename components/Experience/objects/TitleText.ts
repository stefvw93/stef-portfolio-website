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
    experience.addResizeListener(this.handleResize);
    this.gui?.close();
  }

  getOffsetX(mesh = this.mesh) {
    const boundingBox = mesh.geometry.boundingBox!;
    const width = Math.abs(boundingBox.max.x - boundingBox.min.x);
    const small = window.innerWidth < 800;

    if (small) {
      return 0;
    }

    return -width * 0.5;
  }

  private handleResize = () => {
    this.mesh.position.x = this.getOffsetX();
  };

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
        size: 0.25,
        height: 0.15,
        curveSegments: 32,
        bevelEnabled: true,
        bevelThickness: 0.005,
        bevelSize: 0.005,
        bevelOffset: 0,
        bevelSegments: 8,
      }),
      // new THREE.MeshNormalMaterial({})
      new THREE.MeshMatcapMaterial({
        matcap: this.experience.textureLoader.load("/matcap4.png"),
      })
    );

    mesh.geometry.computeBoundingBox();
    mesh.geometry.center();
    mesh.position.x = this.getOffsetX(mesh);

    this.gui?.add(mesh.material, "wireframe");
    this.gui
      ?.addColor({ int: color }, "int")
      .name("text color")
      .onChange((value: number) => mesh.material.color.set(value));

    this.experience.scene.add(mesh);

    return mesh;
  }
}
