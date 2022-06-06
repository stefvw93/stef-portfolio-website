import { DocumentRenderer } from "@keystone-6/document-renderer";
import { Post } from "../../generated/graphql";
import styles from "./Contact.module.scss";

type ContactProps = { post: Post };

export function Contact({ post }: ContactProps) {
  return (
    <div className={styles.container}>
      <div>
        <DocumentRenderer document={post.content?.document} />
      </div>
    </div>
  );
}
