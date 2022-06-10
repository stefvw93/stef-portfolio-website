import gsap, { Power1 } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import { Experience, Post } from "../../generated/graphql";
import { slideUp } from "../../utils/animations/slideIn";
import {
  animateLine,
  animateLines,
  animateLineStartValues,
} from "../../utils/animations/text";
import { classes } from "../../utils/classes";
import { SplitText } from "../../utils/splitText";
import styles from "./Career.module.scss";

type CareerProps = {
  post: Post;
};

export function Career({ post }: CareerProps) {
  const content = useMemo(() => {
    if (!post.resume?.experiences) return;

    return post.resume.experiences.reduce((acc, experience) => {
      const previous = acc[acc.length - 1]?.[0];

      if (!previous || previous.year !== experience.year) {
        acc.push([experience]);
        return acc;
      }

      acc[acc.length - 1].push(experience);
      return acc;
    }, [] as Experience[][]);
  }, [post.resume]);

  return (
    <section className={styles.container}>
      {content?.map((year) => (
        <CareerItem key={year[0].id} year={year} />
      ))}
    </section>
  );
}

type CareerItemProps = { year: Experience[] };

function CareerItem({ year }: CareerItemProps) {
  const container = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!container.current) return;
  }, []);

  return (
    <article ref={container}>
      <div className={classes(styles.yearSeparator, "year")}>
        <footer className={styles.year}>{year[0].year}</footer>
        <hr />
      </div>

      {year.map((experience) => (
        <CareerExperience key={experience.id} experience={experience} />
      ))}
    </article>
  );
}

function CareerExperience({ experience }: { experience: Experience }) {
  const container = useRef<HTMLDivElement>(null);

  const animationMap = useRef<
    WeakMap<
      HTMLElement,
      { animations?: gsap.core.Animation[]; splitText?: SplitText }
    >
  >(new WeakMap());

  useEffect(() => {
    if (!container.current) return;

    const header = container.current.querySelector("h2")!;

    animationMap.current.set(header, {
      splitText: new SplitText(header, {
        wrapChars: true,
        charSpanAttrs: { class: styles.animateChar },
        onComplete({ element, chars }) {
          const obj = animationMap.current.get(element);
          if (!obj) return;
          obj.animations = [slideUp(chars, { duration: 0.8, stagger: 0.06 })];
        },
      }),
    });

    const scrollTrigger = ScrollTrigger.create({
      markers: true,
      trigger: container.current,
      once: true,
      start: "top 75%",
      onEnter() {
        animationMap.current.get(header)?.animations?.forEach((a) => a.play());
      },
    });

    return () => scrollTrigger.kill();
  }, []);

  return (
    <div ref={container} className={styles.job}>
      <div className={styles.jobInfo}>
        <header>
          <a
            target="_blank"
            rel="noreferrer"
            href={experience.employer?.url ?? undefined}
          >
            <h2>{experience.employer?.name}</h2>
          </a>
        </header>
        <p className={styles.jobRole}>{experience.role}</p>
        <p className={styles.jobSkills}>
          {experience.skills?.map((skill) => skill.name).join(" / ")}
        </p>
      </div>
      <hr />
    </div>
  );
}
