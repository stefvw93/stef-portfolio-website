import * as THREE from "three";
import gsap from "gsap";
import { Experience } from "../Experience";
import { TitleText } from "./TitleText";

export class TitleTexts {
  readonly group = new THREE.Group();
  readonly objects: TitleText[];
  spacing = 2;

  private deltaY = 0;
  private smoothDeltaY = this.deltaY;
  private documentHeight = document.documentElement.offsetHeight;

  static create(experience: Experience, texts: string[]) {
    return new TitleTexts(experience, texts);
  }

  constructor(public experience: Experience, public texts: string[]) {
    this.objects = this.createObjects();
    experience.scene.add(this.group);
    experience.addTickListener(this.handleTick);
  }

  handleTick = () => {
    const normal = window.scrollY / window.innerHeight;
    const relative = normal * this.spacing;
    this.deltaY = relative;
    this.smoothDeltaY = gsap.utils.interpolate(
      this.smoothDeltaY,
      this.deltaY,
      0.5
    );

    this.group.position.y = this.smoothDeltaY;
  };

  private createObjects() {
    return this.texts.map((text, index) => {
      const object = new TitleText(this.experience, text);
      object.mesh.position.y += -this.spacing * index;
      this.group.add(object.mesh);
      return object;
    });
  }
}
