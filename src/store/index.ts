import ProjectStore from "./project";

export const store = {
  projectStore: new ProjectStore(),
};

export type Store = typeof store;
