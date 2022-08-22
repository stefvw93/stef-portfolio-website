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

export class TitleText {
  y = 0;
  pointerPosition = new THREE.Vector2();
  group = new THREE.Group();

  baseUniformSpeed = new THREE.Vector2(0.25, 0.08);
  material = new THREE.ShaderMaterial({
    // wireframe: true,
    depthWrite: false,
    depthTest: false,
    transparent: true,
    vertexShader,
    fragmentShader,
    side: THREE.FrontSide,
    uniforms: {
      uAlphaMap: {
        value: this.experience.textureLoader.load(
          "images/text-alpha-map-arlen-2048x512.png"
        ),
      },
      uDentSize: { value: 0 },
      uDimensions: { value: new THREE.Vector2() },
      uPointer: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uSpeed: { value: new THREE.Vector2().copy(this.baseUniformSpeed) },
      uNoiseScale: { value: 0.66 },
      uFragmentation: { value: 10 },
      uColor1: { value: new THREE.Color(0xff206e) },
      uColor2: { value: new THREE.Color(0xfbff12) },
    },
  });

  dimensions: THREE.Vector2;
  geometry: THREE.PlaneGeometry;
  mesh: THREE.Mesh;
  raycaster = new THREE.Raycaster();
  private gui = this.experience.gui?.addFolder("Title text");
  private pointerActive = false;

  constructor(
    public experience: Experience,
    public readonly texts: TitleTextConfig,
    size: number
  ) {
    this.dimensions = new THREE.Vector2(size, size * 0.25);
    this.geometry = new THREE.PlaneBufferGeometry(
      this.dimensions.width,
      this.dimensions.height,
      64,
      16
    );
    this.mesh = this.createMesh();
    SubtitleText.create(this, this.texts.top, this.texts.bottom);
    experience.addTickListener(this.handleTick);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchend", this.handleTouchEnd);
    experience.addDestroyListener(() => {
      window.removeEventListener("mousemove", this.handleMouseMove);
      window.removeEventListener("touchmove", this.handleTouchMove);
      window.removeEventListener("touchstart", this.handleTouchStart);
      window.removeEventListener("touchend", this.handleTouchEnd);
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
    this.pointerActive = true;
    this.pointerPosition.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  };

  private handleTouchMove = (event: TouchEvent) => {
    const touch = event.touches[0];
    if (!touch) return;

    this.pointerActive = true;

    this.pointerPosition.set(
      (touch.screenX / window.innerWidth) * 2 - 1,
      -(touch.screenY / window.innerHeight) * 2 + 1
    );
  };

  private handleTouchStart = () => {
    this.pointerActive = true;
  };

  private handleTouchEnd = () => {
    this.pointerActive = false;
  };

  private handleTick = (time: number, deltaTime: number) => {
    const progress = 0.1 * (deltaTime / this.experience.referenceFrameMs);
    const uniforms = this.material.uniforms;
    uniforms.uTime.value = this.experience.clock.getElapsedTime();

    if (!this.pointerActive) {
      return (uniforms.uDentSize.value = gsap.utils.interpolate(
        uniforms.uDentSize.value,
        0,
        progress
      ));
    }

    this.raycaster.setFromCamera(this.pointerPosition, this.experience.camera);

    const intersects = this.raycaster.intersectObjects(
      this.experience.scene.children
    );

    const uPointer: THREE.Vector2 = uniforms.uPointer.value;
    const uDentSize: { value: number } = uniforms.uDentSize;
    let intersectionPoint: THREE.Vector3 | undefined;

    for (let i = 0, l = intersects.length; i < l; i++) {
      if (intersects[i].object === this.mesh) {
        intersectionPoint = intersects[i].point;
        break;
      }
    }

    if (intersectionPoint) {
      uDentSize.value = gsap.utils.interpolate(uDentSize.value, 1, progress);
      uPointer.set(
        gsap.utils.interpolate(uPointer.x, intersectionPoint.x, progress),
        gsap.utils.interpolate(uPointer.y, intersectionPoint.y, progress)
      );
    } else {
      uDentSize.value = gsap.utils.interpolate(uDentSize.value, 0.2, progress);
    }
  };

  private createMesh() {
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.geometry.computeBoundingBox();
    mesh.geometry.center();
    this.group.add(mesh);
    return mesh;
  }
}

class SubtitleText {
  readonly material = new THREE.MeshBasicMaterial({
    color: 0x0c0f0a,
    transparent: true,
    opacity: 0.1,
    // wireframe: true,
  });

  readonly geometryParams: TextGeometryParameters = {
    font: new Font(typeface),
    size: this.titleText.dimensions.height * 0.15,
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
    const height = Math.abs(bbox.max.y - bbox.min.y);
    // const titleBbox = this.titleText.mesh.geometry.boundingBox!;
    // const titleHeight = Math.abs(titleBbox.max.y - titleBbox.min.y);

    const parentDimensions = this.titleText.dimensions;

    mesh.position.z = -0.1;
    mesh.position.x =
      (destination === "top"
        ? -parentDimensions.width * 0.5
        : parentDimensions.width * 0.5 - width) +
      width * 0.5;

    mesh.position.y =
      destination === "top"
        ? parentDimensions.height - height * 3
        : -parentDimensions.height + height * 3;

    // mesh.position.x =
    //   (destination === "top" ? titleBbox.min.x : titleBbox.max.x - width) +
    //   width * 0.5;

    // mesh.position.y = destination === "top" ? titleHeight : -titleHeight;

    this.titleText.group.add(mesh);
    return mesh;
  }
}
