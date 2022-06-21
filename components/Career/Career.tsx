import gsap, { Power1 } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import { Experience, Post, Skill } from "../../generated/graphql";
import { slideUp } from "../../utils/animations/slideIn";
import { classes } from "../../utils/classes";
import { SCROLL_TRIGGER_START_DEFAULT } from "../../utils/shared";
import { SmoothScroll } from "../../utils/SmoothScroll";
import { SplitText } from "../../utils/splitText";
import styles from "./Career.module.scss";

type CareerProps = {
  post: Post;
};

export function Career({ post }: CareerProps) {
  const content = useMemo(() => {
    if (!post.resume?.experiences) return;

    return post.resume.experiences
      .slice()
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
      .reduce((acc, experience) => {
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
    const _container = container.current;
    if (!_container) return;

    const fadeInTargets = _container.querySelectorAll(".fade-in");
    const slideInTargets = _container.querySelectorAll(".slide-in");
    const duration = 1;
    const ease = Power1.easeInOut;

    const fadeInFrom = { opacity: 0 };
    const fadeIn = gsap.fromTo(fadeInTargets, fadeInFrom, {
      opacity: 1,
      duration,
      ease,
      paused: true,
    });

    const slideInFrom = { x: -30, opacity: 0 };
    const slideIn = gsap.fromTo(slideInTargets, slideInFrom, {
      x: 0,
      opacity: 1,
      duration,
      ease,
      paused: true,
    });

    const animate = () => {
      fadeIn.play();
      slideIn.play();
    };

    const scrollTrigger = ScrollTrigger.create({
      scroller: SmoothScroll.instance?.scrollingElement,
      trigger: _container,
      start: SCROLL_TRIGGER_START_DEFAULT,
      onEnter: animate,
      onEnterBack: animate,
    });

    return () => scrollTrigger.kill();
  }, []);

  return (
    <article ref={container}>
      <div className={classes(styles.yearSeparator, "year", "fade-in")}>
        <footer className={styles.year}>{year[0].year}</footer>
        <hr className="slide-in" />
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

    const header = container.current.querySelector("h2 > a") as HTMLElement;

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

    const animate = () =>
      animationMap.current.get(header)?.animations?.forEach((a) => a.play());

    const scrollTrigger = ScrollTrigger.create({
      scroller: SmoothScroll.instance?.scrollingElement,
      trigger: container.current,
      start: SCROLL_TRIGGER_START_DEFAULT,
      onEnter: animate,
      onEnterBack: animate,
    });

    return () => scrollTrigger.kill();
  }, []);

  return (
    <div ref={container} className={styles.job}>
      <div className={styles.jobInfo}>
        <header>
          <h2>
            <a
              target="_blank"
              rel="noreferrer"
              href={experience.employer?.url ?? undefined}
            >
              {experience.employer?.name}
            </a>
          </h2>
        </header>
        <p className={classes(styles.jobRole, "fade-in")}>{experience.role}</p>
        <p className={classes(styles.jobSkills, "fade-in")}>
          {experience.skills?.map((skill, index, arr) => {
            const last = index === arr.length - 1;
            return (
              <span key={skill.id}>
                <Skill {...skill} />
                {!last && " / "}
              </span>
            );
          })}
        </p>
      </div>
      <hr className="slide-in" />
    </div>
  );
}

function Skill({ id, name }: Skill) {
  const element = useRef<HTMLSpanElement>(null);
  const className = `skill-${id}`;

  useEffect(() => {
    const span = element.current;
    if (!span) return;

    const related = document.getElementsByClassName(className);

    const handleMouseEnter = (event: MouseEvent) => {
      for (const el of related) {
        el.classList.add(styles.active);
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      for (const el of related) {
        el.classList.remove(styles.active);
      }
    };

    span.addEventListener("mouseenter", handleMouseEnter);
    span.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      span.removeEventListener("mouseenter", handleMouseEnter);
      span.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [className]);

  return (
    <span ref={element} className={classes(className, styles.skill)}>
      {name}{" "}
    </span>
  );
}