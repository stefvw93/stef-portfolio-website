import { useEffect } from "react"
import { Experience } from "./Experience"
import styles from "./Experience.module.scss"

export type ExperienceProps = {}

export const ExperienceComponent = (props: ExperienceProps) => {
  useEffect(() => {
    const experience = new Experience("canvas.webgl", "div.css-webgl")
    return experience.destroy
  }, [])

  return (
    <div className={styles.container}>
      <canvas className="webgl" />
      <div className="css-webgl" />
    </div>
  )
}
