import * as THREE from "three";
import { Experience } from "../Experience";
import vertexShader from "../shaders/heads-up.vert.glsl";
import fragmentShader from "../shaders/heads-up.frag.glsl";
import { TitleText } from "./TitleText";

export class HeadsUpLayer {
  gui = this.experience.gui?.addFolder("HeadsUpLayer");
  mesh?: THREE.Mesh;
  text?: TitleText;

  material = new THREE.ShaderMaterial({
    transparent: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uColor1: { value: new THREE.Color(0xffffff) },
      uColor2: { value: new THREE.Color(0x2b59c3) },
      uNoiseScale: { value: 1.45 },
      uSpeed: { value: new THREE.Vector2(-0.2, 0.2) },
      uTime: { value: 0 },
    },
  });

  static create(experience: Experience) {
    return new HeadsUpLayer(experience);
  }

  constructor(public experience: Experience) {
    this.mesh = this.createMesh();
    this.text = this.createText();
    experience.addResizeListener(this.handleResize);
    experience.addTickListener(this.handleTick);

    this.gui?.addColor({ int: 0xff0000 }, "int").onChange((value: number) => {
      this.material.uniforms.uColor.value.set(value);
    });

    ["uNoiseScale"].map((u) => {
      this.gui
        ?.add(this.material.uniforms[u], "value")
        .name(u)
        .min(0)
        .max(50)
        .step(0.01);
    });

    ["x", "y"].forEach((axis) => {
      this.gui
        ?.add(
          new THREE.Vector2(this.material.uniforms.uSpeed.value[axis]),
          axis
        )
        .name(`uSpeed.${axis}`)
        .min(-2)
        .max(2)
        .step(0.005)
        .onChange((value: number) => {
          this.material.uniforms.uSpeed.value[axis] = value;
        });
    });
  }

  updateMesh = () => {
    if (this.mesh) {
      this.mesh.removeFromParent();
      this.mesh.geometry.dispose();
      this.mesh = undefined;
    }

    this.mesh = this.createMesh();
  };

  updateText = () => {
    if (this.text) {
      this.text.group.children.forEach((child) => {
        child.removeFromParent();
        (child as THREE.Mesh).geometry?.dispose();
      });
      this.text.group.removeFromParent();
      this.text = undefined;
    }

    this.text = this.createText();
  };

  private handleResize = () => {
    this.updateMesh();
    this.updateText();
  };

  private handleTick = () => {
    const uniforms = this.material.uniforms;
    uniforms.uTime.value = this.experience.clock.getElapsedTime();
  };

  private createText() {
    const textDistance = 8;
    const textZ = this.experience.camera.position.z - textDistance;
    const fovY =
      (textZ * this.experience.camera.getFilmHeight()) /
      this.experience.camera.getFocalLength();

    const bounds = new THREE.Vector2(
      ...[fovY * this.experience.camera.aspect, fovY].map(Math.abs)
    );

    const titleText = new TitleText(
      this.experience,
      {
        main: "CREATIVE",
        top: "STEF VAN WIJCHEN",
        bottom: "DEVELOPER",
      },
      Math.min(bounds.width * 0.6, 4)
    );

    titleText.group.position.z = textZ;
    this.experience.camera.add(titleText.group);

    return titleText;
  }

  private createMesh() {
    if (this.mesh) return;
    const backgroundDistance = 20;
    const backgroundZ = this.experience.camera.position.z - backgroundDistance;
    const fovY =
      (backgroundZ * this.experience.camera.getFilmHeight()) /
      this.experience.camera.getFocalLength();
    const backgroundDimensions = new THREE.Vector2(
      fovY * this.experience.camera.aspect,
      fovY
    );

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(
        backgroundDimensions.width,
        backgroundDimensions.height
      ),
      this.material
    );

    mesh.position.set(0, 0, backgroundZ);
    this.experience.camera.add(mesh);

    return mesh;
  }
}
