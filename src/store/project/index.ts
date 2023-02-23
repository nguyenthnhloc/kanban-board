import { action, computed, makeAutoObservable } from "mobx";
import { v4 as uuidV4 } from "uuid";
import { makePersistable } from "mobx-persist-store";

export type Project = {
  id: string;
  slug: string;
  name: string;
  columns?: ProjectColumn[];
  totalTime?: number;
  totalCosts?: number;
  description?: string;
  productivity?: { current: number; dayChange: number };
  totalEarnings?: number;
};

export type ProjectTask = {
  id: string;
  title: string;
  column: string;
  dueDate?: number | string;
  position?: number;
  assignTo?: string;
  prioritize?: "low" | "medium" | "high";
  description?: string;
};

export type ProjectColumn = {
  id: string;
  name: string;
  tasks: ProjectTask[];
};

const defaultProject = {
  id: "",
  slug: "",
  name: "",
  columns: [
    {
      id: uuidV4(),
      name: "To Do",
      tasks: [],
    },
    {
      id: uuidV4(),
      name: "On Hold",
      tasks: [],
    },
    {
      id: uuidV4(),
      name: "In Progress",
      tasks: [],
    },
    {
      id: uuidV4(),
      name: "Done",
      tasks: [],
    },
  ],
  totalTime: 220,
  description: "",
  totalCosts: 1260.14,
  productivity: { current: 93.57, dayChange: 2.37 },
  totalEarnings: 2409.2,
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

  @action getProjectById(id: string) {
    return this.projects.find((value) => value.id === id);
  }

  @action createProject(name: string, description?: string) {
    const id = uuidV4();
    const slug = `${id}/${name.toLowerCase().replaceAll(" ", "-")}`;
    this.projects.unshift({ ...defaultProject, id, slug, name, description });
  }

  @action updateProject(project: Project) {
    const foundIndex = this.projects.findIndex((value) => value.id === project.id);
    if (foundIndex !== -1) {
      const slug = `${project.id}/${project.name.toLowerCase().replaceAll(" ", "-")}`;
      this.projects.splice(foundIndex, 1, { ...project, slug });
    }
  }

  @action deleteProject(projectId: string) {
    const found = this.projects.findIndex((value) => value.id === projectId);
    this.projects.splice(found, 1);
  }

  @action createProjectColumn(projectId: string, columnName: string) {
    const found = this.projects.find((value) => value.id === projectId);
    if (found) found?.columns?.push({ id: uuidV4(), name: columnName, tasks: [] });
  }

  @action deleteProjectColumn(projectId: string, columnId: string) {
    const found = this.projects.find((value) => value.id === projectId);
    const column = found?.columns?.findIndex((value) => value.id === columnId);
    if (found && column !== -1) found.columns?.splice(Number(column), 1);
  }

  @action createProjectColumnTask(projectId: string, columnId: string, task: Omit<ProjectTask, "id">) {
    const found = this.projects.find((value) => value.id === projectId);
    if (found) {
      const column = found?.columns?.find((value) => value.id === columnId);
      column?.tasks?.push({ id: uuidV4(), ...task });
    }
  }

  @action updateProjectColumnTask(projectId: string, columnId: string, task: ProjectTask) {
    const found = this.projects.find((value) => value.id === projectId);
    if (found) {
      const column = found?.columns?.find((value) => value.id === columnId);
      const toColumn = found?.columns?.find((value) => value.id === task.column);
      const taskIndex = column?.tasks?.findIndex((value) => value.id === task.id);

      if (column?.id !== toColumn?.id) {
        const tasks = column?.tasks;
        const toTasks = toColumn?.tasks;
        if (tasks && toTasks) {
          const [removed] = tasks?.splice(Number(taskIndex), 1);
          toTasks.push({ ...removed, column: task.column });
        }
      } else {
        if (taskIndex !== -1) column?.tasks?.splice(Number(taskIndex), 1, task);
      }
    }
  }

  @action deleteProjectColumnTask(projectId: string, columnId: string, taskId: string) {
    const found = this.projects.find((value) => value.id === projectId);
    if (found) {
      const column = found?.columns?.find((value) => value.id === columnId);
      const taskIndex = column?.tasks?.findIndex((value) => value.id === taskId);
      if (column && taskIndex !== -1) column?.tasks?.splice(Number(taskIndex), 1);
    }
  }

  @action reorderProjectTask(projectId: string, columnId: string, startIndex: number, endIndex: number) {
    const found = this.projects.find((value) => value.id === projectId);
    const column = found?.columns?.find((value) => value.id === columnId);
    if (!found || !column) return;

    const tasks = column.tasks;
    const [removed] = tasks.splice(startIndex, 1);
    tasks.splice(endIndex, 0, { ...removed });
  }

  @action moveProjectTask(
    projectId: string,
    columnId: string,
    toColumnId: string,
    startIndex: number,
    endIndex: number
  ) {
    const found = this.projects.find((value) => value.id === projectId);
    const column = found?.columns?.find((value) => value.id === columnId);
    const toColumn = found?.columns?.find((value) => value.id === toColumnId);
    if (!found || !column || !toColumn) return;

    const tasks = column.tasks;
    const toTasks = toColumn.tasks;
    const [removed] = tasks.splice(startIndex, 1);
    toTasks.splice(endIndex, 0, { ...removed, column: toColumn.id });
  }
}
