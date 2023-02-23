import { FC, useState } from "react";
import moment from "moment";
import { inject, observer } from "mobx-react";
import { Stack, Avatar, Chip, Grid, Typography } from "@mui/material";

import { Store } from "store";
import { Project, ProjectTask, ProjectColumn } from "store/project";

import TaskDrawer from "./task-drawer";

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
        <Typography mb={1} style={{ wordWrap: "break-word" }} fontWeight={600}>
          {task.title}
        </Typography>
        {task.dueDate && (
          <Chip
            size="small"
            color="primary"
            label={
              <Typography fontSize={12}>
                Due date: <strong>{moment(task.dueDate).format("DD MMM")}</strong>
              </Typography>
            }
          />
        )}
        {task.assignTo && (
          <Stack mt={1}>
            <Avatar style={{ width: 25, height: 25 }}>{task.assignTo[0]}</Avatar>
          </Stack>
        )}
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
