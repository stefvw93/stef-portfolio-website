import { useEffect } from "react";
import { isClient } from "../../utils/isClient";
import { join } from "../../utils/join";
import { Experience } from "./Experience";
import styles from "./Experience.module.scss";

export type ExperienceProps = {};

export const ExperienceComponent = (props: ExperienceProps) => {
  useEffect(() => {
    if (!isClient()) return;
    const experience = new Experience("canvas.webgl");
    return experience.destroy;
  }, []);

  return (
    <div className={join(styles.container, "experience")}>
      <canvas className="webgl" />
      <div className="css-webgl" />
    </div>
  );
};
