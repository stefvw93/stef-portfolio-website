import * as THREE from "three";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Experience } from "../Experience";
import typeface from "../assets/PP_Neue Montreal_Bold.json";
import fragmentShader from "../shaders/text.frag.glsl";
import vertexShader from "../shaders/uv.vert.glsl";

export class TitleText {
  mesh = this.createMesh();

  private gui = this.experience.gui?.addFolder("Title text");

  static create(experience: Experience, text: string = "Hello, world!") {
    return new TitleText(experience, text);
  }

  constructor(public experience: Experience, public readonly text: string) {
    experience.addTickListener(this.handleTick);
    experience.addResizeListener(this.handleResize);

    // uTime
    // uSpeed
    // uNoiseScale
    // uFragmentation
    // uColor1
    // uColor2

    ["uNoiseScale", "uFragmentation"].forEach((u) => {
      this.gui
        ?.add(this.mesh.material.uniforms[u], "value")
        .name(u)
        .min(0)
        .max(10)
        .step(0.005);
    });

    ["x", "y"].forEach((axis) =>
      this.gui
        ?.add(this.mesh.material.uniforms.uSpeed.value, axis)
        .name(`uSpeed.${axis}`)
        .min(0)
        .max(5)
        .step(0.01)
    );

    ["uColor1", "uColor2"].forEach((color) =>
      this.gui
        ?.addColor({ int: this.mesh.material.uniforms[color].value }, "int")
        .name(color)
        .onChange((value: number) =>
          this.mesh.material.uniforms[color].value.set(value)
        )
    );

    this.gui?.close();
  }

  private handleResize = () => {};

  private handleTick = () => {
    this.mesh.material.uniforms.uTime.value =
      this.experience.clock.getElapsedTime();
  };

  private createMesh() {
    const font = new Font(typeface);

    const color = 0x0000ff;

    const geometry = new TextGeometry(this.text, {
      font,
      size: 0.5,
      height: 0,
      curveSegments: 8,
      bevelEnabled: false,
      bevelThickness: 0,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 8,
    });

    // const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: new THREE.Vector2(0.1, 0.2) },
        uNoiseScale: { value: 1.025 },
        uFragmentation: { value: 2.01 },
        uColor1: { value: new THREE.Color(0xff206e) },
        uColor2: { value: new THREE.Color(0xfbff12) },
      },
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.geometry.computeBoundingBox();
    mesh.geometry.center();

    this.experience.scene.add(mesh);

    return mesh;
  }
}
