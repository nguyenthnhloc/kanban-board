import { FC, useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";
import { Stack, Typography } from "@mui/material";
import { FlashOn, People, AccountBalanceWallet } from "@mui/icons-material";

import { Store } from "store";
import { paths } from "configs/pages";
import { Project } from "store/project";

import ProjectStatistic from "./components/project-statistic";
import ProjectTasks from "./components/project-tasks";
import ProjectModal from "../components/project-modal";

const ProjectTrackingDetail: FC<Store> = ({ projectStore }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project>();
  const [openProjectModal, setOpenProjectModal] = useState(false);

  useEffect(() => {
    if (params.id && params.slug) {
      const found = projectStore.getProjectById(params.id);
      if (!found) return navigate(paths.projectsTracking);
      if (found && found.slug !== `${params.id}/${params.slug}`)
        return navigate(`${paths.projectsTracking}/${found.slug}`);

      setProject(found);
    } else return navigate(paths.projectsTracking);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, params, projectStore]);

  const onUpdateProject = (values: Project) => {
    projectStore.updateProject(values);
    const updated = projectStore.getProjectById(values.id);
    if (updated && updated.slug !== project?.slug) navigate(`${paths.projectsTracking}/${updated?.slug}`);

    setProject(updated);
    setOpenProjectModal(false);
  };

  return (
    <Stack height="100%">
      <Stack direction="row" alignItems="center">
        <Typography mr={2} fontSize={20} fontWeight={700}>
          {project?.name}
        </Typography>
        <Typography
          color="primary"
          style={{ cursor: "pointer" }}
          onClick={() => setOpenProjectModal(true)}
          fontWeight={600}
        >
          Edit
        </Typography>

        <ProjectModal
          open={openProjectModal}
          project={project}
          onCancel={() => setOpenProjectModal(false)}
          onSubmit={onUpdateProject}
        />
      </Stack>

      <Stack mt={1} direction="row" spacing={2}>
        <Stack direction="row">
          <FlashOn color="success" />{" "}
          <Typography color="#1CAB8A" fontWeight={700}>
            Active project
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <People color="action" />{" "}
          <Typography ml={1} color="text.secondary">
            <strong>4</strong> assignees
          </Typography>
        </Stack>
        <Stack direction="row">
          <AccountBalanceWallet color="action" />{" "}
          <Typography ml={1} color="text.secondary">
            Budget: <strong>32 hours</strong>
          </Typography>
        </Stack>
      </Stack>

      <ProjectStatistic
        totalTime={project?.totalTime}
        totalCosts={project?.totalCosts}
        productivity={project?.productivity}
        totalEarnings={project?.totalEarnings}
      />

      <ProjectTasks project={project} projectStore={projectStore} />
    </Stack>
  );
};

export default inject("projectStore")(observer(ProjectTrackingDetail));
