import { list } from "@keystone-6/core";
import {
  text,
  password,
  checkbox,
  integer,
  relationship,
  virtual,
} from "@keystone-6/core/fields";
import { Lists } from ".keystone/types";
import { document } from "@keystone-6/fields-document";

export const lists: Lists = {
  User: list({
    fields: {
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        isFilterable: true,
      }),
      name: text({ validation: { isRequired: true } }),
      password: password({ validation: { isRequired: true } }),
    },

    ui: {
      listView: {
        initialColumns: ["name"],
      },
    },
  }),

  Post: list({
    fields: {
      title: text(),
      slug: text({ isIndexed: "unique", isFilterable: true }),
      content: document({ formatting: true, dividers: true, links: true }),
      resume: relationship({ ref: "Resume" }),
    },
  }),

  Resume: list({
    fields: {
      experiences: relationship({ ref: "Experience", many: true }),
    },
  }),

  Experience: list({
    fields: {
      year: integer(),
      role: text(),
      employer: relationship({ ref: "Employer" }),
      skills: relationship({ ref: "Skill", many: true }),
    },

    ui: {
      labelField: "employer",
      listView: {
        initialColumns: ["year", "role"],
      },
    },
  }),

  Employer: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      url: text(),
      description: text(),
    },
  }),

  Skill: list({
    fields: {
      name: text(),
    },
  }),
};
