import { DocumentRenderer } from "@keystone-6/document-renderer";
import { Post } from "../../generated/graphql";
import styles from "./About.module.scss";

type AboutProps = {
  post: Post;
};

export function About({ post }: AboutProps) {
  return (
    <div className={styles.container}>
      <DocumentRenderer document={post.content?.document} />
    </div>
  );
}
