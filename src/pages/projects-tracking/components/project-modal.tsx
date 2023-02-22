import { FC, FormEvent, useEffect, useState } from "react";
import { Stack, TextField } from "@mui/material";

import { Project } from "store/project";
import { GeneralModal, GeneralModalProps } from "components/modals";

type ProjectModalProps = GeneralModalProps & {
  open: boolean;
  project?: Project;
};

type ProjectFormValues = {
  name: string;
  description?: string;
};

const ProjectModal: FC<ProjectModalProps> = ({ open, project, onCancel, onSubmit }) => {
  const [errors, setErrors] = useState<ProjectFormValues>({ name: "" });
  const [values, setValues] = useState<ProjectFormValues>({ name: "" });

  useEffect(() => {
    setValues({ name: project?.name || "", description: project?.description });
  }, [project]);

  const onFormSubmitted = (e: FormEvent) => {
    e.preventDefault();
    if (!values.name) return setErrors((prev) => ({ ...prev, name: "This field is required" }));
    setValues({ name: "", description: "" });
    onSubmit?.(project ? {...project, ...values} : values);
  };

  return (
    <GeneralModal
      open={open}
      title={project ? `Update Project: ${project.name}` : "Add New Project"}
      onCancel={onCancel}
      onSubmit={onFormSubmitted}
    >
      <Stack component="form" spacing={2} autoComplete="off" onSubmit={onFormSubmitted}>
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
          helperText={errors.name}
        />
        <TextField
          size="small"
          rows={4}
          label="Description"
          value={values.description}
          onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
          multiline
        />
      </Stack>
    </GeneralModal>
  );
};

export default ProjectModal;
