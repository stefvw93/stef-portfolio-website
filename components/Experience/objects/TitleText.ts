import * as THREE from "three";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import {
  TextGeometry,
  TextGeometryParameters,
} from "three/examples/jsm/geometries/TextGeometry";
import { Experience } from "../Experience";
import typeface from "../assets/PP_Neue Montreal_Bold.json";
import fragmentShader from "../shaders/text.frag.glsl";
import vertexShader from "../shaders/uv.vert.glsl";

type TitleTextConfig = {
  main: string;
  top: string;
  bottom: string;
};

export class TitleText {
  material = new THREE.ShaderMaterial({
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

  geometry = new TextGeometry(this.texts.main, {
    font: new Font(typeface),
    size: 0.5,
    height: 0,
    curveSegments: 8,
  });

  mesh = this.createMesh();

  private gui = this.experience.gui?.addFolder("Title text");

  static create(experience: Experience, texts: TitleTextConfig) {
    return new TitleText(experience, texts);
  }

  constructor(
    public experience: Experience,
    public readonly texts: TitleTextConfig
  ) {
    SubtitleText.create(this, this.texts.top, this.texts.bottom);
    experience.addTickListener(this.handleTick);
    experience.addResizeListener(this.handleResize);

    ["uNoiseScale", "uFragmentation"].forEach((u) => {
      this.gui
        ?.add(this.material.uniforms[u], "value")
        .name(u)
        .min(0)
        .max(10)
        .step(0.005);
    });

    ["x", "y"].forEach((axis) =>
      this.gui
        ?.add(this.material.uniforms.uSpeed.value, axis)
        .name(`uSpeed.${axis}`)
        .min(0)
        .max(5)
        .step(0.01)
    );

    ["uColor1", "uColor2"].forEach((color) =>
      this.gui
        ?.addColor({ int: this.material.uniforms[color].value }, "int")
        .name(color)
        .onChange((value: number) =>
          this.material.uniforms[color].value.set(value)
        )
    );

    this.gui?.close();
  }

  private handleResize = () => {};

  private handleTick = () => {
    this.material.uniforms.uTime.value = this.experience.clock.getElapsedTime();
  };

  private createMesh() {
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.geometry.computeBoundingBox();
    mesh.geometry.center();
    this.experience.scene.add(mesh);
    return mesh;
  }
}

class SubtitleText {
  readonly material = new THREE.MeshBasicMaterial({
    color: 0x0c0f0a,
    transparent: true,
    opacity: 0.1,
  });

  readonly geometryParams: TextGeometryParameters = {
    font: new Font(typeface),
    size: 0.2,
    height: 0,
    curveSegments: 8,
  };

  readonly geometry1 = new TextGeometry(this.topText, this.geometryParams);
  readonly geometry2 = new TextGeometry(this.bottomText, this.geometryParams);
  readonly mesh1 = this.createMesh("top");
  readonly mesh2 = this.createMesh("bottom");

  static create(titleText: TitleText, topText: string, bottomText: string) {
    return new SubtitleText(titleText, topText, bottomText);
  }

  constructor(
    public titleText: TitleText,
    public readonly topText: string,
    public readonly bottomText: string
  ) {}

  private createMesh(destination: "top" | "bottom") {
    const mesh = new THREE.Mesh(
      destination === "top" ? this.geometry1 : this.geometry2,
      this.material
    );

    mesh.geometry.computeBoundingBox();
    mesh.geometry.center();

    const bbox = mesh.geometry.boundingBox!;
    const width = Math.abs(bbox.max.x - bbox.min.x);
    const titleBbox = this.titleText.mesh.geometry.boundingBox!;
    const titleHeight = Math.abs(titleBbox.max.y - titleBbox.min.y);

    mesh.position.x =
      (destination === "top" ? titleBbox.min.x : titleBbox.max.x - width) +
      width * 0.5;

    mesh.position.y = destination === "top" ? titleHeight : -titleHeight;

    this.titleText.experience.scene.add(mesh);
    return mesh;
  }
}
