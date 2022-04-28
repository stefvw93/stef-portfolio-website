import { DocumentRenderer } from "@keystone-6/document-renderer";
import { Post } from "../../generated/graphql";
import styles from "./Traits.module.scss";

export type TraitsProps = {
  posts?: Post[];
};

export function Traits({ posts }: TraitsProps) {
  if (!posts || posts.length < 2) return null;

  return (
    <div className={styles.container}>
      <div className={styles.postsContainer}>
        <PostItem {...posts[0]} />
        <PostItem {...posts[1]} />
      </div>
    </div>
  );
}

function PostItem({ title, content, traits }: Post) {
  return (
    <section className={styles.postContainer}>
      <h2>{title}</h2>
      <DocumentRenderer document={content?.document} />
      <p className={styles.traits}>
        {traits?.map((trait) => trait.title).join(" / ")}
      </p>
    </section>
  );
}
