import gsap, { Power1 } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import { Experience, Post, Skill } from "../../generated/graphql";
import { classes } from "../../utils/classes";
import { TextMotion } from "../../utils/TextMotion";
import styles from "./Career.module.scss";

const RULER_ANIMATION_DURATION = 0.8;

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
    let scrollTrigger: ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const raf = requestAnimationFrame(() => {
      scrollTrigger = ScrollTrigger.create({
        trigger: container.current,
        onEnter() {
          gsap.from(container.current!.getElementsByTagName("hr"), {
            transformOrigin: "right",
            scale: 0,
            duration: RULER_ANIMATION_DURATION,
            clearProps: "scale, transformOrigin",
          });

          gsap.from(container.current!.querySelector(".year > footer"), {
            opacity: 0,
            duration: 0.3,
            delay: RULER_ANIMATION_DURATION,
            clearProps: "opacity",
          });
        },
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      scrollTrigger?.kill();
    };
  }, []);

  return (
    <article ref={container}>
      <div className={classes(styles.yearSeparator, "year")}>
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

  useEffect(() => {
    let scrollTrigger: ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const raf = requestAnimationFrame(() => {
      scrollTrigger = ScrollTrigger.create({
        trigger: container.current,
        async onEnter() {
          if (!container.current) return;
          const title = container.current.querySelector(
            "header > h2 > a"
          ) as HTMLElement;

          const titleTextMotion = new TextMotion(title, {
            wrapChars: true,
            processChar(char) {
              char.style.setProperty("--clip-y", "0%");
              gsap.set(char, {
                willChange: "contents",
                display: "inline-block",
              });
            },
          });

          const chars = await titleTextMotion.getChars();

          await gsap.fromTo(
            chars,
            {
              y: 20,
              "--clip-y": "0%",
              clipPath:
                "polygon(0 0, 100% 0, 100% var(--clip-y), 0 var(--clip-y))",
            },
            {
              y: 0,
              "--clip-y": "100%",
              duration: 0.3,
              stagger: 0.05,
              delay: RULER_ANIMATION_DURATION,
              clearProps: [
                "--clip-y",
                "will-change",
                "clip-path",
                "transform",
              ].join(","),
            }
          );

          scrollTrigger.kill();

          console.log({ chars });
        },
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      scrollTrigger?.kill();
    };
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
