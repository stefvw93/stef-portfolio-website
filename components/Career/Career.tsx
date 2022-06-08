import gsap, { Power1 } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import { Experience, Post } from "../../generated/graphql";
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

  console.log(content);

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

    const startValues = {
      year: animateLineStartValues,
    };

    const elements = {
      year: container.current!.querySelector("footer") as HTMLElement,
      companies: Array.from(container.current!.querySelectorAll("header")),
      roles: Array.from(
        container.current!.querySelectorAll(`p.${styles.jobRole}`)
      ) as HTMLElement[],
      skills: Array.from(
        container.current!.querySelectorAll(`p.${styles.jobSkills}`)
      ) as HTMLElement[],
      rulers: Array.from(container.current!.querySelectorAll("hr")),
      paragraphs: Array.from(container.current!.querySelectorAll("p")),
    };

    gsap.set(elements.rulers, { width: "0%" });
    gsap.set(elements.paragraphs, { left: -30, opacity: 0 });

    const splitText = {
      year: new SplitText(elements.year, {
        wordSpanAttrs: { class: styles.animateWord },
        onComplete({ words }) {
          gsap.set(words, { opacity: 0 });
        },
      }),
      companies: elements.companies.map(
        (company) =>
          new SplitText(company, {
            wrapChars: true,
            charSpanAttrs: { class: styles.animateChar },
            wordSpanAttrs: { class: styles.animateWord },
            onComplete({ chars }) {
              gsap.set(chars, startValues.year);
            },
          })
      ),
    };

    const scrollTriggers: ScrollTrigger[] = [];

    scrollTriggers.push(
      ScrollTrigger.create({
        once: true,
        trigger: container.current!,
        start: "top 75%",
        onEnter() {
          const duration = 0.5;
          const ease = Power1.easeInOut;
          gsap.to(elements.rulers, {
            width: "100%",
            duration,
            ease,
          });
          gsap.to(elements.paragraphs, {
            left: 0,
            opacity: 1,
            duration,
            ease,
          });
          gsap.fromTo(
            elements.year.querySelector("span"),
            { opacity: 0, top: 30 },
            { opacity: 1, top: 0, duration, ease }
          );
        },
      }),

      ...elements.companies.map((trigger, index) =>
        ScrollTrigger.create({
          once: true,
          trigger,
          start: "top 75%",
          onEnter() {
            animateLines({
              lines: trigger.querySelectorAll(`.${styles.animateWord}`),
              stagger: 0.05,
              delay: 0,
            });
          },
        })
      )
    );

    return () => scrollTriggers.forEach((trigger) => trigger.kill());
  }, []);

  return (
    <article ref={container}>
      <div className={classes(styles.yearSeparator, "year")}>
        <footer className={styles.year}>{year[0].year}</footer>
        <hr />
      </div>

      {year.map((experience) => (
        <div key={experience.id} className={styles.job}>
          <div className={styles.jobInfo}>
            <header>{experience.company}</header>
            <p className={styles.jobRole}>{experience.role}</p>
            <p className={styles.jobSkills}>
              {experience.skills?.map((skill) => skill.name).join(" / ")}
            </p>
          </div>
          <hr />
        </div>
      ))}
    </article>
  );
}
