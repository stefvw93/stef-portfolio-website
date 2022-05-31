import * as THREE from "three";
import gsap from "gsap";
import { Experience } from "../Experience";
import { TitleText } from "./TitleText";
import { isTouchDevice } from "../../../utils/isTouchDevice";

export class TitleTexts {
  readonly group = new THREE.Group();
  readonly objects: TitleText[];
  spacing = 4;

  private deltaY = 0;
  private smoothDeltaY = this.deltaY;
  private documentHeight = document.documentElement.offsetHeight;

  getOffsetX() {
    const width = window.innerWidth;
    const large = width >= 1024;
    const medium = width < 1024;
    const small = width < 800;

    switch (true) {
      case small:
        return 0;
      case medium:
        return -0.2;
      case large:
        return -0.5;
    }

    return 0;
  }

  static create(experience: Experience, texts: string[]) {
    return new TitleTexts(experience, texts);
  }

  constructor(public experience: Experience, public texts: string[]) {
    this.objects = this.createObjects();
    experience.scene.add(this.group);
    experience.addTickListener(this.handleTick);
    experience.addResizeListener(this.handleResize);
  }

  handleResize = () => {
    this.group.position.x = this.getOffsetX();
  };

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
      this.group.position.x = this.getOffsetX();
      return object;
    });
  }
}
