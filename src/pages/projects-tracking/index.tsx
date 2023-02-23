import { FC, useState, MouseEvent } from "react";
import { inject, observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { Delete, Edit, MoreVert } from "@mui/icons-material";

import { Store } from "store";
import { paths } from "configs/pages";
import { Project } from "store/project";

import ProjectModal from "./components/project-modal";
import { ConfirmModal } from "components/modals";

type ProjectFormValues = {
  name: string;
  description?: string;
};

const ProjectsTracking: FC<Store> = ({ projectStore }) => {
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | undefined>();
  const [projectAnchorEl, setProjectMenuAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [projectPopoverId, setProjectPopoverId] = useState("");
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);

  const onOpenProjectMenu = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    setProjectPopoverId(id);
    setProjectMenuAnchorEl(e.currentTarget);
  };

  const onCloseProjectMenu = () => {
    setProjectPopoverId("");
    setProjectMenuAnchorEl(null);
  };

  const onCreateProject = (values: ProjectFormValues) => {
    projectStore.createProject(values.name, values.description);
    setOpenProjectModal(false);
  };

  const onOpenUpdateModal = (e: MouseEvent<HTMLLIElement>, project: Project) => {
    e.stopPropagation();
    setProject(project);
    setOpenProjectModal(true);
    onCloseProjectMenu();
  };

  const onUpdateProject = (values: Project) => {
    projectStore.updateProject(values);
    setProject(undefined);
    setOpenProjectModal(false);
  };

  const onOpenDeleteModal = (e: MouseEvent<HTMLLIElement>, project: Project) => {
    e.stopPropagation();
    setProject(project);
    setOpenConfirmDeleteModal(true);
    onCloseProjectMenu();
  };

  const onDeleteProject = () => {
    project && projectStore.deleteProject(project.id);
    setProject(undefined);
    setOpenConfirmDeleteModal(false);
  };

  return (
    <Stack>
      <Stack mb={2} height={40} direction="row">
        <Button color="primary" variant="outlined" onClick={() => setOpenProjectModal(true)}>
          <Typography fontWeight={600}>
            Add New Project
          </Typography>
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {projectStore.projectsList.map((value) => (
          <Grid key={value.id} item xs={12} sm={6} md={6} lg={4} xl={3}>
            <Card style={{ cursor: "pointer" }} onClick={() => navigate(`${paths.projectsTracking}/${value.slug}`)}>
              <CardHeader
                title={value.name}
                action={
                  <div>
                    <IconButton aria-describedby={value.id} onClick={(e) => onOpenProjectMenu(e, value.id)}>
                      <MoreVert />
                    </IconButton>
                    <Popover
                      open={projectPopoverId === value.id}
                      onClose={onCloseProjectMenu}
                      anchorEl={projectAnchorEl}
                      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    >
                      <MenuList>
                        <MenuItem onClick={(e) => onOpenUpdateModal(e, value)}>
                          <Edit fontSize="small" /> <Typography mx={1}>Edit</Typography>
                        </MenuItem>
                        <MenuItem onClick={(e) => onOpenDeleteModal(e, value)}>
                          <Delete fontSize="small" /> <Typography mx={1}>Delete</Typography>
                        </MenuItem>
                      </MenuList>
                    </Popover>
                  </div>
                }
                subheader={value.description}
              />
              <CardMedia sx={{ height: 140 }} image="https://via.placeholder.com/300/F0F0F0?text=" title={value.name} />
            </Card>
          </Grid>
        ))}
      </Grid>

      <ProjectModal
        open={openProjectModal}
        project={project}
        onCancel={() => setOpenProjectModal(false)}
        onSubmit={project ? onUpdateProject : onCreateProject}
      />

      <ConfirmModal
        type="delete"
        open={openConfirmDeleteModal}
        title="Are you sure you want to delete?"
        onCancel={() => setOpenConfirmDeleteModal(false)}
        onSubmit={onDeleteProject}
      >
        <Typography textAlign="center">
          By deleting "<strong>{project?.name}</strong>" project, all tasks inside that project will also be deleted.
        </Typography>
      </ConfirmModal>
    </Stack>
  );
};

export default inject("projectStore")(observer(ProjectsTracking));
