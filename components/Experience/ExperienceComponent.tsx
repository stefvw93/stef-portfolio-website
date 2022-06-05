import { useEffect } from "react";
import { isClient } from "../../utils/isClient";
import { classes } from "../../utils/classes";
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
    <div className={classes(styles.container, "experience")}>
      <canvas className="webgl" />
      <div className="css-webgl" />
    </div>
  );
};
