import { DocumentRenderer } from "@keystone-6/document-renderer";
import { useEffect } from "react";
import { Post } from "../../generated/graphql";
import { SplitText } from "../../utils/splitText";
import styles from "./Hello.module.scss";

export type HelloProps = {
  post: Post;
};

export function Hello({ post }: HelloProps) {
  useEffect(() => {
    const animated = document.getElementsByClassName("animated-lines");
    if (!animated[0]) return;
    SplitText.split(animated[0] as HTMLElement, {
      wordSpanAttrs: { class: styles.word },
      lineSpanAttrs: { class: "line" },
    });
  }, []);

  return (
    <div className={styles.helloContainer}>
      <article className={styles.hello}>
        <DocumentRenderer
          document={post.content?.document}
          renderers={{
            block: {
              paragraph: ({ children, textAlign }) => (
                <p className="animated-lines" style={{ textAlign }}>
                  {children}
                </p>
              ),
            },
          }}
        />
      </article>
    </div>
  );
}
