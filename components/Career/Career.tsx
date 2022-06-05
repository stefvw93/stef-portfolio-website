import { useMemo } from "react";
import { Experience, Post } from "../../generated/graphql";
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
        <article key={year[0].id}>
          <div className={styles.yearSeparator}>
            <header>{year[0].year}</header>
            <hr />
          </div>

          {year.map((experience) => (
            <div key={experience.id} className={styles.job}>
              <div className={styles.jobInfo}>
                <header>{experience.company}</header>
                <div className={styles.jobRole}>{experience.role}</div>
                <div className={styles.jobSkills}>
                  {experience.skills?.map((skill) => skill.name).join(" / ")}
                </div>
              </div>
              <hr />
            </div>
          ))}
        </article>
      ))}
    </section>
  );
}
