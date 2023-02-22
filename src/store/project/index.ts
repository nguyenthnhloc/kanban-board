import { action, computed, makeAutoObservable } from "mobx";
import { v4 as uuidV4 } from "uuid";
import { makePersistable } from "mobx-persist-store";

export type Project = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

export default class ProjectStore {
  projects: Project[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    makePersistable(this, { name: "ProjectStore", properties: ["projects"], storage: window.localStorage });
  }

  @computed get projectsList() {
    return this.projects;
  }

  @action createProject(name: string, description?: string) {
    const slug = name.toLowerCase().replaceAll(" ", "-");
    this.projects.unshift({ id: uuidV4(), slug, name, description });
  }

  @action updateProject(project: Project) {
    const found = this.projects.findIndex((value) => value.id === project.id);
    this.projects.splice(found, 1, project);
  }

  @action deleteProject(projectId: string) {
    const found = this.projects.findIndex((value) => value.id === projectId);
    this.projects.splice(found, 1);
  }
}
