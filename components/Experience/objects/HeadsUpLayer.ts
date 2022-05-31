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
      uAspect: { value: this.experience.camera.aspect },
      uColor: { value: new THREE.Color(0x141414) },
      uNoiseMix: { value: 0.63 },
      uNoiseScale: { value: 2.68 },
      uSharpness: { value: 0.92 },
      uSpeed: { value: new THREE.Vector2(-0.15, 0.15) },
      uSpread: { value: 64 / window.innerWidth },
      uTime: { value: 0 },
      uWidth: { value: 0 },
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

    this.gui
      ?.add(this.material.uniforms.uSharpness, "value")
      .name("uSharpness")
      .min(0)
      .max(1)
      .step(0.001);

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

    ["uWidth", "uSpread", "uNoiseMix"].forEach((u) => {
      this.gui
        ?.add(this.material.uniforms[u], "value")
        .name(u)
        .min(0)
        .max(1)
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
    this.material.uniforms.uSpread.value = 64 / window.innerWidth;
    this.updateMesh();
  };

  private handleTick = () => {
    this.material.uniforms.uTime.value =
      this.experience.clock.getElapsedTime() + window.scrollY * 0.006;
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