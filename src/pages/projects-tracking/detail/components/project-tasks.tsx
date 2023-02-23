import { FC, FormEvent, useState } from "react";
import { observer } from "mobx-react";
import { Button, Grid, Stack, TextField, Typography, Zoom } from "@mui/material";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import { Store } from "store";
import { Project, ProjectTask } from "store/project";

import Column from "./column";
import TaskDrawer from "./task-drawer";

type ProjectTasksProps = Store & {
  project?: Project;
};

type ColumnFormValues = {
  name: string;
};

const ProjectTasks: FC<ProjectTasksProps> = ({ project, projectStore }) => {
  const [errors, setErrors] = useState<ColumnFormValues>({ name: "" });
  const [values, setValues] = useState<ColumnFormValues>({ name: "" });
  const [openAddColumn, setOpenAddColumn] = useState(false);
  const [openTaskDrawer, setOpenTaskDrawer] = useState(false);

  const onFormSubmitted = (e: FormEvent) => {
    e.preventDefault();
    if (!values.name) return setErrors((prev) => ({ ...prev, name: "This field is required" }));
    setValues({ name: "" });
    if (project) projectStore.createProjectColumn(project.id, values.name);
    setOpenAddColumn(false);
  };

  const onCreateColumnTask = (columnId: string, task: Omit<ProjectTask, "id">) => {
    if (project) projectStore.createProjectColumnTask(project.id, columnId, task);
  };

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || !project) return;

    const sColumn = source.droppableId;
    const dColumn = destination.droppableId;

    if (sColumn === dColumn) projectStore.reorderProjectTask(project.id, sColumn, source.index, destination.index);
    else projectStore.moveProjectTask(project.id, sColumn, dColumn, source.index, destination.index);
  };

  return (
    <Stack height="100%" bgcolor="white" border="1px solid #E8E9EA" borderRadius={2}>
      <Stack p={2} height={75} direction="row" alignItems="center" borderBottom="1px solid #E8E9EA">
        <Typography mr={2} fontWeight={600}>
          Tasks
        </Typography>

        <Button color="primary" variant="outlined">
          <Typography onClick={() => setOpenTaskDrawer(true)} fontWeight={600}>
            Add New Task
          </Typography>
        </Button>
        <TaskDrawer
          open={openTaskDrawer}
          columns={project?.columns || []}
          onClose={() => setOpenTaskDrawer(false)}
          onCreateTask={onCreateColumnTask}
        />
      </Stack>

      <Stack height="100%" overflow="hidden">
        <Stack height="100%" overflow="scroll">
          <Grid p={1} width="max-content" height="100%" container>
            <DragDropContext onDragEnd={onDragEnd}>
              {project?.columns?.map((value, index) => {
                return (
                  <Droppable key={value.id} droppableId={value.id}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{ height: snapshot.isDraggingOver ? "auto" : "100%", marginRight: 10 }}
                      >
                        <Column
                          column={value}
                          project={project}
                          projectStore={projectStore}
                          isDragging={snapshot.isDraggingOver}
                          onCreateTask={onCreateColumnTask}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}

              <Grid p={1} item width={200} height="max-content" bgcolor="#F3F5F6" borderRadius={1}>
                {!openAddColumn && (
                  <Button color="inherit" variant="text" onClick={() => setOpenAddColumn(true)} fullWidth>
                    <Typography mr={1} fontSize={20}>
                      +{" "}
                    </Typography>
                    <Typography fontSize={12}>Add new column</Typography>
                  </Button>
                )}

                {openAddColumn && (
                  <Zoom in={openAddColumn}>
                    <Stack
                      p={1}
                      mt={1}
                      bgcolor="white"
                      spacing={2}
                      onSubmit={onFormSubmitted}
                      component="form"
                      autoComplete="off"
                      borderRadius={1}
                    >
                      <TextField
                        size="small"
                        error={!!errors.name}
                        label="Name"
                        value={values.name}
                        onChange={(e) => {
                          if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                          setValues((prev) => ({ ...prev, name: e.target.value }));
                        }}
                        required
                        autoFocus
                        helperText={errors.name}
                      />
                      <Stack spacing={1} direction="row">
                        <Button color="error" onClick={() => setOpenAddColumn(false)}>
                          Cancel
                        </Button>
                        <Button size="small" color="info" variant="contained" onClick={onFormSubmitted}>
                          <Typography color="white" fontSize={12}>
                            Add
                          </Typography>
                        </Button>
                      </Stack>
                    </Stack>
                  </Zoom>
                )}
              </Grid>
            </DragDropContext>
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default observer(ProjectTasks);
