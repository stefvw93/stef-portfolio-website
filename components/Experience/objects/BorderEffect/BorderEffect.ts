import * as THREE from "three";
import { Experience } from "../../Experience";
import vertexShader from "./border.vert.glsl";
import fragmentShader from "./border.frag.glsl";

export class BorderEffect {
  gui = this.experience.gui?.addFolder("BorderEffect");
  mesh?: THREE.Mesh;
  material = new THREE.ShaderMaterial({
    transparent: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uAspect: { value: this.experience.camera.aspect },
      uColor: { value: new THREE.Color(0xff0000) },
      uGradient: { value: 1.2 },
      uLimit: { value: 0.95 },
      uNoiseScale: { value: 0.22 },
      uSpeed: { value: new THREE.Vector2(0.35, 0.35) },
      uTime: { value: 0 },
    },
  });

  static create(experience: Experience) {
    return new BorderEffect(experience);
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

    ["uGradient", "uLimit"].forEach((u) => {
      this.gui
        ?.add(this.material.uniforms[u], "value")
        .name(u)
        .min(0.01)
        .max(2)
        .step(0.005);
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
    this.material.uniforms.uAspect.value = this.experience.camera.aspect;
    this.updateMesh();
  };

  private handleTick = () => {
    this.material.uniforms.uTime.value = this.experience.clock.getElapsedTime();
  };

  private createMesh() {
    if (this.mesh) return;

    const fovY =
      (this.experience.camera.position.z *
        this.experience.camera.getFilmHeight()) /
      this.experience.camera.getFocalLength();

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(fovY * this.experience.camera.aspect, fovY),
      this.material
    );

    mesh.position.set(0, 0, -4.1);
    this.experience.camera.add(mesh);

    return mesh;
  }
}
