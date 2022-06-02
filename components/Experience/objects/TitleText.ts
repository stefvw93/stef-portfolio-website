import * as THREE from "three";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import {
  TextGeometry,
  TextGeometryParameters,
} from "three/examples/jsm/geometries/TextGeometry";
import { Experience } from "../Experience";
import typeface from "../assets/PP_Neue Montreal_Bold.json";
import fragmentShader from "../shaders/text.frag.glsl";
import vertexShader from "../shaders/text.vert.glsl";
import gsap from "gsap";

type TitleTextConfig = {
  main: string;
  top: string;
  bottom: string;
};

/**
 * ORIGINAL DIMENSIONS
 * x: 3.4255001544952393
 * y: 0.5184999704360962
 * aspect 6.612
 */
export class TitleText {
  pointerPosition = new THREE.Vector2();

  material = new THREE.ShaderMaterial({
    transparent: true,
    vertexShader,
    fragmentShader,
    // wireframe: true,
    side: THREE.DoubleSide,
    uniforms: {
      uAlphaMap: {
        value: this.experience.textureLoader.load("/text-alpha-map-2048.png"),
      },
      uDentSize: { value: 0 },
      uDimensions: { value: new THREE.Vector2() },
      uPointer: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uSpeed: { value: new THREE.Vector2(0.25, 0.14) },
      uNoiseScale: { value: 1.025 },
      uFragmentation: { value: 2.01 },
      uColor1: { value: new THREE.Color(0xff206e) },
      uColor2: { value: new THREE.Color(0xfbff12) },
    },
  });

  // geometry = new TextGeometry(this.texts.main, {
  //   font: new Font(typeface),
  //   size: 0.5,
  //   height: 0,
  //   curveSegments: 8,
  // });
  geometry = new THREE.PlaneGeometry(3.43, 3.43, 256, 128);

  mesh = this.createMesh();

  raycaster = new THREE.Raycaster();

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

    window.addEventListener("mousemove", this.handleMouseMove);
    experience.addDestroyListener(() => {
      window.removeEventListener("mousemove", this.handleMouseMove);
    });

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

  private handleMouseMove = (event: MouseEvent) => {
    this.pointerPosition.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  };

  private handleResize = () => {};

  private handleTick = (time: number, deltaTime: number) => {
    const progress = 0.1 * (this.experience.referenceFrameMs / deltaTime);
    const uniforms = this.material.uniforms;
    uniforms.uTime.value = this.experience.clock.getElapsedTime();

    this.raycaster.setFromCamera(this.pointerPosition, this.experience.camera);
    const intersects = this.raycaster.intersectObjects(
      this.experience.scene.children
    );

    const uPointer = uniforms.uPointer.value;
    let intersectionPoint: THREE.Vector3 | undefined;

    for (let i = 0, l = intersects.length; i < l; i++) {
      if (intersects[i].object === this.mesh) {
        intersectionPoint = intersects[i].point;
        break;
      }
    }

    if (intersectionPoint) {
      uniforms.uDentSize.value = gsap.utils.interpolate(
        uniforms.uDentSize.value,
        1,
        progress
      );
      uPointer.set(
        gsap.utils.interpolate(uPointer.x, intersectionPoint.x, progress),
        gsap.utils.interpolate(uPointer.y, intersectionPoint.y, progress)
      );
    } else {
      uniforms.uDentSize.value = gsap.utils.interpolate(
        uniforms.uDentSize.value,
        0,
        progress
      );
    }
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
    size: 0.15,
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
    // const titleBbox = this.titleText.mesh.geometry.boundingBox!;
    // const titleHeight = Math.abs(titleBbox.max.y - titleBbox.min.y);

    const parentDimensions = new THREE.Vector2(
      3.4255001544952393,
      0.5184999704360962
    );

    mesh.position.z = 0.01;
    mesh.position.x =
      (destination === "top"
        ? -parentDimensions.width * 0.5
        : parentDimensions.width * 0.5 - width) +
      width * 0.5;

    mesh.position.y =
      destination === "top"
        ? parentDimensions.height
        : -parentDimensions.height;

    // mesh.position.x =
    //   (destination === "top" ? titleBbox.min.x : titleBbox.max.x - width) +
    //   width * 0.5;

    // mesh.position.y = destination === "top" ? titleHeight : -titleHeight;

    this.titleText.experience.scene.add(mesh);
    return mesh;
  }
}
