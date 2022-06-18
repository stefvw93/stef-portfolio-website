import { useEffect } from "react";
import { isClient } from "../../utils/isClient";
import { classes } from "../../utils/classes";
import { Experience } from "./Experience";
import styles from "./Experience.module.scss";

export type ExperienceProps = {};

let experience: Experience;
export const ExperienceComponent = (props: ExperienceProps) => {
  useEffect(() => {
    if (!isClient()) return;
    experience = new Experience();
    return experience?.destroy;
  }, []);

  return (
    <div className={classes(styles.container, "experience")}>
      <canvas className={classes(styles.canvas, "webgl background")} />
      <canvas className={classes(styles.canvas, "webgl foreground")} />
    </div>
  );
};
