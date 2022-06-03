import styles from "./Hud.module.scss";

type HudProps = {};

export function Hud({}: HudProps) {
  return (
    <div className={styles.container}>
      <nav className={styles.navigation}>
        <div>Stef van Wiechen</div>
        <div className={styles.links}>
          <div>About</div>
          <div>Career</div>
          <div>Contact</div>
        </div>
      </nav>

      <nav className={styles.navigation}>
        <div>2022</div>
      </nav>
    </div>
  );
}
