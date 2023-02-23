import { FC, FormEvent, useState } from "react";
import styled from "@emotion/styled";
import { cloneDeep } from "lodash";
import {
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Clear, Delete } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ProjectColumn, ProjectTask } from "store/project";
import { observer } from "mobx-react";
import { ConfirmModal } from "components/modals";

type TaskDrawerProps = {
  open: boolean;
  task?: ProjectTask;
  columns: ProjectColumn[];
  onClose: () => void;
  onCreateTask?: (columnId: string, task: Omit<ProjectTask, "id">) => void;
  onUpdateTask?: (columnId: string, task: ProjectTask) => void;
  onDeleteTask?: (columnId: string, taskId: string) => void;
};

type TaskFormValues = { [key: string]: any };

const TaskDrawer: FC<TaskDrawerProps> = ({
  open,
  task,
  columns,
  onClose,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [errors, setErrors] = useState<TaskFormValues>({ title: "", column: "" });
  const [values, setValues] = useState<TaskFormValues>({ title: "", column: "", ...cloneDeep(task) });
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);

  const onFormSubmitted = (e: FormEvent) => {
    e.preventDefault();
    if (!values.title) return setErrors((prev) => ({ ...prev, title: "This field is required" }));
    if (!values.column) return setErrors((prev) => ({ ...prev, column: "This field is required" }));
    if (task?.id) onUpdateTask?.(task.column, values as ProjectTask);
    else onCreateTask?.(values.column, values as ProjectTask);
    setValues({ title: "", column: "" });
    onClose();
  };

  return (
    <Drawer open={open} anchor="right" onClose={onClose} disableEscapeKeyDown>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DrawerContent>
          <Stack
            p={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid #E8E9EA"
          >
            <Typography noWrap fontSize={16} fontWeight={600}>
              {task ? task.title : "Add new task"}
            </Typography>

            <Stack style={{ cursor: "pointer" }} spacing={1} direction="row" alignItems="center">
              <IconButton onClick={() => setOpenConfirmDeleteModal(true)}>
                <Delete color="error" />
              </IconButton>
              <IconButton onClick={onClose}>
                <Clear />
              </IconButton>

              <ConfirmModal
                type="delete"
                open={openConfirmDeleteModal}
                title="Are you sure you want to delete?"
                onCancel={() => setOpenConfirmDeleteModal(false)}
                onSubmit={onDeleteTask}
              >
                <Typography textAlign="center">
                  By deleting "<strong>{task?.title}</strong>" task, its details will also be deleted.
                </Typography>
              </ConfirmModal>
            </Stack>
          </Stack>

          <Stack p={2} component="form" spacing={2} autoComplete="off" onSubmit={onFormSubmitted}>
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
              helperText={errors.title}
            />
            <FormControl>
              <InputLabel size="small">Column</InputLabel>
              <Select
                size="small"
                error={!!errors.column}
                value={values.column}
                label="Column"
                required
                onChange={(e) => {
                  if (errors.column) setErrors((prev) => ({ ...prev, column: "" }));
                  setValues((prev) => ({ ...prev, column: e.target.value }));
                }}
              >
                {columns.map((value) => (
                  <MenuItem key={value.id} value={value.id}>
                    {value.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.column && <FormHelperText color="error">{errors.column}</FormHelperText>}
            </FormControl>
            <FormControl>
              <InputLabel size="small">Assign to</InputLabel>
              <Select
                size="small"
                value={values.assignTo}
                label="Assign to"
                onChange={(e) => setValues((prev) => ({ ...prev, assignTo: e.target.value }))}
              >
                <MenuItem value="You">You</MenuItem>
                <MenuItem value="John Doe">Barney Thea</MenuItem>
                <MenuItem value="Barney Thea">Barney Thea</MenuItem>
                <MenuItem value="Maddison Wilber">Maddison Wilber</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>
                <Typography fontSize={12}>Prioritize</Typography>
              </FormLabel>
              <RadioGroup
                row
                value={values.prioritize}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, prioritize: e.target.value as ProjectTask["prioritize"] }))
                }
              >
                <FormControlLabel value="low" control={<Radio />} label="Low" />
                <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                <FormControlLabel value="high" control={<Radio />} label="High" />
              </RadioGroup>
            </FormControl>
            <DatePicker
              label="Due date"
              value={values.dueDate || null}
              onChange={(newValue) => setValues((prev) => ({ ...prev, dueDate: newValue?.toString() }))}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
            <TextField
              size="small"
              rows={4}
              label="Description"
              value={values.description}
              onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
              multiline
            />
            <Button type="submit" size="large" color="info" fullWidth variant="contained">
              <Typography color="white">Submit</Typography>
            </Button>
          </Stack>
        </DrawerContent>
      </LocalizationProvider>
    </Drawer>
  );
};

const DrawerContent = styled(Stack)`
  width: 90vw;

  @media screen and (min-width: 600px) {
    width: 450px;
  }
`;

export default observer(TaskDrawer);
