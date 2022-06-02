import * as THREE from "three";
import { Experience } from "../Experience";
import vertexShader from "../shaders/heads-up.vert.glsl";
import fragmentShader from "../shaders/heads-up.frag.glsl";

export class HeadsUpLayer {
  gui = this.experience.gui?.addFolder("HeadsUpLayer");
  mesh?: THREE.Mesh;

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

  private handleResize = () => {
    this.updateMesh();
  };

  private handleTick = () => {
    const uniforms = this.material.uniforms;
    uniforms.uTime.value = this.experience.clock.getElapsedTime();
  };

  private createMesh() {
    if (this.mesh) return;
    const z = this.experience.camera.position.z + 10;
    const fovY =
      (z * this.experience.camera.getFilmHeight()) /
      this.experience.camera.getFocalLength();

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(fovY * this.experience.camera.aspect, fovY),
      this.material
    );

    mesh.position.set(0, 0, -z);
    this.experience.camera.add(mesh);

    return mesh;
  }
}
