import { FC, FormEvent, useState } from "react";
import { observer } from "mobx-react";
import { Button, Grid, Stack, TextField, Typography, Zoom } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { Delete } from "@mui/icons-material";

import { Store } from "store";
import { Project, ProjectColumn, ProjectTask } from "store/project";

import Task from "./task";
import { ConfirmModal } from "components/modals";

type ColumnProps = Store & {
  column: ProjectColumn;
  project?: Project;
  isDragging?: boolean;
  onCreateTask: (columnId: string, task: Omit<ProjectTask, "id">) => void;
};

type TaskFormValues = {
  title: string;
};

const Column: FC<ColumnProps> = ({ column, project, projectStore, isDragging = false, onCreateTask }) => {
  const [errors, setErrors] = useState<TaskFormValues>({ title: "" });
  const [values, setValues] = useState<TaskFormValues>({ title: "" });
  const [openAddTask, setOpenAddTask] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);

  const onFormSubmitted = (e: FormEvent) => {
    e.preventDefault();
    if (!values.title) return setErrors((prev) => ({ ...prev, title: "This field is required" }));
    setValues({ title: "" });
    onCreateTask(column.id, { title: values.title, column: column.id });
  };

  const onDeleteProjectColumn = () => {
    project && projectStore.deleteProjectColumn(project.id, column.id);
    setOpenConfirmDeleteModal(false);
  };

  return (
    <Grid
      p="10px"
      item
      width={300}
      height="100%"
      bgcolor={isDragging ? "#707F92" : "#F3F5F6"}
      overflow="auto"
      maxHeight={600}
      borderRadius={1}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography pt={1} pb={1.5} fontWeight={700}>
          {column.name}
        </Typography>

        <Stack style={{ cursor: "pointer" }} onClick={() => setOpenConfirmDeleteModal(true)}>
          <Delete color="error" />
        </Stack>

        <ConfirmModal
          type="delete"
          open={openConfirmDeleteModal}
          title="Are you sure you want to delete?"
          onCancel={() => setOpenConfirmDeleteModal(false)}
          onSubmit={onDeleteProjectColumn}
        >
          <Typography textAlign="center">
            By deleting "<strong>{column.name}</strong>" column, all tasks inside that column will also be deleted.
          </Typography>
        </ConfirmModal>
      </Stack>

      <Grid container>
        <Grid item mb={1} xs={12}>
          {!openAddTask && (
            <Button color="inherit" variant="text" onClick={() => setOpenAddTask(true)} fullWidth>
              <Typography mr={1} fontSize={20}>
                +{" "}
              </Typography>
              <Typography fontSize={12}>Add new task</Typography>
            </Button>
          )}

          {openAddTask && (
            <Zoom in={openAddTask}>
              <Stack
                p={1}
                mb={1}
                bgcolor="white"
                spacing={2}
                onSubmit={onFormSubmitted}
                component="form"
                autoComplete="off"
                borderRadius={1}
              >
                <TextField
                  size="small"
                  error={!!errors.title}
                  label="Title"
                  value={values.title}
                  onChange={(e) => {
                    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                    setValues((prev) => ({ ...prev, title: e.target.value }));
                  }}
                  required
                  autoFocus
                  helperText={errors.title}
                />
                <Stack spacing={1} direction="row">
                  <Button color="error" onClick={() => setOpenAddTask(false)}>
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
      </Grid>

      {column.tasks.map((value, index) => (
        <Draggable key={value.id} index={index} draggableId={value.id}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{ ...provided.draggableProps.style }}
            >
              <Task task={value} columns={project?.columns || []} project={project} projectStore={projectStore} />
            </div>
          )}
        </Draggable>
      ))}
    </Grid>
  );
};

export default observer(Column);
