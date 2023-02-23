import { FC, useState } from "react";
import { inject, observer } from "mobx-react";
import { Grid, Typography } from "@mui/material";

import { Project, ProjectTask, ProjectColumn } from "store/project";

import TaskDrawer from "./task-drawer";
import { Store } from "store";

type TaskProps = Store & {
  task: ProjectTask;
  columns: ProjectColumn[];
  project?: Project;
};

const Task: FC<TaskProps> = ({ task, columns, project, projectStore }) => {
  const [openTaskDrawer, setOpenTaskDrawer] = useState(false);

  const onUpdateColumnTask = (columnId: string, task: ProjectTask) => {
    if (project) projectStore.updateProjectColumnTask(project.id, columnId, task);
  };

  const onDeleteColumnTask = () => {
    if (project) projectStore.deleteProjectColumnTask(project.id, task.column, task.id);
  };

  return (
    <div style={{ width: "100%", cursor: "move", marginBottom: 10 }}>
      <Grid p={2} item bgcolor="white" borderRadius={1} onClick={() => setOpenTaskDrawer(true)}>
        <Typography style={{ wordWrap: "break-word" }}>{task.title}</Typography>
      </Grid>

      {openTaskDrawer && (
        <TaskDrawer
          task={task}
          open={openTaskDrawer}
          columns={columns || []}
          onClose={() => setOpenTaskDrawer(false)}
          onUpdateTask={onUpdateColumnTask}
          onDeleteTask={onDeleteColumnTask}
        />
      )}
    </div>
  );
};

export default inject("projectStore")(observer(Task));
